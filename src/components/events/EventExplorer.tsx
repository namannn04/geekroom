"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import EventCard from "./EventCard";
import { eventsByDate, type EventKind } from "@/data/events";

type Filter = "All" | EventKind;
const filters: Filter[] = ["All", "Hackathon", "Meetup"];

/** Filterable, animated grid of all events. */
export default function EventExplorer() {
  const [filter, setFilter] = useState<Filter>("All");
  const items = useMemo(
    () => (filter === "All" ? eventsByDate : eventsByDate.filter((e) => e.kind === filter)),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div role="tablist" aria-label="Filter events" className="flex gap-2">
          {filters.map((f) => {
            const count = f === "All" ? eventsByDate.length : eventsByDate.filter((e) => e.kind === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-paper"
                }`}
              >
                {active && (
                  <motion.span layoutId="event-filter" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">
                  {f} <span className={active ? "text-ink/50" : "text-subtle"}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Sorted by date · newest first</p>
      </div>

      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((e) => (
            <motion.div
              key={e.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              <EventCard event={e} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
