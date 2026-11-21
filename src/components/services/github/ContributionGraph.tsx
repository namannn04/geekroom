"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const COLS = 30;
const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

// Deterministic noise so server and client render the same grid
const noise = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/** Activity ramps up once the campaign starts (column 12), as community issues and PRs arrive. */
const cells = Array.from({ length: COLS * 7 }, (_, i) => {
  const col = Math.floor(i / 7);
  const heat = col < 12 ? 0.18 : 0.35 + ((col - 12) / (COLS - 12)) * 0.6;
  const v = noise(i) * heat * 1.6;
  return Math.min(4, Math.floor(v * 4.2));
});

/** GitHub's contribution heatmap, filling in column by column as the campaign lands. */
export default function ContributionGraph() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  return (
    <div ref={root} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-[12px] text-[#8b949e] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] text-[#e6edf3]">
          <span className="font-semibold">Community contributions</span> to your-org/your-repo
        </p>
      </div>
      <div className="relative mt-9">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {cells.map((lvl, i) => (
            <motion.span
              key={i}
              className="aspect-square rounded-[2px] outline outline-1 -outline-offset-1 outline-[rgba(27,31,35,0.06)]"
              initial={{ backgroundColor: LEVELS[0] }}
              animate={inView || reduced ? { backgroundColor: LEVELS[lvl] } : {}}
              transition={{ delay: reduced ? 0 : Math.floor(i / 7) * 0.045 + (i % 7) * 0.01, duration: 0.3 }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute -top-1 -bottom-1 border-l border-dashed border-orange"
          style={{ left: `${(12 / COLS) * 100}%` }}
        >
          <span className="absolute -top-6 -translate-x-1/2 rounded-full bg-orange px-2 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-ink">
            Campaign starts
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1">
        Less
        {LEVELS.map((c) => (
          <span key={c} className="size-2.5 rounded-[2px]" style={{ background: c }} />
        ))}
        More
      </div>
    </div>
  );
}
