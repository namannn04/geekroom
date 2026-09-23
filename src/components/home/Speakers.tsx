import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { speakers } from "@/data/site";

export default function Speakers() {
  return (
    <section className="shell relative py-24 md:py-32">
      <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
        <SectionHead
          index="05"
          title={
            <>
              Expert <em>insights</em>
            </>
          }
          intro="Engineers, founders and data scientists who've taken the Geek Room stage."
        />
        <Reveal className="shrink-0 md:text-right">
          <p className="display text-7xl text-transparent [-webkit-text-stroke:1.5px_var(--paper)] md:text-8xl">
            <CountUp to={35} suffix="+" />
          </p>
          <p className="eyebrow mt-2">Speakers &amp; mentors</p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
        {speakers.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.06} className={i % 2 ? "md:mt-14" : ""}>
            <a
              href={s.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-3xl border border-line bg-ink-2"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base leading-tight font-bold">{s.name}</h3>
                <p className="mt-1 text-xs leading-snug text-muted">{s.role}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
