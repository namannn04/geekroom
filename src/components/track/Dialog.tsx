"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/** Native <dialog> so focus trapping and Escape come from the browser. */
export default function Dialog({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto w-[calc(100%-32px)] overflow-visible rounded-xl border border-line-strong bg-ink-2 p-0 text-paper shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)] backdrop:bg-black/60 backdrop:backdrop-blur-[2px] ${
        wide ? "max-w-[680px]" : "max-w-[460px]"
      }`}
    >
      {open && (
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-subtle hover:bg-ink-3 hover:text-paper">
              <X className="size-4" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-subtle">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors placeholder:text-subtle focus:border-paper/60";

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-md border border-orange/40 bg-orange/10 px-3 py-2 text-[13px] text-orange">
      {error}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-md bg-paper px-4 font-mono text-[11px] font-medium tracking-[0.08em] text-ink uppercase transition-colors hover:bg-orange disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
