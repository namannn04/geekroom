"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  BookIcon,
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GitPullRequestIcon,
  GraphIcon,
  IssueOpenedIcon,
  LawIcon,
  PulseIcon,
  RepoForkedIcon,
  RepoIcon,
  StarFillIcon,
  StarIcon,
  TriangleDownIcon,
} from "@primer/octicons-react";

const FROM = 214;
const TO = 3180;

/** GitHub's own compact count format: 3180 -> 3.2k */
export const ghCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${Math.round(n)}`);

const topics = ["open-source", "developer-tools", "ai", "typescript", "cli"];

/**
 * A faithful GitHub repository header (dark theme) whose star count climbs when it
 * scrolls into view. The Star button works: click it to add your own.
 */
export default function RepoCard() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(FROM);
  const [starred, setStarred] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(TO);
      return;
    }
    const controls = animate(FROM, TO, { duration: 2.8, ease: [0.22, 1, 0.36, 1], delay: 0.3, onUpdate: setCount });
    return () => controls.stop();
  }, [inView, reduced]);

  const total = Math.round(count) + (starred ? 1 : 0);

  const toggleStar = () => {
    setStarred((s) => !s);
    if (!starred) setBurst((b) => b + 1);
  };

  return (
    <div
      ref={root}
      className="overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] font-sans text-[14px] text-[#e6edf3] shadow-[0_40px_120px_-40px_rgba(255,90,31,0.35)]"
    >
      {/* Repo header */}
      <div className="flex flex-col gap-4 border-b border-[#30363d] px-4 pt-4 pb-0 sm:px-6 sm:pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <RepoIcon size={16} className="shrink-0 text-[#8b949e]" />
            <p className="truncate text-[17px] sm:text-[20px]">
              <span className="text-[#4493f8]">your-org</span>
              <span className="px-1 text-[#8b949e]">/</span>
              <span className="font-semibold text-[#4493f8]">your-repo</span>
            </p>
            <span className="rounded-full border border-[#30363d] px-2 py-px text-[12px] text-[#8b949e]">Public</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <GhButton icon={<EyeIcon size={16} />} label="Watch" count="86" className="hidden sm:flex" />
            <GhButton icon={<RepoForkedIcon size={16} />} label="Fork" count={ghCount(total * 0.11)} className="hidden sm:flex" />
            <div className="relative flex">
              <button
                type="button"
                onClick={toggleStar}
                aria-pressed={starred}
                className="flex items-center gap-1.5 rounded-l-md border border-[#30363d] bg-[#21262d] px-3 py-[5px] font-medium transition-colors hover:border-[#8b949e] hover:bg-[#30363d]"
              >
                {starred ? <StarFillIcon size={16} className="text-[#e3b341]" /> : <StarIcon size={16} className="text-[#8b949e]" />}
                {starred ? "Starred" : "Star"}
                <span className="ml-1 rounded-full bg-[#30363d] px-1.5 text-[12px] font-semibold tabular-nums" aria-live="polite">
                  {ghCount(total)}
                </span>
              </button>
              <span className="grid place-items-center rounded-r-md border border-l-0 border-[#30363d] bg-[#21262d] px-1.5 text-[#8b949e]">
                <TriangleDownIcon size={16} />
              </span>
              <StarBurst key={burst} active={burst > 0 && !reduced} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav aria-label="Repository" className="-mb-px flex gap-1 overflow-x-auto text-[14px] [scrollbar-width:none]">
          {[
            { icon: CodeIcon, label: "Code", active: true },
            { icon: IssueOpenedIcon, label: "Issues", count: "12" },
            { icon: GitPullRequestIcon, label: "Pull requests", count: "4" },
            { icon: CommentDiscussionIcon, label: "Discussions" },
            { icon: PulseIcon, label: "Actions" },
            { icon: GraphIcon, label: "Insights" },
          ].map(({ icon: Icon, label, count: c, active }) => (
            <span
              key={label}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-2 pb-3 ${active ? "border-[#f78166] text-[#e6edf3]" : "border-transparent text-[#8b949e]"}`}
            >
              <Icon size={16} />
              {label}
              {c && <span className="rounded-full bg-[#30363d] px-1.5 text-[12px] text-[#e6edf3]">{c}</span>}
            </span>
          ))}
        </nav>
      </div>

      {/* Body: About sidebar */}
      <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1fr_15rem]">
        <div className="overflow-hidden rounded-md border border-[#30363d]">
          <div className="flex items-center justify-between gap-2 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5 text-[13px]">
            <span className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-orange text-[10px] font-bold text-ink">G</span>
              <span className="font-semibold">geekroom-bot</span>
              <span className="hidden text-[#8b949e] sm:inline">docs: add 60-second quickstart</span>
            </span>
            <span className="text-[#8b949e]">2h ago</span>
          </div>
          {[
            ["src", "feat: streaming API"],
            ["examples", "add hackathon starter"],
            ["docs", "quickstart and FAQ"],
            ["README.md", "badges, demo GIF, install"],
            ["CONTRIBUTING.md", "good first issues"],
          ].map(([name, msg], i) => (
            <div key={name} className="flex items-center gap-3 border-b border-[#30363d] px-4 py-2 text-[13px] last:border-0">
              <span className="text-[#7d8590]">
                {i < 3 ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#54aeff" aria-hidden>
                    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
                  </svg>
                ) : (
                  <BookIcon size={16} />
                )}
              </span>
              <span className="w-32 shrink-0 truncate">{name}</span>
              <span className="truncate text-[#8b949e]">{msg}</span>
            </div>
          ))}
        </div>

        <aside className="text-[13px]">
          <h3 className="text-[16px] font-semibold">About</h3>
          <p className="mt-3 leading-snug text-[#e6edf3]">The open-source toolkit your users have been waiting for. Fast, typed and easy to start.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <span key={t} className="rounded-full bg-[#121d2f] px-2.5 py-0.5 text-[12px] font-medium text-[#4493f8]">
                {t}
              </span>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-[#8b949e]">
            <li className="flex items-center gap-2">
              <BookIcon size={16} /> Readme
            </li>
            <li className="flex items-center gap-2">
              <LawIcon size={16} /> MIT license
            </li>
            <li className="flex items-center gap-2">
              <StarIcon size={16} /> <strong className="font-semibold text-[#e6edf3] tabular-nums">{ghCount(total)}</strong> stars
            </li>
            <li className="flex items-center gap-2">
              <EyeIcon size={16} /> <strong className="font-semibold text-[#e6edf3]">86</strong> watching
            </li>
            <li className="flex items-center gap-2">
              <RepoForkedIcon size={16} /> <strong className="font-semibold text-[#e6edf3] tabular-nums">{ghCount(total * 0.11)}</strong> forks
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function GhButton({ icon, label, count, className = "" }: { icon: React.ReactNode; label: string; count: string; className?: string }) {
  return (
    <span className={`items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-[5px] font-medium text-[#e6edf3] ${className}`}>
      <span className="text-[#8b949e]">{icon}</span>
      {label}
      <span className="ml-1 rounded-full bg-[#30363d] px-1.5 font-semibold tabular-nums">{count}</span>
    </span>
  );
}

/** Six tiny stars that fly out of the button on each new star. */
function StarBurst({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-5">
          {Array.from({ length: 7 }, (_, i) => {
            const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
            return (
              <motion.span
                key={i}
                className="absolute text-[#e3b341]"
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                animate={{ x: Math.cos(angle) * 34, y: Math.sin(angle) * 34, scale: 1, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <StarFillIcon size={10} />
              </motion.span>
            );
          })}
        </span>
      )}
    </AnimatePresence>
  );
}
