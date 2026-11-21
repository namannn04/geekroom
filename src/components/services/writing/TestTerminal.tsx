"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const lines: { t: string; c: string; pause?: number }[] = [
  { t: "$ npm run check:samples", c: "text-[#e6edf3]", pause: 500 },
  { t: "", c: "" },
  { t: " RUN  posts/rag-in-15-minutes.md", c: "text-[#8b949e]", pause: 300 },
  { t: " ✓ sample 1 · bash · install          0.9s", c: "text-[#3fb950]" },
  { t: " ✓ sample 2 · ts · create client       0.4s", c: "text-[#3fb950]" },
  { t: " ✓ sample 3 · ts · index 1,000 docs    3.1s", c: "text-[#3fb950]" },
  { t: " ✓ sample 4 · ts · query + rerank      0.6s", c: "text-[#3fb950]", pause: 400 },
  { t: "", c: "" },
  { t: " ✓ 12 links resolve · 0 dead", c: "text-[#3fb950]" },
  { t: " ✓ versions pinned · your-sdk@2.4.0", c: "text-[#3fb950]", pause: 300 },
  { t: "", c: "" },
  { t: " Samples  4 passed (4)", c: "text-[#e6edf3] font-semibold" },
  { t: " Ready for technical review ✦", c: "text-orange font-semibold" },
];

/** Every code sample in a draft runs in CI before a reviewer ever sees it. */
export default function TestTerminal() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduced) {
      setShown(lines.length);
      return;
    }
    if (!inView || shown >= lines.length) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), (lines[shown - 1]?.pause ?? 0) + 160);
    return () => window.clearTimeout(id);
  }, [inView, shown, reduced]);

  return (
    <div ref={root} className="overflow-hidden rounded-xl border border-[#30363d] bg-[#010409]">
      <div className="flex items-center gap-2 border-b border-[#30363d] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-[#8b949e]">ci · check-samples</span>
      </div>
      <div className="min-h-[340px] overflow-x-auto p-4 font-mono text-[12px] leading-[1.8] sm:p-5 sm:text-[13px]">
        {lines.slice(0, shown).map((l, i) => (
          <motion.p
            key={i}
            initial={reduced ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={`whitespace-pre ${l.c}`}
          >
            {l.t || " "}
          </motion.p>
        ))}
        {shown < lines.length && <span className="inline-block h-4 w-2 animate-pulse bg-[#e6edf3]" />}
      </div>
    </div>
  );
}
