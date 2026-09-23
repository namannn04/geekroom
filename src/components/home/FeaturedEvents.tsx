"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import EventTicket from "@/components/events/EventTicket";
import { eventsByDate, formatChip } from "@/data/events";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

// Oldest → newest so the track reads left to right like a timeline
const track = [...eventsByDate].reverse();
const t0 = new Date(`${track[0].iso}T00:00:00`).getTime();
const t1 = new Date(`${track[track.length - 1].iso}T00:00:00`).getTime();
const pos = (iso: string) => (new Date(`${iso}T00:00:00`).getTime() - t0) / (t1 - t0);
const years = Array.from(new Set(track.map((e) => e.iso.slice(0, 4))));

/**
 * "Signal track": on desktop the section pins and scroll drives a horizontal run of
 * tickets while a playhead travels a real date axis. On small screens tickets stack
 * and swing into place as they scroll through.
 */
export default function FeaturedEvents() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const rail = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const pin = root.current!.querySelector<HTMLElement>("[data-pin]")!;
        const distance = () => rail.scrollWidth - window.innerWidth + 80;
        const setPlayhead = gsap.quickSetter("[data-playhead]", "left") as (v: string) => void;

        const run = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Playhead follows real dates: interpolate between neighbouring events
              const f = self.progress * (track.length - 1);
              const i = Math.floor(f);
              const a = pos(track[i].iso);
              const b = pos(track[Math.min(i + 1, track.length - 1)].iso);
              setPlayhead(`${(a + (b - a) * (f - i)) * 100}%`);
              setActive(Math.round(f));
            },
          },
        });

        // Each ticket swings flat as it crosses into the viewport
        gsap.utils.toArray<HTMLElement>("[data-ticket-wrap]").forEach((el) => {
          gsap.fromTo(
            el,
            { rotate: 7, yPercent: 14, scale: 0.9, transformOrigin: "0% 100%" },
            {
              rotate: 0,
              yPercent: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: el, containerAnimation: run, start: "left 100%", end: "left 55%", scrub: true },
            },
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-ticket-wrap]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { rotate: i % 2 ? 5 : -5, yPercent: 18, opacity: 0.4 },
            {
              rotate: 0,
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 95%", end: "top 55%", scrub: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const current = track[active];
  const chip = formatChip(current.iso);

  return (
    <section ref={root} className="relative overflow-x-clip pt-24 md:pt-32">
      <div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHead
          index="01"
          title={
            <>
              Events on the <em>track</em>
            </>
          }
          intro="Seven editions across four cities. Scroll to run the timeline, or open any ticket for the full story."
        />
        <Link href="/event" className="btn-ghost shrink-0 self-start md:self-auto">
          Every event <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div data-pin className="relative flex flex-col justify-center py-14 md:h-[100svh] md:py-0">
        {/* Date axis with playhead (desktop) */}
        <div className="shell hidden md:block">
          <div className="flex items-end justify-between gap-6">
            <p className="label tabular-nums" aria-live="polite">
              <span className="text-paper">
                {chip.day} {chip.month} {chip.year}
              </span>{" "}
              · {current.title} · {String(active + 1).padStart(2, "0")}/{String(track.length).padStart(2, "0")}
            </p>
            <p className="label">Scroll ↓ to travel</p>
          </div>
          <div className="relative mt-5 h-8">
            <span className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
            {years.map((y) => {
              const x = pos(`${y}-01-01`);
              return x >= 0 && x <= 1 ? (
                <span key={y} className="absolute top-0 -translate-x-1/2 font-mono text-xs text-subtle" style={{ left: `${x * 100}%` }}>
                  {y}
                </span>
              ) : null;
            })}
            {track.map((e, i) => (
              <span
                key={e.slug}
                className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                  i <= active ? "bg-orange" : "bg-line-strong"
                }`}
                style={{ left: `${pos(e.iso) * 100}%` }}
              />
            ))}
            <span data-playhead className="absolute top-1/2 left-0 h-6 w-px -translate-y-1/2 bg-paper" />
          </div>
        </div>

        <div
          data-track
          className="shell flex flex-col gap-6 md:mt-12 md:w-max md:max-w-none md:flex-row md:gap-8 md:pr-[20vw]"
        >
          {track.map((e, i) => (
            <div key={e.slug} data-ticket-wrap className="md:w-[min(720px,70vw)] md:shrink-0">
              <EventTicket event={e} index={i} className="h-full md:min-h-[340px]" priority={i < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
