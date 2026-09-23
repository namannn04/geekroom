import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { partners } from "@/data/site";

// Staggered vertical offsets give the logo wall a loose, floating rhythm
const drift = ["md:translate-y-6", "md:-translate-y-4", "md:translate-y-10", "md:translate-y-0", "md:-translate-y-8", "md:translate-y-4"];

export default function Partners() {
  return (
    <section className="shell py-24 md:py-32">
      <div className="noise relative grid gap-12 overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-8 md:p-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <span aria-hidden className="absolute -left-20 bottom-0 size-80 rounded-full bg-orange/15 blur-[100px]" />
        <Reveal className="relative">
          <p className="eyebrow flex items-center gap-3">
            <span className="text-orange">06</span>
            <span className="h-px w-8 bg-line-strong" />
            Partners
          </p>
          <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.5rem)]">
            Our partners <em className="text-signal">make it possible</em>
          </h2>
          <p className="mt-6 max-w-[380px] leading-relaxed text-muted">
            From AI labs to fintech and developer tooling — the companies that power Geek Room hackathons and meetups.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-3 gap-3 sm:grid-cols-4">
          {partners.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 0.06} className={drift[i % drift.length]}>
              <div
                title={p.name}
                className="group grid aspect-square place-items-center rounded-2xl border border-line bg-ink p-4 transition-all duration-500 hover:-translate-y-1 hover:border-teal/50 hover:shadow-[0_0_40px_-10px_rgba(25,179,191,0.5)]"
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
