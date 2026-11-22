import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Mic } from "lucide-react";
import { MarkGithubIcon, PencilIcon, StarFillIcon, StarIcon, TriangleDownIcon } from "@primer/octicons-react";
import GeekMark from "@/components/ui/GeekMark";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import { contactHref, serviceList, type Service } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: `Work with Geek Room: exclusive hackathons, hiring challenges, speaker sessions, GitHub star campaigns and technical writing, all aimed at a community of ${stat.builders} builders.`,
  path: "/services",
});

const icons: Record<Service["teaser"], React.ReactNode> = {
  hackathon: <GeekMark className="h-6 w-auto" />,
  hiring: <Briefcase className="size-6" />,
  speaker: <Mic className="size-6" />,
  stars: <MarkGithubIcon size={26} />,
  writing: <PencilIcon size={24} />,
};

// Bento layout: three event services across the top, the two newer services wider below
const spans = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export default function ServicesPage() {
  return (
    <>
      <section className="shell pt-36 pb-16 md:pt-44">
        <SectionHead
          as="h1"
          index="Services"
          title={
            <>
              Grow with <em>builders</em>
            </>
          }
          intro={`Five ways to put your product in front of developers, run by the team behind ${stat.events} developer events and a ${stat.builders} builder community.`}
        />
      </section>

      <section className="shell grid grid-cols-1 gap-4 pb-24 md:grid-cols-2 md:pb-32 lg:grid-cols-6 [&>*]:min-w-0">
        {serviceList.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.08} className={`h-full ${spans[i]} ${i === serviceList.length - 1 ? "md:col-span-2" : ""}`}>
            <Link
              href={s.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 p-7 transition-colors duration-300 hover:border-line-strong md:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-line-strong text-paper transition-colors group-hover:border-orange group-hover:text-orange">
                  {icons[s.teaser]}
                </span>
                <span className="flex items-center gap-2">
                  {s.isNew && <span className="rounded-full bg-orange px-2 py-0.5 font-mono text-[10px] font-semibold text-ink uppercase">New</span>}
                  <span className="label tabular-nums">{s.index}</span>
                </span>
              </div>

              <div className="mt-8 rounded-xl border border-[#30363d] bg-[#0d1117] p-5 transition-transform duration-500 group-hover:-translate-y-1">
                <Teaser kind={s.teaser} />
              </div>

              <p className="label mt-8">{s.eyebrow}</p>
              <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)]">{s.title}</h2>
              <p className="mt-4 max-w-[34rem] leading-relaxed text-muted">{s.summary}</p>
              <ul className="mt-6 grid gap-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-paper">
                    <span className="size-1.5 shrink-0 rounded-full bg-orange" />
                    {p}
                  </li>
                ))}
              </ul>

              <span className="mt-auto flex items-center justify-between pt-10">
                <span className="font-mono text-xs tracking-[0.06em] uppercase">Explore the service</span>
                <span className="grid size-12 place-items-center rounded-full bg-paper text-ink transition-all duration-300 group-hover:-rotate-45 group-hover:bg-orange">
                  <ArrowUpRight className="size-5" />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="shell pb-24 md:pb-32">
        <div className="flex flex-col gap-6 rounded-[1.75rem] border border-line p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="display text-[clamp(1.8rem,3.6vw,3rem)]">Not sure which fits?</p>
            <p className="mt-2 text-muted">Tell us what you want to achieve and we&apos;ll suggest a mix.</p>
          </div>
          <Link href={contactHref("Partnership")} className="btn-primary shrink-0">
            Talk to the team <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Teaser({ kind }: { kind: Service["teaser"] }) {
  switch (kind) {
    case "stars":
      return (
        <div className="flex items-center justify-between gap-4 text-[13px] text-[#e6edf3]">
          <div className="min-w-0">
            <p className="truncate">
              <span className="text-[#4493f8]">your-org</span>
              <span className="px-1 text-[#8b949e]">/</span>
              <span className="font-semibold text-[#4493f8]">your-repo</span>
            </p>
            <div className="mt-3 flex">
              <span className="flex items-center gap-1.5 rounded-l-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-[12px] font-medium">
                <StarIcon size={14} className="text-[#8b949e] group-hover:hidden" />
                <StarFillIcon size={14} className="hidden text-[#e3b341] group-hover:block" />
                <span className="group-hover:hidden">Star</span>
                <span className="hidden group-hover:inline">Starred</span>
                <span className="ml-1 rounded-full bg-[#30363d] px-1.5 font-semibold">3.2k</span>
              </span>
              <span className="grid place-items-center rounded-r-md border border-l-0 border-[#30363d] bg-[#21262d] px-1 text-[#8b949e]">
                <TriangleDownIcon size={14} />
              </span>
            </div>
          </div>
          <svg viewBox="0 0 120 48" className="h-12 w-28 shrink-0" aria-hidden>
            <path d="M2 44 C20 43 26 42 34 30 S50 26 60 25 S72 12 84 11 S100 6 118 3" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "writing":
      return (
        <div className="font-mono text-[12px] leading-[1.7]">
          <p className="font-semibold text-orange"># Build a RAG app in 15 minutes</p>
          <p className="text-[#8b949e] italic">&gt; Written by a senior engineer</p>
          <p className="text-[#a5d6ff]">await client.index(&quot;docs&quot;, chunks);</p>
          <p className="mt-2 text-[#3fb950]">✓ 4 samples passed · reviewed by 2 engineers</p>
        </div>
      );
    case "hackathon":
      return (
        <div className="font-mono text-[12px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[#8b949e]">Registrations</span>
            <span className="text-orange">● live</span>
          </div>
          <p className="display mt-1 text-4xl text-[#e6edf3]">3,741</p>
          <div className="mt-3 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]">
            {Array.from({ length: 48 }, (_, i) => (
              <span key={i} className={`aspect-square rounded-full ${i < 40 ? "bg-[#e6edf3]/70" : "bg-[#30363d]"} ${i === 39 ? "!bg-orange" : ""}`} />
            ))}
          </div>
        </div>
      );
    case "hiring":
      return (
        <ul className="space-y-1.5 font-mono text-[12px] text-[#e6edf3]">
          {[
            ["C04", 35, true],
            ["A17", 33, true],
            ["B22", 32, true],
            ["D09", 32, false],
          ].map(([id, score, pick]) => (
            <li key={id as string} className="flex items-center gap-3">
              <span className="w-8 text-[#8b949e]">{id}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#30363d]">
                <span className="block h-full rounded-full bg-orange" style={{ width: `${((score as number) / 40) * 100}%` }} />
              </span>
              <span className="w-6 text-right">{score}</span>
              <span className={`w-4 ${pick ? "text-[#3fb950]" : "text-transparent"}`}>✓</span>
            </li>
          ))}
        </ul>
      );
    case "speaker":
      return (
        <div className="flex items-center gap-4">
          <div className="grid aspect-video w-28 shrink-0 place-items-center rounded-md bg-paper p-2 text-center">
            <span className="display text-[13px] leading-none text-ink">Shipping agents to prod</span>
          </div>
          <ul className="min-w-0 flex-1 space-y-1.5 text-[12px] text-[#e6edf3]">
            <li className="flex items-center gap-2 truncate">
              <span className="font-mono text-orange">▲ 14</span>
              <span className="truncate">How do you eval tool calls?</span>
            </li>
            <li className="flex items-center gap-2 truncate">
              <span className="font-mono text-[#8b949e]">▲ 9</span>
              <span className="truncate">Works with open models?</span>
            </li>
            <li className="flex items-center gap-2 truncate">
              <span className="font-mono text-[#8b949e]">▲ 7</span>
              <span className="truncate">Can we use it tomorrow?</span>
            </li>
          </ul>
        </div>
      );
  }
}
