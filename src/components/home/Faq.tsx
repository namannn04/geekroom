"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { faqs, site } from "@/data/site";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-x relative z-10 py-16 md:py-24">
      <Reveal>
        <h2 className="heading-lg">Frequently asked question</h2>
      </Reveal>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.4fr_1fr]">
        <Reveal className="relative aspect-[710/414] overflow-hidden">
          <Image src="/images/home/faq.jpg" alt="Geek Room event" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
        </Reveal>

        <div className="flex flex-col">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium capitalize"
                >
                  {f.q}
                  <Plus
                    className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden text-[15px] leading-relaxed text-muted"
                    >
                      <span className="block pb-5">{f.a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <Reveal className="mt-16 text-center">
        <p className="font-display text-2xl font-semibold capitalize md:text-4xl">Get in touch with us</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-3 inline-block bg-gradient-to-r from-teal to-orange bg-clip-text font-display text-2xl font-semibold text-transparent md:text-4xl"
        >
          {site.email}
        </a>
      </Reveal>
    </section>
  );
}
