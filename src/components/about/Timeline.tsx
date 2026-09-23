"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { milestones } from "@/data/site";

/** Vertical timeline whose rail fills with the signal gradient as you scroll. */
export default function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="shell py-24 md:py-32">
      <SectionHead
        index="01"
        label="Milestones"
        title={
          <>
            The story <em className="text-signal">so far</em>
          </>
        }
      />

      <ol ref={ref} className="relative mt-16 md:mt-20">
        <span className="absolute left-[7px] top-0 h-full w-px bg-line-strong md:left-1/2" />
        <motion.span style={{ height: fill }} className="absolute left-[7px] top-0 w-px bg-signal md:left-1/2" />

        {milestones.map((m, i) => {
          const right = i % 2 === 1;
          return (
            <motion.li
              key={m.date}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid pb-14 pl-10 last:pb-0 md:grid-cols-2 md:pl-0"
            >
              <span className="absolute left-0 top-2 size-[15px] rounded-full border-2 border-ink bg-orange shadow-[0_0_0_4px_rgba(255,90,31,0.15)] md:left-1/2 md:-translate-x-1/2" />
              <div className={`${right ? "md:col-start-2 md:pl-16" : "md:pr-16 md:text-right"}`}>
                <p className="display text-4xl text-signal md:text-5xl">{m.date}</p>
                <p className="mt-4 max-w-[440px] text-lg leading-relaxed text-muted md:inline-block">{m.text}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
