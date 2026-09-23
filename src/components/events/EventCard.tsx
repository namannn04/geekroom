import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { formatChip, type EventItem } from "@/data/events";

export default function EventCard({ event, className = "" }: { event: EventItem; className?: string }) {
  const chip = formatChip(event.iso);

  return (
    <Link
      href={`/event/${event.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />

        {/* Date chip */}
        <div className="absolute left-4 top-4 flex overflow-hidden rounded-xl border border-white/15 bg-ink/70 font-mono text-paper backdrop-blur-md">
          <span className="grid place-items-center bg-paper px-2.5 text-lg font-bold text-ink">{chip.day}</span>
          <span className="flex flex-col justify-center px-2.5 py-1 text-[10px] leading-tight tracking-[0.1em]">
            <span>{chip.month}</span>
            <span className="text-subtle">{chip.year}</span>
          </span>
        </div>

        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase backdrop-blur-md">
          {event.kind}
        </span>
      </div>

      <div className="flex flex-1 items-end justify-between gap-4 p-5">
        <div>
          <h3 className="font-display text-xl leading-tight font-bold">{event.title}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5 shrink-0 text-teal" />
            {event.city}
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-45 group-hover:border-orange group-hover:bg-orange group-hover:text-ink">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
