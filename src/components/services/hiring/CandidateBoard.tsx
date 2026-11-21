"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, ExternalLink, PlayCircle } from "lucide-react";
import { MarkGithubIcon } from "@primer/octicons-react";

const rubric = ["Working product", "Code quality", "Problem solving", "Communication"] as const;

type Candidate = { id: string; role: string; stack: string[]; scores: number[]; project: string };

/* Anonymised on purpose: you see the work first, the resume later */
const candidates: Candidate[] = [
  { id: "A17", role: "Backend", stack: ["Go", "Postgres"], scores: [9, 8, 9, 7], project: "Rate-limited payouts API with retries" },
  { id: "C04", role: "Full stack", stack: ["Next.js", "tRPC"], scores: [9, 9, 8, 9], project: "Battery-swap station finder with live queue" },
  { id: "B22", role: "ML", stack: ["Python", "PyTorch"], scores: [8, 7, 9, 8], project: "Demand forecasting with an eval harness" },
  { id: "D09", role: "Frontend", stack: ["React", "Tailwind"], scores: [8, 8, 7, 9], project: "Accessible ops dashboard, 98 Lighthouse" },
  { id: "E31", role: "Backend", stack: ["Node", "Redis"], scores: [7, 8, 8, 6], project: "Event-driven invoice reconciler" },
];

/**
 * Scores arrive one rubric line at a time and the shortlist re-sorts as they do.
 * Click a candidate to open their scorecard.
 */
export default function CandidateBoard() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState("C04");

  useEffect(() => {
    if (reduced) {
      setRound(rubric.length);
      return;
    }
    if (!inView || round >= rubric.length) return;
    const id = window.setTimeout(() => setRound((r) => r + 1), round === 0 ? 400 : 1300);
    return () => window.clearTimeout(id);
  }, [inView, round, reduced]);

  const ranked = useMemo(
    () =>
      candidates
        .map((c) => ({ ...c, total: c.scores.slice(0, round).reduce((a, b) => a + b, 0) }))
        .sort((a, b) => b.total - a.total),
    [round],
  );
  const pick = candidates.find((c) => c.id === selected)!;
  const max = rubric.length * 10;

  return (
    <div ref={root} className="grid overflow-hidden rounded-[1.75rem] border border-line-strong bg-ink-2 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Shortlist */}
      <div className="border-b border-line p-5 sm:p-7 lg:border-r lg:border-b-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="label">Shortlist · Backend and full stack roles</p>
          <p className="font-mono text-xs text-orange">
            {round < rubric.length ? `Scoring: ${rubric[round]}` : "Scoring complete"}
          </p>
        </div>
        <ul className="mt-5 space-y-2">
          {ranked.map((c, i) => {
            const active = c.id === selected;
            const top = round === rubric.length && i < 3;
            return (
              <motion.li key={c.id} layout={!reduced} transition={{ type: "spring", stiffness: 320, damping: 32 }}>
                <button
                  type="button"
                  onClick={() => setSelected(c.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    active ? "border-orange bg-ink" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className="w-5 font-mono text-xs text-subtle tabular-nums">{i + 1}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-3 font-mono text-[11px] text-paper">{c.id}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-paper">{c.project}</span>
                    <span className="block font-mono text-[11px] text-subtle">
                      {c.role} · {c.stack.join(", ")}
                    </span>
                  </span>
                  <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-ink-3 sm:block">
                    <motion.span className="block h-full rounded-full bg-orange" animate={{ width: `${(c.total / max) * 100}%` }} transition={{ duration: 0.6 }} />
                  </span>
                  <span className="w-8 text-right font-display text-xl font-bold tabular-nums">{c.total}</span>
                  <AnimatePresence>
                    {top && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid size-5 place-items-center rounded-full bg-[#238636] text-white" title="Interview">
                        <Check className="size-3" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.li>
            );
          })}
        </ul>
        <p className="mt-4 font-mono text-[11px] text-subtle">Illustrative candidates. Top three go to interview.</p>
      </div>

      {/* Scorecard */}
      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div key={pick.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between">
              <p className="label">Scorecard</p>
              <span className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[11px] text-muted">Candidate {pick.id}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl leading-tight font-bold [font-stretch:90%]">{pick.project}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
                <MarkGithubIcon size={14} /> repo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
                <PlayCircle className="size-3.5" /> 3 min demo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
                <ExternalLink className="size-3.5" /> live app
              </span>
            </div>
            <ul className="mt-7 space-y-4">
              {rubric.map((r, i) => {
                const scored = i < round;
                return (
                  <li key={r}>
                    <div className="flex justify-between text-sm">
                      <span className={scored ? "text-paper" : "text-subtle"}>{r}</span>
                      <span className="font-mono text-xs tabular-nums text-muted">{scored ? `${pick.scores[i]}/10` : "–"}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-3">
                      <motion.span
                        className="block h-full rounded-full bg-orange"
                        initial={{ width: 0 }}
                        animate={{ width: scored ? `${pick.scores[i] * 10}%` : 0 }}
                        transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-7 rounded-xl border-l-4 border-orange bg-orange/10 px-4 py-3 text-sm leading-relaxed text-paper">
              <span className="font-semibold">Reviewer note:</span> shipped a working build with tests and a clear README. Ask about scaling the queue in the interview.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
