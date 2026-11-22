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

/** Content: a feed of what's been published, cycling through formats. */
const content = [
  { kind: "Podcast", title: "Build with Bifrost", meta: "1:07:01" },
  { kind: "Blog", title: "Qdrant on Towards AI", meta: "8 min" },
  { kind: "Short", title: "Your product, explained", meta: "0:58" },
  { kind: "YouTube", title: "SEO pipeline with MCP", meta: "9:52" },
  { kind: "GEO", title: "Named in Google AI Overview", meta: "live" },
];

export function ContentPreview() {
  const { ref, tick, reduced } = useTicker(1700);
  const rows = Array.from({ length: 3 }, (_, i) => content[(tick + i) % content.length]);
  return (
    <div ref={ref} className={frame} aria-hidden>
      <div className="flex justify-between text-subtle">
        <span>Published</span>
        <span className="text-orange">● this week</span>
      </div>
      <ul className="mt-3 space-y-1.5 font-sans text-[12px]">
        {rows.map((r, i) => (
          <motion.li
            key={`${r.title}-${tick}`}
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${i === 0 ? "border-orange/60" : "border-line"}`}
          >
            <span className={`w-14 shrink-0 font-mono text-[10px] uppercase ${i === 0 ? "text-orange" : "text-subtle"}`}>{r.kind}</span>
            <span className="flex-1 truncate text-paper">{r.title}</span>
            <span className="font-mono text-[10px] text-subtle">{r.meta}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Community: a repo's star count climbing as campaigns land. */
export function CommunityPreview() {
  const { ref, tick } = useTicker(140);
  const stars = 5200 + ((tick * 23) % 2001);
  const bars = [3, 4, 4, 5, 6, 6, 7, 8, 9, 10];
  return (
    <div ref={ref} className={frame} aria-hidden>
      <div className="flex justify-between text-subtle">
        <span>arc-task-gen</span>
        <span className="text-orange">★ GitHub</span>
      </div>
      <p className="display mt-2 text-4xl text-paper tabular-nums">{(stars / 1000).toFixed(1)}K</p>
      <div className="mt-3 flex h-10 items-end gap-1">
        {bars.map((h, i) => (
          <span key={i} className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-orange" : "bg-paper/25"}`} style={{ height: `${h * 10}%` }} />
        ))}
      </div>
    </div>
  );
}
