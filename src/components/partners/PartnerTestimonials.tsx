"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { corporateTestimonials } from "@/data/site";

const STEP_MS = 7000;

/** One large quote at a time from partner and industry voices; rotates while on screen, pick any speaker. */
export default function PartnerTestimonials() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-120px" });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const t = corporateTestimonials[i];

  useEffect(() => {
    if (!inView || !auto || reduced) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % corporateTestimonials.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [i, inView, auto, reduced]);

  return (
    <div ref={root} className="grid gap-10 rounded-[2rem] border border-line bg-ink-2 p-7 md:p-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
      <figure className="min-h-[16rem]">
        <span aria-hidden className="display block text-[6rem] leading-[0.6] text-orange">&ldquo;</span>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
            <blockquote className="mt-4 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] font-bold [font-stretch:88%]">{t.quote}</blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              {t.image && <Image src={t.image} alt="" width={56} height={56} className="size-14 rounded-full object-cover" />}
              <span>
                <span className="block font-display text-lg font-bold [font-stretch:90%]">{t.name}</span>
                <span className="block text-sm text-muted">{t.role}</span>
              </span>
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </figure>

      <ul className="space-y-2" aria-label="Choose a testimonial">
        {corporateTestimonials.map((c, n) => {
          const active = n === i;
          return (
            <li key={c.name}>
              <button
                type="button"
                onClick={() => {
                  setI(n);
                  setAuto(false);
                }}
                aria-pressed={active}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-colors ${
                  active ? "border-orange bg-ink" : "border-line hover:border-line-strong"
                }`}
              >
                {c.image && (
                  <Image src={c.image} alt="" width={40} height={40} className={`size-10 rounded-full object-cover transition-all ${active ? "" : "grayscale"}`} />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm text-paper">{c.name}</span>
                  <span className="block truncate text-xs text-subtle">{c.role}</span>
                </span>
                {active && auto && !reduced && (
                  <motion.span
                    key={`p-${i}`}
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-orange"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
