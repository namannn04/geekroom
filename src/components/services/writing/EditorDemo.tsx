"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { FileIcon, GitBranchIcon } from "@primer/octicons-react";

type Kind = "h1" | "meta" | "p" | "h2" | "code" | "tip";
type Block = { kind: Kind; md: string; lang?: string; body?: string };

const blocks: Block[] = [
  { kind: "h1", md: "# Build a RAG app in 15 minutes" },
  { kind: "meta", md: "> Written by a senior engineer · 8 min read" },
  { kind: "p", md: "Most RAG tutorials stop at \"it works on my laptop\". This one ends with something you can ship." },
  { kind: "h2", md: "## 1. Install the client" },
  { kind: "code", lang: "bash", body: "npm i your-sdk", md: "```bash\nnpm i your-sdk\n```" },
  { kind: "h2", md: "## 2. Index your docs" },
  {
    kind: "code",
    lang: "ts",
    body: 'const client = new Client({ apiKey });\nawait client.index("docs", chunks);',
    md: '```ts\nconst client = new Client({ apiKey });\nawait client.index("docs", chunks);\n```',
  },
  { kind: "tip", md: "**Tip:** chunk by heading, not by character count." },
];

const source = blocks.map((b) => b.md).join("\n\n");
// Character offset where each block finishes typing
const ends = blocks.reduce<number[]>((acc, b, i) => [...acc, (acc[i - 1] ?? -2) + 2 + b.md.length], []);

const lineColor = (line: string, inCode: boolean) => {
  if (line.startsWith("```")) return "text-[#8b949e]";
  if (inCode) return "text-[#a5d6ff]";
  if (line.startsWith("# ") || line.startsWith("## ")) return "text-orange font-semibold";
  if (line.startsWith(">")) return "text-[#8b949e] italic";
  if (line.startsWith("**")) return "text-[#e3b341]";
  return "text-[#e6edf3]";
};

/** Markdown typed on the left, the finished blog post rendering on the right. Loops while on screen. */
export default function EditorDemo() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-120px" });
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPos(source.length);
      return;
    }
    if (!inView) return;
    const done = pos >= source.length;
    const id = window.setTimeout(
      () => setPos((p) => (p >= source.length ? 0 : Math.min(source.length, p + (source[p] === "\n" ? 1 : 2)))),
      done ? 3200 : 22,
    );
    return () => window.clearTimeout(id);
  }, [pos, inView, reduced]);

  const typed = source.slice(0, pos);
  const lines = typed.split("\n");
  let inCode = false;

  return (
    <div ref={root} className="grid overflow-hidden rounded-[1.25rem] border border-line-strong bg-[#0d1117] lg:grid-cols-2 [&>*]:min-w-0">
      {/* Editor */}
      <div className="flex min-h-[460px] flex-col border-b border-[#30363d] lg:border-r lg:border-b-0">
        <div className="flex items-center gap-4 border-b border-[#30363d] bg-[#010409] px-4 py-2.5 text-[12px] text-[#8b949e]">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex items-center gap-1.5 rounded-t-md border-t-2 border-orange bg-[#0d1117] px-3 py-1 text-[#e6edf3]">
            <FileIcon size={12} /> rag-in-15-minutes.md
          </span>
          <span className="ml-auto hidden items-center gap-1 sm:flex">
            <GitBranchIcon size={12} /> draft/rag-tutorial
          </span>
        </div>
        <pre className="flex-1 overflow-hidden p-4 font-mono text-[12.5px] leading-[1.7] sm:text-[13px]">
          {lines.map((line, i) => {
            const fence = line.startsWith("```");
            const color = lineColor(line, inCode && !fence);
            if (fence) inCode = !inCode;
            const last = i === lines.length - 1;
            return (
              <div key={i} className="flex">
                <span className="w-8 shrink-0 pr-3 text-right text-[#484f58] select-none">{i + 1}</span>
                <span className={`whitespace-pre-wrap ${color}`}>
                  {line}
                  {last && <span className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-orange" />}
                </span>
              </div>
            );
          })}
        </pre>
        <div className="flex justify-between border-t border-[#30363d] bg-[#010409] px-4 py-1.5 font-mono text-[11px] text-[#8b949e]">
          <span>Markdown</span>
          <span className="tabular-nums">{typed.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      {/* Rendered post */}
      <div className="flex flex-col bg-paper text-ink">
        <div className="flex items-center gap-3 border-b border-ink/10 bg-[#e2e0d9] px-4 py-2.5">
          <span className="flex-1 truncate rounded-md bg-paper px-3 py-1 font-mono text-[11px] text-ink/60">yourcompany.com/blog/rag-in-15-minutes</span>
        </div>
        <article className="flex-1 space-y-4 p-6 sm:p-8">
          <AnimatePresence>
            {blocks.map((b, i) =>
              pos >= ends[i] ? (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Rendered block={b} />
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </article>
      </div>
    </div>
  );
}

function Rendered({ block: b }: { block: Block }) {
  const text = b.md.replace(/^#+ |^> |\*\*/g, "");
  switch (b.kind) {
    case "h1":
      return <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-bold [font-stretch:85%]">{text}</h3>;
    case "meta":
      return (
        <p className="flex items-center gap-2 text-[13px] text-ink/60">
          <span className="grid size-6 place-items-center rounded-full bg-orange text-[10px] font-bold text-ink">GR</span>
          {text}
        </p>
      );
    case "h2":
      return <h4 className="pt-2 font-display text-xl font-bold [font-stretch:90%]">{text}</h4>;
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-paper">
          <span className="mb-2 block text-[10px] tracking-[0.1em] text-subtle uppercase">{b.lang}</span>
          {b.body}
        </pre>
      );
    case "tip":
      return (
        <p className="rounded-lg border-l-4 border-orange bg-orange/10 px-4 py-3 text-[14px]">
          <strong>Tip:</strong> {text.replace(/^Tip:\s*/, "")}
        </p>
      );
    default:
      return <p className="leading-relaxed text-ink/80">{text}</p>;
  }
}
