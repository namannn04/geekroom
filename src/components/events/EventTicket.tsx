import Image from "next/image";
import Link from "next/link";
import { barcode, formatChip, type EventItem } from "@/data/events";

/** Slash angle of the </> mark, reused for the image cut. */
const SLASH = "polygon(0 0, 100% 0, 84% 100%, 0 100%)";
const SLASH_V = "polygon(0 0, 100% 0, 100% 84%, 0 100%)";

/**
 * An event as an admission ticket: slash-cut photo, oversized date numerals,
 * a perforated stub with the city code and a barcode seeded from the slug.
 */
export default function EventTicket({
  event,
  index,
  className = "",
  priority = false,
}: {
  event: EventItem;
  index: number;
  className?: string;
  priority?: boolean;
}) {
  const chip = formatChip(event.iso);
  const bars = barcode(event.slug);

  return (
    <Link
      href={`/event/${event.slug}`}
      data-ticket
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-paper text-ink md:flex-row ${className}`}
    >
      {/* Photo, cut on the slash */}
      <div className="relative aspect-[16/10] shrink-0 md:aspect-auto md:w-[42%]">
        <div
          className="absolute inset-0 [clip-path:var(--cut-v)] md:[clip-path:var(--cut)]"
          style={{ "--cut": SLASH, "--cut-v": SLASH_V } as React.CSSProperties}
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority={priority}
            sizes="(min-width: 768px) 360px, 90vw"
            className="object-cover"
          />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 font-mono text-xs text-paper">
          {event.kind}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:py-7 md:pr-4 md:pl-2">
        <div className="flex items-baseline gap-2 font-display leading-none font-extrabold tabular-nums">
          <span className="text-[clamp(3.5rem,8vw,5.5rem)] [font-stretch:62%]">{chip.day}</span>
          <span className="flex flex-col text-lg [font-stretch:100%]">
            <span>{chip.month}</span>
            <span className="text-ink/55">{chip.year}</span>
          </span>
        </div>
        <div>
          <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.02] font-extrabold uppercase [font-stretch:80%] transition-[font-stretch] duration-500 group-hover:[font-stretch:100%]">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-ink/70">{event.location ?? event.city}</p>
        </div>
      </div>

      {/* Perforated stub */}
      <div className="relative flex shrink-0 items-center justify-between gap-4 border-t-2 border-dashed border-ink/25 px-6 py-5 md:w-[22%] md:flex-col md:items-stretch md:border-t-0 md:border-l-2 md:py-7 md:pl-5 md:pr-6">
        {/* notches */}
        <span aria-hidden className="absolute -top-3 -left-3 size-6 rounded-full bg-ink md:-top-3 md:-left-3" />
        <span aria-hidden className="absolute -top-3 -right-3 size-6 rounded-full bg-ink md:top-auto md:-bottom-3 md:-left-3 md:right-auto" />

        <div>
          <p className="font-mono text-xs text-ink/60">No. {String(index + 1).padStart(2, "0")}</p>
          <p className="mt-1 font-display text-4xl leading-none font-extrabold [font-stretch:120%]">{event.code}</p>
        </div>

        <svg
          viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1.5, 0)} 40`}
          preserveAspectRatio="none"
          className="h-10 w-32 transition-transform duration-500 group-hover:translate-x-1 md:h-12 md:w-full"
          aria-hidden
        >
          {bars.reduce<{ x: number; els: React.ReactNode[] }>(
            (acc, w, i) => {
              acc.els.push(<rect key={i} x={acc.x} y={0} width={w} height={40} fill="currentColor" />);
              acc.x += w + 1.5;
              return acc;
            },
            { x: 0, els: [] },
          ).els}
        </svg>

        <span className="hidden font-mono text-xs text-ink/60 md:block">View event →</span>
      </div>
    </Link>
  );
}
