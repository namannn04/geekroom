import type { Task, User } from "./schema";

/** Apply the FilterBar's query params to a task list. */
export function applyFilters(list: Task[], people: User[], sp: { assignee?: string; project?: string; tier?: string }) {
  return list.filter((t) => {
    if (sp.assignee === "none" && t.assigneeId != null) return false;
    if (sp.assignee && sp.assignee !== "none" && String(t.assigneeId) !== sp.assignee) return false;
    if (sp.project && String(t.projectId) !== sp.project) return false;
    if (sp.tier) {
      const a = people.find((p) => p.id === t.assigneeId);
      if (!a || a.tier !== sp.tier) return false;
    }
    return true;
  });
}
