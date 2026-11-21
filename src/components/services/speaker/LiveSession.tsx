"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowBigUp, Radio } from "lucide-react";

const slides = [
  { kicker: "Talk", title: "Shipping agents to production", body: "What broke, what we fixed, and the three evals we run on every deploy." },
  { kicker: "Live demo", title: "From zero to a working agent", body: "npx your-sdk init  →  first tool call in 90 seconds", code: true },
  { kicker: "Try it tonight", title: "Free credits for everyone here", body: "Scan the code, build something, show us at the next meetup." },
];

const seedQuestions = [
  { id: 1, q: "How do you evaluate tool calls without a human in the loop?", votes: 12 },
  { id: 2, q: "Does this work with open models on our own infra?", votes: 9 },
  { id: 3, q: "What's the latency cost of the guardrails?", votes: 7 },
  { id: 4, q: "Can we use it in the hackathon tomorrow?", votes: 4 },
];

const reactions = ["🔥", "👏", "🤯", "🚀", "💡"];

/** A meetup talk in miniature: slides advance, the audience upvotes questions and the Q&A re-sorts live. */
export default function LiveSession() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-120px" });
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [questions, setQuestions] = useState(seedQuestions);
  const [floaters, setFloaters] = useState<{ id: number; e: string; x: number }[]>([]);
  const [voted, setVoted] = useState<number | null>(null);

  // Slides advance on their own
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 5200);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  // The room votes: a random question gains a vote every so often
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => {
      setQuestions((qs) => {
        // Biased toward the least-voted question, so the order keeps changing
        const asc = [...qs].sort((a, b) => a.votes - b.votes);
        const target = asc[Math.floor(Math.random() ** 2 * asc.length)];
        const bump = 1 + Math.floor(Math.random() * 3);
        return qs.map((q) => (q.id === target.id ? { ...q, votes: q.votes + bump } : q));
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  // Reactions float up from the audience
  useEffect(() => {
    if (!inView || reduced) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      const f = { id: n, e: reactions[n % reactions.length], x: 10 + ((n * 37) % 80) };
      setFloaters((fs) => [...fs.slice(-8), f]);
    }, 700);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const sorted = [...questions].sort((a, b) => b.votes - a.votes);
  const s = slides[slide];

  return (
    <div ref={root} className="grid overflow-hidden rounded-[1.75rem] border border-line-strong bg-ink-2 lg:grid-cols-[1.35fr_0.65fr]">
      {/* Stage */}
      <div className="relative border-b border-line p-4 sm:p-6 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange px-3 py-1 font-mono text-[11px] font-semibold text-ink uppercase">
            <Radio className="size-3.5" /> Live
          </span>
          <span className="font-mono text-[11px] text-subtle">Geek Room Meetup · Stage A</span>
        </div>

        <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-paper text-ink">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={reduced ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8"
            >
              <p className="font-mono text-[10px] tracking-[0.12em] text-orange uppercase sm:text-xs">{s.kicker}</p>
              <div>
                <p className="display text-[clamp(1.6rem,4vw,3.2rem)]">{s.title}</p>
                {s.code ? (
                  <p className="mt-3 inline-block rounded-lg bg-ink px-3 py-2 font-mono text-[11px] text-paper sm:text-sm">{s.body}</p>
                ) : (
                  <p className="mt-3 max-w-[28rem] text-sm text-ink/70 sm:text-base">{s.body}</p>
                )}
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-ink/50">
                <span>your-company.dev</span>
                <span>
                  {slide + 1} / {slides.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <AnimatePresence>
              {floaters.map((f) => (
                <motion.span
                  key={f.id}
                  className="absolute bottom-2 text-2xl"
                  style={{ left: `${f.x}%` }}
                  initial={{ y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ y: -160, opacity: [0, 1, 0], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.4, ease: "easeOut" }}
                >
                  {f.e}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Audience */}
        <div className="mt-4 flex items-end justify-center gap-1.5 sm:gap-2" aria-hidden>
          {Array.from({ length: 22 }, (_, i) => (
            <motion.span
              key={i}
              className="w-3 rounded-t-full bg-ink-3 sm:w-4"
              style={{ height: 14 + ((i * 7) % 12) }}
              animate={reduced ? {} : { y: [0, -3, 0] }}
              transition={{ duration: 1.6 + (i % 4) * 0.3, repeat: Infinity, delay: (i % 5) * 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Q&A */}
      <div className="p-4 sm:p-6">
        <div className="flex items-baseline justify-between">
          <p className="label">Audience Q&amp;A</p>
          <p className="font-mono text-[11px] text-subtle">Top questions first</p>
        </div>
        <ul className="mt-4 space-y-2">
          {sorted.map((q, i) => (
            <motion.li key={q.id} layout={!reduced} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
              <div className={`flex items-start gap-3 rounded-xl border p-3 ${i === 0 ? "border-orange bg-orange/10" : "border-line"}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (voted === q.id) return;
                    setVoted(q.id);
                    setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, votes: x.votes + 1 } : x)));
                  }}
                  aria-label={`Upvote: ${q.q}`}
                  aria-pressed={voted === q.id}
                  className={`flex shrink-0 flex-col items-center rounded-lg border px-2 py-1 transition-colors ${
                    voted === q.id ? "border-orange text-orange" : "border-line-strong text-muted hover:text-paper"
                  }`}
                >
                  <ArrowBigUp className="size-4" />
                  <span className="font-mono text-xs tabular-nums">{q.votes}</span>
                </button>
                <p className="text-sm leading-snug text-paper">{q.q}</p>
              </div>
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[11px] text-subtle">Illustrative session. Upvote a question to join in.</p>
      </div>
    </div>
  );
}
