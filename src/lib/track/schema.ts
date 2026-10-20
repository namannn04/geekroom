import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

/** Core runs Geek Room; leads report to a core member; members report to a lead. */
export const tierEnum = pgEnum("tier", ["core", "lead", "member"]);
export const statusEnum = pgEnum("task_status", ["backlog", "todo", "in_progress", "in_review", "done", "canceled"]);
export const projectStatusEnum = pgEnum("project_status", ["planned", "active", "paused", "completed"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  tier: tierEnum("tier").notNull().default("member"),
  title: text("title").notNull().default(""),
  managerId: integer("manager_id").references((): AnyPgColumn => users.id, { onDelete: "set null" }),
  image: text("image"),
  inviteTokenHash: text("invite_token_hash"),
  inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  status: projectStatusEnum("status").notNull().default("active"),
  leadId: integer("lead_id").references(() => users.id, { onDelete: "set null" }),
  targetDate: date("target_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: statusEnum("status").notNull().default("todo"),
    /** 0 none, 1 urgent, 2 high, 3 medium, 4 low (Linear's ordering) */
    priority: integer("priority").notNull().default(0),
    /** Effort points: 1, 2, 3, 5 or 8. Completing the task credits these to the assignee. */
    estimate: integer("estimate").notNull().default(1),
    projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
    assigneeId: integer("assignee_id").references(() => users.id, { onDelete: "set null" }),
    creatorId: integer("creator_id").references(() => users.id, { onDelete: "set null" }),
    parentId: integer("parent_id").references((): AnyPgColumn => tasks.id, { onDelete: "cascade" }),
    dueDate: date("due_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("tasks_assignee_idx").on(t.assigneeId), index("tasks_parent_idx").on(t.parentId)],
);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Time spent on anything, tied to a task or not, so work outside the tracker still counts. */
export const worklogs = pgTable(
  "worklogs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskId: integer("task_id").references(() => tasks.id, { onDelete: "set null" }),
    minutes: integer("minutes").notNull(),
    note: text("note").notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("worklogs_user_idx").on(t.userId, t.date)],
);

/** Append-only feed. Every row is one unit on the contribution graph. */
export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    actorId: integer("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }),
    projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").references(() => users.id, { onDelete: "set null" }),
    data: jsonb("data").$type<Record<string, string | number | null>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("activities_actor_idx").on(t.actorId, t.createdAt), index("activities_task_idx").on(t.taskId)],
);

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Tier = (typeof tierEnum.enumValues)[number];
export type TaskStatus = (typeof statusEnum.enumValues)[number];
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
