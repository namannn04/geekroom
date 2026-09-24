"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import SectionHead from "@/components/ui/SectionHead";
import { services, site } from "@/data/site";
import { EYES, LEFT, RIGHT, SLASH, toPath, VIEWBOX } from "@/lib/geekmark";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_IN_OUT, EASE_OUT, reveal } from "@/lib/motion";

gsap.registerPlugin(DrawSVGPlugin);

/* One line-drawn glyph per offering; every stroke is drawn on scroll */
const glyphs = [
  // Hiring: crosshair on a candidate
  <svg key="0" viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle data-draw cx="32" cy="32" r="26" />
    <circle data-draw cx="32" cy="32" r="14" />
    <path data-draw d="M32 2v14M32 48v14M2 32h14M48 32h14" />
  </svg>,
  // Hackathons: the Geek Room mark itself, traced from the logo and drawn as a line glyph
  <svg
    key="1"
    viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
    className="h-16 w-auto"
    fill="none"
    stroke="currentColor"
    strokeWidth="14"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path data-draw d={toPath(LEFT)} />
    <path data-draw d={toPath(RIGHT)} />
    <path data-draw d={toPath(SLASH, true)} className="text-orange" strokeWidth="9" />
    {EYES.map(({ c, r }) => (
      <circle key={c[0]} data-draw cx={c[0]} cy={c[1]} r={r - 6} strokeWidth="10" />
    ))}
  </svg>,
  // Speakers: rising signal
  <svg key="2" viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
    <path data-draw d="M4 44c8 0 8-24 16-24s8 32 16 32 8-40 16-40 6 20 8 20" />
    <path data-draw d="M4 58h56" />
  </svg>,
];

const layout = ["md:col-span-7", "md:col-span-5 md:row-span-2", "md:col-span-7"];

export default function Offerings() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-offer]").forEach((card, i) => {
        const tl = gsap.timeline({ scrollTrigger: reveal(card, "top 90%") });
        // Card opens along the slash of the </> mark, then its glyph draws itself
        tl.fromTo(
          card,
          { clipPath: i % 2 ? "polygon(100% 0,100% 0,100% 100%,100% 100%)" : "polygon(0 0,0 0,0 100%,0 100%)" },
          { clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", duration: 1, ease: "expo.inOut", delay: i * 0.08 },
        )
          .from(card.querySelectorAll("[data-draw]"), { drawSVG: "0%", duration: 0.9, stagger: 0.1, ease: EASE_IN_OUT }, 0.45)
          .from(card.querySelectorAll("[data-copy]"), { y: 28, opacity: 0, duration: 0.7, stagger: 0.07, ease: EASE_OUT }, 0.5);
      });

      gsap.fromTo(
        "[data-cta-offer]",
        { clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" },
        {
          clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)",
          duration: 1.1,
          ease: "expo.inOut",
          scrollTrigger: reveal("[data-cta-offer]", "top 94%"),
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            Work with us, <em>get seen</em>
          </>
        }
        intro="Put your brand in front of India's sharpest student builders, and meet your tech and hiring needs while you're at it."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-12 md:grid-rows-2">
        {services.map((s, i) => (
          <article key={s.title} data-offer className={`flex flex-col justify-between rounded-[1.75rem] bg-ink-2 p-7 md:p-10 ${layout[i]}`}>
            <div className="flex items-start justify-between text-paper">
              {glyphs[i]}
              <span className="label tabular-nums">0{i + 1}</span>
            </div>
            {s.proof && (
              <dl className="mt-12 border-t border-line md:my-10">
                {s.proof.map((p) => (
                  <div key={p.label} data-copy className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                    <dt className="text-sm text-muted">{p.label}</dt>
                    <dd className="font-display text-xl font-bold text-right [font-stretch:90%] md:text-2xl">{p.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-16">
              <h3 data-copy className="display text-[clamp(1.9rem,3.2vw,2.75rem)]">
                {s.title}
              </h3>
              <p data-copy className="mt-4 max-w-[30rem] leading-relaxed text-muted">
                {s.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Link
        data-cta-offer
        href={`mailto:${site.email}?subject=Partnering%20with%20Geek%20Room`}
        className="group mt-4 flex items-center justify-between gap-6 rounded-[1.75rem] bg-orange p-7 text-ink md:p-10"
      >
        <p className="display text-[clamp(1.6rem,3.6vw,3rem)]">Got a different idea? Pitch it to us.</p>
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:-rotate-45">
          <ArrowUpRight className="size-5" />
        </span>
      </Link>
    </section>
  );
}
