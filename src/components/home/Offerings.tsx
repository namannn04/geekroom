import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { services, site } from "@/data/site";

/* Small abstract glyphs, one per offering */
const glyphs = [
  // Hiring: target rings
  <svg key="0" viewBox="0 0 48 48" className="size-12" fill="none" aria-hidden>
    <circle cx="24" cy="24" r="20" stroke="#19b3bf" strokeWidth="2" />
    <circle cx="24" cy="24" r="12" stroke="#f4f1ea" strokeOpacity=".4" strokeWidth="2" />
    <circle cx="24" cy="24" r="4" fill="#ff5a1f" />
  </svg>,
  // Hackathons: stacked brackets
  <svg key="1" viewBox="0 0 48 48" className="size-12" fill="none" aria-hidden>
    <path d="M16 10 6 24l10 14M32 10l10 14-10 14" stroke="#19b3bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M27 8 21 40" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" />
  </svg>,
  // Speakers: sound waves
  <svg key="2" viewBox="0 0 48 48" className="size-12" fill="none" aria-hidden>
    {[8, 16, 24, 32, 40].map((x, i) => (
      <rect key={x} x={x - 2} y={24 - [6, 12, 18, 12, 6][i]} width="4" height={[12, 24, 36, 24, 12][i]} rx="2" fill={i === 2 ? "#ff5a1f" : "#19b3bf"} />
    ))}
  </svg>,
];

export default function Offerings() {
  return (
    <section className="shell relative py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            Work with us, <em>get seen</em>
          </>
        }
        intro="Make your brand visible to India's sharpest student builders and meet your tech and hiring needs along the way."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-2">
        {services.map((s, i) => (
          <Reveal
            key={s.title}
            delay={i * 0.08}
            className={`group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-line-strong md:p-9 ${
              i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2 md:row-span-2" : "md:col-span-4"
            }`}
          >
            <span className="absolute -right-16 -top-16 size-48 rounded-full bg-teal/0 blur-3xl transition-colors duration-700 group-hover:bg-teal/20" />
            <div className="flex items-start justify-between">
              {glyphs[i]}
              <span className="font-mono text-xs text-subtle">0{i + 1}</span>
            </div>
            <h3 className="mt-10 font-display text-2xl font-bold uppercase md:text-3xl">{s.title}</h3>
            <p className="mt-4 max-w-[460px] leading-relaxed text-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-4">
        <Link
          href={`mailto:${site.email}?subject=Partnering%20with%20Geek%20Room`}
          className="group flex items-center justify-between gap-6 rounded-3xl border border-line bg-signal p-7 text-ink md:p-9"
        >
          <p className="display text-2xl md:text-4xl">
            Have something else in mind? <em>Let&apos;s build it.</em>
          </p>
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-5" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
