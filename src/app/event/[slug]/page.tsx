import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Tag } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import JoinCta from "@/components/ui/JoinCta";
import EventGrid from "@/components/events/EventGrid";
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

  const related = eventsByDate.filter((e) => e.slug !== slug).slice(0, 3);
  const meta = [
    { Icon: CalendarDays, label: "Date", value: event.date ?? "TBA" },
    { Icon: MapPin, label: "Venue", value: event.location ?? event.city },
    { Icon: Tag, label: "Format", value: event.kind },
  ];

  return (
    <>
      <section className="noise relative isolate overflow-hidden pt-32 md:pt-40">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-paper grid-fade absolute inset-0" />
          <span className="absolute -left-20 top-20 size-[520px] rounded-full bg-teal/20 blur-[140px]" />
          <span className="absolute right-0 top-0 size-[460px] rounded-full bg-orange/20 blur-[140px]" />
        </div>

        <div className="shell">
          <Link href="/event" className="btn-ghost !py-2">
            <ArrowLeft className="size-3.5" /> All events
          </Link>
          <Reveal>
            <p className="eyebrow mt-10 flex items-center gap-3">
              <span className="text-orange">{event.kind}</span>
              <span className="h-px w-8 bg-line-strong" />
              {event.city}
            </p>
            <h1 className="display mt-5 max-w-[1100px] text-[clamp(2.8rem,8vw,7.5rem)]">{event.title}</h1>
            {event.tagline && <p className="accent mt-4 text-3xl md:text-4xl">{event.tagline}</p>}
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-line md:aspect-[21/9]">
              <Image src={event.image} alt={event.title} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {meta.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-line bg-ink-2 p-5">
                <dt className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">
                  <Icon className="size-3.5 text-teal" /> {label}
                </dt>
                <dd className="mt-3 font-display text-lg leading-snug font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          {event.register && (
            <a
              href={event.register.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 w-full justify-center lg:hidden"
            >
              {event.register.label} <ArrowUpRight className="size-4" />
            </a>
          )}

          {event.highlights && (
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {event.highlights.map((h, i) => (
                <Reveal key={h} delay={i * 0.05}>
                  <li className="flex items-center gap-4 rounded-2xl border border-line p-5">
                    <span className="font-mono text-xs text-orange">0{i + 1}</span>
                    <span className="font-display text-lg font-bold">{h}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}

          <Reveal className="mt-12 space-y-6 text-lg leading-relaxed text-muted md:text-xl">
            {event.description.map((p, i) => (
              <p key={p} className={i === 0 ? "text-paper" : ""}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Sticky action panel */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-ink-2 p-7">
            <span aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-orange/25 blur-3xl" />
            <p className="eyebrow relative">Take part</p>
            <p className="relative mt-4 font-display text-2xl leading-tight font-bold">
              {event.register ? "Registrations are handled on the event page." : "Stay tuned for the next edition."}
            </p>
            {event.register ? (
              <a
                href={event.register.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary relative mt-7 w-full justify-center"
              >
                {event.register.label} <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <Link href="/contact-us" className="btn-primary relative mt-7 w-full justify-center">
                Get notified <ArrowUpRight className="size-4" />
              </Link>
            )}

            <p className="eyebrow relative mt-9">More events</p>
            <ul className="relative mt-3 divide-y divide-line">
              {eventsByDate
                .filter((e) => e.slug !== slug)
                .map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/event/${e.slug}`}
                      className="group flex items-center justify-between gap-3 py-3 text-sm text-muted transition-colors hover:text-paper"
                    >
                      {e.title}
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <h2 className="display text-[clamp(2.2rem,5vw,4rem)]">
            Related <em>events</em>
          </h2>
        </Reveal>
        <div className="mt-10">
          <EventGrid items={related} />
        </div>
      </section>

      <JoinCta />
    </>
  );
}
