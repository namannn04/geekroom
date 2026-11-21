"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Clock, Gavel, Megaphone, Trophy, Users, Filter } from "lucide-react";

const phases = [
  { key: "announce", label: "Announce", icon: Megaphone, caption: "Your brand and problem statements go out to 150K+ builders." },
  { key: "register", label: "Registrations", icon: Users, caption: "Registrations climb as the campaign runs across every channel." },
  { key: "shortlist", label: "Shortlist", icon: Filter, caption: "We read every profile and shortlist the teams worth flying in." },
  { key: "build", label: "Build", icon: Clock, caption: "Teams build with your tools, mentors from your team on the floor." },
  { key: "judge", label: "Judging", icon: Gavel, caption: "Your judges score on a shared rubric. Scores update live." },
  { key: "finale", label: "Finale", icon: Trophy, caption: "Winners on stage at your office, content out the same day." },
] as const;

const STEP_MS = 4200;

/** A hackathon in six phases, auto-playing while on screen. Click a phase to jump to it. */
export default function HackathonSimulator() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-120px" });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!inView || !auto || reduced) return;
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % phases.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [phase, inView, auto, reduced]);

  const current = phases[phase];

  return (
    <div ref={root} className="overflow-hidden rounded-[1.75rem] border border-line-strong bg-ink-2">
      {/* Phase rail */}
      <div role="tablist" aria-label="Hackathon phases" className="grid grid-cols-3 border-b border-line sm:grid-cols-6">
        {phases.map((p, i) => {
          const Icon = p.icon;
          const active = i === phase;
          return (
            <button
              key={p.key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => {
                setPhase(i);
                setAuto(false);
              }}
              className={`relative flex items-center gap-2 border-line px-3 py-4 text-left transition-colors sm:px-4 [&:not(:last-child)]:border-r ${
                active ? "text-paper" : "text-subtle hover:text-paper"
              }`}
            >
              <Icon className={`size-4 shrink-0 ${active ? "text-orange" : ""}`} />
              <span className="font-mono text-[11px] tracking-[0.06em] uppercase">{p.label}</span>
              {active && (
                <motion.span
                  key={`bar-${phase}-${auto}`}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-orange"
                  initial={{ scaleX: auto && !reduced ? 0 : 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: auto && !reduced ? STEP_MS / 1000 : 0, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="font-mono text-xs text-orange">Phase 0{phase + 1} / 06</p>
          <AnimatePresence mode="wait">
            <motion.div key={current.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <h3 className="display mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)]">{current.label}</h3>
              <p className="mt-3 max-w-[24rem] leading-relaxed text-muted">{current.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line bg-ink p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {current.key === "announce" && <Announce />}
              {current.key === "register" && <Register />}
              {current.key === "shortlist" && <Shortlist />}
              {current.key === "build" && <Build />}
              {current.key === "judge" && <Judge />}
              {current.key === "finale" && <Finale />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 font-mono text-[11px] text-subtle sm:px-8">
        Illustrative walkthrough. Shortlist ratios follow Code Cubicle 5.0: 3,741 registrations, 250 teams shortlisted, 15 in the finale.
      </p>
    </div>
  );
}

function useCount(to: number, duration = 2.6) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) return;
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    return () => c.stop();
  }, [to, duration, reduced]);
  return Math.round(v);
}

function Announce() {
  return (
    <div className="relative grid h-full place-items-center">
      <motion.div
        initial={{ rotate: -4, y: 20 }}
        animate={{ rotate: -2, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[22rem] rounded-2xl bg-orange p-6 text-ink shadow-[0_30px_80px_-30px_rgba(255,90,31,0.6)]"
      >
        <p className="font-mono text-[11px] tracking-[0.1em] uppercase">Geek Room × Your Company</p>
        <p className="display mt-4 text-5xl">Your hack 2027</p>
        <p className="mt-2 text-sm">48 hours · Finale at your office</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {["AI agents", "Dev tools", "Fintech", "Open track"].map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="rounded-full border border-ink/30 px-2.5 py-1 font-mono text-[10px] uppercase"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </motion.div>
      {["WhatsApp", "LinkedIn", "Instagram", "Newsletter"].map((c, i) => (
        <motion.span
          key={c}
          className="absolute rounded-full border border-line-strong bg-ink-2 px-3 py-1 font-mono text-[10px] text-muted uppercase"
          style={{ top: ["8%", "14%", "80%", "86%"][i], [i % 2 ? "right" : "left"]: "4%" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.15 }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}

const channels = [
  { label: "Community channels", share: 0.38 },
  { label: "Campus chapters", share: 0.24 },
  { label: "LinkedIn and Instagram", share: 0.21 },
  { label: "Newsletter", share: 0.17 },
];

function Register() {
  const n = useCount(3741);
  return (
    <div>
      <p className="label">Registrations</p>
      <p className="display mt-1 text-6xl tabular-nums">{n.toLocaleString("en-IN")}</p>
      <div className="mt-5 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
        {Array.from({ length: 80 }, (_, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-full bg-paper"
            initial={{ opacity: 0.08 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: (i / 80) * 2.4, duration: 0.2 }}
          />
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {channels.map((c, i) => (
          <li key={c.label} className="grid grid-cols-[9.5rem_1fr] items-center gap-3 text-xs text-muted">
            <span className="truncate">{c.label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-ink-3">
              <motion.span
                className="block h-full rounded-full bg-orange"
                initial={{ width: 0 }}
                animate={{ width: `${c.share * 100 * 2.2}%` }}
                transition={{ delay: 0.3 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shortlist() {
  // 6 rows of 25 = 150 cells; ~7% lit for the shortlist, 3 brightest for the finale picks
  const lit = new Set([3, 17, 22, 38, 41, 55, 63, 70, 84, 92, 101, 117, 128, 136, 144]);
  const final = new Set([22, 70, 128]);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label">Profile review</p>
        <p className="font-mono text-xs text-orange">250 / 3,741 teams</p>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(25,minmax(0,1fr))] gap-1">
        {Array.from({ length: 150 }, (_, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-[3px]"
            initial={{ backgroundColor: "rgba(238,236,230,0.18)" }}
            animate={{
              backgroundColor: final.has(i) ? "#ff5a1f" : lit.has(i) ? "rgba(255,90,31,0.55)" : "rgba(238,236,230,0.06)",
              scale: final.has(i) ? [1, 1.35, 1] : 1,
            }}
            transition={{ delay: 0.3 + (i % 25) * 0.03 + (final.has(i) ? 1.2 : 0), duration: 0.5 }}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px] bg-[rgba(255,90,31,0.55)]" /> Shortlisted
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px] bg-orange" /> Finale
        </span>
      </div>
    </div>
  );
}

const commits = [
  { team: "Null Pointers", msg: "feat: agent calls your API" },
  { team: "Kernel Panic", msg: "fix: stream tokens to UI" },
  { team: "Async Await", msg: "deploy: demo is live" },
  { team: "404 Sleep", msg: "feat: eval dashboard" },
  { team: "Merge Conflict", msg: "docs: README + demo GIF" },
];

function Build() {
  const reduced = useReducedMotion();
  const [secs, setSecs] = useState(24 * 3600);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setSecs((s) => Math.max(0, s - 97)), 30);
    return () => window.clearInterval(id);
  }, [reduced]);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div>
      <p className="label">Time left</p>
      <p className="display mt-1 text-6xl tabular-nums">
        {hh}
        <span className="text-orange">:</span>
        {mm}
        <span className="text-orange">:</span>
        {ss}
      </p>
      <ul className="mt-5 space-y-2 font-mono text-xs">
        {commits.map((c, i) => (
          <motion.li
            key={c.team}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.5 }}
            className="flex items-center gap-3 rounded-lg border border-line px-3 py-2"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-[#3fb950]" />
            <span className="w-28 shrink-0 truncate text-paper">{c.team}</span>
            <span className="truncate text-muted">{c.msg}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const teams = [
  { team: "Async Await", scores: [9, 8, 9] },
  { team: "Null Pointers", scores: [8, 9, 8] },
  { team: "Kernel Panic", scores: [7, 8, 9] },
  { team: "404 Sleep", scores: [8, 7, 7] },
];

function Judge() {
  const reduced = useReducedMotion();
  const [round, setRound] = useState(reduced ? 3 : 0);
  useEffect(() => {
    if (reduced || round >= 3) return;
    const id = window.setTimeout(() => setRound((r) => r + 1), 900);
    return () => window.clearTimeout(id);
  }, [round, reduced]);
  const rows = teams
    .map((t) => ({ ...t, total: t.scores.slice(0, round).reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label">Live scoreboard</p>
        <p className="font-mono text-xs text-subtle">{["Waiting…", "Impact", "+ Use of your tools", "+ Execution"][round]}</p>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <motion.li key={r.team} layout={!reduced} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex items-center gap-3 rounded-xl border border-line bg-ink-2 px-4 py-3">
            <span className={`font-mono text-xs ${i === 0 && round > 0 ? "text-orange" : "text-subtle"}`}>0{i + 1}</span>
            <span className="flex-1 truncate">{r.team}</span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-3">
              <motion.span className="block h-full rounded-full bg-orange" animate={{ width: `${(r.total / 30) * 100}%` }} transition={{ duration: 0.6 }} />
            </span>
            <span className="w-8 text-right font-display text-xl font-bold tabular-nums">{r.total}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Finale() {
  const podium = [
    { team: "Null Pointers", place: 2, h: "h-24" },
    { team: "Async Await", place: 1, h: "h-36" },
    { team: "Kernel Panic", place: 3, h: "h-16" },
  ];
  return (
    <div className="relative flex h-full min-h-[270px] items-end justify-center gap-3">
      {Array.from({ length: 18 }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute top-0 size-1.5 rounded-[1px]"
          style={{ left: `${5 + ((i * 53) % 90)}%`, background: i % 3 ? "var(--orange)" : "var(--paper)" }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 220, opacity: [0, 1, 0], rotate: 360 }}
          transition={{ duration: 2.2, delay: 0.6 + (i % 6) * 0.15, repeat: Infinity, repeatDelay: 0.8 }}
        />
      ))}
      {podium.map((p, i) => (
        <div key={p.team} className="flex w-1/3 max-w-[8rem] flex-col items-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="mb-2 truncate text-center text-xs text-muted">
            {p.team}
          </motion.p>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.15 * p.place, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`grid w-full origin-bottom place-items-center rounded-t-xl ${p.place === 1 ? "bg-orange text-ink" : "bg-ink-3 text-paper"} ${p.h}`}
          >
            <span className="display text-4xl">{p.place}</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
