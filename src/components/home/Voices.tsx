"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import SectionHead from "@/components/ui/SectionHead";
import { reviews } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/** Reviews set large; each quote's words light up in reading order as it scrolls past. */
export default function Voices({ index = "07" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const splits = gsap.utils.toArray<HTMLElement>("[data-quote]").map((q) => {
        const split = SplitText.create(q, { type: "words" });
        gsap.fromTo(
          split.words,
          { color: "rgba(238,236,230,0.18)" },
          {
            color: "rgba(238,236,230,1)",
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: q, start: "top 88%", end: "top 45%", scrub: true },
          },
        );
        return split;
      });
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index={index}
        title={
          <>
            Reviews <em>speak</em> for us
          </>
        }
        intro="What hackers told us after thirty-six hours, a lot of coffee and a demo on stage."
      />
      <div className="mt-16 flex flex-col">
        {reviews.map((r, i) => (
          <figure key={r.title} className="grid gap-4 border-t border-line py-10 md:grid-cols-[12rem_1fr] md:gap-10 md:py-14">
            <figcaption className="font-mono text-sm text-subtle">
              <span className="text-orange tabular-nums">0{i + 1}</span>
              <span className="mt-2 block">{r.title}</span>
            </figcaption>
            <blockquote data-quote className="font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.1] font-bold [font-stretch:85%]">
              {r.body}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
