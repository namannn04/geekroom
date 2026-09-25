"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SplitText } from "gsap/SplitText";
import DotField from "@/components/ui/DotField";
import GeekMark from "@/components/ui/GeekMark";
import { EASE_EXPO } from "@/lib/motion";
import { partners } from "@/data/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

// three.js only loads in the browser; the flat SVG mark holds the space until it does
const GeekMark3D = dynamic(() => import("@/components/three/GeekMark3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <GeekMark className="w-[46%]" />
    </div>
  ),
});

const rowA = partners.slice(0, 6);
const rowB = partners.slice(6);

/**
 * Hero. On load the headline's letters rise and unsquash while a glossy 3D
 * </> mark fades up inside its orbit of achievements. On scroll the headline
 * lines drift apart, the mark comes apart at the seams, and the partner rows
 * slide against each other.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      const split = SplitText.create(lines, { type: "chars", mask: "chars" });
      // Lines never wrap: each is a single word or phrase sized to fit its column

      // Intro: chars rise and unsquash (transform-only)
      gsap
        .timeline({ delay: 0.3 })
        .from(split.chars, {
          yPercent: 115,
          scaleX: 1.7,
          transformOrigin: "0% 100%",
          duration: 1.1,
          stagger: 0.022,
          ease: EASE_EXPO,
        })
        .from("[data-fadeup]", { y: 24, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 0.55)
        .from("[data-stage]", { opacity: 0, scale: 0.92, duration: 1.4, ease: EASE_EXPO }, 0.2);

      // Scroll: lines diverge, and the 3D mark reads the same progress to pull itself apart
      const st = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self: ScrollTrigger) => (progress.current = self.progress),
      };
      gsap.to(lines[0], { xPercent: -10, ease: "none", scrollTrigger: st });
      gsap.to(lines[1], { xPercent: 6, ease: "none", scrollTrigger: { ...st, onUpdate: undefined } });
      gsap.to(lines[2], { xPercent: 12, ease: "none", scrollTrigger: { ...st, onUpdate: undefined } });
      gsap.to("[data-stage]", { yPercent: 18, ease: "none", scrollTrigger: { ...st, onUpdate: undefined } });

      // Partner rows slide against each other while the strip is on screen
      const strip = { trigger: "[data-strip]", start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo("[data-row='a']", { xPercent: 0 }, { xPercent: -18, ease: "none", scrollTrigger: strip });
      gsap.fromTo("[data-row='b']", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: strip });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-x-clip pt-28 md:pt-32">
      <DotField className="absolute inset-0 -z-10 opacity-80" />

      <div className="shell grid min-h-[calc(100svh-8rem)] items-center gap-10 pb-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h1 className="display text-[clamp(3.2rem,13vw,6rem)] whitespace-nowrap sm:text-[clamp(4rem,11vw,8.5rem)] lg:text-[clamp(5rem,8.6vw,9rem)]">
            <span data-line className="block">
              Meet the
            </span>
            <span data-line className="wide block text-[0.78em]">
              smarter
            </span>
            <span data-line className="block">
              community
            </span>
          </h1>

          <p data-fadeup className="mt-8 max-w-[31rem] text-lg leading-relaxed text-muted">
            Geek Room runs hackathons, meetups and hiring challenges where 150K+ builders across 400+ colleges
            learn, connect and build in public.
          </p>

          <div data-fadeup className="mt-9 flex flex-wrap gap-3">
            <Link href="/event" className="btn-primary cursor-pointer">
              See the events <ArrowDownRight className="size-4" />
            </Link>
            <Link href="/contact-us" className="btn-ghost cursor-pointer">
              Partner with us <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* 3D mark with revolving achievements */}
        <div data-stage className="relative -mx-4 h-[380px] sm:h-[460px] lg:mx-0 lg:h-[min(640px,78svh)]">
          <GeekMark3D progress={progress} className="absolute inset-0 lg:-inset-x-16" />
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
                    className="max-h-8 h-auto w-auto object-contain opacity-80"
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
