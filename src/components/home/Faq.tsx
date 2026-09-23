"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { faqs, site } from "@/data/site";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <p className="label flex items-center gap-3">
          <span className="text-orange">08</span>
          <span className="h-px w-8 bg-line-strong" />
          FAQ
        </p>
        <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.5rem)]">
          Questions, <em>answered</em>
        </h2>
        <p className="mt-6 max-w-[360px] leading-relaxed text-muted">Still curious? Our inbox is always open.</p>
        <a href={`mailto:${site.email}`} className="btn-ghost mt-8">
          {site.email} <ArrowUpRight className="size-3.5" />
        </a>
      </Reveal>

      <div className="border-t border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-6 py-7 text-left"
              >
                <span className="font-mono text-xs text-orange">0{i + 1}</span>
                <span className="flex-1 font-display text-xl font-bold md:text-2xl">{f.q}</span>
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                    isOpen ? "rotate-45 border-orange bg-orange text-ink" : "border-line-strong group-hover:border-paper"
                  }`}
                >
                  <Plus className="size-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[600px] pb-7 pl-10 leading-relaxed text-muted">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
