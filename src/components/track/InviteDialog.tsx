"use client";

import { useActionState, useState, useTransition } from "react";
import { Check, Copy, Link2, UserPlus } from "lucide-react";
import Dialog, { Field, FormError, SubmitButton, inputCls } from "./Dialog";
import Avatar from "./Avatar";
import { useTrack } from "./TrackContext";
import { invitePerson, regenerateInvite, type FormState } from "@/app/track/actions";
import { TIERS } from "@/lib/track/constants";
import { invitableTiers, managerTierFor } from "@/lib/track/permissions";
import type { Tier } from "@/lib/track/schema";

export type Suggestion = { name: string; image: string };

export function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-md border border-line-strong bg-ink p-1 pl-3">
      <code className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">{link}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="flex h-7 items-center gap-1.5 rounded bg-paper px-2.5 text-[12px] font-medium text-ink hover:bg-orange"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function InviteButton({ suggestions = [] }: { suggestions?: Suggestion[] }) {
  const { viewer } = useTrack();
  const [open, setOpen] = useState(false);
  if (!invitableTiers(viewer).length) return null;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-7 items-center gap-1.5 rounded-md bg-paper px-2.5 text-xs font-medium text-ink hover:bg-orange"
      >
        <UserPlus className="size-3.5" /> Invite
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Invite to Geek Room Track">
        {open && <InviteForm suggestions={suggestions} />}
      </Dialog>
    </>
  );
}

function InviteForm({ suggestions }: { suggestions: Suggestion[] }) {
  const { viewer, people } = useTrack();
  const tiers = invitableTiers(viewer);
  const [state, action, pending] = useActionState<FormState, FormData>(invitePerson, undefined);
  const [tier, setTier] = useState<Tier>(tiers[tiers.length - 1]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const managerTier = managerTierFor(tier);
  const managers = people.filter((p) => p.active && p.tier === managerTier);
  const taken = new Set(people.map((p) => p.name.toLowerCase()));
  const open = suggestions.filter((s) => !taken.has(s.name.toLowerCase()));

  if (state?.ok && state.link) {
    return (
      <div className="space-y-4">
        <p className="text-[14px] leading-relaxed">
          <span className="text-orange">Invite ready.</span> Send this link to them on WhatsApp or email. It works once and expires in 7 days.
        </p>
        <CopyLink link={state.link} />
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {tier === "core" && open.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">From the website team</p>
          <div className="flex flex-wrap gap-1.5">
            {open.map((s) => (
              <button
                type="button"
                key={s.name}
                onClick={() => {
                  setName(s.name);
                  setImage(s.image);
                }}
                className={`flex items-center gap-1.5 rounded-full border py-0.5 pr-2.5 pl-0.5 text-[12px] transition-colors ${
                  name === s.name ? "border-orange text-paper" : "border-line text-muted hover:border-line-strong"
                }`}
              >
                <Avatar person={s} size={20} /> {s.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      )}
      <input type="hidden" name="image" value={image} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            maxLength={80}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setImage("");
            }}
            className={inputCls}
          />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required className={inputCls} />
        </Field>
      </div>
      <Field label="Tier">
        <div className="grid grid-cols-3 gap-1.5">
          {TIERS.filter((t) => tiers.includes(t.value)).map((t) => (
            <label
              key={t.value}
              className={`cursor-pointer rounded-md border px-3 py-2 text-[13px] transition-colors ${
                tier === t.value ? "border-orange bg-orange/10" : "border-line-strong hover:border-paper/40"
              }`}
            >
              <input type="radio" name="tier" value={t.value} checked={tier === t.value} onChange={() => setTier(t.value)} className="sr-only" />
              <span className="block font-medium">{t.label}</span>
              <span className="block text-[11px] leading-snug text-subtle">{t.blurb}</span>
            </label>
          ))}
        </div>
      </Field>
      {managerTier && viewer.tier === "core" && (
        <Field label={`Reports to (${managerTier})`}>
          <select name="managerId" required className={inputCls} defaultValue="">
            <option value="" disabled>
              {managers.length ? "Pick someone" : `Invite a ${managerTier} first`}
            </option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Role" hint="Optional, e.g. Design lead, Sponsorships, Community">
        <input name="title" maxLength={80} className={inputCls} />
      </Field>
      <FormError error={state?.error} />
      <div className="flex justify-end">
        <SubmitButton pending={pending}>Create invite</SubmitButton>
      </div>
    </form>
  );
}

export function ResendInvite({ userId }: { userId: number }) {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (link) return <CopyLink link={link} />;
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await regenerateInvite(userId);
            if (r?.link) setLink(r.link);
            else setError(r?.error ?? "Couldn't create a link");
          })
        }
        className="flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] text-muted hover:border-line-strong hover:text-paper"
      >
        <Link2 className="size-3" /> {pending ? "…" : "New invite link"}
      </button>
      {error && <span className="text-[11px] text-orange">{error}</span>}
    </span>
  );
}
