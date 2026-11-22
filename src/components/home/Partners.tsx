"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
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
      <div>
      <SectionHead
        size="sm"
        index="06"
        title={
          <>
            Partners who <em>back</em> the build
          </>
        }
        intro="Global AI labs, fintech and developer-tool companies that power Geek Room hackathons and meetups. Hover a tile with a dot to see what we built together."
      />
        <Link href="/partners" className="btn-ghost mt-8">
          See all partners <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div data-wall className="grid grid-cols-3 overflow-hidden border-t border-l border-line [perspective:900px] sm:grid-cols-4">
        {partners.map((p) => {
          const logo = <Image src={p.logo} alt={p.name} width={120} height={60} className="max-h-11 h-auto w-auto object-contain opacity-85" />;
          if (!p.story) {
            return (
              <div key={p.name} data-cell title={p.name} className="grid aspect-square place-items-center border-r border-b border-line p-5">
                {logo}
              </div>
            );
          }
          // Tiles with a story flip on hover or focus to show what we ran together
          return (
            <div key={p.name} data-cell className="aspect-square border-r border-b border-line [perspective:700px]">
              <Link
                href={p.story.href}
                aria-label={`${p.name}: ${p.story.event}. ${p.story.detail}`}
                className="group relative block size-full outline-none"
              >
                <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
                  <span className="absolute inset-0 grid place-items-center p-5 [backface-visibility:hidden]">
                    {logo}
                    <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-orange" aria-hidden />
                  </span>
                  <span className="absolute inset-0 flex flex-col justify-between bg-orange p-3 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-4">
                    <span className="font-mono text-[9px] tracking-[0.06em] uppercase sm:text-[10px]">{p.name}</span>
                    <span>
                      <span className="block font-display text-sm leading-tight font-extrabold uppercase [font-stretch:85%] sm:text-base">{p.story.event}</span>
                      <span className="mt-1 line-clamp-3 block text-[10px] leading-snug sm:text-[11px]">{p.story.detail}</span>
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          );
        })}
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
