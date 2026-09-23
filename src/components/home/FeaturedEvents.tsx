"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import EventCard from "@/components/events/EventCard";
import { eventsByDate } from "@/data/events";

export default function FeaturedEvents() {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("a");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 20), behavior: "smooth" });
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHead
          index="01"
          label="Programs"
          title={
            <>
              Featured <em className="text-signal">events</em>
            </>
          }
          intro="The best hackathons and tech events in India — hosted at Microsoft, Mastercard and campuses across the country."
        />
        <div className="flex shrink-0 items-center gap-2">
          {[
            { dir: -1 as const, Icon: ArrowLeft, label: "Previous events" },
            { dir: 1 as const, Icon: ArrowRight, label: "Next events" },
          ].map(({ dir, Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => scroll(dir)}
              className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <Icon className="size-4" />
            </button>
          ))}
          <Link href="/event" className="btn-ghost ml-2">
            All events <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div
        ref={track}
        className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] sm:px-6 lg:px-[max(2.5rem,calc((100vw_-_1320px)/2_+_2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {eventsByDate.map((e) => (
          <EventCard key={e.slug} event={e} className="w-[82vw] shrink-0 snap-start sm:w-[380px]" />
        ))}
      </div>
    </section>
  );
}
