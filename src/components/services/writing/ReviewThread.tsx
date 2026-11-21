"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircleFillIcon, CommentIcon, FileIcon, GitPullRequestIcon, KebabHorizontalIcon } from "@primer/octicons-react";

type Line = { n: number; t: string; kind?: "add" | "del" };

const diff: Line[] = [
  { n: 41, t: "## 2. Index your docs" },
  { n: 42, t: "" },
  { n: 43, t: "const client = new VectorClient({ url });", kind: "del" },
  { n: 43, t: "const client = new VectorClient({ url, apiKey });", kind: "add" },
  { n: 44, t: "await client.upsert(\"docs\", { points });" },
  { n: 45, t: "" },
  { n: 46, t: "Search is now lightning fast and scales infinitely.", kind: "del" },
  { n: 46, t: "On our 1M-vector test set, p95 latency stayed under 20 ms.", kind: "add" },
];

const comments: Record<number, { who: string; role: string; body: string; suggestion?: string }> = {
  3: {
    who: "senior-engineer",
    role: "Technical reviewer",
    body: "Cloud clusters reject requests without an API key, so readers copying this would hit a 401. Added it and verified against a live cluster.",
  },
  7: {
    who: "staff-engineer",
    role: "Technical reviewer",
    body: "\"Scales infinitely\" won't survive a Hacker News thread. Swapped in the number we measured while testing the sample.",
    suggestion: "Benchmark script committed to examples/bench.ts",
  },
};

/** A GitHub pull-request review on a blog draft: how every post gets checked by an engineer before it ships. */
export default function ReviewThread() {
  const reduced = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] text-[13px] text-[#e6edf3]">
      <div className="border-b border-[#30363d] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#238636] px-3 py-1 text-[12px] font-medium text-white">
            <GitPullRequestIcon size={14} /> Open
          </span>
          <p className="text-[16px] font-semibold sm:text-[18px]">
            Draft: Build a RAG app in 15 minutes <span className="font-normal text-[#8b949e]">#128</span>
          </p>
        </div>
        <p className="mt-2 text-[#8b949e]">2 reviewers requested changes · all code samples passing</p>
      </div>

      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 font-mono text-[12px]">
        <span className="flex items-center gap-2">
          <FileIcon size={14} className="text-[#8b949e]" /> posts/rag-in-15-minutes.md
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[#3fb950]">+2</span>
          <span className="text-[#f85149]">-2</span>
          <KebabHorizontalIcon size={14} className="text-[#8b949e]" />
        </span>
      </div>

      <div className="font-mono text-[12px] leading-[1.75]">
        {diff.map((l, i) => (
          <div key={i}>
            <div
              className={`flex ${l.kind === "add" ? "bg-[#2ea04326]" : l.kind === "del" ? "bg-[#f8514926]" : ""}`}
            >
              <span className="w-10 shrink-0 pr-2 text-right text-[#6e7681] select-none">{l.n}</span>
              <span className={`w-5 shrink-0 text-center select-none ${l.kind === "add" ? "text-[#3fb950]" : "text-[#f85149]"}`}>
                {l.kind === "add" ? "+" : l.kind === "del" ? "−" : ""}
              </span>
              <span className="min-w-0 pr-4 break-words whitespace-pre-wrap">{l.t || " "}</span>
            </div>
            {comments[i] && (
              <motion.div
                initial={reduced ? false : { opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-y border-[#30363d] bg-[#0d1117] font-sans"
              >
                <div className="m-3 rounded-md border border-[#30363d]">
                  <div className="flex items-center gap-2 border-b border-[#30363d] bg-[#161b22] px-3 py-2 text-[12px]">
                    <span className="grid size-5 place-items-center rounded-full bg-orange text-[9px] font-bold text-ink">
                      {comments[i].who[0].toUpperCase()}
                    </span>
                    <span className="font-semibold">{comments[i].who}</span>
                    <span className="rounded-full border border-[#30363d] px-1.5 text-[11px] text-[#8b949e]">{comments[i].role}</span>
                  </div>
                  <p className="px-3 py-2.5 text-[13px] leading-relaxed">{comments[i].body}</p>
                  {comments[i].suggestion && (
                    <p className="mx-3 mb-3 flex items-center gap-2 rounded-md bg-[#161b22] px-3 py-2 text-[12px] text-[#8b949e]">
                      <CommentIcon size={14} /> {comments[i].suggestion}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-[#30363d] px-4 py-3 text-[12px] text-[#3fb950]">
        <CheckCircleFillIcon size={16} /> All checks have passed: 4 code samples run, links verified, style check clean
      </div>
    </div>
  );
}
