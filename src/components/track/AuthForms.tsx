"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import DotField from "@/components/ui/DotField";
import GeekMark from "@/components/ui/GeekMark";
import { Field, FormError, SubmitButton, inputCls } from "./Dialog";
import { acceptInvite, login, setupOwner, type FormState } from "@/app/track/actions";

export function AuthFrame({ heading, sub, children }: { heading: ReactNode; sub: string; children: ReactNode }) {
  return (
    <main className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-4 py-16">
      <DotField className="absolute inset-0 -z-10 opacity-50" />
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex items-center gap-2.5">
          <GeekMark className="h-7 w-auto" />
          <span className="font-display text-base font-bold uppercase">Geek Room</span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-orange uppercase">Track</span>
        </div>
        <h1 className="display text-[clamp(2.6rem,9vw,3.6rem)]">{heading}</h1>
        <p className="mt-3 mb-8 text-[15px] leading-relaxed text-muted">{sub}</p>
        <div className="rounded-xl border border-line-strong bg-ink-2/90 p-5 backdrop-blur">{children}</div>
      </div>
    </main>
  );
}

/**
 * Server-action redirects render their target without passing through the middleware,
 * which would serve the marketing home page on the track host. A full navigation avoids that.
 */
function useGoHomeOnSuccess(state: FormState) {
  useEffect(() => {
    if (state?.ok) window.location.assign("/");
  }, [state]);
}

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, undefined);
  useGoHomeOnSuccess(state);
  return (
    <form action={action} className="space-y-4">
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
      <FormError error={state?.error} />
      <SubmitButton pending={pending || Boolean(state?.ok)}>Sign in</SubmitButton>
    </form>
  );
}

export function SetupForm({ needsKey }: { needsKey: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(setupOwner, undefined);
  useGoHomeOnSuccess(state);
  return (
    <form action={action} className="space-y-4">
      {needsKey && (
        <Field label="Setup key" hint="The TRACK_SETUP_KEY value from the Vercel project settings.">
          <input name="setupKey" type="password" required className={inputCls} />
        </Field>
      )}
      <Field label="Your name">
        <input name="name" required maxLength={80} autoComplete="name" className={inputCls} />
      </Field>
      <Field label="Role at Geek Room">
        <input name="title" maxLength={80} placeholder="Founder" className={inputCls} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </Field>
      <Field label="Password" hint="At least 8 characters.">
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
      </Field>
      <FormError error={state?.error} />
      <SubmitButton pending={pending || Boolean(state?.ok)}>Create workspace</SubmitButton>
    </form>
  );
}

export function InviteForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(acceptInvite, undefined);
  useGoHomeOnSuccess(state);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label="Email">
        <input value={email} readOnly autoComplete="username" className={`${inputCls} text-muted`} />
      </Field>
      <Field label="Choose a password" hint="At least 8 characters.">
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
      </Field>
      <FormError error={state?.error} />
      <SubmitButton pending={pending || Boolean(state?.ok)}>Join the team</SubmitButton>
    </form>
  );
}
