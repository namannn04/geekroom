"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import SectionHead from "@/components/ui/SectionHead";
import { continents, type Continent } from "@/data/reach";
import { stat, totals } from "@/data/stats";

export type MapPin = { name: string; continent: Continent; x: number; y: number };

type Props = {
  dots: [number, number][];
  pins: MapPin[];
  origin: { name: string; x: number; y: number };
  width: number;
  height: number;
};

/** A curved arc from the origin to a pin, lifted so it reads as a flight path */
const arc = (o: { x: number; y: number }, p: { x: number; y: number }) => {
  const mx = (o.x + p.x) / 2;
  const dist = Math.hypot(p.x - o.x, p.y - o.y);
  const my = Math.min(o.y, p.y) - dist * 0.28;
  return `M${o.x},${o.y} Q${mx},${my} ${p.x},${p.y}`;
};

/**
 * Where our builders register from. Arcs fly out from India to every country on
 * scroll; pick a continent to light up its countries, hover a country to find it.
 */
export default function GlobalReachView({ dots, pins, origin, width, height }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const show = inView || !!reduced;
  const [continent, setContinent] = useState<Continent | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const counts = Object.fromEntries(continents.map((c) => [c, pins.filter((p) => p.continent === c).length])) as Record<Continent, number>;
  const lit = (p: MapPin) => (hover ? p.name === hover : !continent || p.continent === continent);
  const hovered = pins.find((p) => p.name === hover);
  const listed = continent ? pins.filter((p) => p.continent === continent) : pins;

  return (
    <section className="shell py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            Builders from <em>{stat.countries}</em> countries
          </>
        }
        intro={`Our global hackathons are online and open to anyone. Builders have registered from ${stat.countries} countries across six continents, and the map keeps filling in.`}
      />

      <div ref={root} className="mt-14 overflow-hidden rounded-[1.75rem] border border-line bg-ink-2">
        {/* Headline numbers */}
        <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {[
            [`${totals.countries}`, "Countries"],
            ["6", "Continents"],
            [`${counts.Asia}`, "Countries in Asia"],
            [`${counts.Africa}`, "Countries in Africa"],
          ].map(([v, l], i) => (
            <div key={l} className={`border-line p-5 md:p-7 ${i % 2 ? "border-l" : ""} ${i === 2 ? "md:border-l" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}>
              <dd className="display text-[clamp(2.2rem,5vw,3.8rem)]">
                {v}
                {i === 0 && <span className="text-orange">+</span>}
              </dd>
              <dt className="mt-1 text-sm text-muted">{l}</dt>
            </div>
          ))}
        </dl>

        {/* Map */}
        <div className="relative px-2 pt-6 pb-10 sm:px-6">
          <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`World map with Geek Room builders in ${pins.length} countries across six continents, connected to India`}>
            <g fill="var(--paper)" opacity="0.13">
              {dots.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="0.32" />
              ))}
            </g>

            {/* Arcs from India */}
            <g fill="none" strokeLinecap="round">
              {pins.map((p, i) => (
                <motion.path
                  key={p.name}
                  d={arc(origin, p)}
                  stroke="var(--orange)"
                  strokeWidth={hover === p.name ? 0.28 : 0.14}
                  initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
                  animate={show ? { pathLength: 1, opacity: lit(p) ? (hover ? 1 : 0.55) : 0.06 } : {}}
                  transition={{
                    pathLength: { duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.3 + (i % 16) * 0.07, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.35, delay: inView && !continent && !hover ? 0.3 + (i % 16) * 0.07 : 0 },
                  }}
                />
              ))}
            </g>

            {/* Country pins */}
            {pins.map((p, i) => (
              <motion.g
                key={p.name}
                initial={{ opacity: 0 }}
                animate={show ? { opacity: lit(p) ? 1 : 0.2 } : {}}
                transition={{ duration: 0.35, delay: show && !continent && !hover && !reduced ? 1.2 + (i % 16) * 0.07 : 0 }}
                onMouseEnter={() => setHover(p.name)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <circle cx={p.x} cy={p.y} r="1.6" fill="transparent" />
                <circle cx={p.x} cy={p.y} r={hover === p.name ? 0.85 : 0.55} fill="var(--orange)" stroke="var(--ink-2)" strokeWidth="0.15" />
              </motion.g>
            ))}

            {/* Home */}
            <g>
              {!reduced && (
                <motion.circle
                  cx={origin.x}
                  cy={origin.y}
                  r="1"
                  fill="var(--paper)"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 3.5 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
                />
              )}
              <circle cx={origin.x} cy={origin.y} r="1" fill="var(--paper)" stroke="var(--orange)" strokeWidth="0.35" />
            </g>
          </svg>

          {/* Hover label, positioned in map space */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={hovered.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-full bg-paper px-3 py-1 font-mono text-[11px] whitespace-nowrap text-ink"
                style={{ left: `${(hovered.x / width) * 100}%`, top: `calc(${(hovered.y / height) * 100}% - 8px)` }}
              >
                {hovered.name}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <p className="absolute bottom-3 left-4 flex items-center gap-2 font-mono text-[11px] text-subtle sm:left-8">
            <span className="size-2 rounded-full border border-orange bg-paper" /> Home: India
          </p>
        </div>

        {/* Continent filter and country list */}
        <div className="border-t border-line p-5 md:p-7">
          <div role="tablist" aria-label="Filter by continent" className="flex flex-wrap gap-2">
            {[null, ...continents].map((c) => {
              const active = continent === c;
              return (
                <button
                  key={c ?? "all"}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setContinent(c)}
                  className={`rounded-full border px-4 py-2 font-mono text-xs tracking-[0.04em] uppercase transition-colors ${
                    active ? "border-orange bg-orange text-ink" : "border-line-strong text-muted hover:border-paper hover:text-paper"
                  }`}
                >
                  {c ?? "All"} <span className={active ? "text-ink/70" : "text-subtle"}>{c ? counts[c] : pins.length}</span>
                </button>
              );
            })}
          </div>

          <motion.ul layout={!reduced} className="mt-6 flex flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {listed.map((p) => (
                <motion.li
                  key={p.name}
                  layout={!reduced}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHover(p.name)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(p.name)}
                    onBlur={() => setHover(null)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      hover === p.name ? "border-orange text-paper" : "border-line text-muted hover:text-paper"
                    }`}
                  >
                    {p.name}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
