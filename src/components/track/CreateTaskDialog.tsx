"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownRight } from "lucide-react";
import Dialog, { FormError, SubmitButton } from "./Dialog";
import { AssigneePicker, DueDateInput, EstimatePicker, PriorityPicker, ProjectPicker, StatusPicker } from "./TaskPickers";
import type { CreateDefaults } from "./TrackContext";
import { createTask, type FormState } from "@/app/track/actions";
import type { TaskStatus } from "@/lib/track/schema";

export default function CreateTaskDialog({
  open,
  defaults,
  onClose,
}: {
  open: boolean;
  defaults: CreateDefaults;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={defaults.parentId ? "Delegate a sub-task" : "New task"} wide>
      {/* Remount per open so every new task starts from a clean form */}
      {open && <CreateTaskForm defaults={defaults} onClose={onClose} />}
    </Dialog>
  );
}

function CreateTaskForm({ defaults, onClose }: { defaults: CreateDefaults; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(createTask, undefined);
  const [status, setStatus] = useState<TaskStatus>((defaults.status as TaskStatus) ?? "todo");
  const [priority, setPriority] = useState(0);
  const [estimate, setEstimate] = useState(1);
  const [assigneeId, setAssigneeId] = useState<number | null>(defaults.assigneeId ?? null);
  const [projectId, setProjectId] = useState<number | null>(defaults.projectId ?? null);
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.ok || !state.id) return;
    onClose();
    if (!defaults.parentId) router.push(`/tasks/${state.id}`);
  }, [state, onClose, router, defaults.parentId]);

  return (
    <form action={action} className="space-y-4">
      {defaults.parentId && (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <CornerDownRight className="size-3.5" /> Sub-task of <span className="text-paper">{defaults.parentTitle}</span>
        </p>
      )}
      <input type="hidden" name="parentId" value={defaults.parentId ?? ""} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="priority" value={priority} />
      <input type="hidden" name="estimate" value={estimate} />
      <input type="hidden" name="assigneeId" value={assigneeId ?? ""} />
      <input type="hidden" name="projectId" value={projectId ?? ""} />
      <input type="hidden" name="dueDate" value={dueDate ?? ""} />

      <input
        name="title"
        required
        autoFocus
        maxLength={200}
        placeholder="Task title"
        className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-subtle focus-visible:outline-none"
      />
      <textarea
        name="description"
        rows={4}
        placeholder="Add details, links, acceptance criteria…"
        className="w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none placeholder:text-subtle focus-visible:outline-none"
      />

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line pt-3 [&>*]:rounded-md [&>*]:border [&>*]:border-line">
        <StatusPicker value={status} onChange={setStatus} />
        <PriorityPicker value={priority} onChange={setPriority} />
        <AssigneePicker value={assigneeId} onChange={setAssigneeId} />
        <ProjectPicker value={projectId} onChange={setProjectId} />
        <EstimatePicker value={estimate} onChange={setEstimate} />
        <div className="w-40">
          <DueDateInput value={dueDate} onChange={setDueDate} />
        </div>
      </div>

      <FormError error={state?.error} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Create task</SubmitButton>
      </div>
    </form>
  );
}
