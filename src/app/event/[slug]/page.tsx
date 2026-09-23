import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Blobs from "@/components/ui/Blobs";
import Reveal from "@/components/ui/Reveal";
import JoinCta from "@/components/ui/JoinCta";
import EventGrid from "@/components/events/EventGrid";
import EventSidebar from "@/components/events/EventSidebar";
import { events, getEvent } from "@/data/events";

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

  const related = events.filter((e) => e.slug !== slug);

  return (
    <div className="relative isolate">
      <Blobs
        className="-z-10 h-[1600px]"
        blobs={[
          { color: "#0fa39a", className: "-left-40 top-[420px] size-[520px] opacity-80" },
          { color: "#1b3be0", className: "left-[20%] top-[800px] size-[600px] opacity-80" },
          { color: "#d0457a", className: "-right-20 top-[500px] size-[560px] opacity-70" },
          { color: "#c9621c", className: "right-[20%] top-[250px] size-[380px] opacity-60" },
        ]}
      />
      <PageHeader title={event.title} />

      <section className="container-x relative z-10 pt-10 md:pt-16">
        <div className="grid gap-5 md:grid-cols-[1fr_380px] lg:gap-10">
          <Reveal className="relative aspect-[800/702] overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <EventSidebar current={event.slug} />
          </Reveal>
        </div>

        <Reveal className="mt-12 max-w-[1000px] text-[15px] leading-relaxed text-fg/85">
          {event.date && (
            <h2 className="font-display text-2xl font-semibold text-fg md:text-3xl">
              {event.title} — ({event.date})
            </h2>
          )}
          {event.tagline && (
            <h2 className="font-display text-2xl font-semibold text-fg md:text-3xl">{event.tagline}</h2>
          )}

          {(event.location || event.register) && (
            <dl className="mt-6 space-y-2">
              {event.location && (
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-fg">Location :</dt>
                  <dd>{event.location}</dd>
                </div>
              )}
              {event.register && (
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-fg">{event.register.label} :</dt>
                  <dd>
                    <a
                      href={event.register.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-teal underline-offset-4 hover:underline"
                    >
                      {event.register.url}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}

          {event.highlights && (
            <ul className="mt-8 list-disc space-y-1 pl-5">
              {event.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div className="mt-6 space-y-4">
            {event.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {event.register && (
            <a
              href={event.register.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bebas mt-8 inline-block rounded-sm bg-fg px-8 py-3.5 text-base text-bg transition-transform hover:scale-105"
            >
              {event.register.label}
            </a>
          )}
        </Reveal>
      </section>

      <section className="container-x relative z-10 pt-24">
        <Reveal>
          <h2 className="heading-lg">Related events</h2>
        </Reveal>
        <div className="mt-10">
          <EventGrid items={related} />
        </div>
      </section>

      <JoinCta />
    </div>
  );
}
