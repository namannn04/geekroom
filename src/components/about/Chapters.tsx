"use client";

import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { chapters } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";

/** Campus chapters as a ruled index. Each row draws its rule and lifts its text as it scrolls in. */
export default function Chapters() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: reveal(row, "top 94%") })
          .from(row.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: "expo.inOut" })
          .from(row.querySelectorAll("[data-lift]"), { yPercent: 110, duration: 0.8, stagger: 0.05, ease: EASE_EXPO }, 0.2);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            20+ campus <em>chapters</em>
          </>
        }
        intro="Geek Room runs locally too. Each chapter hosts its own hackathons, workshops and talks, and plugs its campus into the wider network."
      />

      <ol className="mt-14 border-b border-line">
        {chapters.map((c, i) => (
          <li
            key={c.name}
            data-chapter
            className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 py-6 md:grid-cols-[3.5rem_1.1fr_0.5fr_1fr] md:items-baseline md:py-7"
          >
            <span data-rule className="absolute inset-x-0 top-0 h-px bg-line-strong" />
            <span className="overflow-hidden">
              <span data-lift className="block font-mono text-sm tabular-nums text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>
            <span className="overflow-hidden pb-1">
              <span data-lift className="block font-display text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[0.95] font-extrabold uppercase [font-stretch:80%]">
                {c.name}
              </span>
            </span>
            <span className="col-start-2 overflow-hidden md:col-start-auto">
              <span data-lift className="block font-mono text-sm text-orange">
                {c.place}
              </span>
            </span>
            <span className="col-start-2 overflow-hidden md:col-start-auto">
              <span data-lift className="block text-muted">
                {c.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
