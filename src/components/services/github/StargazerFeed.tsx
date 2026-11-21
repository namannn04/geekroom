"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { StarFillIcon } from "@primer/octicons-react";

/** Where each stargazer came from: the channels a campaign actually runs through. */
const pool = [
  { user: "ml-builder", source: "Code Cubicle hackathon track", hue: 18 },
  { user: "rustacean-22", source: "Launch-day community post", hue: 200 },
  { user: "frontend-fox", source: "Tutorial on your blog", hue: 140 },
  { user: "infra-nerd", source: "Geek Room newsletter", hue: 280 },
  { user: "vector-vibes", source: "Live workshop demo", hue: 45 },
  { user: "ship-it-sam", source: "LinkedIn launch carousel", hue: 330 },
  { user: "kernel-panic", source: "Good first issue drive", hue: 170 },
  { user: "prompt-wrangler", source: "Vibe-a-thon starter repo", hue: 95 },
  { user: "byte-sized", source: "Campus chapter meetup", hue: 10 },
  { user: "async-aditi", source: "dev.to cross-post", hue: 230 },
];

const VISIBLE = 5;

/** A GitHub-dashboard style feed that keeps ticking with new stargazers while on screen. */
export default function StargazerFeed() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-80px" });
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(VISIBLE);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1900);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const n = tick - i;
    return { n, ...pool[n % pool.length], ago: i === 0 ? "just now" : `${i * 2 + 1}m ago` };
  });

  return (
    <div ref={root} className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] text-[14px] text-[#e6edf3]">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
        <p className="font-semibold">Stargazers</p>
        <span className="flex items-center gap-2 font-mono text-[11px] text-[#3fb950]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3fb950] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#3fb950]" />
          </span>
          LIVE
        </span>
      </div>
      <ul className="relative h-[330px]" aria-live="off">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.li
              key={it.n}
              layout={!reduced}
              initial={{ opacity: 0, y: -24, backgroundColor: "rgba(227,179,65,0.12)" }}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(227,179,65,0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], backgroundColor: { duration: 1.6 } }}
              className="flex items-center gap-3 border-b border-[#21262d] px-4 py-3"
              style={{ height: 66 }}
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-[#0d1117]"
                style={{ background: `hsl(${it.hue} 80% 65%)` }}
                aria-hidden
              >
                {it.user[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate">
                  <span className="font-semibold">{it.user}</span> <span className="text-[#8b949e]">starred</span>{" "}
                  <span className="font-semibold text-[#4493f8]">your-org/your-repo</span>
                </p>
                <p className="truncate text-[12px] text-[#8b949e]">via {it.source}</p>
              </div>
              <span className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-[#8b949e]">
                <StarFillIcon size={14} className={i === 0 ? "text-[#e3b341]" : "text-[#30363d]"} />
                {it.ago}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
