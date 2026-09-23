import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const cards = [
  {
    title: "Explore our events",
    href: "/event",
    gradient:
      "radial-gradient(120% 90% at 20% 110%, #c21cb4 0%, transparent 55%), radial-gradient(90% 90% at 95% 100%, #2fbf71 0%, transparent 55%), radial-gradient(80% 80% at 50% 80%, #8a1538 0%, transparent 70%), #0b0b0b",
  },
  {
    title: "Watch our Growth",
    href: "/about-us",
    gradient:
      "radial-gradient(90% 90% at 100% 100%, #4b3bff 0%, transparent 55%), radial-gradient(80% 70% at 30% 110%, #c9b31a 0%, transparent 55%), radial-gradient(70% 70% at 60% 100%, #d0237f 0%, transparent 65%), #050b0b",
  },
];

export default function Highlights() {
  return (
    <section className="container-x relative z-10 py-16 md:py-24">
      <Reveal>
        <h2 className="heading-lg max-w-[900px]">
          Don&apos;t miss out on the best hackathons and tech events in India
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <Link
              href={c.href}
              className="group relative flex aspect-[612/282] flex-col justify-end overflow-hidden p-7"
              style={{ background: c.gradient }}
            >
              <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
              <h3 className="relative font-display text-xl font-semibold md:text-2xl">{c.title}</h3>
              <span className="relative mt-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full border border-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                  <ArrowRight className="size-4" />
                </span>
                <span className="btn-bebas text-sm">More Details</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
