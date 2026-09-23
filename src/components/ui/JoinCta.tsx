"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import GeekMark from "./GeekMark";
import { site } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Closing band: a solid orange panel that opens along the slash as it scrolls in. */
export default function JoinCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 35%", scrub: 0.7 },
      });
      tl.fromTo(
        "[data-panel]",
        { clipPath: "polygon(45% 0, 55% 0, 45% 100%, 35% 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", ease: "power2.inOut" },
      )
        .from("[data-mark]", { rotate: -25, scale: 0.7, ease: "none" }, 0)
        .from("[data-copy]", { y: 50, opacity: 0, stagger: 0.08, ease: "power2.out" }, 0.35);
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
          <h2 data-copy className="display text-[clamp(2.6rem,7vw,6rem)]">
            Hear it first. <span className="[font-stretch:150%] font-light">Join the room.</span>
          </h2>
          <p data-copy className="mt-6 max-w-[32rem] text-lg leading-relaxed">
            New hackathons, meetups and announcements land on our socials before anywhere else.
          </p>
          <div data-copy className="mt-10 flex flex-wrap gap-3">
            <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn bg-ink text-paper hover:bg-ink-3">
              Join on LinkedIn <ArrowUpRight className="size-3.5" />
            </a>
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="btn border border-ink/40 hover:border-ink">
              Follow on Instagram <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
