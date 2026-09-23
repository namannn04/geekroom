import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/data/events";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/event/${event.slug}`} className="group relative block aspect-[393/460] overflow-hidden bg-surface">
      <Image
        src={event.image}
        alt={event.title}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 flex min-h-[25%] items-center bg-gradient-to-t from-black/90 via-black/70 to-black/40 px-6 py-5 backdrop-blur-[2px]">
        <h3 className="font-display text-xl font-medium transition-transform duration-300 group-hover:translate-x-1 md:text-[22px]">
          {event.title}
        </h3>
      </div>
    </Link>
  );
}
