"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/* Sample format only: every real report is built from the partner's own developers' results */
const scores = [
  { area: "Onboarding", value: 72, good: true },
  { area: "Docs", value: 54, good: false },
  { area: "API design", value: 81, good: true },
  { area: "Pricing clarity", value: 46, good: false },
  { area: "Performance", value: 88, good: true },
];
const friction = ["Auth setup steps", "Missing SDK examples", "Unclear rate limits"];

/** A developer-experience report in the format partners receive, with bars that fill on scroll. */
export default function DxReport() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const show = inView || !!reduced;

  return (
    <div ref={ref} className="rounded-[1.5rem] border border-line bg-ink-2 p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="display text-3xl">DX report</p>
        <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">Sample format</p>
      </div>
      <ul className="mt-6 space-y-4">
        {scores.map((s, i) => (
          <li key={s.area} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-4 text-sm">
            <span className="text-paper">{s.area}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-ink-3">
              <motion.span
                className={`block h-full rounded-full ${s.good ? "bg-teal" : "bg-orange"}`}
                initial={{ width: reduced ? `${s.value}%` : 0 }}
                animate={show ? { width: `${s.value}%` } : {}}
                transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="text-right font-mono text-xs text-muted tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <p className="label">Top friction</p>
          <ol className="mt-3 space-y-1.5 text-sm text-paper">
            {friction.map((f, i) => (
              <li key={f}>
                {i + 1}. {f}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="label">Developer voice</p>
          <p className="mt-3 font-display text-lg leading-snug font-bold [font-stretch:90%]">
            &ldquo;Took me 10 minutes to first query. The docs need one full example.&rdquo;
          </p>
        </div>
      </div>
      <p className="mt-6 text-xs text-subtle">Illustrative layout. Every report is built from your own developers&apos; results.</p>
    </div>
  );
}
