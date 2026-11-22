"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import PartnerMark from "@/components/partners/PartnerMark";
import { directory, partnerCategories } from "@/data/partners";

/** Every partner, filterable by category and searchable by name or role. */
export default function PartnerDirectory() {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(partnerCategories.map((c) => [c.slug, directory.filter((p) => p.category === c.slug).length])),
    [],
  );

  const q = query.trim().toLowerCase();
  const visible = directory.filter(
    (p) => (!category || p.category === category) && (!q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)),
  );
  // Group by category, in category order, so "All" still reads as a structured directory
  const groups = partnerCategories
    .map((c) => ({ ...c, items: visible.filter((p) => p.category === c.slug) }))
    .filter((g) => g.items.length);

  return (
    <div>
      <div className="flex flex-col-reverse gap-4">
        <div role="tablist" aria-label="Partner categories" className="flex flex-wrap gap-2">
          {[null, ...partnerCategories.map((c) => c.slug)].map((slug) => {
            const active = category === slug;
            const title = slug ? partnerCategories.find((c) => c.slug === slug)!.title : "All partners";
            return (
              <button
                key={slug ?? "all"}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setCategory(slug)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active ? "border-orange bg-orange text-ink" : "border-line-strong text-muted hover:border-paper hover:text-paper"
                }`}
              >
                {title}{" "}
                <span className={`font-mono text-xs ${active ? "text-ink/70" : "text-subtle"}`}>{slug ? counts[slug] : directory.length}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block sm:max-w-sm">
          <span className="sr-only">Search partners</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search partners"
            className="w-full rounded-full border border-line-strong bg-ink py-2.5 pr-10 pl-10 text-sm text-paper outline-none transition-colors placeholder:text-subtle focus:border-orange [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 text-subtle hover:text-paper">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      <p className="mt-6 font-mono text-xs text-subtle" aria-live="polite">
        Showing {visible.length} of {directory.length}
      </p>

      <div className="mt-6 space-y-14">
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.map((g) => (
            <motion.section
              key={g.slug}
              layout={!reduced}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-labelledby={`cat-${g.slug}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
                <h3 id={`cat-${g.slug}`} className="display text-[clamp(1.6rem,3vw,2.4rem)]">
                  {g.title}
                </h3>
                <p className="text-sm text-muted">{g.blurb}</p>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {g.items.map((p) => (
                    <motion.li
                      key={p.name}
                      layout={!reduced}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="group flex flex-col rounded-[1.25rem] border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong"
                    >
                      <div className="grid h-16 place-items-start content-center overflow-hidden">
                        <PartnerMark name={p.name} logo={p.logo} mark={p.mark} invert={p.invert} />
                      </div>
                      {p.logo && !p.mark && <p className="mt-3 font-display text-lg leading-tight font-bold [font-stretch:90%]">{p.name}</p>}
                      <p className={`${p.logo && !p.mark ? "mt-1" : "mt-3"} flex-1 text-sm leading-relaxed text-muted`}>{p.role}</p>
                      {p.link && (
                        <Link
                          href={p.link.href}
                          className="mt-4 inline-flex w-fit items-center gap-1 rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-orange hover:text-orange"
                        >
                          {p.link.label} <ArrowUpRight className="size-3" />
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>
        {groups.length === 0 && (
          <p className="rounded-[1.25rem] border border-dashed border-line-strong p-10 text-center text-muted">
            No partners match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
