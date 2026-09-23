"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { milestones } from "@/data/site";

const STEP = 230;

export default function Milestones() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (dir: -1 | 1) => {
    const next = Math.min(Math.max(active + dir, 0), milestones.length - 1);
    setActive(next);
    track.current?.scrollTo({ left: next * STEP, behavior: "smooth" });
  };

  return (
    <section className="container-x relative z-10 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <Reveal>
          <h2 className="heading-lg">Milestone highlights</h2>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div
            ref={track}
            onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / STEP))}
            className="relative flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="absolute left-0 top-[5px] h-px bg-white/20" style={{ width: milestones.length * STEP }} />
            {milestones.map((m, i) => (
              <button
                type="button"
                key={m.date}
                onClick={() => {
                  setActive(i);
                  track.current?.scrollTo({ left: i * STEP, behavior: "smooth" });
                }}
                className="relative w-[230px] shrink-0 snap-start pr-6 text-left"
              >
                <span
                  className={`block size-[11px] rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/40"}`}
                />
                <span
                  className={`mt-3 block font-display text-2xl font-semibold transition-colors ${
                    i === active ? "text-fg" : "text-subtle"
                  }`}
                >
                  {m.date}
                </span>
                <span
                  className={`mt-3 block text-sm leading-relaxed transition-colors ${i === active ? "text-fg/90" : "text-subtle"}`}
                >
                  {m.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            {[
              { dir: -1 as const, Icon: ArrowLeft, label: "Previous milestone", disabled: active === 0 },
              { dir: 1 as const, Icon: ArrowRight, label: "Next milestone", disabled: active === milestones.length - 1 },
            ].map(({ dir, Icon, label, disabled }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => go(dir)}
                disabled={disabled}
                className="grid size-10 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
