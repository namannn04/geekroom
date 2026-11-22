"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { stat } from "@/data/stats";

/* Only the community sizes we've published: founding, May 2024 and today */
const points = [
  { t: 2023.0, v: 0, label: "2023", note: "A WhatsApp group at MSIT" },
  { t: 2024.37, v: 30000, label: "May 2024", note: "30,000 members" },
  { t: 2026.88, v: 150000, label: "Today", note: `${stat.builders} builders` },
];

/* Event moments on the time axis (not on the curve, since we don't publish sizes for them) */
const moments = [
  { t: 2024.08, label: "Code Kshetra 1" },
  { t: 2024.6, label: "CC 2.0 at Microsoft" },
  { t: 2025.17, label: "Going global" },
  { t: 2026.3, label: "HackBLR" },
  { t: 2026.78, label: "CC 6.0" },
];

const W = 800;
const H = 260;
const P = { l: 16, r: 16, t: 28, b: 56 };
const T0 = 2023;
const T1 = 2027;
const x = (t: number) => P.l + ((t - T0) / (T1 - T0)) * (W - P.l - P.r);
const y = (v: number) => H - P.b - (v / 165000) * (H - P.t - P.b);

const [a, b, c] = points;
const line = `M${x(a.t)},${y(a.v)} C${x(a.t + 0.6)},${y(a.v)} ${x(b.t - 0.5)},${y(b.v - 8000)} ${x(b.t)},${y(b.v)} S${x(c.t - 0.7)},${y(c.v - 25000)} ${x(c.t)},${y(c.v)}`;
const area = `${line} L${x(c.t)},${H - P.b} L${x(a.t)},${H - P.b} Z`;

/** Community growth drawn as a curve through our published milestones. */
export default function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const show = inView || !!reduced;

  return (
    <div ref={ref} className="mt-14 rounded-[1.75rem] border border-line bg-ink-2 p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label">Community size, 2023 to today</p>
        <p className="font-mono text-[11px] text-subtle">Curve through our published milestones</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full overflow-visible" role="img" aria-label={`Community growth from a WhatsApp group in 2023 to 30,000 members in May 2024 and ${stat.builders} builders today.`}>
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="var(--line-strong)" />
        {[2024, 2025, 2026].map((yr) => (
          <text key={yr} x={x(yr)} y={H - P.b + 18} textAnchor="middle" className="fill-[var(--subtle)] font-mono text-[11px]">
            {yr}
          </text>
        ))}

        <motion.path d={area} fill="url(#growth-fill)" initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: reduced ? 0 : 1.4, duration: 0.8 }} />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={show ? { pathLength: 1 } : {}}
          transition={{ duration: reduced ? 0 : 2, ease: [0.65, 0, 0.35, 1] }}
        />

        {moments.map((m, i) => (
          <motion.g key={m.label} initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: reduced ? 0 : 0.4 + ((m.t - T0) / (T1 - T0)) * 2 }}>
            <circle cx={x(m.t)} cy={H - P.b} r="3.5" fill="var(--paper)" />
            <text x={x(m.t)} y={H - P.b + (i % 2 ? 46 : 34)} textAnchor="middle" className="fill-[var(--muted)] text-[10.5px]">
              {m.label}
            </text>
          </motion.g>
        ))}

        {points.map((p, i) => (
          <motion.g
            key={p.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={show ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: reduced ? 0 : 0.2 + i * 0.85, duration: 0.4 }}
            style={{ transformOrigin: `${x(p.t)}px ${y(p.v)}px` }}
          >
            <circle cx={x(p.t)} cy={y(p.v)} r="7" fill="var(--ink)" stroke="var(--orange)" strokeWidth="3" />
            <text
              x={x(p.t) + [10, 14, -14][i]}
              y={y(p.v) + [-18, 26, 6][i]}
              textAnchor={i === 2 ? "end" : "start"}
              style={{ fontStretch: "85%" }}
              className={i === 0 ? "fill-[var(--muted)] text-[13px]" : "fill-[var(--paper)] font-display text-[20px] font-extrabold uppercase"}
            >
              {p.note}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
