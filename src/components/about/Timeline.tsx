"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHead from "@/components/ui/SectionHead";
import { milestones } from "@/data/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_OUT, reveal } from "@/lib/motion";
import { paperRgb, useTheme } from "@/components/theme/ThemeProvider";

/**
 * Vertical timeline. The rail fills with scroll, and each date swells and turns
 * orange while it crosses the middle of the screen, then relaxes again.
 */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const rgb = paperRgb(useTheme().theme);

  useGSAP(
    () => {
      // The sticky progress panel follows whichever milestone crosses the middle of the screen
      const items = gsap.utils.toArray<HTMLElement>("[data-item]");
      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          // The last milestone may never reach the middle of the screen, so it activates a little earlier
          start: i === items.length - 1 ? "top 75%" : "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      if (prefersReducedMotion()) return;
      gsap.from("[data-fill]", {
        scaleY: 0,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: { trigger: "[data-list]", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
        const date = item.querySelector<HTMLElement>("[data-date]");
        // Continuous: the date swells and ignites while it crosses the middle of the screen
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: "top 80%", end: "bottom 30%", scrub: true } })
          .fromTo(
            date,
            { scale: 0.86, color: `rgba(${rgb},0.4)` },
            { scale: 1.06, color: "#ff5a1f", ease: "sine.inOut" },
          )
          .to(date, { scale: 1, color: `rgba(${rgb},1)`, ease: "sine.inOut" });
        // Reveal: copy lifts in as soon as the row enters
        gsap.from(item.querySelector("[data-text]"), {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: EASE_OUT,
          scrollTrigger: reveal(item, "top 88%"),
        });
      });
    },
    { scope: root, dependencies: [rgb], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="01"
        title={
          <>
            The story <em>so far</em>
          </>
        }
      />

      <div className="mt-16 grid gap-10 md:mt-20 xl:grid-cols-[1fr_17rem]">
      <ol data-list className="relative">
        <span className="absolute top-0 left-[5px] h-full w-px bg-line-strong md:left-[11.5rem]" />
        <span data-fill className="absolute top-0 left-[5px] h-full w-px bg-orange md:left-[11.5rem]" />

        {milestones.map((m) => (
          <li key={m.date} data-item className="relative grid gap-3 pb-16 pl-8 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-16 md:pl-0">
            <span className="absolute top-3 left-0 size-[11px] rounded-full bg-orange md:left-[11.5rem] md:-translate-x-[5px]" />
            <p data-date className="display origin-left text-4xl whitespace-nowrap will-change-transform md:origin-right md:text-right md:text-5xl">
              {m.date}
            </p>
            <p data-text className="max-w-[34rem] text-lg leading-relaxed text-muted md:pl-4 md:text-xl">
              {m.text}
            </p>
          </li>
        ))}
      </ol>

      {/* Sticky progress readout, desktop only */}
      <aside className="hidden xl:block">
        <div className="sticky top-32 rounded-[1.5rem] border border-line bg-ink-2 p-6">
          <div className="flex items-center justify-between">
            <p className="label">Milestone</p>
            <p className="font-mono text-xs text-subtle tabular-nums">
              <span className="text-orange">{String(active + 1).padStart(2, "0")}</span> / {String(milestones.length).padStart(2, "0")}
            </p>
          </div>
          <div className="relative mx-auto mt-6 size-36">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line-strong)" strokeWidth="4" />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--orange)"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ pathLength: (active + 1) / milestones.length }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={milestones[active].date}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="display px-3 text-2xl"
                >
                  {milestones[active].date}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={milestones[active].short}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 text-center font-display text-xl font-bold [font-stretch:90%]"
            >
              {milestones[active].short}
            </motion.p>
          </AnimatePresence>
          <div className="mt-6 flex gap-1" aria-hidden>
            {milestones.map((m, i) => (
              <span key={m.date} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= active ? "bg-orange" : "bg-ink-3"}`} />
            ))}
          </div>
        </div>
      </aside>
      </div>
    </section>
  );
}
