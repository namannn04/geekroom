import Image from "next/image";
import Link from "next/link";
import { barcode, formatChip, kindLabel, type EventItem } from "@/data/events";

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
  const chip = formatChip(event.iso, event.approx);
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
            {/* Most covers are posters, so show the whole image over a blurred fill of itself */}
            <Image
              src={event.image}
              alt=""
              aria-hidden
              fill
              sizes="120px"
              className="scale-125 object-cover opacity-70 blur-2xl"
            />
            {/* Kept clear of the slash so no part of the poster is cut away */}
            <div className="absolute inset-0 bottom-[16%] p-3 pt-12 @2xl:bottom-0 @2xl:right-[16%] @2xl:py-12">
              <div className="relative h-full w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority={priority}
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          </div>
          <span className="absolute left-4 top-4 flex gap-1.5">
            <span className="rounded-full bg-ink px-3 py-1.5 font-mono text-xs text-paper">{kindLabel(event)}</span>
            {event.status === "live" && (
              <span className="flex items-center gap-1.5 rounded-full bg-orange px-3 py-1.5 font-mono text-xs text-ink">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-ink/60" />
                  <span className="relative size-2 rounded-full bg-ink" />
                </span>
                Live
              </span>
            )}
            {event.status === "upcoming" && (
              <span className="rounded-full bg-paper px-3 py-1.5 font-mono text-xs text-ink">Upcoming</span>
            )}
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
            {event.status === "live" ? "Register →" : "View event →"}
          </span>
        </div>
      </Link>
    </div>
  );
}
