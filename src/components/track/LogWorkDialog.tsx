"use client";

import { useActionState, useEffect } from "react";
import Dialog, { Field, FormError, SubmitButton, inputCls } from "./Dialog";
import { logWork, type FormState } from "@/app/track/actions";

const today = () => new Date().toLocaleDateString("en-CA");

export default function LogWorkDialog({ open, taskId, onClose }: { open: boolean; taskId?: number; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Log effort">
      {open && <LogWorkForm taskId={taskId} onClose={onClose} />}
    </Dialog>
  );
}

function LogWorkForm({ taskId, onClose }: { taskId?: number; onClose: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(logWork, undefined);
  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <form action={action} className="space-y-4">
      <p className="text-[13px] leading-relaxed text-muted">
        Calls with sponsors, design work, venue runs, moderating the community: log it so it counts. Every hour is one effort point.
      </p>
      <input type="hidden" name="taskId" value={taskId ?? ""} />
      <Field label="What did you work on?">
        <textarea name="note" required rows={3} maxLength={500} className={inputCls} placeholder="Coordinated judges for CC 6.0 finale" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Hours">
          <input name="hours" type="number" min={0} max={24} step={1} defaultValue={1} className={inputCls} />
        </Field>
        <Field label="Minutes">
          <input name="minutes" type="number" min={0} max={59} step={5} defaultValue={0} className={inputCls} />
        </Field>
        <Field label="Date">
          <input name="date" type="date" max={today()} defaultValue={today()} className={`${inputCls} [color-scheme:dark]`} />
        </Field>
      </div>
      <FormError error={state?.error} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Log effort</SubmitButton>
      </div>
    </form>
  );
}
