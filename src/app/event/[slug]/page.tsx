import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import JoinCta from "@/components/ui/JoinCta";
import EventHero from "@/components/events/EventHero";
import EventTicket from "@/components/events/EventTicket";
import { events, eventsByDate, getEvent } from "@/data/events";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return { title: event.title, description: event.description[0] };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const others = eventsByDate.filter((e) => e.slug !== slug);
  const related = others.slice(0, 2);
  const meta = [
    { label: "Date", value: event.date ?? "To be announced" },
    { label: "Venue", value: event.location ?? event.city },
    { label: "Format", value: event.kind },
  ];

  return (
    <>
      <section className="shell pt-32 md:pt-40">
        <Link href="/event" className="btn-ghost mb-10 !py-2">
          <ArrowLeft className="size-3.5" /> All events
        </Link>
        <EventHero event={event} />
      </section>

      <section className="shell grid gap-14 py-16 md:py-24 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <dl className="grid border-t border-line sm:grid-cols-3">
            {meta.map((m, i) => (
              <div key={m.label} className={`border-b border-line py-5 sm:pr-6 ${i ? "sm:border-l sm:pl-6" : ""}`}>
                <dt className="label">{m.label}</dt>
                <dd className="mt-2 font-display text-lg leading-snug font-bold [font-stretch:90%]">{m.value}</dd>
              </div>
            ))}
          </dl>

          {event.register && (
            <a href={event.register.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full justify-center lg:hidden">
              {event.register.label} <ArrowUpRight className="size-4" />
            </a>
          )}

          {event.highlights && (
            <ul className="mt-12 border-t border-line">
              {event.highlights.map((h, i) => (
                <li key={h} className="flex items-baseline gap-5 border-b border-line py-5">
                  <span className="font-mono text-sm text-orange tabular-nums">0{i + 1}</span>
                  <span className="font-display text-2xl font-bold [font-stretch:90%]">{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 max-w-[40rem] space-y-6 text-lg leading-relaxed text-muted md:text-xl">
            {event.description.map((p, i) => (
              <p key={p} className={i === 0 ? "text-paper" : ""}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-[1.75rem] bg-orange p-7 text-ink">
            <p className="display text-3xl">{event.register ? "Take part" : "Next edition"}</p>
            <p className="mt-3 leading-relaxed">
              {event.register
                ? "Registration and schedules live on the official event page."
                : "This edition has wrapped. Tell us you're interested and we'll ping you for the next one."}
            </p>
            {event.register ? (
              <a href={event.register.url} target="_blank" rel="noopener noreferrer" className="btn mt-6 w-full justify-center bg-ink text-paper hover:bg-ink-3">
                {event.register.label} <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <Link href="/contact-us" className="btn mt-6 w-full justify-center bg-ink text-paper hover:bg-ink-3">
                Get notified <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>

          <p className="label mt-10">More events</p>
          <ul className="mt-3 border-t border-line">
            {others.map((e) => (
              <li key={e.slug} className="border-b border-line">
                <Link
                  href={`/event/${e.slug}`}
                  className="group flex min-h-11 items-center justify-between gap-3 py-3 text-muted transition-colors hover:text-paper"
                >
                  <span>{e.title}</span>
                  <span className="font-mono text-xs text-subtle group-hover:text-orange">{e.code}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="shell pb-24 md:pb-32">
        <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">
          Up <em>next</em>
        </h2>
        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {related.map((e) => (
            <EventTicket key={e.slug} event={e} index={eventsByDate.indexOf(e)} />
          ))}
        </div>
      </section>

      <JoinCta />
    </>
  );
}
