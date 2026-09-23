"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { features } from "@/data/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Sticky index on the left, panels on the right. Each photo is uncovered by a
 * wipe from below while it settles from an over-scaled crop; the index tracks
 * whichever panel is crossing the centre of the screen.
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
        const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 90%", end: "top 35%", scrub: 0.6 } });
        tl.fromTo(media, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
          .fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none" }, 0)
          .from(panel.querySelectorAll("[data-copy]"), { y: 36, opacity: 0, stagger: 0.1, ease: "power2.out" }, 0.25);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
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
