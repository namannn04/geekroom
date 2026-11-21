"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** End of the given day in India Standard Time */
const endOfDayIST = (iso: string) => new Date(`${iso}T23:59:59+05:30`).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { label: "Days", value: Math.floor(s / 86400) },
    { label: "Hours", value: Math.floor((s % 86400) / 3600) },
    { label: "Mins", value: Math.floor((s % 3600) / 60) },
    { label: "Secs", value: s % 60 },
  ];
}

/** Live countdown to a deadline. Renders nothing on the server, and nothing once the deadline has passed. */
export default function Countdown({ iso, label }: { iso: string; label: string }) {
  const target = endOfDayIST(iso);
  const reduced = useReducedMotion();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null || now >= target) return null;

  return (
    <div className="rounded-[1.75rem] border border-line-strong bg-ink-2 p-6 md:p-7" role="timer" aria-label={`${label} ${parts(target - now)[0].value} days`}>
      <p className="flex items-center gap-2 font-mono text-xs text-orange">
        <span className="size-1.5 animate-pulse rounded-full bg-orange" /> {label}
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {parts(target - now).map((p) => (
          <div key={p.label} className="rounded-xl bg-ink p-3 text-center">
            <div className="relative h-[1.1em] overflow-hidden font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none font-extrabold tabular-nums [font-stretch:80%]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={p.value}
                  className="block"
                  initial={reduced ? false : { y: "-100%" }}
                  animate={{ y: 0 }}
                  exit={reduced ? { opacity: 0 } : { y: "100%" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {String(p.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.06em] text-subtle uppercase">{p.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
