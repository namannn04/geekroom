"use client";

import { useRef, type ReactNode } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, EASE_OUT, reveal } from "@/lib/motion";

gsap.registerPlugin(SplitText);

type Props = {
  index: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  /** "sm" for headings that live in a narrow sidebar column */
  size?: "lg" | "sm";
};

/**
 * Section header. The title's characters rise out of a mask while unsquashing
 * horizontally, so each heading "tightens" into place. Transform-only, so it
 * stays on the compositor. The index sits beside the title, not above it.
 */
export default function SectionHead({ index, title, intro, align = "left", className = "", as: Tag = "h2", size = "lg" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const centered = align === "center";

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const heading = root.current?.querySelector("[data-title]");
      if (!heading) return;
      const split = SplitText.create(heading, { type: "words,chars", mask: "words", wordsClass: "whitespace-nowrap" });
      const tl = gsap.timeline({ scrollTrigger: reveal(root.current, "top 90%") });
      // Transform-only: chars start squashed and low, then snap to their resting shape
      tl.from(split.chars, {
        yPercent: 105,
        scaleX: 1.6,
        transformOrigin: "0% 100%",
        duration: 0.9,
        stagger: { each: 0.014, from: centered ? "center" : "start" },
        ease: EASE_EXPO,
      })
        .from("[data-index]", { xPercent: -40, opacity: 0, duration: 0.5, ease: EASE_OUT }, 0.15)
        .from("[data-intro]", { y: 20, opacity: 0, duration: 0.7, ease: EASE_OUT }, 0.25);
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      <div className={`flex flex-wrap items-start gap-x-4 gap-y-2 ${centered ? "justify-center" : ""}`}>
        <Tag
          data-title
          className={`display min-w-0 ${size === "sm" ? "text-[clamp(1.8rem,8.8vw,3.9rem)] lg:text-[clamp(2.3rem,4.4vw,3.9rem)]" : "text-[clamp(1.9rem,9.4vw,5.5rem)] md:text-[clamp(2.5rem,6.5vw,5.5rem)]"}`}
        >
          {title}
        </Tag>
        <span data-index className="label mt-2 shrink-0 tabular-nums">
          ({index})
        </span>
      </div>
      {intro && (
        <p data-intro className={`mt-6 max-w-[34rem] text-base leading-relaxed text-muted md:text-lg ${centered ? "mx-auto" : ""}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
