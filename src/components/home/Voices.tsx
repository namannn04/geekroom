import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { reviews } from "@/data/site";

export default function Voices({ index = "07" }: { index?: string }) {
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead
        index={index}
        align="center"
        title={
          <>
            Reviews <em>speak</em> for us
          </>
        }
        intro="What hackers say after 36 hours, too much coffee and a demo on stage."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal
            key={r.title}
            delay={i * 0.1}
            className="relative flex flex-col justify-between rounded-3xl border border-line bg-ink-2 p-8 transition-colors hover:border-line-strong"
          >
            <span aria-hidden className="font-serif text-8xl leading-[0.6] text-teal">&ldquo;</span>
            <p className="mt-6 text-lg leading-relaxed">{r.body}</p>
            <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
              <span className="grid size-10 place-items-center rounded-full bg-signal font-display text-sm font-bold text-ink">
                {r.title.split(" at ")[1]?.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold">Hacker</p>
                <p className="font-mono text-xs tracking-[0.1em] text-subtle uppercase">{r.title.split(" at ")[1]}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
