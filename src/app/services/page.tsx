import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarkGithubIcon, PencilIcon, StarFillIcon, StarIcon, TriangleDownIcon } from "@primer/octicons-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import { serviceList, serviceMail } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Developer marketing services from Geek Room: GitHub star campaigns that bring real developers to your open-source repo, and technical writing by experienced developers.",
};

const also = [
  { title: "Exclusive hackathons", href: "/event?category=hackathon" },
  { title: "Hiring challenges", href: "/event?category=hiring" },
  { title: "Speaker sessions", href: "/contact-us" },
];

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
          intro="Two ways to put your product in front of developers, run by the team behind 80+ developer events and a 150K+ builder community."
        />
      </section>

      <section className="shell grid gap-4 pb-24 md:pb-32 lg:grid-cols-2">
        {serviceList.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.1} className="h-full">
            <Link
              href={s.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 p-7 transition-colors duration-300 hover:border-line-strong md:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-line-strong text-paper transition-colors group-hover:border-orange group-hover:text-orange">
                  {i === 0 ? <MarkGithubIcon size={26} /> : <PencilIcon size={24} />}
                </span>
                <span className="label tabular-nums">{s.index}</span>
              </div>

              <div className="mt-10 rounded-xl border border-[#30363d] bg-[#0d1117] p-5 transition-transform duration-500 group-hover:-translate-y-1">
                {i === 0 ? <StarsTeaser /> : <WritingTeaser />}
              </div>

              <p className="label mt-10">{s.eyebrow}</p>
              <h2 className="display mt-3 text-[clamp(2.2rem,4.2vw,3.6rem)]">{s.title}</h2>
              <p className="mt-4 max-w-[34rem] leading-relaxed text-muted">{s.summary}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-paper">
                    <span className="size-1.5 rounded-full bg-orange" />
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
        <div className="flex flex-col gap-8 rounded-[1.75rem] border border-line p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="label">Also from Geek Room</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {also.map((a) => (
                <li key={a.title}>
                  <Link href={a.href} className="btn-ghost !py-2">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <a href={serviceMail("Working")} className="btn-primary shrink-0">
            Talk to the team <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}

/** Miniature GitHub star button and a climbing sparkline. */
function StarsTeaser() {
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
}

/** Miniature markdown file with a passing check. */
function WritingTeaser() {
  return (
    <div className="font-mono text-[12px] leading-[1.7]">
      <p className="font-semibold text-orange"># Build a RAG app in 15 minutes</p>
      <p className="text-[#8b949e] italic">&gt; Written by a senior engineer</p>
      <p className="text-[#8b949e]">```ts</p>
      <p className="text-[#a5d6ff]">await client.index(&quot;docs&quot;, chunks);</p>
      <p className="text-[#8b949e]">```</p>
      <p className="mt-2 text-[#3fb950]">✓ 4 samples passed · reviewed by 2 engineers</p>
    </div>
  );
}
