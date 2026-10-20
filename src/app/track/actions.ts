"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/track/db";
import { activities, comments, projects, tasks, users, worklogs, type Tier, type TaskStatus } from "@/lib/track/schema";
import { endSession, requireUser, startSession } from "@/lib/track/session";
import {
  canAssignTo,
  canEditTask,
  canManagePeople,
  canManageProjects,
  invitableTiers,
  managerTierFor,
} from "@/lib/track/permissions";
import { ESTIMATES, PROJECT_STATUSES, STATUSES, TIERS } from "@/lib/track/constants";

export type FormState = { error?: string; ok?: boolean; link?: string; id?: number } | undefined;

const INVITE_DAYS = 7;
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const optInt = (v: unknown) => {
  const n = Number(v);
  return v === "" || v == null || !Number.isInteger(n) || n <= 0 ? null : n;
};
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");
let dummyHash: string | undefined;
const refresh = () => revalidatePath("/", "layout");

async function inviteLink(token: string) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "track.geekroom.co.in";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}/invite/${token}`;
}

function newInvite() {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token), expires: new Date(Date.now() + INVITE_DAYS * 86_400_000) };
}

function checkPassword(pw: string) {
  if (pw.length < 8) return "Use at least 8 characters for the password.";
  if (pw.length > 200) return "That password is too long.";
  return null;
}

/* ---------- Auth ---------- */

export async function setupOwner(_: FormState, fd: FormData): Promise<FormState> {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  if (n > 0) return { error: "Geek Room Track is already set up. Sign in instead." };

  const key = process.env.TRACK_SETUP_KEY;
  if (key && str(fd, "setupKey") !== key) return { error: "That setup key is wrong." };
  if (!key && process.env.NODE_ENV === "production") return { error: "TRACK_SETUP_KEY must be set before setup." };

  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!name || name.length > 80) return { error: "Enter your name." };
  if (!isEmail(email)) return { error: "Enter a valid email." };
  const pwErr = checkPassword(password);
  if (pwErr) return { error: pwErr };

  const [user] = await db
    .insert(users)
    .values({ name, email, tier: "core", title: str(fd, "title").slice(0, 80), passwordHash: await bcrypt.hash(password, 10) })
    .returning();
  await db.insert(activities).values({ actorId: user.id, kind: "joined", subjectId: user.id });
  await startSession(user.id);
  return { ok: true };
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  // Compare against a dummy hash when the user is missing so timing doesn't reveal who has an account
  const hash = user?.passwordHash ?? (dummyHash ??= await bcrypt.hash("not-a-real-password", 10));
  const ok = await bcrypt.compare(password, hash);
  if (!user || !user.passwordHash || !ok || !user.active) return { error: "Wrong email or password." };
  await startSession(user.id);
  return { ok: true };
}

export async function logout() {
  await endSession();
}

export async function acceptInvite(_: FormState, fd: FormData): Promise<FormState> {
  const token = str(fd, "token");
  const password = String(fd.get("password") ?? "");
  const pwErr = checkPassword(password);
  if (pwErr) return { error: pwErr };
  const user = await db.query.users.findFirst({
    where: and(eq(users.inviteTokenHash, hashToken(token)), gt(users.inviteExpiresAt, new Date()), eq(users.active, true)),
  });
  if (!user) return { error: "This invite link has expired or was already used. Ask whoever invited you for a new one." };
  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(password, 10), inviteTokenHash: null, inviteExpiresAt: null })
    .where(eq(users.id, user.id));
  await db.insert(activities).values({ actorId: user.id, kind: "joined", subjectId: user.id });
  await startSession(user.id);
  return { ok: true };
}

/* ---------- People ---------- */

async function validateManager(tier: Tier, managerId: number | null) {
  const want = managerTierFor(tier);
  if (!want) return { managerId: null };
  if (!managerId) return { error: `A ${tier} needs to report to a ${want} member.` };
  const m = await db.query.users.findFirst({ where: eq(users.id, managerId) });
  if (!m || m.tier !== want || !m.active) return { error: `A ${tier} has to report to someone in the ${want} tier.` };
  return { managerId };
}

export async function invitePerson(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const tier = str(fd, "tier") as Tier;
  const title = str(fd, "title").slice(0, 80);
  const image = str(fd, "image");
  if (!name || name.length > 80) return { error: "Enter their name." };
  if (!isEmail(email)) return { error: "Enter a valid email." };
  if (!TIERS.some((t) => t.value === tier)) return { error: "Pick a tier." };
  if (!invitableTiers(actor).includes(tier)) return { error: "You can't add people to that tier." };

  // Leads always grow their own crew
  const requested = actor.tier === "lead" ? actor.id : optInt(fd.get("managerId"));
  const mgr = await validateManager(tier, requested);
  if ("error" in mgr) return { error: mgr.error };

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return { error: `${existing.name} already has an account with that email.` };

  const inv = newInvite();
  const [person] = await db
    .insert(users)
    .values({
      name,
      email,
      tier,
      title,
      managerId: mgr.managerId,
      // Only allow the team photos that ship with the site
      image: /^\/images\/team\/[\w-]+\.(jpg|png|webp)$/.test(image) ? image : null,
      inviteTokenHash: inv.hash,
      inviteExpiresAt: inv.expires,
    })
    .returning();
  await db.insert(activities).values({ actorId: actor.id, kind: "invited", subjectId: person.id, data: { tier } });
  refresh();
  return { ok: true, id: person.id, link: await inviteLink(inv.token) };
}

export async function regenerateInvite(userId: number): Promise<FormState> {
  const actor = await requireUser();
  const person = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!person) return { error: "Not found." };
  if (person.passwordHash) return { error: `${person.name} has already joined.` };
  if (actor.tier !== "core" && person.managerId !== actor.id) return { error: "You can't invite this person." };
  const inv = newInvite();
  await db.update(users).set({ inviteTokenHash: inv.hash, inviteExpiresAt: inv.expires }).where(eq(users.id, userId));
  return { ok: true, link: await inviteLink(inv.token) };
}

export async function updatePerson(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  const id = optInt(fd.get("id"));
  const person = id ? await db.query.users.findFirst({ where: eq(users.id, id) }) : null;
  if (!person) return { error: "Not found." };

  const title = str(fd, "title").slice(0, 80);
  // Anyone can edit their own title; only core reshapes the tree
  if (!canManagePeople(actor)) {
    if (actor.id !== person.id) return { error: "Only core members can edit other people." };
    await db.update(users).set({ title }).where(eq(users.id, person.id));
    refresh();
    return { ok: true };
  }

  const tier = str(fd, "tier") as Tier;
  if (!TIERS.some((t) => t.value === tier)) return { error: "Pick a tier." };
  const active = fd.get("active") === "on";
  if (person.id === actor.id && (tier !== "core" || !active)) return { error: "You can't demote or deactivate yourself." };
  const mgr = await validateManager(tier, optInt(fd.get("managerId")));
  if ("error" in mgr) return { error: mgr.error };
  if (mgr.managerId === person.id) return { error: "Someone can't report to themself." };

  await db.update(users).set({ title, tier, managerId: mgr.managerId, active }).where(eq(users.id, person.id));
  if (tier !== person.tier) {
    await db.insert(activities).values({ actorId: actor.id, kind: "tier", subjectId: person.id, data: { from: person.tier, to: tier } });
    // People who reported to them may now sit in the wrong place in the tree
    const reports = await db.select().from(users).where(eq(users.managerId, person.id));
    for (const r of reports) {
      if (managerTierFor(r.tier) !== tier) await db.update(users).set({ managerId: null }).where(eq(users.id, r.id));
    }
  }
  refresh();
  return { ok: true };
}

/* ---------- Tasks ---------- */

const allPeople = () => db.select({ id: users.id, tier: users.tier, managerId: users.managerId, active: users.active }).from(users);

export async function createTask(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  const title = str(fd, "title");
  if (!title) return { error: "Give the task a title." };
  if (title.length > 200) return { error: "Keep the title under 200 characters." };
  const status = (str(fd, "status") || "todo") as TaskStatus;
  if (!STATUSES.some((s) => s.value === status)) return { error: "Unknown status." };
  const priority = Number(fd.get("priority") ?? 0);
  const estimate = Number(fd.get("estimate") ?? 1);
  const dueDate = str(fd, "dueDate");
  const assigneeId = optInt(fd.get("assigneeId"));
  const projectId = optInt(fd.get("projectId"));
  const parentId = optInt(fd.get("parentId"));

  if (assigneeId) {
    const people = await allPeople();
    const target = people.find((p) => p.id === assigneeId);
    if (!target || !target.active) return { error: "That person isn't on the team." };
    if (!canAssignTo(actor, target, people)) return { error: "You can only hand work to people in your crew." };
  }
  const [task] = await db
    .insert(tasks)
    .values({
      title,
      description: str(fd, "description").slice(0, 10_000),
      status,
      priority: [0, 1, 2, 3, 4].includes(priority) ? priority : 0,
      estimate: ESTIMATES.includes(estimate) ? estimate : 1,
      dueDate: isDate(dueDate) ? dueDate : null,
      assigneeId,
      projectId,
      parentId,
      creatorId: actor.id,
      completedAt: status === "done" ? new Date() : null,
    })
    .returning();

  await db.insert(activities).values({ actorId: actor.id, kind: "created", taskId: task.id, projectId, data: { parentId } });
  if (assigneeId && assigneeId !== actor.id)
    await db.insert(activities).values({ actorId: actor.id, kind: "assigned", taskId: task.id, subjectId: assigneeId });
  refresh();
  return { ok: true, id: task.id };
}

type TaskPatch = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  estimate?: number;
  assigneeId?: number | null;
  projectId?: number | null;
  dueDate?: string | null;
};

export async function updateTask(id: number, patch: TaskPatch): Promise<FormState> {
  const actor = await requireUser();
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!task) return { error: "Task not found." };
  const people = await allPeople();
  if (!canEditTask(actor, task, people)) return { error: "You can only edit tasks you created, own, or delegated to your crew." };

  const set: Partial<typeof tasks.$inferInsert> = { updatedAt: new Date() };
  const log: (typeof activities.$inferInsert)[] = [];
  const base = { actorId: actor.id, taskId: id, projectId: task.projectId };

  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t || t.length > 200) return { error: "Titles need 1–200 characters." };
    set.title = t;
  }
  if (patch.description !== undefined) set.description = patch.description.slice(0, 10_000);
  if (patch.status && patch.status !== task.status) {
    if (!STATUSES.some((s) => s.value === patch.status)) return { error: "Unknown status." };
    set.status = patch.status;
    set.completedAt = patch.status === "done" ? new Date() : null;
    log.push({ ...base, kind: patch.status === "done" ? "completed" : "status", subjectId: task.assigneeId, data: { from: task.status, to: patch.status } });
  }
  if (patch.priority !== undefined && patch.priority !== task.priority) {
    if (![0, 1, 2, 3, 4].includes(patch.priority)) return { error: "Unknown priority." };
    set.priority = patch.priority;
    log.push({ ...base, kind: "priority", data: { to: patch.priority } });
  }
  if (patch.estimate !== undefined && patch.estimate !== task.estimate) {
    if (!ESTIMATES.includes(patch.estimate)) return { error: "Unknown estimate." };
    set.estimate = patch.estimate;
    log.push({ ...base, kind: "estimate", data: { to: patch.estimate } });
  }
  if (patch.assigneeId !== undefined && patch.assigneeId !== task.assigneeId) {
    if (patch.assigneeId != null) {
      const target = people.find((p) => p.id === patch.assigneeId);
      if (!target || !target.active) return { error: "That person isn't on the team." };
      if (!canAssignTo(actor, target, people)) return { error: "You can only hand work to people in your crew." };
    }
    set.assigneeId = patch.assigneeId;
    log.push({ ...base, kind: patch.assigneeId ? "assigned" : "unassigned", subjectId: patch.assigneeId });
  }
  if (patch.projectId !== undefined && patch.projectId !== task.projectId) {
    set.projectId = patch.projectId;
    log.push({ ...base, projectId: patch.projectId, kind: "project", data: { to: patch.projectId } });
  }
  if (patch.dueDate !== undefined && patch.dueDate !== task.dueDate) {
    if (patch.dueDate && !isDate(patch.dueDate)) return { error: "Invalid date." };
    set.dueDate = patch.dueDate || null;
    log.push({ ...base, kind: "due", data: { to: patch.dueDate || null } });
  }

  await db.update(tasks).set(set).where(eq(tasks.id, id));
  if (log.length) await db.insert(activities).values(log);
  refresh();
  return { ok: true };
}

/** Returns where to go next; the client navigates so the request goes through the subdomain middleware. */
export async function deleteTask(id: number): Promise<{ error?: string; next?: string }> {
  const actor = await requireUser();
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!task) return { error: "Task not found." };
  if (actor.tier !== "core" && task.creatorId !== actor.id) return { error: "Only core or the creator can delete this task." };
  await db.delete(tasks).where(eq(tasks.id, id));
  refresh();
  return { next: task.parentId ? `/tasks/${task.parentId}` : "/tasks" };
}

export async function addComment(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  const taskId = optInt(fd.get("taskId"));
  const body = str(fd, "body");
  if (!taskId) return { error: "Missing task." };
  if (!body) return { error: "Write something first." };
  if (body.length > 5000) return { error: "Keep comments under 5,000 characters." };
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
  if (!task) return { error: "Task not found." };
  await db.insert(comments).values({ taskId, authorId: actor.id, body });
  await db.insert(activities).values({ actorId: actor.id, kind: "commented", taskId, projectId: task.projectId });
  refresh();
  return { ok: true };
}

/* ---------- Work log ---------- */

export async function logWork(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  const minutes = Math.round(Number(fd.get("hours") || 0) * 60) + Math.round(Number(fd.get("minutes") || 0));
  const note = str(fd, "note");
  const date = str(fd, "date");
  const taskId = optInt(fd.get("taskId"));
  if (!Number.isFinite(minutes) || minutes <= 0) return { error: "Add how long you spent." };
  if (minutes > 24 * 60) return { error: "That's more than a day. Split it across days." };
  if (!note) return { error: "Say what you worked on." };
  if (!isDate(date) || date > new Date().toISOString().slice(0, 10)) return { error: "Pick a date that isn't in the future." };
  await db.insert(worklogs).values({ userId: actor.id, taskId, minutes, note: note.slice(0, 500), date });
  await db.insert(activities).values({ actorId: actor.id, kind: "logged", taskId, data: { minutes, note: note.slice(0, 140) } });
  refresh();
  return { ok: true };
}

/* ---------- Projects ---------- */

export async function saveProject(_: FormState, fd: FormData): Promise<FormState> {
  const actor = await requireUser();
  if (!canManageProjects(actor)) return { error: "Only core members and leads manage projects." };
  const id = optInt(fd.get("id"));
  const name = str(fd, "name");
  const key = str(fd, "key").toUpperCase();
  const status = str(fd, "status") || "active";
  const targetDate = str(fd, "targetDate");
  if (!name || name.length > 80) return { error: "Name the project." };
  if (!/^[A-Z0-9]{2,8}$/.test(key)) return { error: "The key is 2–8 letters or digits, like CC7." };
  if (!PROJECT_STATUSES.some((s) => s.value === status)) return { error: "Unknown status." };
  const values = {
    name,
    key,
    description: str(fd, "description").slice(0, 2000),
    status: status as (typeof PROJECT_STATUSES)[number]["value"],
    leadId: optInt(fd.get("leadId")),
    targetDate: isDate(targetDate) ? targetDate : null,
  };
  const clash = await db.query.projects.findFirst({ where: eq(projects.key, key) });
  if (clash && clash.id !== id) return { error: `${clash.name} already uses the key ${key}.` };

  if (id) {
    await db.update(projects).set(values).where(eq(projects.id, id));
  } else {
    const [p] = await db.insert(projects).values(values).returning();
    await db.insert(activities).values({ actorId: actor.id, kind: "project_created", projectId: p.id, data: { name } });
  }
  refresh();
  return { ok: true };
}
