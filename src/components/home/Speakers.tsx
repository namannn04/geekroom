"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { speakers } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Speakers start as a fanned deck stacked in the middle of the grid and deal
 * out to their seats as the section scrolls through (desktop). On touch
 * screens they simply lift into place one after another.
 */
export default function Speakers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>("[data-speaker]");

      mm.add("(min-width: 768px)", () => {
        const grid = root.current!.querySelector<HTMLElement>("[data-grid]")!;
        const mid = (cards.length - 1) / 2;
        // Offsets from each card's seat to the grid centre, measured on every refresh
        const offset = (card: HTMLElement, axis: "x" | "y") => {
          gsap.set(card, { clearProps: "transform" });
          const g = grid.getBoundingClientRect();
          const r = card.getBoundingClientRect();
          return axis === "x" ? g.left + g.width / 2 - (r.left + r.width / 2) : g.top + g.height / 2 - (r.top + r.height / 2);
        };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: grid, start: "top 85%", end: "center 55%", scrub: 0.8, invalidateOnRefresh: true },
        });
        cards.forEach((card, i) => {
          tl.from(
            card,
            { x: () => offset(card, "x"), y: () => offset(card, "y"), rotate: (i - mid) * 7, ease: "power2.out" },
            0,
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        cards.forEach((card) =>
          gsap.from(card, {
            yPercent: 25,
            rotate: 3,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 95%", end: "top 65%", scrub: true },
          }),
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
        <SectionHead
          index="05"
          title={
            <>
              Voices on <em>stage</em>
            </>
          }
          intro="Engineers, founders and data scientists who've given talks and mentored at Geek Room. 35+ so far."
        />
      </div>

      <div data-grid className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
        {speakers.map((s, i) => (
          <a
            key={s.name}
            data-speaker
            href={s.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block overflow-hidden rounded-[1.5rem] bg-ink-2 ${i % 2 ? "md:mt-16" : ""}`}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
                className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <div>
                <h3 className="font-display text-lg leading-tight font-extrabold uppercase [font-stretch:80%]">{s.name}</h3>
                <p className="mt-1 text-sm leading-snug text-muted">{s.role}</p>
              </div>
              <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-colors group-hover:text-orange" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
