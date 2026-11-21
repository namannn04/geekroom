"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import GeekMark from "@/components/ui/GeekMark";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, EASE_OUT, reveal } from "@/lib/motion";

type Props = {
  title: React.ReactNode;
  body: string;
  mailto: string;
  secondary?: { href: string; label: string };
};

/** Closing orange band for service pages; opens along the slash like the site's other CTAs. */
export default function ServiceCta({ title, body, mailto, secondary }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: reveal(root.current, "top 85%") });
      tl.fromTo(
        "[data-panel]",
        { clipPath: "polygon(45% 0, 55% 0, 45% 100%, 35% 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.2, ease: "expo.inOut" },
      )
        .from("[data-mark]", { rotate: -25, scale: 0.7, duration: 1.4, ease: EASE_EXPO }, 0.2)
        .from("[data-copy]", { y: 36, opacity: 0, duration: 0.8, stagger: 0.08, ease: EASE_OUT }, 0.55);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell pb-24 md:pb-32">
      <div data-panel className="relative overflow-hidden rounded-[2rem] bg-orange px-6 py-16 text-ink md:px-16 md:py-24">
        <div data-mark className="absolute -right-12 -bottom-20 w-[320px] opacity-25 mix-blend-multiply md:w-[460px]">
          <GeekMark className="w-full" />
        </div>
        <div className="relative max-w-[52rem]">
          <h2 data-copy className="display text-[clamp(2.4rem,6.5vw,5.5rem)]">
            {title}
          </h2>
          <p data-copy className="mt-6 max-w-[34rem] text-lg leading-relaxed">
            {body}
          </p>
          <div data-copy className="mt-10 flex flex-wrap gap-3">
            <a href={mailto} className="btn bg-ink text-paper hover:bg-ink-3">
              Start a project <ArrowUpRight className="size-3.5" />
            </a>
            {secondary && (
              <Link href={secondary.href} className="btn border border-ink/40 hover:border-ink">
                {secondary.label} <ArrowUpRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
