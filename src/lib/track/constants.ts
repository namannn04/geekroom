import type { ProjectStatus, TaskStatus, Tier } from "./schema";

export const TIERS: { value: Tier; label: string; plural: string; blurb: string }[] = [
  { value: "core", label: "Core", plural: "Core team", blurb: "Runs Geek Room and hands out work" },
  { value: "lead", label: "Lead", plural: "Leads", blurb: "Reports to a core member and runs a crew" },
  { value: "member", label: "Member", plural: "Members", blurb: "Reports to a lead and ships the work" },
];
export const tierLabel = (t: Tier) => TIERS.find((x) => x.value === t)!.label;
export const tierRank: Record<Tier, number> = { core: 0, lead: 1, member: 2 };

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];
export const statusLabel = (s: TaskStatus) => STATUSES.find((x) => x.value === s)!.label;
export const OPEN_STATUSES: TaskStatus[] = ["backlog", "todo", "in_progress", "in_review"];

export const PRIORITIES = [
  { value: 0, label: "No priority" },
  { value: 1, label: "Urgent" },
  { value: 2, label: "High" },
  { value: 3, label: "Medium" },
  { value: 4, label: "Low" },
];
export const priorityLabel = (p: number) => PRIORITIES.find((x) => x.value === p)?.label ?? "No priority";

export const ESTIMATES = [1, 2, 3, 5, 8];

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export const taskKey = (id: number) => `GR-${id}`;
