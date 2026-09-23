"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import DotField from "@/components/ui/DotField";
import GeekMark from "@/components/ui/GeekMark";
import Marquee from "@/components/ui/Marquee";
import { partners } from "@/data/site";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28">
      {/* Backdrop layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-paper grid-fade absolute inset-0" />
        <DotField className="absolute inset-0 opacity-70" />
        <span className="absolute left-1/2 top-[38%] size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/20 blur-[140px]" />
        <span className="absolute right-[-10%] top-[10%] size-[420px] rounded-full bg-orange/20 blur-[130px]" />
      </div>

      <div className="shell relative grid flex-1 items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <motion.div style={{ opacity: fade }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink/60 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-orange opacity-70" />
              <span className="relative size-2 rounded-full bg-orange" />
            </span>
            50,000+ builders · Est. 2023
          </motion.p>

          <h1 className="display mt-7 text-[clamp(3.2rem,10vw,9.5rem)]">
            {["Meet the", "smarter", "community"].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? "accent pr-2" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="mt-7 max-w-[520px] text-lg leading-relaxed text-muted"
          >
            Hackathons, meetups and speaker sessions where India&apos;s students learn, connect and grow — by building in
            public.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/event" className="btn-primary">
              Explore events <ArrowDownRight className="size-4" />
            </Link>
            <Link href="/contact-us" className="btn-ghost">
              Partner with us <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Abstract mark with orbit rings and floating chips */}
        <motion.div
          style={{ y: markY, rotate: markRotate }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="relative mx-auto hidden aspect-square w-full max-w-[520px] lg:block"
        >
          <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-line-strong" />
          <div className="absolute inset-[12%] rounded-full border border-line" />
          <div className="absolute inset-[26%] rounded-full border border-teal/30 bg-teal/[0.04]" />
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange shadow-[0_0_24px_#ff5a1f]" />
          <span className="absolute bottom-[12%] left-[12%] size-2 rounded-full bg-teal shadow-[0_0_18px_#19b3bf]" />
          <GeekMark className="absolute inset-[30%] drop-shadow-[0_0_40px_rgba(25,179,191,0.35)]" />

          <FloatChip className="left-[-8%] top-[14%]" delay={0.9} label="Hackathons" value="Code Cubicle" />
          <FloatChip className="right-[-12%] top-[58%]" delay={1.05} label="Largest in North India" value="Code Kshetra" />
          <FloatChip className="bottom-[4%] left-[6%]" delay={1.2} label="Prize pool" value="₹5L+" />
        </motion.div>
      </div>

      {/* Partner logo strip */}
      <div className="relative mt-16 border-y border-line bg-ink/60 py-6 backdrop-blur">
        <p className="eyebrow mb-5 text-center">Trusted by teams at</p>
        <Marquee>
          {partners.map((p) => (
            <span key={p.name} className="mx-10 flex h-10 w-[120px] items-center justify-center">
              <Image
                src={p.logo}
                alt={p.name}
                width={120}
                height={40}
                className="max-h-9 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function FloatChip({ className, delay, label, value }: { className: string; delay: number; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, y: { delay, duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      className={`absolute rounded-2xl border border-line-strong bg-ink-2/80 px-4 py-3 backdrop-blur-md ${className}`}
    >
      <p className="font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </motion.div>
  );
}
