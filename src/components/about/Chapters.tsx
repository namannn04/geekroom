"use client";

import { useRef, useState } from "react";
import ChaptersMap, { hubFor } from "@/components/about/ChaptersMap";
import SectionHead from "@/components/ui/SectionHead";
import { chapters } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";

/** Campus chapters as a ruled index. Each row draws its rule and lifts its text as it scrolls in. */
export default function Chapters() {
  const root = useRef<HTMLElement>(null);
  const [hub, setHub] = useState<string | null>(null);

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
        intro="Online, Geek Room is open to builders anywhere. Offline, local chapters host their own hackathons, workshops and talks, and plug into the wider network."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <div className="rounded-[1.75rem] border border-line bg-ink-2 p-6 md:p-8">
          <ChaptersMap active={hub} onHover={setHub} />
          <p className="mt-4 font-mono text-[11px] text-subtle">Chapters with public activity. Online, builders join from everywhere.</p>
        </div>
      </div>
      <ol className="border-b border-line" onMouseLeave={() => setHub(null)}>
        {chapters.map((c, i) => (
          <li
            key={c.name}
            data-chapter
            onMouseEnter={() => setHub(hubFor(c.place))}
            className={`relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 py-6 transition-opacity duration-300 md:grid-cols-[3.5rem_1.1fr_0.5fr_1fr] md:items-baseline md:py-7 lg:grid-cols-[2.5rem_1fr_auto] ${
              hub && hubFor(c.place) !== hub ? "lg:opacity-40" : ""
            }`}
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
            <span className="col-start-2 overflow-hidden md:col-start-auto lg:col-span-2 lg:col-start-2">
              <span data-lift className="block text-muted">
                {c.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}
