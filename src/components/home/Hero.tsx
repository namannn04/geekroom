"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SplitText } from "gsap/SplitText";
import DotField from "@/components/ui/DotField";
import GeekMark from "@/components/ui/GeekMark";
import { partners } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

const rowA = partners.slice(0, 6);
const rowB = partners.slice(6);

/**
 * Hero. On load the headline's letters stretch in from a compressed cut.
 * On scroll the three lines drift apart, the </> mark comes apart at the
 * seams, and the partner rows slide against each other.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      const split = SplitText.create(lines, { type: "chars", mask: "chars" });

      // Intro
      const intro = gsap.timeline({ delay: 0.35 });
      intro
        .from(split.chars, { yPercent: 120, fontStretch: "50%", duration: 1.2, stagger: 0.025, ease: "power4.out" })
        .from("[data-mark] [data-part='left']", { x: 40, opacity: 0, duration: 0.9 }, 0.3)
        .from("[data-mark] [data-part='right']", { x: -40, opacity: 0, duration: 0.9 }, 0.3)
        .from("[data-mark] [data-part='slash']", { scaleY: 0, transformOrigin: "50% 50%", duration: 0.9 }, 0.45)
        .from("[data-mark] [data-part='eye']", { scale: 0, transformOrigin: "50% 50%", stagger: 0.08, duration: 0.5 }, 0.8)
        .from("[data-fadeup]", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.7);

      // Scroll: lines diverge, mark separates
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(lines[0], { xPercent: -12, ease: "none", scrollTrigger: st });
      gsap.to(lines[1], { fontStretch: "150%", ease: "none", scrollTrigger: st });
      gsap.to(lines[2], { xPercent: 10, ease: "none", scrollTrigger: st });
      gsap.to("[data-mark] [data-part='left']", { x: -70, ease: "none", scrollTrigger: st });
      gsap.to("[data-mark] [data-part='right']", { x: 70, ease: "none", scrollTrigger: st });
      gsap.to("[data-mark] [data-part='slash']", { rotate: 90, transformOrigin: "50% 50%", ease: "none", scrollTrigger: st });
      gsap.to("[data-mark]", { yPercent: 30, ease: "none", scrollTrigger: st });

      // Partner rows slide against each other while the strip is on screen
      const strip = { trigger: "[data-strip]", start: "top bottom", end: "bottom top", scrub: 0.4 };
      gsap.fromTo("[data-row='a']", { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: strip });
      gsap.fromTo("[data-row='b']", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: strip });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-x-clip pt-28 md:pt-32">
      <DotField className="absolute inset-0 -z-10 opacity-80" />

      <div className="shell grid min-h-[calc(100svh-8rem)] items-center gap-10 pb-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h1 className="display text-[clamp(3.4rem,11.5vw,10.5rem)]">
            <span data-line className="block">
              Meet the
            </span>
            <span data-line className="wide block">
              smarter
            </span>
            <span data-line className="block">
              community
            </span>
          </h1>

          <p data-fadeup className="mt-8 max-w-[31rem] text-lg leading-relaxed text-muted">
            Geek Room runs hackathons, meetups and speaker sessions where 50,000+ students across India learn,
            connect and build in public.
          </p>

          <div data-fadeup className="mt-9 flex flex-wrap gap-3">
            <Link href="/event" className="btn-primary">
              See the events <ArrowDownRight className="size-4" />
            </Link>
            <Link href="/contact-us" className="btn-ghost">
              Partner with us <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <div data-mark className="relative mx-auto hidden w-full max-w-[440px] lg:block">
          <GeekMark className="w-full" />
        </div>
      </div>

      {/* Partner strip: two rows moving against each other on scroll */}
      <div data-strip className="border-y border-line py-7">
        <p className="label shell mb-5">Hackathons powered by</p>
        <div className="flex flex-col gap-4 overflow-hidden">
          {[
            { key: "a", items: rowA },
            { key: "b", items: rowB },
          ].map((row) => (
            <div key={row.key} data-row={row.key} className="flex w-max gap-4 pl-4">
              {[...row.items, ...row.items, ...row.items].map((p, i) => (
                <span
                  key={`${p.name}-${i}`}
                  className="flex h-16 w-44 shrink-0 items-center justify-center rounded-full border border-line px-6"
                >
                  <Image
                    src={p.logo}
                    alt={i < row.items.length ? p.name : ""}
                    width={120}
                    height={40}
                    className="max-h-8 w-auto object-contain opacity-80"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
