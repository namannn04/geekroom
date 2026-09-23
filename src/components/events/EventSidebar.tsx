import Link from "next/link";
import { events } from "@/data/events";

export default function EventSidebar({ current }: { current: string }) {
  return (
    <nav aria-label="All events" className="flex h-full flex-col justify-center gap-4 bg-surface p-8 md:p-10">
      {events.map((e) => {
        const active = e.slug === current;
        return (
          <Link
            key={e.slug}
            href={`/event/${e.slug}`}
            aria-current={active ? "page" : undefined}
            className={`btn-bebas rounded-sm border px-4 py-2.5 text-center text-sm transition-colors ${
              active ? "border-white/60 text-fg" : "border-white/25 text-subtle hover:border-white/60 hover:text-fg"
            }`}
          >
            {e.title}
          </Link>
        );
      })}
    </nav>
  );
}
