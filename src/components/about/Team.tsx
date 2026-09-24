"use client";

import Image from "next/image";
import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { LinkedinIcon, XIcon } from "@/components/ui/Icons";
import { team } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_OUT, reveal } from "@/lib/motion";

/** Portraits open like shutters, one after another, as the grid scrolls in. */
export default function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-member]").forEach((card, i) => {
        gsap
          .timeline({ scrollTrigger: reveal(card, "top 90%") })
          .fromTo(
            card.querySelector("[data-media]"),
            { clipPath: i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", delay: (i % 4) * 0.08 },
          )
          .from(card.querySelectorAll("[data-copy]"), { y: 20, opacity: 0, duration: 0.6, stagger: 0.07, ease: EASE_OUT }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="03"
        title={
          <>
            The people <em>behind</em> the room
          </>
        }
        intro="The team that turned a group chat into a nationwide community."
      />

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {team.map((p) => {
          const links = [
            { href: p.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            { href: p.x, label: "X", Icon: XIcon },
          ].filter((l): l is typeof l & { href: string } => Boolean(l.href));
          return (
            <article key={p.image} data-member className="group">
              <div data-media className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 data-copy className="font-display text-xl leading-tight font-extrabold uppercase [font-stretch:80%] md:text-2xl">
                    {p.name}
                  </h3>
                  {p.role && (
                    <p data-copy className="mt-1 text-sm text-muted">
                      {p.role}
                    </p>
                  )}
                </div>
                {links.length > 0 && (
                  <div data-copy className="flex shrink-0 gap-1.5">
                    {links.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.name} on ${label}`}
                        className="grid size-9 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-paper hover:text-paper"
                      >
                        <Icon className="size-3.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
