import type { TaskRowData } from "@/components/track/TaskViews";
import type { Task } from "./schema";

/** Shape tasks for the client views, folding in sub-task progress. */
export function toRows(list: Task[], all: Task[] = list): TaskRowData[] {
  return list.map((t) => {
    const subs = all.filter((s) => s.parentId === t.id);
    return {
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      estimate: t.estimate,
      assigneeId: t.assigneeId,
      creatorId: t.creatorId,
      projectId: t.projectId,
      parentId: t.parentId,
      dueDate: t.dueDate,
      subtasks: subs.length,
      subtasksDone: subs.filter((s) => s.status === "done").length,
    };
  });
}
