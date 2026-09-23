"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { team } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Portraits open like shutters, one after another, as the grid scrolls in. */
export default function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-member]").forEach((card, i) => {
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 92%", end: "top 50%", scrub: 0.6 } })
          .fromTo(
            card.querySelector("[data-media]"),
            { clipPath: i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" },
          )
          .from(card.querySelectorAll("[data-copy]"), { y: 24, opacity: 0, stagger: 0.08 }, 0.3);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            The people <em>behind</em> the room
          </>
        }
        intro="Co-founders and founding members who turned a group chat into a nationwide community."
      />

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {team.map((p) => (
          <a key={p.name} data-member href={p.linkedin} target="_blank" rel="noopener noreferrer" className="group block">
            <div data-media className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 data-copy className="font-display text-xl leading-tight font-extrabold uppercase [font-stretch:80%] md:text-2xl">
                  {p.name}
                </h3>
                <p data-copy className={`mt-1 text-sm ${p.role === "Co-Founder" ? "text-orange" : "text-muted"}`}>
                  {p.role}
                </p>
              </div>
              <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-colors group-hover:text-orange" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
