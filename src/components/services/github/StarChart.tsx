"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { StarFillIcon } from "@primer/octicons-react";

/** Illustrative cumulative stars per week across a 12-week campaign. */
const weeks = [140, 152, 171, 690, 905, 1010, 1095, 1880, 2240, 2410, 2920, 3180];

const moments: { week: number; label: string; detail: string }[] = [
  { week: 3, label: "Launch day", detail: "Coordinated push across community channels, newsletters and socials" },
  { week: 7, label: "Hackathon track", detail: "Builders use the repo in a sponsored track and star what they ship with" },
  { week: 10, label: "Tutorial series", detail: "Engineer-written guides keep new developers arriving from search" },
];

const W = 720;
const H = 300;
const PAD = { l: 44, r: 16, t: 24, b: 32 };
const MAX = 3500;
const x = (i: number) => PAD.l + (i / (weeks.length - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / MAX) * (H - PAD.t - PAD.b);

// Smooth monotone-ish curve through the points
const line = weeks
  .map((v, i) => {
    if (i === 0) return `M${x(i)},${y(v)}`;
    const px = x(i - 1);
    const cx = (px + x(i)) / 2;
    return `C${cx},${y(weeks[i - 1])} ${cx},${y(v)} ${x(i)},${y(v)}`;
  })
  .join(" ");
const area = `${line} L${x(weeks.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;

/**
 * A star-history chart in the style of star-history.com: the curve draws itself on
 * scroll, campaign moments pop in along it, and hovering reads out any week.
 */
export default function StarChart() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const show = inView || reduced;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (weeks.length - 1));
    setHover(Math.max(0, Math.min(weeks.length - 1, i)));
  };

  return (
    <div ref={root} className="rounded-[1.75rem] border border-line bg-ink-2 p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Star history · your-org/your-repo</p>
          <p className="mt-2 flex items-center gap-2 font-display text-3xl font-bold [font-stretch:90%] tabular-nums sm:text-4xl">
            <StarFillIcon size={24} className="text-[#e3b341]" />
            {(hover === null ? weeks[weeks.length - 1] : weeks[hover]).toLocaleString("en-IN")}
            <span className="font-mono text-xs font-normal text-subtle">{hover === null ? "after 12 weeks" : `week ${hover + 1}`}</span>
          </p>
        </div>
        <p className="font-mono text-[11px] tracking-[0.04em] text-subtle">Illustrative campaign curve</p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-6 w-full touch-none select-none"
        role="img"
        aria-label="Star history chart rising from about 140 to 3,180 stars over twelve weeks, with jumps at launch day, a hackathon track and a tutorial series."
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="star-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1000, 2000, 3000].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="3 5" />
            <text x={PAD.l - 10} y={y(v) + 4} textAnchor="end" className="fill-[var(--subtle)] font-mono text-[11px]">
              {v ? `${v / 1000}k` : "0"}
            </text>
          </g>
        ))}
        {weeks.map((_, i) =>
          i % 2 === 0 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-[var(--subtle)] font-mono text-[11px]">
              W{i + 1}
            </text>
          ) : null,
        )}

        <motion.path
          d={area}
          fill="url(#star-area)"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: reduced ? 0 : 1.2 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={show ? { pathLength: 1 } : {}}
          transition={{ duration: reduced ? 0 : 2.2, ease: [0.65, 0, 0.35, 1] }}
        />

        {moments.map((m, n) => (
          <motion.g
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reduced ? 0 : 0.5 + (m.week / weeks.length) * 1.8, duration: 0.5 }}
          >
            <line x1={x(m.week)} x2={x(m.week)} y1={y(weeks[m.week])} y2={H - PAD.b} stroke="var(--line-strong)" />
            <circle cx={x(m.week)} cy={y(weeks[m.week])} r="6" fill="var(--ink)" stroke="var(--orange)" strokeWidth="2.5" />
            <g transform={`translate(${x(m.week) - 8}, ${y(weeks[m.week]) - 18})`}>
              <rect x={-64 + 8} y={-18} width="128" height="22" rx="11" fill="var(--paper)" />
              <text x="8" y="-3" textAnchor="middle" className="fill-[var(--ink)] font-mono text-[11px] font-semibold">
                {`0${n + 1} ${m.label}`}
              </text>
            </g>
          </motion.g>
        ))}

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="var(--paper)" strokeOpacity="0.4" />
            <circle cx={x(hover)} cy={y(weeks[hover])} r="5" fill="var(--paper)" />
          </g>
        )}
      </svg>

      <ol className="mt-6 grid gap-3 border-t border-line pt-6 md:grid-cols-3">
        {moments.map((m, n) => (
          <li key={m.label} className="flex gap-3">
            <span className="font-mono text-xs text-orange">0{n + 1}</span>
            <div>
              <p className="font-display text-lg font-bold [font-stretch:90%]">{m.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
