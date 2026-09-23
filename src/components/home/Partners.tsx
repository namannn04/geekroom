"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Plus } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { partners } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";

/**
 * Logo wall drawn as a hairline grid (no cards). Cells flip up on their bottom
 * edge in a diagonal wave as the wall enters.
 */
export default function Partners() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-cell]", {
        rotateX: -90,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.9,
        ease: EASE_EXPO,
        stagger: { each: 0.05, grid: "auto", from: "start" },
        scrollTrigger: reveal("[data-wall]", "top 85%"),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell grid grid-cols-[minmax(0,1fr)] gap-12 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <SectionHead
        size="sm"
        index="06"
        title={
          <>
            Partners who <em>back</em> the build
          </>
        }
        intro="AI labs, fintech and developer tooling teams that power Geek Room hackathons and meetups."
      />

      <div data-wall className="grid grid-cols-3 overflow-hidden border-t border-l border-line [perspective:900px] sm:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.name}
            data-cell
            title={p.name}
            className="grid aspect-square place-items-center border-r border-b border-line p-5"
          >
            <Image src={p.logo} alt={p.name} width={120} height={60} className="max-h-11 w-auto object-contain opacity-85" />
          </div>
        ))}
        <Link
          data-cell
          href="/contact-us"
          className="group grid aspect-square place-items-center border-r border-b border-line p-5 text-center transition-colors hover:bg-orange hover:text-ink"
        >
          <span className="flex flex-col items-center gap-2 text-sm text-muted group-hover:text-ink">
            <Plus className="size-5" />
            Your logo
          </span>
        </Link>
      </div>
    </section>
  );
}
