"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import Dialog, { Field, FormError, SubmitButton, inputCls } from "./Dialog";
import { useTrack } from "./TrackContext";
import { saveProject, type FormState } from "@/app/track/actions";
import { PROJECT_STATUSES } from "@/lib/track/constants";

type ProjectInput = {
  id: number;
  key: string;
  name: string;
  description: string;
  status: string;
  leadId: number | null;
  targetDate: string | null;
};

export default function ProjectButton({ project }: { project?: ProjectInput }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          project
            ? "flex h-7 items-center gap-1.5 rounded-md border border-line-strong px-2.5 text-xs hover:bg-ink-3"
            : "flex h-7 items-center gap-1.5 rounded-md bg-paper px-2.5 text-xs font-medium text-ink hover:bg-orange"
        }
      >
        {project ? <Pencil className="size-3.5" /> : <Plus className="size-3.5" />} {project ? "Edit" : "New project"}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={project ? "Edit project" : "New project"}>
        {open && <ProjectForm project={project} onDone={() => setOpen(false)} />}
      </Dialog>
    </>
  );
}

function ProjectForm({ project, onDone }: { project?: ProjectInput; onDone: () => void }) {
  const { people } = useTrack();
  const [state, action, pending] = useActionState<FormState, FormData>(saveProject, undefined);
  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);
  const leads = people.filter((p) => p.active && p.tier !== "member");

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <div className="grid grid-cols-[1fr_100px] gap-3">
        <Field label="Name">
          <input name="name" required maxLength={80} defaultValue={project?.name} placeholder="Code Cubicle 7.0" className={inputCls} />
        </Field>
        <Field label="Key">
          <input name="key" required maxLength={8} defaultValue={project?.key} placeholder="CC7" className={`${inputCls} font-mono uppercase`} />
        </Field>
      </div>
      <Field label="Description">
        <textarea name="description" rows={3} defaultValue={project?.description} className={inputCls} placeholder="What does done look like?" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Status">
          <select name="status" defaultValue={project?.status ?? "active"} className={inputCls}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Owner">
          <select name="leadId" defaultValue={project?.leadId ?? ""} className={inputCls}>
            <option value="">None</option>
            {leads.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Target">
          <input name="targetDate" type="date" defaultValue={project?.targetDate ?? ""} className={`${inputCls} [color-scheme:dark]`} />
        </Field>
      </div>
      <FormError error={state?.error} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>{project ? "Save" : "Create project"}</SubmitButton>
      </div>
    </form>
  );
}
