"use client";

import Image from "next/image";
import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import type { EventItem } from "@/data/events";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Event title plus a cover photo that opens along the slash and drifts on scroll. */
export default function EventHero({ event }: { event: EventItem }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cover]",
        { clipPath: "polygon(0 0, 0 0, -30% 100%, -30% 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.3, delay: 0.5, ease: "power4.inOut" },
      );
      gsap.fromTo(
        "[data-cover] img",
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: "[data-cover]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <SectionHead as="h1" index={event.code} title={event.title} intro={event.tagline} />
      <div data-cover className="relative mt-12 aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[16/9] md:aspect-[21/9]">
        <Image src={event.image} alt={event.title} fill priority sizes="100vw" className="object-cover" />
      </div>
    </div>
  );
}
