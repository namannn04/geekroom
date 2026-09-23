"use client";

import { useRef, type ReactNode } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

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
 * Section header. The title's characters rise out of a mask while the Anybody
 * width axis contracts from expanded to its resting cut, so each heading
 * "tightens" into place. The index sits beside the title, not above it.
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
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 82%" } });
      tl.from(split.chars, {
        yPercent: 110,
        fontStretch: "150%",
        duration: 1.1,
        stagger: { each: 0.018, from: centered ? "center" : "start" },
        ease: "power4.out",
      })
        .from("[data-index]", { xPercent: -40, opacity: 0, duration: 0.6 }, 0.2)
        .from("[data-intro]", { y: 24, opacity: 0, duration: 0.8 }, 0.35);
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      <div className={`flex items-start gap-4 ${centered ? "justify-center" : ""}`}>
        <Tag
          data-title
          className={`display ${size === "sm" ? "text-[clamp(2.3rem,4.4vw,3.9rem)]" : "text-[clamp(2.5rem,6.5vw,5.5rem)]"}`}
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
