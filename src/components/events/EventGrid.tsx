import Reveal from "@/components/ui/Reveal";
import type { EventItem } from "@/data/events";
import EventCard from "./EventCard";

export default function EventGrid({ items }: { items: EventItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e, i) => (
        <Reveal key={e.slug} delay={(i % 3) * 0.08}>
          <EventCard event={e} className="h-full" />
        </Reveal>
      ))}
    </div>
  );
}
