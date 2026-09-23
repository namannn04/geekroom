"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { heroImages } from "@/data/site";

const tagline = "Learn - Connect - Grow";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={ref} className="relative isolate min-h-[640px] overflow-hidden pt-[92px] md:h-[1000px] md:pt-0">
      {/* Teal / orange glow behind the headline */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="blob left-[-5%] top-[20%] size-[520px] bg-orange/80" />
        <span className="blob left-[30%] top-[18%] size-[620px] bg-teal/80" />
        <span className="blob right-[10%] top-[30%] size-[380px] bg-orange/40" />
      </div>

      {/* Floating event photos (desktop) */}
      <motion.div style={{ y: drift }} className="absolute inset-0 hidden md:block">
        {heroImages.map((img, i) => (
          <motion.div
            key={img.src}
            className={`absolute overflow-hidden shadow-2xl ${img.className}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, y: [0, i % 2 ? 12 : -12, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.1 * i },
              scale: { duration: 0.8, delay: 0.1 * i },
              y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image src={img.src} alt="" fill sizes="20vw" className="object-cover" priority={i < 3} />
          </motion.div>
        ))}
      </motion.div>

      {/* Photo strip (mobile) */}
      <div className="grid grid-cols-3 gap-2 px-5 pt-4 md:hidden">
        {heroImages.slice(0, 3).map((img) => (
          <div key={img.src} className="relative aspect-square overflow-hidden">
            <Image src={img.src} alt="" fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pt-12 text-center md:pt-[330px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.1] font-bold capitalize md:text-[96px]"
        >
          Meet the smarter
          <br />
          community
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            href="/about-us"
            className="btn-bebas mt-10 inline-block rounded-sm bg-fg px-8 py-3.5 text-base text-bg transition-transform hover:scale-105"
          >
            Explore
          </Link>
        </motion.div>
      </div>

      {/* Giant scrolling tagline */}
      <div aria-hidden className="pointer-events-none absolute bottom-10 left-0 w-full overflow-hidden md:bottom-[140px]">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-sans pr-24 text-[110px] leading-none font-medium text-white/10 md:text-[240px]"
            >
              {tagline}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
