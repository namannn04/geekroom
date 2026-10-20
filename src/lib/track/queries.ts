import "server-only";
import { and, asc, desc, eq, gte, inArray, isNull, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { activities, comments, projects, tasks, users, worklogs, type TaskStatus } from "./schema";

/** Days are bucketed in India time so a late-night push lands on the right square. */
export const TZ = "Asia/Kolkata";

export const listPeople = () => db.select().from(users).orderBy(asc(users.createdAt));

export const listProjects = () => db.select().from(projects).orderBy(desc(projects.createdAt));

export type TaskFilter = {
  assigneeId?: number;
  creatorId?: number;
  projectId?: number;
  statuses?: TaskStatus[];
  topLevelOnly?: boolean;
};

export function listTasks(f: TaskFilter = {}) {
  const where: SQL[] = [];
  if (f.assigneeId) where.push(eq(tasks.assigneeId, f.assigneeId));
  if (f.creatorId) where.push(eq(tasks.creatorId, f.creatorId));
  if (f.projectId) where.push(eq(tasks.projectId, f.projectId));
  if (f.statuses?.length) where.push(inArray(tasks.status, f.statuses));
  if (f.topLevelOnly) where.push(isNull(tasks.parentId));
  return db
    .select()
    .from(tasks)
    .where(where.length ? and(...where) : undefined)
    .orderBy(sql`case when ${tasks.priority} = 0 then 5 else ${tasks.priority} end`, desc(tasks.updatedAt));
}

export const getTask = (id: number) => db.query.tasks.findFirst({ where: eq(tasks.id, id) });

export const listSubtasks = (id: number) =>
  db.select().from(tasks).where(eq(tasks.parentId, id)).orderBy(asc(tasks.createdAt));

export const listComments = (taskId: number) =>
  db.select().from(comments).where(eq(comments.taskId, taskId)).orderBy(asc(comments.createdAt));

export const listTaskActivity = (taskId: number) =>
  db.select().from(activities).where(eq(activities.taskId, taskId)).orderBy(asc(activities.createdAt));

export function recentActivity({ actorId, limit = 30 }: { actorId?: number; limit?: number } = {}) {
  return db
    .select()
    .from(activities)
    .where(actorId ? eq(activities.actorId, actorId) : undefined)
    .orderBy(desc(activities.createdAt))
    .limit(limit);
}

export function recentWorklogs({ userId, limit = 20 }: { userId?: number; limit?: number } = {}) {
  return db
    .select()
    .from(worklogs)
    .where(userId ? eq(worklogs.userId, userId) : undefined)
    .orderBy(desc(worklogs.date), desc(worklogs.createdAt))
    .limit(limit);
}

const day = sql<string>`to_char((${activities.createdAt} at time zone ${sql.raw(`'${TZ}'`)})::date, 'YYYY-MM-DD')`;

/** Activity count per day for the last `days` days, for one person or the whole org. */
export async function activityByDay(days: number, actorId?: number) {
  const since = new Date(Date.now() - days * 86_400_000);
  const rows = await db
    .select({ day, count: sql<number>`count(*)::int` })
    .from(activities)
    .where(and(gte(activities.createdAt, since), actorId ? eq(activities.actorId, actorId) : undefined))
    .groupBy(day);
  return new Map(rows.map((r) => [r.day, r.count]));
}

export type Effort = {
  userId: number;
  points: number;
  completed: number;
  minutes: number;
  actions: number;
};

/**
 * Effort points = estimate points of tasks completed + one point per hour of logged work.
 * Both are credited to whoever did the work, so delegated tasks count for the person who shipped them.
 */
export async function effortSince(since: Date | null): Promise<Map<number, Effort>> {
  const [done, logged, acts] = await Promise.all([
    db
      .select({
        userId: tasks.assigneeId,
        points: sql<number>`coalesce(sum(${tasks.estimate}), 0)::int`,
        completed: sql<number>`count(*)::int`,
      })
      .from(tasks)
      .where(and(eq(tasks.status, "done"), since ? gte(tasks.completedAt, since) : undefined))
      .groupBy(tasks.assigneeId),
    db
      .select({ userId: worklogs.userId, minutes: sql<number>`coalesce(sum(${worklogs.minutes}), 0)::int` })
      .from(worklogs)
      .where(since ? gte(worklogs.date, since.toISOString().slice(0, 10)) : undefined)
      .groupBy(worklogs.userId),
    db
      .select({ userId: activities.actorId, actions: sql<number>`count(*)::int` })
      .from(activities)
      .where(since ? gte(activities.createdAt, since) : undefined)
      .groupBy(activities.actorId),
  ]);

  const out = new Map<number, Effort>();
  const get = (id: number) => {
    let e = out.get(id);
    if (!e) out.set(id, (e = { userId: id, points: 0, completed: 0, minutes: 0, actions: 0 }));
    return e;
  };
  for (const r of done) if (r.userId != null) Object.assign(get(r.userId), { completed: r.completed, points: r.points });
  for (const r of logged) get(r.userId).minutes = r.minutes;
  for (const r of acts) get(r.userId).actions = r.actions;
  for (const e of out.values()) e.points += Math.round(e.minutes / 60);
  return out;
}

export async function projectProgress() {
  const rows = await db
    .select({ projectId: tasks.projectId, status: tasks.status, count: sql<number>`count(*)::int` })
    .from(tasks)
    .groupBy(tasks.projectId, tasks.status);
  const out = new Map<number, { total: number; done: number; open: number }>();
  for (const r of rows) {
    if (r.projectId == null || r.status === "canceled") continue;
    const p = out.get(r.projectId) ?? { total: 0, done: 0, open: 0 };
    p.total += r.count;
    if (r.status === "done") p.done += r.count;
    else p.open += r.count;
    out.set(r.projectId, p);
  }
  return out;
}

export async function userCount() {
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  return r.n;
}
