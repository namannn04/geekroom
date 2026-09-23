import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { team } from "@/data/site";

export default function Team() {
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead
        index="02"
        title={
          <>
            The people <em>behind</em> the room
          </>
        }
        intro="Co-founders and founding members who turned a group chat into a nationwide community."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
        {team.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.08}>
            <a
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-3xl border border-line bg-ink-2"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
                <div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase ${
                      p.role === "Co-Founder" ? "bg-orange text-ink" : "border border-white/25 bg-ink/50 backdrop-blur"
                    }`}
                  >
                    {p.role}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold md:text-2xl">{p.name}</h3>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
