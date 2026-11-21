"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookIcon, CheckIcon, CopyIcon, PencilIcon } from "@primer/octicons-react";

/* Real shields.io badges, the same ones top open-source READMEs use */
const badges = [
  { src: "https://img.shields.io/badge/stars-3.2k-e3b341?style=flat&logo=github&logoColor=white", alt: "GitHub stars: 3.2k" },
  { src: "https://img.shields.io/badge/npm-v2.4.0-cb3837?style=flat&logo=npm&logoColor=white", alt: "npm version 2.4.0" },
  { src: "https://img.shields.io/badge/license-MIT-3fb950?style=flat", alt: "MIT license" },
  { src: "https://img.shields.io/badge/PRs-welcome-4493f8?style=flat", alt: "PRs welcome" },
  { src: "https://img.shields.io/badge/discord-join-5865F2?style=flat&logo=discord&logoColor=white", alt: "Join the Discord" },
];

const fixes = [
  "One-line pitch above the fold",
  "Badges that signal a living project",
  "Demo GIF before any wall of text",
  "Install in a single copyable command",
  "Good first issues for new contributors",
];

/** Toggle between a typical README and the one we ship after the repo audit. */
export default function ReadmeMakeover() {
  const [after, setAfter] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText("npm i your-repo").catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start [&>*]:min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] text-[14px] text-[#e6edf3]">
        <div className="flex items-center justify-between gap-3 border-b border-[#30363d] px-4 py-2.5">
          <span className="flex items-center gap-2 font-semibold">
            <BookIcon size={16} className="text-[#8b949e]" /> README
          </span>
          <div role="tablist" aria-label="README version" className="flex rounded-md border border-[#30363d] p-0.5 text-[12px]">
            {[
              ["Before", false],
              ["After the audit", true],
            ].map(([label, value]) => (
              <button
                key={String(label)}
                role="tab"
                type="button"
                aria-selected={after === value}
                onClick={() => setAfter(value as boolean)}
                className={`rounded px-3 py-1 font-medium transition-colors ${after === value ? "bg-[#30363d] text-[#e6edf3]" : "text-[#8b949e] hover:text-[#e6edf3]"}`}
              >
                {label as string}
              </button>
            ))}
          </div>
          <PencilIcon size={16} className="hidden text-[#8b949e] sm:block" />
        </div>

        <div className="relative min-h-[460px] p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {after ? (
              <motion.article
                key="after"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="border-b border-[#30363d] pb-2 text-[28px] font-semibold">your-repo</h3>
                <p className="mt-4 text-[16px] text-[#e6edf3]">
                  <strong>Ship AI features in minutes, not sprints.</strong> A typed toolkit with streaming, retries and evals built in.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={b.src} src={b.src} alt={b.alt} height={20} className="h-5 w-auto" loading="lazy" />
                  ))}
                </div>
                <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]">
                  <FakeDemo />
                </div>
                <h4 className="mt-6 border-b border-[#30363d] pb-1.5 text-[20px] font-semibold">Quickstart</h4>
                <div className="mt-3 flex items-center justify-between rounded-md bg-[#161b22] px-4 py-3 font-mono text-[13px]">
                  <span>
                    <span className="text-[#ff7b72]">npm</span> i your-repo
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy install command"
                    className="grid size-7 place-items-center rounded-md border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3]"
                  >
                    {copied ? <CheckIcon size={14} className="text-[#3fb950]" /> : <CopyIcon size={14} />}
                  </button>
                </div>
              </motion.article>
            ) : (
              <motion.article
                key="before"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="text-[#8b949e]"
              >
                <h3 className="border-b border-[#30363d] pb-2 text-[28px] font-semibold text-[#e6edf3]">your-repo</h3>
                <p className="mt-4">A library for doing things with AI models. See the docs folder for details.</p>
                <h4 className="mt-6 text-[18px] font-semibold text-[#e6edf3]">Installation</h4>
                <p className="mt-2">Clone the repo, install the dependencies, set up your environment variables (see config.example), then build from source.</p>
                <h4 className="mt-6 text-[18px] font-semibold text-[#e6edf3]">Usage</h4>
                <p className="mt-2">TODO</p>
                <h4 className="mt-6 text-[18px] font-semibold text-[#e6edf3]">License</h4>
                <p className="mt-2">See LICENSE.</p>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <p className="label">What the audit fixes</p>
        <ul className="mt-5 border-t border-line">
          {fixes.map((f, i) => (
            <li key={f} className="flex items-center justify-between gap-4 border-b border-line py-4">
              <span className="flex items-center gap-4">
                <span className="font-mono text-xs text-orange">0{i + 1}</span>
                <span className="text-paper">{f}</span>
              </span>
              <motion.span
                animate={{ scale: after ? 1 : 0.6, opacity: after ? 1 : 0.25 }}
                transition={{ delay: after ? i * 0.07 : 0 }}
                className={`grid size-6 shrink-0 place-items-center rounded-full ${after ? "bg-[#238636] text-white" : "bg-ink-3 text-subtle"}`}
              >
                <CheckIcon size={14} />
              </motion.span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          A visitor decides in seconds. Every developer we send to your repo should land on a page that makes starring it the obvious next step.
        </p>
      </div>
    </div>
  );
}

/** A tiny looping terminal standing in for the demo GIF. */
function FakeDemo() {
  const lines = [
    { t: "$ npx your-repo init", c: "text-[#e6edf3]" },
    { t: "✔ Created your-repo.config.ts", c: "text-[#3fb950]" },
    { t: "✔ Connected model provider", c: "text-[#3fb950]" },
    { t: "→ Streaming response… 212 tokens in 0.8s", c: "text-[#e3b341]" },
  ];
  return (
    <div className="absolute inset-0 p-4 font-mono text-[12px] sm:p-6 sm:text-[13px]">
      <div className="mb-3 flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      {lines.map((l, i) => (
        <motion.p
          key={l.t}
          className={l.c}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.08, 0.92, 1], delay: i * 0.7, repeat: Infinity, repeatDelay: 0.6 }}
        >
          {l.t}
        </motion.p>
      ))}
    </div>
  );
}
