"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { faqs, site } from "@/data/site";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHead
          index="08"
          title={
            <>
              Questions, <em>answered</em>
            </>
          }
          intro="Still curious? Our inbox is always open."
        />
        <a href={`mailto:${site.email}`} className="btn-ghost mt-8">
          {site.email} <ArrowUpRight className="size-3.5" />
        </a>
      </div>

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
                <span className="font-mono text-sm text-orange tabular-nums">0{i + 1}</span>
                <span className="flex-1 font-display text-xl font-extrabold uppercase [font-stretch:85%] md:text-2xl">{f.q}</span>
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
