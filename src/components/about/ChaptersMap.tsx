"use client";

import { motion, useReducedMotion } from "motion/react";
import { chapters } from "@/data/site";

/* Coarse outline of India as [lon, lat]. Drawn as a dot matrix, so a simplified border reads fine. */
const OUTLINE: [number, number][] = [
  [68.2, 23.7], [70.0, 24.3], [71.0, 24.6], [70.3, 25.7], [70.1, 27.8], [71.9, 27.9], [73.4, 29.9], [74.5, 31.0],
  [74.6, 32.5], [73.8, 33.6], [73.9, 34.6], [75.3, 35.6], [76.8, 35.7], [77.8, 35.5], [78.9, 34.3], [78.7, 32.6],
  [79.3, 31.3], [80.3, 30.4], [81.1, 30.0], [80.1, 28.8], [81.9, 27.9], [83.3, 27.4], [85.0, 26.9], [86.8, 26.4],
  [87.9, 26.4], [88.1, 27.9], [88.8, 27.3], [89.0, 26.8], [92.0, 26.8], [92.0, 27.8], [94.5, 29.2], [96.1, 29.4],
  [97.4, 28.2], [96.2, 27.3], [95.2, 26.6], [94.6, 25.2], [93.4, 23.7], [93.2, 22.2], [92.6, 22.0], [92.2, 23.7],
  [91.4, 24.1], [90.0, 25.2], [89.0, 26.0], [88.4, 26.4], [88.2, 25.0], [88.8, 24.0], [88.9, 22.5], [89.0, 21.6],
  [87.0, 21.4], [86.0, 20.0], [84.7, 19.2], [82.3, 16.6], [80.3, 15.5], [80.2, 13.4], [79.8, 11.0], [79.3, 10.2],
  [78.1, 8.9], [77.5, 8.1], [76.5, 8.9], [76.0, 10.6], [75.0, 12.8], [74.1, 15.0], [73.4, 16.5], [72.8, 19.0],
  [72.6, 21.4], [72.2, 21.2], [70.9, 20.7], [69.0, 22.2], [70.0, 22.8], [68.4, 23.5],
];

const LON0 = 67.5;
const LAT1 = 36.5;
const K = 12;
const COS = 0.92; // shrink longitude to keep the shape from looking stretched
const px = (lon: number) => (lon - LON0) * K * COS;
const py = (lat: number) => (LAT1 - lat) * K;
const W = px(98);
const H = py(7.5);

function inside(lon: number, lat: number) {
  let hit = false;
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i];
    const [xj, yj] = OUTLINE[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const STEP = 0.62;
const dots: [number, number][] = [];
for (let lat = LAT1; lat > 7.5; lat -= STEP) {
  for (let lon = LON0; lon < 98; lon += STEP / COS) {
    if (inside(lon, lat)) dots.push([px(lon), py(lat)]);
  }
}

/** Which hub a chapter's place belongs to. Delhi, Gurugram, Ghaziabad and Greater Noida share one NCR marker. */
export const hubFor = (place: string) => (place === "Mohali" ? "mohali" : place === "Odisha" ? "odisha" : "ncr");

const hubs = [
  { key: "ncr", label: "Delhi NCR", lon: 77.2, lat: 28.6 },
  { key: "mohali", label: "Mohali", lon: 76.7, lat: 30.7 },
  { key: "odisha", label: "Odisha", lon: 85.8, lat: 20.3 },
].map((h) => ({ ...h, count: chapters.filter((c) => hubFor(c.place) === h.key).length }));

/** Dot-matrix India with a pulsing marker per chapter hub. `active` highlights one hub. */
export default function ChaptersMap({ active, onHover }: { active: string | null; onHover?: (key: string | null) => void }) {
  const reduced = useReducedMotion();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Map of India with Geek Room chapters in Delhi NCR, Mohali and Odisha">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.8" fill="var(--paper)" opacity="0.14" />
      ))}
      {hubs.map((h, i) => {
        const x = px(h.lon);
        const y = py(h.lat);
        const on = active === h.key;
        const r = 5 + Math.sqrt(h.count) * 2.4;
        return (
          <g key={h.key} onMouseEnter={() => onHover?.(h.key)} onMouseLeave={() => onHover?.(null)} className="cursor-default">
            {!reduced && (
              <motion.circle
                cx={x}
                cy={y}
                r={r}
                fill="var(--orange)"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            )}
            <motion.circle
              cx={x}
              cy={y}
              r={r}
              fill="var(--orange)"
              stroke="var(--ink)"
              strokeWidth="2"
              animate={{ scale: on ? 1.35 : 1 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
            {h.count > 1 && (
              <text x={x} y={y + 4} textAnchor="middle" className="pointer-events-none fill-[var(--ink)] font-mono text-[11px] font-bold">
                {h.count}
              </text>
            )}
            <g className={`transition-opacity duration-300 ${on || h.key === "ncr" ? "opacity-100" : "opacity-70"}`}>
              <text
                x={h.key === "odisha" ? x + r + 8 : x - r - 8}
                y={h.key === "mohali" ? y - 4 : y + 4}
                textAnchor={h.key === "odisha" ? "start" : "end"}
                className={`font-mono text-[12px] ${on ? "fill-[var(--orange)]" : "fill-[var(--paper)]"}`}
              >
                {h.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
