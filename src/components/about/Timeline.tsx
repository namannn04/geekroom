"use client";

import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { milestones } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Vertical timeline. The rail fills with scroll, and each date widens and turns
 * orange while it crosses the middle of the screen, then relaxes again.
 */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-fill]", {
        scaleY: 0,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: { trigger: "[data-list]", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
        const date = item.querySelector("[data-date]");
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: "top 75%", end: "bottom 35%", scrub: true } })
          .fromTo(date, { fontStretch: "60%", color: "rgba(238,236,230,0.35)" }, { fontStretch: "130%", color: "#ff5a1f", ease: "sine.inOut" })
          .to(date, { fontStretch: "80%", color: "rgba(238,236,230,1)", ease: "sine.inOut" });
        gsap.from(item.querySelector("[data-text]"), {
          y: 40,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 85%", end: "top 55%", scrub: true },
        });
      });
    },
    { scope: root },
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

      <ol data-list className="relative mt-16 md:mt-20">
        <span className="absolute top-0 left-[5px] h-full w-px bg-line-strong md:left-[11.5rem]" />
        <span data-fill className="absolute top-0 left-[5px] h-full w-px bg-orange md:left-[11.5rem]" />

        {milestones.map((m) => (
          <li key={m.date} data-item className="relative grid gap-3 pb-16 pl-8 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-16 md:pl-0">
            <span className="absolute top-3 left-0 size-[11px] rounded-full bg-orange md:left-[11.5rem] md:-translate-x-[5px]" />
            <p data-date className="display text-4xl whitespace-nowrap md:text-right md:text-5xl">
              {m.date}
            </p>
            <p data-text className="max-w-[34rem] text-lg leading-relaxed text-muted md:pl-4 md:text-xl">
              {m.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
