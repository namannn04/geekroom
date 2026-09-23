import Reveal from "@/components/ui/Reveal";
import { reviews } from "@/data/site";

export default function Reviews() {
  return (
    <section className="container-x relative z-10 pt-10 pb-24">
      <Reveal>
        <h2 className="heading-lg mx-auto max-w-[680px] text-center">Reviews speak for us</h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal
            key={r.title}
            delay={i * 0.1}
            className="bg-surface px-7 py-8 text-center transition-transform duration-300 hover:-translate-y-1.5"
          >
            <h3 className="font-display text-base font-semibold capitalize">{r.title}</h3>
            <p className="mt-5 text-[15px] leading-relaxed text-fg/85">{r.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
