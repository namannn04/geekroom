"use client";

import { useActionState, useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import Dialog, { Field, FormError, SubmitButton, inputCls } from "./Dialog";
import { useTrack } from "./TrackContext";
import { updatePerson, type FormState } from "@/app/track/actions";
import { TIERS } from "@/lib/track/constants";
import { managerTierFor } from "@/lib/track/permissions";
import type { Tier } from "@/lib/track/schema";

type P = { id: number; title: string; tier: Tier; managerId: number | null; active: boolean };

export default function PersonEdit({ person, full }: { person: P; full: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-7 items-center gap-1.5 rounded-md border border-line-strong px-2.5 text-xs hover:bg-ink-3">
        <Settings2 className="size-3.5" /> {full ? "Manage" : "Edit role"}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={full ? "Manage member" : "Edit your role"}>
        {open && <Form person={person} full={full} onDone={() => setOpen(false)} />}
      </Dialog>
    </>
  );
}

function Form({ person, full, onDone }: { person: P; full: boolean; onDone: () => void }) {
  const { people } = useTrack();
  const [state, action, pending] = useActionState<FormState, FormData>(updatePerson, undefined);
  const [tier, setTier] = useState<Tier>(person.tier);
  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);
  const mt = managerTierFor(tier);
  const managers = people.filter((p) => p.active && p.tier === mt && p.id !== person.id);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={person.id} />
      <Field label="Role">
        <input name="title" maxLength={80} defaultValue={person.title} className={inputCls} placeholder="Sponsorships" />
      </Field>
      {full && (
        <>
          <Field label="Tier">
            <select name="tier" value={tier} onChange={(e) => setTier(e.target.value as Tier)} className={inputCls}>
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}: {t.blurb}
                </option>
              ))}
            </select>
          </Field>
          {mt && (
            <Field label={`Reports to (${mt})`}>
              <select name="managerId" required className={inputCls} defaultValue={managers.some((m) => m.id === person.managerId) ? (person.managerId ?? "") : ""}>
                <option value="" disabled>
                  Pick someone
                </option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" name="active" defaultChecked={person.active} className="accent-[var(--orange)]" />
            Active on the team <span className="text-subtle">(untick to move them to alumni)</span>
          </label>
        </>
      )}
      <FormError error={state?.error} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Save</SubmitButton>
      </div>
    </form>
  );
}
