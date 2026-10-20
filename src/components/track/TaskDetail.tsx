"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { Clock3, CornerDownRight, Plus, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { StatusIcon } from "./icons";
import { AssigneePicker, DueDateInput, EstimatePicker, PriorityPicker, ProjectPicker, StatusPicker } from "./TaskPickers";
import { useTrack } from "./TrackContext";
import { FormError } from "./Dialog";
import { addComment, deleteTask, updateTask, type FormState } from "@/app/track/actions";
import { taskKey } from "@/lib/track/constants";
import type { TaskStatus } from "@/lib/track/schema";

type Detail = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  estimate: number;
  assigneeId: number | null;
  creatorId: number | null;
  projectId: number | null;
  dueDate: string | null;
};
type Sub = { id: number; title: string; status: TaskStatus; assigneeId: number | null };

export function TaskEditor({ task, editable }: { task: Detail; editable: boolean }) {
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const save = (patch: { title?: string; description?: string }) =>
    start(async () => {
      const r = await updateTask(task.id, patch);
      setError(r?.error ?? null);
    });

  return (
    <div>
      <textarea
        value={title}
        readOnly={!editable}
        rows={1}
        onChange={(e) => setTitle(e.target.value.replace(/\n/g, ""))}
        onBlur={() => title.trim() !== task.title && save({ title })}
        aria-label="Title"
        className="field-sizing-content w-full resize-none bg-transparent font-display text-2xl leading-tight font-bold outline-none [font-stretch:90%] focus-visible:outline-none sm:text-3xl"
      />
      <textarea
        value={desc}
        readOnly={!editable}
        onChange={(e) => setDesc(e.target.value)}
        onBlur={() => desc !== task.description && save({ description: desc })}
        placeholder={editable ? "Add a description…" : "No description."}
        aria-label="Description"
        className="field-sizing-content mt-3 min-h-24 w-full resize-none bg-transparent text-[15px] leading-relaxed text-muted outline-none placeholder:text-subtle focus-visible:outline-none"
      />
      {error && <FormError error={error} />}
    </div>
  );
}

export function TaskProperties({ task, editable, canDelete }: { task: Detail; editable: boolean; canDelete: boolean }) {
  const { openLogWork } = useTrack();
  const router = useRouter();
  const [t, apply] = useOptimistic(task, (cur: Detail, p: Partial<Detail>) => ({ ...cur, ...p }));
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const set = (p: Partial<Detail>) =>
    start(async () => {
      apply(p);
      const r = await updateTask(task.id, p);
      setError(r?.error ?? null);
    });
  const row = "grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2";
  const lbl = "text-[12px] text-subtle";

  return (
    <div className="space-y-1">
      <div className={row}>
        <span className={lbl}>Status</span>
        <StatusPicker value={t.status} disabled={!editable} onChange={(status) => set({ status })} />
      </div>
      <div className={row}>
        <span className={lbl}>Priority</span>
        <PriorityPicker value={t.priority} disabled={!editable} onChange={(priority) => set({ priority })} />
      </div>
      <div className={row}>
        <span className={lbl}>Assignee</span>
        <AssigneePicker value={t.assigneeId} disabled={!editable} onChange={(assigneeId) => set({ assigneeId })} />
      </div>
      <div className={row}>
        <span className={lbl}>Project</span>
        <ProjectPicker value={t.projectId} disabled={!editable} onChange={(projectId) => set({ projectId })} />
      </div>
      <div className={row}>
        <span className={lbl}>Effort</span>
        <EstimatePicker value={t.estimate} disabled={!editable} onChange={(estimate) => set({ estimate })} />
      </div>
      <div className={row}>
        <span className={lbl}>Due</span>
        <DueDateInput value={t.dueDate} disabled={!editable} onChange={(dueDate) => set({ dueDate })} />
      </div>
      {error && <p className="pt-2 text-[12px] text-orange">{error}</p>}
      <div className="flex gap-2 pt-4">
        <button
          onClick={() => openLogWork(task.id)}
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line-strong text-[12px] hover:bg-ink-3"
        >
          <Clock3 className="size-3.5" /> Log effort
        </button>
        {canDelete && (
          <button
            onClick={() => {
              if (!confirm("Delete this task and its sub-tasks?")) return;
              start(async () => {
                const r = await deleteTask(task.id);
                if (r.next) router.push(r.next);
                else setError(r.error ?? null);
              });
            }}
            aria-label="Delete task"
            className="grid size-8 place-items-center rounded-md border border-line-strong text-subtle hover:border-orange/60 hover:text-orange"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Subtasks({ parent, subs }: { parent: { id: number; title: string; projectId: number | null }; subs: Sub[] }) {
  const { people, openCreate } = useTrack();
  const done = subs.filter((s) => s.status === "done").length;
  return (
    <section className="mt-8">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-[13px] font-medium">Sub-tasks</h2>
        {subs.length > 0 && (
          <span className="font-mono text-[11px] text-subtle">
            {done}/{subs.length}
          </span>
        )}
        <button
          onClick={() => openCreate({ parentId: parent.id, parentTitle: parent.title, projectId: parent.projectId })}
          className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted hover:bg-ink-3 hover:text-paper"
        >
          <Plus className="size-3.5" /> Delegate a sub-task
        </button>
      </div>
      {subs.length > 0 ? (
        <ul className="overflow-hidden rounded-lg border border-line">
          {subs.map((s) => (
            <li key={s.id} className="border-b border-line last:border-0">
              <Link href={`/tasks/${s.id}`} className="flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-ink-2">
                <CornerDownRight className="size-3 text-subtle" />
                <StatusIcon status={s.status} />
                <span className="font-mono text-[11px] text-subtle">{taskKey(s.id)}</span>
                <span className={`min-w-0 flex-1 truncate ${s.status === "done" ? "text-muted line-through decoration-subtle" : ""}`}>{s.title}</span>
                <Avatar person={people.find((p) => p.id === s.assigneeId)} size={18} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-line px-3 py-3 text-[13px] text-subtle">
          Break this down and hand the pieces to your crew. Each sub-task credits whoever ships it.
        </p>
      )}
    </section>
  );
}

export function CommentComposer({ taskId }: { taskId: number }) {
  const { people, viewer } = useTrack();
  const [state, action, pending] = useActionState<FormState, FormData>(addComment, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="flex gap-2.5">
      <Avatar person={people.find((p) => p.id === viewer.id)} size={22} className="mt-1.5" />
      <div className="flex-1 rounded-lg border border-line-strong bg-ink-2 focus-within:border-paper/50">
        <input type="hidden" name="taskId" value={taskId} />
        <textarea
          name="body"
          rows={2}
          placeholder="Leave a comment…"
          className="w-full resize-y bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-subtle focus-visible:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) form.current?.requestSubmit();
          }}
        />
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-[11px] text-subtle">{state?.error ?? "⌘ + Enter to send"}</span>
          <button disabled={pending} className="rounded-md bg-paper px-3 py-1 text-[12px] font-medium text-ink hover:bg-orange disabled:opacity-60">
            Comment
          </button>
        </div>
      </div>
    </form>
  );
}
