"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

export type PickerOption<V> = { value: V; label: string; icon?: ReactNode; hint?: string };

/**
 * Linear-style property picker: a trigger that opens a filterable list.
 * Arrow keys move, Enter picks, Escape closes.
 */
export default function Picker<V extends string | number | null>({
  options,
  value,
  onChange,
  children,
  label,
  disabled,
  align = "left",
  className = "",
}: {
  options: PickerOption<V>[];
  value: V;
  onChange: (v: V) => void;
  children: ReactNode;
  label: string;
  disabled?: boolean;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    }
  }, [open, options, value]);

  const pick = (o: PickerOption<V>) => {
    setOpen(false);
    if (o.value !== value) onChange(o.value);
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors hover:bg-ink-3 disabled:cursor-default disabled:hover:bg-transparent"
      >
        {children}
      </button>
      {open && (
        <div
          className={`absolute top-full z-50 mt-1 w-60 overflow-hidden rounded-lg border border-line-strong bg-ink-2 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(filtered.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[active]) pick(filtered[active]);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder={`${label}…`}
            aria-controls={listId}
            className="w-full border-b border-line bg-transparent px-3 py-2.5 text-[13px] outline-none placeholder:text-subtle focus-visible:outline-none"
          />
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 && <li className="px-2 py-2 text-[13px] text-subtle">No matches</li>}
            {filtered.map((o, i) => (
              <li
                key={String(o.value)}
                role="option"
                aria-selected={o.value === value}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(o)}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] ${i === active ? "bg-ink-3" : ""}`}
              >
                {o.icon}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.hint && <span className="shrink-0 font-mono text-[10px] text-subtle uppercase">{o.hint}</span>}
                {o.value === value && <Check className="size-3.5 shrink-0 text-muted" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
