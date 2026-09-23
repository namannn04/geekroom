"use client";

import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { impact } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";

const max = Math.max(...impact.map((s) => s.value));
// Log scale so 50 events and 70,000 views can share one axis honestly
const share = (v: number) => Math.log10(v) / Math.log10(max);
const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");

/**
 * Impact as a horizontal bar readout. Each bar shoots out and its counter
 * races up together the moment the row enters the screen.
 */
export default function Impact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-stat]");
      rows.forEach((row, i) => {
        const value = impact[i].value;
        const num = row.querySelector<HTMLElement>("[data-num]")!;
        if (prefersReducedMotion()) {
          num.textContent = fmt(value);
          return;
        }
        const state = { v: 0 };
        const tl = gsap.timeline({ scrollTrigger: reveal(row, "top 90%") });
        tl.from(row.querySelector("[data-bar]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.4, ease: EASE_EXPO }).to(
          state,
          { v: value, duration: 1.4, ease: EASE_EXPO, onUpdate: () => (num.textContent = fmt(state.v)) },
          0,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="03"
        title={
          <>
            Numbers that <em>compound</em>
          </>
        }
        intro="Three years of events, measured. Bars use a log scale so every figure stays readable."
      />

      <dl className="mt-14 border-t border-line">
        {impact.map((s) => (
          <div
            key={s.label}
            data-stat
            className="grid gap-3 border-b border-line py-7 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:gap-10 md:py-9"
          >
            <div>
              <dd className="display text-[clamp(3rem,7vw,5.5rem)] tabular-nums">
                <span data-num>{fmt(s.value)}</span>
                <span className="text-orange">{s.suffix}</span>
              </dd>
              <dt className="mt-2 text-muted">{s.label}</dt>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-ink-3 md:h-4">
              <span
                data-bar
                className="absolute inset-y-0 left-0 rounded-full bg-orange"
                style={{ width: `${share(s.value) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
