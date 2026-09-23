import Image from "next/image";
import Link from "next/link";
import { barcode, formatChip, type EventItem } from "@/data/events";

/** Slash angle of the </> mark, reused for the image cut. */
const SLASH = "polygon(0 0, 100% 0, 84% 100%, 0 100%)";
const SLASH_V = "polygon(0 0, 100% 0, 100% 84%, 0 100%)";

/**
 * An event as an admission ticket: slash-cut photo, oversized date numerals,
 * a perforated stub with the city code and a barcode seeded from the slug.
 * The layout follows the ticket's own width (container query), so it works
 * the same in a wide track, a two-up grid or a phone column.
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
    <div className={`@container ${className}`}>
      <Link
        href={`/event/${event.slug}`}
        data-ticket
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-paper text-ink @2xl:flex-row"
      >
        {/* Photo, cut on the slash */}
        <div className="relative aspect-[16/10] shrink-0 @2xl:aspect-auto @2xl:w-[42%]">
          <div
            className="absolute inset-0 [clip-path:var(--cut-v)] @2xl:[clip-path:var(--cut)]"
            style={
              { "--cut": SLASH, "--cut-v": SLASH_V } as React.CSSProperties
            }
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
        <div className="flex flex-1 flex-col justify-between gap-6 p-6 @2xl:py-7 @2xl:pr-4 @2xl:pl-2">
          <div className="flex items-baseline gap-2 font-display leading-none font-extrabold tabular-nums">
            <span className="text-[clamp(3.5rem,8vw,5.5rem)] [font-stretch:62%]">
              {chip.day}
            </span>
            <span className="flex flex-col text-lg [font-stretch:100%]">
              <span>{chip.month}</span>
              <span className="text-ink/55">{chip.year}</span>
            </span>
          </div>
          <div>
            <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.02] font-extrabold uppercase [font-stretch:80%] transition-[font-stretch] duration-500 group-hover:[font-stretch:100%]">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-ink/70">
              {event.location ?? event.city}
            </p>
          </div>
        </div>

        {/* Perforated stub */}
        <div className="relative flex shrink-0 items-center justify-between gap-4 border-t-2 border-dashed border-ink/25 px-6 py-5 @2xl:w-[26%] @2xl:min-w-[150px] @2xl:flex-col @2xl:items-stretch @2xl:border-t-0 @2xl:border-l-2 @2xl:py-7 @2xl:pl-5 @2xl:pr-6">
          {/* notches */}
          <span
            aria-hidden
            className="absolute -top-3 -left-3 size-6 rounded-full bg-ink @2xl:-top-3 @2xl:-left-3"
          />
          <span
            aria-hidden
            className="absolute -top-3 -right-3 size-6 rounded-full bg-ink @2xl:top-auto @2xl:-bottom-3 @2xl:-left-3 @2xl:right-auto"
          />

          <div>
            <p className="font-mono text-xs text-ink/60">
              No. {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 font-display text-[clamp(1.9rem,2.6vw,2.4rem)] leading-none font-extrabold [font-stretch:105%]">
              {event.code}
            </p>
          </div>

          <svg
            viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1.5, 0)} 40`}
            preserveAspectRatio="none"
            className="h-10 w-32 transition-transform duration-500 group-hover:translate-x-1 @2xl:h-12 @2xl:w-full"
            aria-hidden
          >
            {
              bars.reduce<{ x: number; els: React.ReactNode[] }>(
                (acc, w, i) => {
                  acc.els.push(
                    <rect
                      key={i}
                      x={acc.x}
                      y={0}
                      width={w}
                      height={40}
                      fill="currentColor"
                    />,
                  );
                  acc.x += w + 1.5;
                  return acc;
                },
                { x: 0, els: [] },
              ).els
            }
          </svg>

          <span className="hidden font-mono text-xs text-ink/60 @2xl:block">
            View event →
          </span>
        </div>
      </Link>
    </div>
  );
}
