"use client";

import { useEffect, useRef, useState } from "react";

/** Sequential orange ramp on the ink surface: empty, then four steps of intensity. */
const RAMP = ["#1e201c", "#5a2a17", "#94391a", "#cf4a1d", "#ff5a1f"];

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function localIso(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

type Tip = { x: number; y: number; text: string } | null;

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-md border border-line-strong bg-ink px-2 py-1 text-[11px] whitespace-nowrap text-paper shadow-lg"
      style={{ left: tip.x, top: tip.y - 6 }}
    >
      {tip.text}
    </div>
  );
}

/**
 * GitHub-style contribution graph. Each cell is one day; intensity is that day's activity
 * relative to the busiest day in the window (quartile steps so one huge day doesn't wash out the rest).
 */
export function Heatmap({ counts, weeks = 53, label = "Contribution graph" }: { counts: Record<string, number>; weeks?: number; label?: string }) {
  const [tip, setTip] = useState<Tip>(null);
  const cell = 11;
  const gap = 3;
  const today = new Date(`${localIso(new Date())}T00:00:00`);
  // Start on the Sunday `weeks - 1` weeks before this week's Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (weeks - 1) * 7);

  const values = Object.values(counts).filter((v) => v > 0).sort((a, b) => a - b);
  const q = (p: number) => values[Math.floor(p * (values.length - 1))] ?? 0;
  const thresholds = [q(0.25), q(0.5), q(0.75)];
  const level = (n: number) => (n <= 0 ? 0 : n <= thresholds[0] ? 1 : n <= thresholds[1] ? 2 : n <= thresholds[2] ? 3 : 4);

  const cells: { x: number; y: number; iso: string; n: number }[] = [];
  const months: { x: number; label: string }[] = [];
  let total = 0;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) continue;
      const iso = localIso(date);
      const n = counts[iso] ?? 0;
      total += n;
      cells.push({ x: w * (cell + gap), y: d * (cell + gap), iso, n });
      if (d === 0 && date.getDate() <= 7) months.push({ x: w * (cell + gap), label: date.toLocaleDateString("en-IN", { month: "short" }) });
    }
  }
  const width = weeks * (cell + gap) - gap;
  const height = 7 * (cell + gap) - gap;

  return (
    <figure className="relative">
      <div className="overflow-x-auto pb-1">
        <svg width={width + 28} height={height + 18} role="img" aria-label={`${label}: ${total} contributions in the last year`} className="block">
          <g transform="translate(28 16)">
            {months.map((m) => (
              <text key={`${m.x}-${m.label}`} x={m.x} y={-5} className="fill-[var(--subtle)] font-mono text-[9px]">
                {m.label}
              </text>
            ))}
            {[1, 3, 5].map((d) => (
              <text key={d} x={-6} y={d * (cell + gap) + cell - 2} textAnchor="end" className="fill-[var(--subtle)] font-mono text-[9px]">
                {["", "Mon", "", "Wed", "", "Fri"][d]}
              </text>
            ))}
            {cells.map((c) => (
              <rect
                key={c.iso}
                x={c.x}
                y={c.y}
                width={cell}
                height={cell}
                rx={2}
                fill={RAMP[level(c.n)]}
                onMouseEnter={(e) => {
                  const box = (e.currentTarget.ownerSVGElement!.parentElement!.parentElement as HTMLElement).getBoundingClientRect();
                  const r = e.currentTarget.getBoundingClientRect();
                  setTip({
                    x: r.left - box.left + r.width / 2,
                    y: r.top - box.top,
                    text: `${c.n} ${c.n === 1 ? "contribution" : "contributions"} · ${fmtDay(c.iso)}`,
                  });
                }}
                onMouseLeave={() => setTip(null)}
              />
            ))}
          </g>
        </svg>
      </div>
      <Tooltip tip={tip} />
      <figcaption className="mt-2 flex items-center justify-between gap-4 text-[11px] text-subtle">
        <span>
          <span className="text-paper">{total.toLocaleString("en-IN")}</span> contributions in the last year
        </span>
        <span className="flex items-center gap-1">
          Less
          {RAMP.map((c) => (
            <span key={c} className="size-[11px] rounded-[2px]" style={{ background: c }} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}

/** One bar per day, single series, with a hover tooltip. */
export function DailyBars({ counts, days = 60 }: { counts: Record<string, number>; days?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  // Draw at the container's real pixel width so axis text never scales with the viewBox
  const box = useRef<HTMLElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const today = new Date(`${localIso(new Date())}T00:00:00`);
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const iso = localIso(d);
    return { iso, n: counts[iso] ?? 0 };
  });
  const max = Math.max(1, ...series.map((s) => s.n));
  // Round the axis top up to a friendly number
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const H = 180;
  const pad = { l: 32, r: 4, t: 8, b: 20 };
  const bw = (W - pad.l - pad.r) / days;
  const y = (n: number) => pad.t + (H - pad.t - pad.b) * (1 - n / top);
  const h = hover != null ? series[hover] : null;

  return (
    <figure ref={box} className="relative">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={`Team activity per day over the last ${days} days`}>
        {[0, top / 2, top].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" />
            <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" className="fill-[var(--subtle)] font-mono text-[10px]">
              {Math.round(v)}
            </text>
          </g>
        ))}
        {series.map((s, i) => {
          const x = pad.l + i * bw;
          const bh = H - pad.b - y(s.n);
          return (
            <g key={s.iso} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* Full-height hit target so thin bars are easy to hover */}
              <rect x={x} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              {s.n > 0 && (
                <path
                  d={`M${x + 1} ${H - pad.b} V${y(s.n) + Math.min(3, bh)} q0 -${Math.min(3, bh)} ${Math.min(3, bh)} -${Math.min(3, bh)} H${x + bw - 1 - Math.min(3, bh)} q${Math.min(3, bh)} 0 ${Math.min(3, bh)} ${Math.min(3, bh)} V${H - pad.b} Z`}
                  fill={hover === i ? "var(--paper)" : "var(--orange)"}
                />
              )}
            </g>
          );
        })}
        {[0, Math.floor(days / 2), days - 1].map((i) => (
          <text
            key={i}
            x={pad.l + i * bw + bw / 2}
            y={H - 5}
            textAnchor={i === 0 ? "start" : i === days - 1 ? "end" : "middle"}
            className="fill-[var(--subtle)] font-mono text-[10px]"
          >
            {new Date(`${series[i].iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </text>
        ))}
      </svg>
      {h && hover != null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-line-strong bg-ink px-2 py-1 text-[11px] whitespace-nowrap"
          style={{ left: Math.min(W - 90, Math.max(90, pad.l + hover * bw + bw / 2)) }}
        >
          <span className="text-paper">{h.n}</span> <span className="text-muted">actions · {fmtDay(h.iso)}</span>
        </div>
      )}
    </figure>
  );
}
