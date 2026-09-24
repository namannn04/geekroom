"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { eventsByDate, formatChip, type EventKind } from "@/data/events";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, reveal } from "@/lib/motion";
import { useLenis } from "@/components/motion/SmoothScroll";

type Filter = "All" | EventKind;
const filters: Filter[] = ["All", "Hackathon", "Meetup", "Hiring"];

const asc = [...eventsByDate].reverse();
const t0 = new Date(`${asc[0].iso}T00:00:00`).getTime();
const t1 = new Date(`${asc[asc.length - 1].iso}T00:00:00`).getTime();
const pos = (iso: string) => (new Date(`${iso}T00:00:00`).getTime() - t0) / (t1 - t0);
// Year ticks after the first event, so the first label never sits on the axis edge
const years = Array.from(new Set(asc.map((e) => e.iso.slice(0, 4)))).filter((y) => pos(`${y}-01-01`) > 0);
const span = [asc[0], asc[asc.length - 1]].map((e) => {
  const c = formatChip(e.iso, true);
  return `${c.day.charAt(0)}${c.day.slice(1).toLowerCase()} ${c.year}`;
});

/**
 * Events as a typographic index: a real date axis on top, then one row per event.
 * Rows draw their rule and lift their text as they scroll in; on pointer devices a
 * slash-cut preview of the event follows the cursor.
 */
export default function EventIndex() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const [axisHover, setAxisHover] = useState<string | null>(null);

  const items = useMemo(
    () => (filter === "All" ? eventsByDate : eventsByDate.filter((e) => e.kind === filter)),
    [filter],
  );
  const visible = new Set(items.map((e) => e.slug));

  // Row reveals, re-run whenever the filtered set changes
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: reveal(row, "top 94%") })
          .from(row.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: "expo.inOut" })
          .from(row.querySelectorAll("[data-lift]"), { yPercent: 110, duration: 0.8, stagger: 0.05, ease: EASE_EXPO }, 0.2);
      });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  // Cursor-following preview (pointer devices only)
  useGSAP(
    () => {
      if (!preview.current || !window.matchMedia("(pointer: fine)").matches) return;
      const x = gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!preview.current) return;
      gsap.to(preview.current, {
        scale: hovered ? 1 : 0.6,
        opacity: hovered ? 1 : 0,
        rotate: hovered ? -4 : 0,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [hovered] },
  );

  const jumpTo = (slug: string) => {
    const el = document.getElementById(`row-${slug}`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -140 });
    else el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const hoveredEvent = eventsByDate.find((e) => e.slug === hovered);

  return (
    <div ref={root}>
      {/* Date axis */}
      <div className="rounded-[1.75rem] bg-ink-2 px-5 pt-5 pb-7 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="label">
            {axisHover ? (
              <span className="text-paper">{eventsByDate.find((e) => e.slug === axisHover)?.title}</span>
            ) : (
              `Timeline · ${span[0]} → ${span[1]}`
            )}
          </p>
          <p className="label tabular-nums">{items.length} shown</p>
        </div>
        <div className="relative mx-2 mt-8 h-10">
          <span className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
          {years.map((yr) => (
            <span
              key={yr}
              className="absolute -top-1 -translate-x-1/2 font-mono text-xs text-subtle"
              style={{ left: `${pos(`${yr}-01-01`) * 100}%` }}
            >
              {yr}
            </span>
          ))}
          {asc.map((e) => {
            const on = visible.has(e.slug);
            const hot = hovered === e.slug || axisHover === e.slug;
            return (
              <button
                key={e.slug}
                type="button"
                aria-label={`Jump to ${e.title}`}
                disabled={!on}
                onClick={() => jumpTo(e.slug)}
                onPointerEnter={() => setAxisHover(e.slug)}
                onPointerLeave={() => setAxisHover(null)}
                className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center disabled:cursor-default"
                style={{ left: `${pos(e.iso) * 100}%` }}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    hot ? "size-4 bg-orange" : on ? "size-2.5 bg-paper" : "size-2 bg-line-strong"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div role="group" aria-label="Filter events" className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
        {filters.map((f) => {
          const count = f === "All" ? eventsByDate.length : eventsByDate.filter((e) => e.kind === f).length;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`group flex min-h-11 items-baseline gap-2 font-display text-2xl font-extrabold uppercase transition-colors md:text-3xl ${
                active ? "text-paper" : "text-subtle hover:text-paper"
              }`}
              style={{ fontStretch: active ? "110%" : "72%", transition: "font-stretch 400ms var(--ease-out), color 200ms" }}
            >
              {f}
              <sup className="font-mono text-xs font-normal">{count}</sup>
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <ol className="mt-8 border-b border-line" onPointerLeave={() => setHovered(null)}>
        {items.map((e) => {
          const chip = formatChip(e.iso, e.approx);
          const n = eventsByDate.indexOf(e) + 1;
          return (
            <li key={e.slug} id={`row-${e.slug}`} data-row className="relative">
              <span data-rule className="absolute inset-x-0 top-0 h-px bg-line-strong" />
              <Link
                href={`/event/${e.slug}`}
                onPointerEnter={() => setHovered(e.slug)}
                onFocus={() => setHovered(e.slug)}
                onBlur={() => setHovered(null)}
                className="group relative -mx-3 grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 overflow-hidden rounded-2xl px-3 py-6 md:-mx-5 md:px-5 md:grid-cols-[3.5rem_1fr_6rem_8rem_9rem] md:py-8"
              >
                {/* Paper fill that sweeps in on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="relative overflow-hidden">
                  <span data-lift className="block font-mono text-sm tabular-nums text-subtle group-hover:text-ink/60">
                    {String(n).padStart(2, "0")}
                  </span>
                </span>
                <span className="relative overflow-hidden pb-1">
                  <span
                    data-lift
                    className="block font-display text-[clamp(1.6rem,5vw,3.75rem)] leading-[0.95] font-extrabold uppercase transition-[font-stretch,color] duration-500 [font-stretch:72%] group-hover:text-ink md:group-hover:[font-stretch:100%]"
                  >
                    {e.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted group-hover:text-ink/70 md:hidden">
                    {e.code} · {e.kind} · {chip.label}
                  </span>
                </span>
                {/* Mobile thumbnail */}
                <span className="relative size-16 overflow-hidden rounded-xl md:hidden">
                  <Image src={e.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="relative hidden overflow-hidden md:block">
                  <span data-lift className="block font-display text-2xl font-extrabold [font-stretch:120%] group-hover:text-ink">
                    {e.code}
                  </span>
                </span>
                <span className="relative hidden overflow-hidden md:block">
                  <span data-lift className="block text-sm text-muted group-hover:text-ink/70">
                    {e.kind}
                  </span>
                </span>
                <span className="relative hidden overflow-hidden text-right md:block">
                  <span data-lift className="block font-mono text-sm tabular-nums text-muted group-hover:text-ink">
                    {chip.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Floating preview */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-[260px] w-[360px] -translate-x-1/2 -translate-y-[115%] opacity-0 [@media(pointer:fine)]:block"
      >
        <div className="relative h-full w-full [clip-path:polygon(0_0,100%_0,86%_100%,0_100%)]">
          {hoveredEvent && (
            <Image src={hoveredEvent.image} alt="" fill sizes="360px" className="object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
