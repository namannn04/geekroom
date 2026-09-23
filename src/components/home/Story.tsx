"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { features } from "@/data/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_OUT, reveal } from "@/lib/motion";

/**
 * Sticky index on the left, panels on the right. Each photo wipes up as it
 * enters and then drifts inside its frame; the index tracks whichever panel
 * is crossing the centre of the screen.
 */
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
        if (prefersReducedMotion()) return;
        const media = panel.querySelector("[data-media]");
        const img = panel.querySelector("img");
        // Wipe up once as the panel enters…
        gsap
          .timeline({ scrollTrigger: reveal(panel, "top 88%") })
          .fromTo(media, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
          .from(panel.querySelectorAll("[data-copy]"), { y: 28, opacity: 0, duration: 0.7, stagger: 0.08, ease: EASE_OUT }, 0.55);
        // …while the photo drifts inside its frame for as long as it is on screen
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell grid grid-cols-[minmax(0,1fr)] gap-12 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:h-fit">
        <SectionHead
          size="sm"
          index="04"
          title={
            <>
              Learn. Connect. <em>Grow.</em>
            </>
          }
          intro="What began as a WhatsApp group at MSIT is now where students across India come to hack, ship, and meet the people building the industry."
        />
        <ol className="mt-10 hidden border-t border-line lg:block">
          {features.map((f, i) => (
            <li
              key={f.title}
              className={`flex items-baseline gap-4 border-b border-line py-4 transition-colors duration-300 ${
                i === active ? "text-paper" : "text-subtle"
              }`}
            >
              <span className={`font-mono text-sm tabular-nums ${i === active ? "text-orange" : ""}`}>0{i + 1}</span>
              <span className="text-base">{f.title}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-16">
        {features.map((f, i) => (
          <article key={f.title} data-panel>
            <div data-media className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem]">
              <Image src={f.image} alt={f.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-[3rem_1fr]">
              <span data-copy className="font-mono text-sm text-orange tabular-nums">
                0{i + 1}
              </span>
              <div>
                <h3 data-copy className="display text-[clamp(1.9rem,3.4vw,2.9rem)]">
                  {f.title}
                </h3>
                <p data-copy className="mt-4 max-w-[34rem] leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
