"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import EventTicket from "@/components/events/EventTicket";
import { formatChip, getEvent } from "@/data/events";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";

// Hand-picked run: what's live, what's next, then recent editions
const track = ["global-ai-hackathon", "hacksmart-2", "trackshift-2026", "pears", "hacksmart", "hackblr1"].map(
  (slug) => getEvent(slug)!,
);
// The run isn't chronological, so stops sit at even steps along the axis
const pos = (i: number) => i / (track.length - 1);

/**
 * "Signal track": on desktop the section pins and scroll drives a horizontal run of
 * tickets while a playhead travels a real date axis. On small screens tickets stack
 * and swing into place as they scroll through.
 */
export default function FeaturedEvents() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

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
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPlayhead(`${self.progress * 100}%`);
              // Only touch React when the active event actually changes
              const next = Math.round(self.progress * (track.length - 1));
              if (next !== activeRef.current) {
                activeRef.current = next;
                setActive(next);
              }
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
              scrollTrigger: { trigger: el, containerAnimation: run, start: "left 105%", end: "left 78%", scrub: true },
            },
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-ticket-wrap]").forEach((el, i) => {
          gsap.from(el, {
            rotate: i % 2 ? 4 : -4,
            yPercent: 16,
            opacity: 0,
            duration: 0.9,
            ease: EASE_EXPO,
            scrollTrigger: reveal(el, "top 92%"),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const current = track[active];
  const chip = formatChip(current.iso, current.approx);
  const when = current.status === "live" ? "Live now" : current.status === "upcoming" ? "Coming soon" : chip.label;

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
          intro={`From global online hackathons and vibe-a-thons to in-person finales, meetups, campaigns and dedicated promotions, we handle it all. See what's live, what's next and where we've been.`}
        />
        <Link href="/event" className="btn-ghost shrink-0 self-start md:self-auto">
          Check Out our Events <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div data-pin className="relative flex flex-col justify-center py-14 md:h-[100svh] md:py-0">
        {/* Date axis with playhead (desktop) */}
        <div className="shell hidden md:block">
          <div className="flex items-end justify-between gap-6">
            <p className="label tabular-nums" aria-live="polite">
              <span className={current.status ? "text-orange" : "text-paper"}>{when}</span>{" "}
              · {current.title} · {String(active + 1).padStart(2, "0")}/{String(track.length).padStart(2, "0")}
            </p>
            <p className="label">Scroll ↓ to travel</p>
          </div>
          <div className="relative mt-5 h-8">
            <span className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
            {track.map((e, i) => (
              <span
                key={e.slug}
                className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                  i <= active ? "bg-orange" : "bg-line-strong"
                }`}
                style={{ left: `${pos(i) * 100}%` }}
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
              <EventTicket event={e} index={i} className="h-full md:min-h-[340px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
