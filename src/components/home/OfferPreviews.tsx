"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/** Ticks a counter while the element is on screen; frozen for reduced motion. */
function useTicker(ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [inView, reduced, ms]);
  return { ref, tick, reduced };
}

const frame = "rounded-2xl border border-line bg-ink p-4 font-mono text-[11px]";

/** Hiring: four candidates whose scores keep updating, so the shortlist re-sorts itself. */
export function HiringPreview() {
  const { ref, tick, reduced } = useTicker(1600);
  const base = [
    { id: "C04", s: 31 },
    { id: "A17", s: 30 },
    { id: "B22", s: 29 },
    { id: "D09", s: 28 },
  ];
  // Deterministic wobble so the order changes every tick
  const rows = base
    .map((c, i) => ({ ...c, s: c.s + ((tick * (i + 3) + i * 5) % 7) }))
    .sort((a, b) => b.s - a.s);

  return (
    <div ref={ref} className={frame} aria-hidden>
      <div className="flex justify-between text-subtle">
        <span>Shortlist</span>
        <span className="text-orange">live scoring</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <motion.li key={r.id} layout={!reduced} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex items-center gap-3">
            <span className="w-7 text-muted">{r.id}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-3">
              <motion.span className="block h-full rounded-full bg-orange" animate={{ width: `${(r.s / 40) * 100}%` }} transition={{ duration: 0.5 }} />
            </span>
            <span className="w-5 text-right text-paper tabular-nums">{r.s}</span>
            <span className={`w-3 ${i < 2 ? "text-[#3fb950]" : "text-transparent"}`}>✓</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Hackathon: a registration counter that keeps climbing as dots fill in. */
export function HackathonPreview() {
  const { ref, tick } = useTicker(220);
  const count = 2480 + ((tick * 7) % 1261);
  const filled = Math.round(((count - 2480) / 1261) * 60);
  return (
    <div ref={ref} className={frame} aria-hidden>
      <div className="flex justify-between text-subtle">
        <span>Registrations</span>
        <span className="flex items-center gap-1.5 text-orange">
          <span className="size-1.5 animate-pulse rounded-full bg-orange" /> open
        </span>
      </div>
      <p className="display mt-2 text-4xl text-paper tabular-nums">{count.toLocaleString("en-IN")}</p>
      <div className="mt-3 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]">
        {Array.from({ length: 60 }, (_, i) => (
          <span key={i} className={`aspect-square rounded-full transition-colors duration-300 ${i < filled ? "bg-paper/80" : "bg-ink-3"} ${i === filled - 1 ? "!bg-orange" : ""}`} />
        ))}
      </div>
    </div>
  );
}

const qs = ["How do you eval tool calls?", "Works with open models?", "Latency of guardrails?"];

/** Speakers: an audience Q&A where votes keep coming in. */
export function SpeakerPreview() {
  const { ref, tick } = useTicker(1300);
  const votes = qs.map((_, i) => 6 + i * 2 + ((tick * (3 - i) + i) % 9));
  const order = qs.map((q, i) => ({ q, v: votes[i] })).sort((a, b) => b.v - a.v);
  return (
    <div ref={ref} className={frame} aria-hidden>
      <div className="flex justify-between text-subtle">
        <span>Audience Q&amp;A</span>
        <span className="text-orange">● live</span>
      </div>
      <ul className="mt-3 space-y-1.5 font-sans text-[12px]">
        {order.map((o, i) => (
          <motion.li key={o.q} layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${i === 0 ? "border-orange/60" : "border-line"}`}>
            <span className={`font-mono text-[11px] tabular-nums ${i === 0 ? "text-orange" : "text-subtle"}`}>▲ {o.v}</span>
            <span className="truncate text-paper">{o.q}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
