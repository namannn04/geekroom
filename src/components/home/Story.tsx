"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { features } from "@/data/site";

/** Sticky left column with a progress rail; image panels scroll past on the right. */
export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const rail = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="shell relative grid gap-12 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:h-fit">
        <p className="label flex items-center gap-3">
          <span className="text-orange">04</span>
          <span className="h-px w-8 bg-line-strong" />
          Why Geek Room
        </p>
        <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5.25rem)]">
          Learn. Connect. <em>Grow.</em>
        </h2>
        <p className="mt-6 max-w-[440px] text-lg leading-relaxed text-muted">
          Started as a WhatsApp group at MSIT, Geek Room is now where students across India come to hack, ship and meet
          the people who build the industry.
        </p>

        <div className="mt-10 hidden gap-5 lg:flex">
          <div className="relative w-px bg-line-strong">
            <motion.span style={{ height: rail }} className="absolute inset-x-0 top-0 bg-signal" />
          </div>
          <ol className="space-y-4">
            {features.map((f, i) => (
              <li key={f.title} className="font-mono text-xs tracking-[0.1em] text-muted uppercase">
                <span className="mr-3 text-orange">0{i + 1}</span>
                {f.title}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {features.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group overflow-hidden rounded-3xl border border-line bg-ink-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={f.image}
                alt={f.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover grayscale-[40%] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
              />
              <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1 font-mono text-xs text-paper backdrop-blur">
                0{i + 1} / 0{features.length}
              </span>
            </div>
            <div className="p-7 md:p-9">
              <h3 className="font-display text-2xl leading-tight font-bold uppercase md:text-3xl">{f.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{f.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
