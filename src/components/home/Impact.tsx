import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { impact } from "@/data/site";

export default function Impact() {
  return (
    <section className="shell py-10">
      <Reveal className="noise relative overflow-hidden rounded-[2rem] border border-line-strong bg-ink-2 px-6 py-16 md:px-14 md:py-20">
        {/* Concentric rings + glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 -top-24 size-[420px] rounded-full bg-teal/25 blur-[110px]" />
          <span className="absolute -bottom-32 -right-10 size-[460px] rounded-full bg-orange/25 blur-[120px]" />
          {[260, 380, 500].map((s) => (
            <span
              key={s}
              className="absolute right-[-120px] top-1/2 -translate-y-1/2 rounded-full border border-line-strong"
              style={{ width: s, height: s }}
            />
          ))}
        </div>

        <div className="relative">
          <p className="label text-center">
            <span className="text-orange">03</span> — Delivered impact
          </p>
          <h2 className="display mx-auto mt-5 max-w-[800px] text-center text-[clamp(2rem,5vw,4rem)]">
            Numbers that <em>compound</em>
          </h2>

          <dl className="mt-14 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {impact.map((s, i) => (
              <div key={s.label} className={`px-4 text-center ${i > 0 ? "md:border-l md:border-line-strong" : ""}`}>
                <dd className="display text-[clamp(2.2rem,5vw,4rem)]">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
