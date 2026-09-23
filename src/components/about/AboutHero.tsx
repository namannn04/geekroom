"use client";

import { useRef } from "react";
import GeekMark from "@/components/ui/GeekMark";
import SectionHead from "@/components/ui/SectionHead";
import { stats } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const cells = [{ value: 50000, suffix: "+", label: "Members" }, ...stats];
const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");

export default function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-num]");
      if (prefersReducedMotion()) return;
      // Stat cells slide up out of their row one by one, counting as they land
      nums.forEach((el, i) => {
        const state = { v: 0 };
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-stats]", start: "top 85%" }, delay: i * 0.12 })
          .from(el.closest("[data-cell]"), { yPercent: 100, duration: 0.9, ease: "power4.out" })
          .to(state, { v: cells[i].value, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = fmt(state.v)) }, 0);
      });
      gsap.to("[data-mark] [data-part='slash']", {
        rotate: 180,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell pt-36 pb-20 md:pt-44">
      <SectionHead
        as="h1"
        index="2023"
        title={
          <>
            From a group chat to <em>50,000+</em> builders
          </>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div className="max-w-[36rem] space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Geek Room started in 2023 with one goal: bring together everyone in tech who thinks alike. What began as a
            WhatsApp group for MSIT students is now one of India&apos;s biggest student communities.
          </p>
          <p>
            Along the way we&apos;ve hit plenty of milestones and built lasting relationships with partners and, above
            all, with our <span className="text-paper">members</span>.
          </p>
        </div>
        <div data-mark className="hidden justify-self-end lg:block">
          <GeekMark className="w-[240px]" />
        </div>
      </div>

      <dl data-stats className="mt-16 grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {cells.map((s, i) => (
          <div key={s.label} className={`overflow-hidden border-b border-line ${i % 2 ? "border-l" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <div data-cell className="p-6 md:p-8">
              <dd className="display text-[clamp(2.4rem,6vw,4.5rem)] tabular-nums lg:text-[clamp(2.4rem,3.8vw,4.5rem)]">
                <span data-num>{fmt(s.value)}</span>
                <span className="text-orange">{s.suffix}</span>
              </dd>
              <dt className="mt-2 text-muted">{s.label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
