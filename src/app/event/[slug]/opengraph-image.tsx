import { renderOg } from "@/lib/og";
import { events, getEvent, kindLabel } from "@/data/events";

export const alt = "Geek Room event";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = getEvent((await params).slug);
  if (!event) return renderOg({ eyebrow: "Events", title: "Geek Room events" });
  const live = event.status === "live";
  return renderOg({
    eyebrow: live ? `Live now · ${kindLabel(event)}` : kindLabel(event),
    live,
    title: event.title,
    subtitle: `${event.date ?? "Date to be announced"} · ${event.location ?? event.city}`,
    image: event.image,
  });
}
