import CountUp from "@/components/ui/CountUp";
import GeekMark from "@/components/ui/GeekMark";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/data/site";

export default function AboutHero() {
  const cells = [{ value: 50000, suffix: "+", label: "Members" }, ...stats];

  return (
    <section className="noise relative isolate overflow-hidden pt-36 pb-20 md:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-paper grid-fade absolute inset-0" />
        <span className="absolute -left-40 top-20 size-[560px] rounded-full bg-teal/20 blur-[140px]" />
        <span className="absolute -right-40 top-60 size-[560px] rounded-full bg-orange/20 blur-[140px]" />
      </div>

      <div className="shell">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-orange">About</span>
            <span className="h-px w-8 bg-line-strong" />
            Since 2023
          </p>
          <h1 className="display mt-6 max-w-[1100px] text-[clamp(2.8rem,8vw,7.5rem)]">
            From a WhatsApp group to <em>50,000+</em> builders
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Geek Room started in 2023 with one goal: bring together everyone in tech who thinks alike. What began as a
              small group chat for MSIT students is now one of India&apos;s biggest student communities.
            </p>
            <p>
              Along the way we&apos;ve hit plenty of milestones and built lasting relationships with partners — and
              above all, with our <span className="text-paper">members</span>.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="relative hidden justify-self-end lg:block">
            <GeekMark className="w-[260px] opacity-90" />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-16 grid grid-cols-2 overflow-hidden rounded-3xl border border-line md:grid-cols-4">
            {cells.map((s, i) => (
              <div
                key={s.label}
                className={`bg-ink-2 p-7 md:p-9 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <dd className="display text-5xl md:text-6xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
