import Reveal from "@/components/ui/Reveal";
import { services } from "@/data/site";

export default function Services() {
  return (
    <section className="container-x relative z-10 py-16 md:py-24">
      <Reveal>
        <h2 className="heading-lg mx-auto max-w-[820px] text-center">
          Work with us to make your brand visible and meet your tech needs
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal
            key={s.title}
            delay={i * 0.1}
            className="group bg-surface p-7 transition-transform duration-300 hover:-translate-y-1.5"
          >
            <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-8 text-[15px] leading-relaxed text-subtle transition-colors group-hover:text-muted">
              {s.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
