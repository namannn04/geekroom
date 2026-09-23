import Reveal from "@/components/ui/Reveal";
import type { EventItem } from "@/data/events";
import EventCard from "./EventCard";

export default function EventGrid({ items }: { items: EventItem[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
      {items.map((e, i) => (
        <Reveal key={e.slug} delay={(i % 3) * 0.1}>
          <EventCard event={e} />
        </Reveal>
      ))}
    </div>
  );
}
