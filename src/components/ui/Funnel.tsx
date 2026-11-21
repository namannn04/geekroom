"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

export type FunnelStage = { value: number; suffix?: string; label: string };

const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");

/**
 * A selection funnel: each stage's bar shoots out to its share of the first stage
 * (log scale, so 14,500 and 150 can share an axis) while its number counts up.
 */
export default function Funnel({ stages, compact = false }: { stages: FunnelStage[]; compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const top = Math.log10(stages[0].value);
  const share = (v: number) => Math.max(0.08, Math.log10(v) / top);

  return (
    <div ref={root}>
      <ol className="space-y-3">
        {stages.map((s, i) => (
          <li key={s.label} className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-5">
            <div className="flex items-baseline justify-between gap-3 sm:block">
              <p className={`display tabular-nums ${compact ? "text-3xl" : "text-[clamp(2rem,4vw,3rem)]"}`}>
                <Counter value={s.value} run={inView || !!reduced} delay={i * 0.25} />
                {s.suffix && <span className="text-orange">{s.suffix}</span>}
              </p>
              <p className="text-sm text-muted sm:mt-1">{s.label}</p>
            </div>
            <div className="relative h-9 overflow-hidden rounded-lg bg-ink-3 sm:h-11">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{
                  width: `${share(s.value) * 100}%`,
                  background: i === stages.length - 1 ? "var(--orange)" : `color-mix(in oklab, var(--orange) ${30 + (i / Math.max(1, stages.length - 1)) * 50}%, var(--ink-3))`,
                  transformOrigin: "0% 50%",
                }}
                initial={{ scaleX: reduced ? 1 : 0 }}
                animate={inView || reduced ? { scaleX: 1 } : {}}
                transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : i * 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        ))}
      </ol>
      {stages.length > 1 && (
        <p className="mt-4 font-mono text-[11px] tracking-[0.04em] text-subtle">
          Bar lengths on a log scale
        </p>
      )}
    </div>
  );
}

function Counter({ value, run, delay }: { value: number; run: boolean; delay: number }) {
  const [v, setV] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!run) return;
    if (reduced) {
      setV(value);
      return;
    }
    const c = animate(0, value, { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [run, value, delay, reduced]);

  return <span>{fmt(v)}</span>;
}
