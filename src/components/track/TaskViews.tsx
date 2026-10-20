"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { ChevronDown, Columns3, CornerDownRight, List, Plus } from "lucide-react";
import Avatar from "./Avatar";
import { PriorityIcon, StatusIcon } from "./icons";
import { AssigneePicker, PriorityPicker, StatusPicker } from "./TaskPickers";
import { useTrack } from "./TrackContext";
import { STATUSES, taskKey } from "@/lib/track/constants";
import { canEditTask } from "@/lib/track/permissions";
import type { TaskStatus } from "@/lib/track/schema";
import { updateTask } from "@/app/track/actions";

/** The task fields list/board rows need; dates arrive as ISO strings. */
export type TaskRowData = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: number;
  estimate: number;
  assigneeId: number | null;
  creatorId: number | null;
  projectId: number | null;
  parentId: number | null;
  dueDate: string | null;
  subtasks: number;
  subtasksDone: number;
};

type Patch = { id: number; status?: TaskStatus; priority?: number; assigneeId?: number | null };

function useTaskMutations(tasks: TaskRowData[]) {
  const [optimistic, apply] = useOptimistic(tasks, (cur: TaskRowData[], p: Patch) =>
    cur.map((t) => (t.id === p.id ? { ...t, ...p } : t)),
  );
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const mutate = (p: Patch) =>
    start(async () => {
      apply(p);
      const { id, ...patch } = p;
      const res = await updateTask(id, patch);
      setError(res?.error ?? null);
    });
  return { tasks: optimistic, mutate, error };
}

function formatDue(d: string) {
  const date = new Date(`${d}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function isOverdue(t: TaskRowData) {
  return t.dueDate != null && t.status !== "done" && t.status !== "canceled" && t.dueDate < new Date().toLocaleDateString("en-CA");
}

export function ViewToggle() {
  const params = useSearchParams();
  const path = usePathname();
  const view = params.get("view") === "board" ? "board" : "list";
  const href = (v: string) => {
    const p = new URLSearchParams(params);
    if (v === "list") p.delete("view");
    else p.set("view", v);
    const q = p.toString();
    return q ? `${path}?${q}` : path;
  };
  return (
    <div className="flex rounded-md border border-line p-0.5">
      {[
        { v: "list", Icon: List, label: "List" },
        { v: "board", Icon: Columns3, label: "Board" },
      ].map(({ v, Icon, label }) => (
        <Link
          key={v}
          href={href(v)}
          aria-label={`${label} view`}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${view === v ? "bg-ink-3 text-paper" : "text-subtle hover:text-paper"}`}
        >
          <Icon className="size-3.5" /> <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </div>
  );
}

export function NewTaskButton({ projectId, assigneeId }: { projectId?: number; assigneeId?: number }) {
  const { openCreate } = useTrack();
  return (
    <button
      onClick={() => openCreate({ projectId, assigneeId })}
      className="flex h-7 items-center gap-1.5 rounded-md bg-paper px-2.5 text-xs font-medium text-ink transition-colors hover:bg-orange"
    >
      <Plus className="size-3.5" /> New task
    </button>
  );
}

export function TaskList({
  tasks: initial,
  emptyText = "Nothing here yet.",
  hideDone = false,
  showProject = true,
}: {
  tasks: TaskRowData[];
  emptyText?: string;
  hideDone?: boolean;
  showProject?: boolean;
}) {
  const { people, projects, viewer, openCreate } = useTrack();
  const { tasks, mutate, error } = useTaskMutations(initial);
  const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set(hideDone ? ["done", "canceled"] : ["canceled"]));
  const viewerPerson = people.find((p) => p.id === viewer.id)!;

  if (!tasks.length) {
    return <p className="px-6 py-16 text-center text-sm text-subtle">{emptyText}</p>;
  }

  return (
    <div>
      {error && <p className="border-b border-orange/30 bg-orange/10 px-6 py-2 text-[13px] text-orange">{error}</p>}
      {STATUSES.map(({ value, label }) => {
        const group = tasks.filter((t) => t.status === value);
        if (!group.length) return null;
        const isCollapsed = collapsed.has(value);
        return (
          <section key={value}>
            <div className="sticky top-12 z-10 flex items-center gap-2 border-b border-line bg-ink-2 px-4 py-1.5 sm:px-6 lg:top-0">
              <button
                onClick={() =>
                  setCollapsed((s) => {
                    const n = new Set(s);
                    if (n.has(value)) n.delete(value);
                    else n.add(value);
                    return n;
                  })
                }
                className="flex items-center gap-2 text-[13px]"
                aria-expanded={!isCollapsed}
              >
                <ChevronDown className={`size-3.5 text-subtle transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                <StatusIcon status={value} />
                <span className="font-medium">{label}</span>
                <span className="text-subtle">{group.length}</span>
              </button>
              <button
                onClick={() => openCreate({ status: value })}
                aria-label={`New ${label} task`}
                className="ml-auto rounded p-1 text-subtle hover:bg-ink-3 hover:text-paper"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            {!isCollapsed &&
              group.map((t) => {
                const editable = canEditTask(viewerPerson, t, people);
                const project = projects.find((p) => p.id === t.projectId);
                return (
                  <div
                    key={t.id}
                    className="group relative flex h-11 items-center gap-1 border-b border-line/60 px-3 text-[13px] transition-colors hover:bg-ink-2 sm:px-5"
                  >
                    <Link href={`/tasks/${t.id}`} className="absolute inset-0" aria-label={t.title} />
                    <div className="relative">
                      <PriorityPicker compact value={t.priority} disabled={!editable} onChange={(v) => mutate({ id: t.id, priority: v })} />
                    </div>
                    <span className="hidden w-14 shrink-0 font-mono text-[11px] text-subtle sm:block">{taskKey(t.id)}</span>
                    <div className="relative">
                      <StatusPicker compact value={t.status} disabled={!editable} onChange={(v) => mutate({ id: t.id, status: v })} />
                    </div>
                    <span className="pointer-events-none min-w-0 flex-1 truncate pl-1">
                      {t.parentId && <CornerDownRight className="mr-1.5 inline size-3 text-subtle" />}
                      {t.title}
                    </span>
                    {t.subtasks > 0 && (
                      <span className="pointer-events-none hidden shrink-0 font-mono text-[11px] text-subtle md:inline">
                        {t.subtasksDone}/{t.subtasks}
                      </span>
                    )}
                    {showProject && project && (
                      <span className="pointer-events-none hidden shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted md:inline">
                        {project.name}
                      </span>
                    )}
                    {t.dueDate && (
                      <span
                        className={`pointer-events-none hidden w-14 shrink-0 text-right text-[11px] sm:inline ${isOverdue(t) ? "text-orange" : "text-subtle"}`}
                      >
                        {formatDue(t.dueDate)}
                      </span>
                    )}
                    <span className="pointer-events-none hidden w-10 shrink-0 text-right font-mono text-[11px] text-subtle sm:inline">
                      {t.estimate}pt
                    </span>
                    <div className="relative">
                      <AssigneePicker
                        compact
                        align="right"
                        value={t.assigneeId}
                        disabled={!editable}
                        onChange={(v) => mutate({ id: t.id, assigneeId: v })}
                      />
                    </div>
                  </div>
                );
              })}
          </section>
        );
      })}
    </div>
  );
}

export function TaskBoard({ tasks: initial }: { tasks: TaskRowData[] }) {
  const { people, projects, viewer, openCreate } = useTrack();
  const router = useRouter();
  const { tasks, mutate, error } = useTaskMutations(initial);
  const [over, setOver] = useState<TaskStatus | null>(null);
  const viewerPerson = people.find((p) => p.id === viewer.id)!;
  const columns = STATUSES.filter((s) => s.value !== "canceled");

  return (
    <div>
      {error && <p className="border-b border-orange/30 bg-orange/10 px-6 py-2 text-[13px] text-orange">{error}</p>}
      <div className="flex gap-3 overflow-x-auto p-4 sm:px-6">
        {columns.map(({ value, label }) => {
          const col = tasks.filter((t) => t.status === value);
          return (
            <section
              key={value}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(value);
              }}
              onDragLeave={() => setOver((o) => (o === value ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                const id = Number(e.dataTransfer.getData("text/task"));
                const t = tasks.find((x) => x.id === id);
                if (t && t.status !== value) mutate({ id, status: value });
              }}
              className={`flex w-72 shrink-0 flex-col rounded-lg border p-2 transition-colors ${
                over === value ? "border-orange/50 bg-orange/5" : "border-transparent bg-ink-2/60"
              }`}
            >
              <header className="flex items-center gap-2 px-1.5 pt-0.5 pb-2 text-[13px]">
                <StatusIcon status={value} />
                <span className="font-medium">{label}</span>
                <span className="text-subtle">{col.length}</span>
                <button
                  onClick={() => openCreate({ status: value })}
                  aria-label={`New ${label} task`}
                  className="ml-auto rounded p-1 text-subtle hover:bg-ink-3 hover:text-paper"
                >
                  <Plus className="size-3.5" />
                </button>
              </header>
              <div className="flex min-h-24 flex-col gap-2">
                {col.map((t) => {
                  const editable = canEditTask(viewerPerson, t, people);
                  const assignee = people.find((p) => p.id === t.assigneeId);
                  const project = projects.find((p) => p.id === t.projectId);
                  return (
                    <article
                      key={t.id}
                      draggable={editable}
                      onDragStart={(e) => e.dataTransfer.setData("text/task", String(t.id))}
                      onClick={() => router.push(`/tasks/${t.id}`)}
                      className={`cursor-pointer rounded-md border border-line bg-ink-2 p-3 transition-colors hover:border-line-strong ${
                        editable ? "active:cursor-grabbing" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-subtle">
                        {taskKey(t.id)}
                        <Avatar person={assignee} size={18} />
                      </div>
                      <p className="mt-1.5 text-[13px] leading-snug">{t.title}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-subtle">
                        <span className="grid size-5 place-items-center rounded border border-line">
                          <PriorityIcon priority={t.priority} size={12} />
                        </span>
                        {project && <span className="rounded border border-line px-1.5 py-0.5">{project.key}</span>}
                        <span className="rounded border border-line px-1.5 py-0.5 font-mono">{t.estimate}pt</span>
                        {t.dueDate && (
                          <span className={`rounded border border-line px-1.5 py-0.5 ${isOverdue(t) ? "text-orange" : ""}`}>
                            {formatDue(t.dueDate)}
                          </span>
                        )}
                        {t.subtasks > 0 && (
                          <span className="rounded border border-line px-1.5 py-0.5 font-mono">
                            {t.subtasksDone}/{t.subtasks}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
