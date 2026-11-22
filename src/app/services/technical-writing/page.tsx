import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  BeakerIcon,
  BookIcon,
  ChecklistIcon,
  CodeIcon,
  GitMergeIcon,
  GlobeIcon,
  LightBulbIcon,
  MegaphoneIcon,
  NoteIcon,
  PencilIcon,
  RocketIcon,
  SearchIcon,
  TerminalIcon,
  VersionsIcon,
} from "@primer/octicons-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import EditorDemo from "@/components/services/writing/EditorDemo";
import ReviewThread from "@/components/services/writing/ReviewThread";
import TestTerminal from "@/components/services/writing/TestTerminal";
import ServiceCta from "@/components/services/ServiceCta";
import { contactHref } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";
import PackageStrip from "@/components/services/PackageStrip";

export const metadata: Metadata = pageMetadata({
  title: "Technical Blogs",
  description: "Technical blog posts, tutorials and launch content written by experienced developers. Every code sample is run before it ships and every draft is reviewed by an engineer.",
  path: "/services/technical-writing",
});

const formats = [
  { icon: TerminalIcon, title: "Tutorials", text: "Step-by-step builds that end with working code, not a screenshot of one." },
  { icon: RocketIcon, title: "Launch posts", text: "Product and feature announcements that developers actually read to the end." },
  { icon: BookIcon, title: "Docs and guides", text: "Quickstarts, concept pages and migration guides that cut support tickets." },
  { icon: BeakerIcon, title: "Deep dives", text: "Architecture write-ups and benchmarks with methods readers can reproduce." },
  { icon: VersionsIcon, title: "Comparisons", text: "Honest X vs Y posts that rank, and hold up when the other side reads them." },
  { icon: LightBulbIcon, title: "Case studies", text: "How a real team built with your product, told from the engineering side." },
  { icon: NoteIcon, title: "Release notes", text: "Changelogs and upgrade notes that make a new version worth installing." },
  { icon: MegaphoneIcon, title: "Talks to posts", text: "Turn a conference talk or livestream into a post that keeps working." },
];

const steps = [
  { icon: PencilIcon, title: "Brief", text: "Audience, goal, keyword and the one thing a reader should walk away able to do." },
  { icon: ChecklistIcon, title: "Outline", text: "A structure you approve before a word of the draft is written." },
  { icon: CodeIcon, title: "Build and draft", text: "Our developer builds the thing first, then writes about what actually happened." },
  { icon: TerminalIcon, title: "Test every sample", text: "Code runs in CI against pinned versions. Links and commands are verified." },
  { icon: GitMergeIcon, title: "Engineer review", text: "A second senior engineer reviews accuracy, then an editor reviews clarity." },
  { icon: SearchIcon, title: "Publish and distribute", text: "SEO pass, your blog, canonical cross-posts and a push to our community." },
];

const writers = [
  { v: "Production", l: "Every writer has shipped real software, not just written about it" },
  { v: "Your stack", l: "Matched by language and domain: AI, infra, web, mobile, data" },
  { v: "Two-key", l: "One developer writes, a second engineer signs off on accuracy" },
];

const destinations = ["Your blog", "dev.to", "Hashnode", "Medium", "LinkedIn", "Geek Room community"];

const faqs = [
  {
    q: "Who actually writes the posts?",
    a: "Experienced developers from the Geek Room network, matched to your stack. Every draft is then reviewed by a second senior engineer and an editor.",
  },
  {
    q: "Do you need access to our product?",
    a: "Yes, ideally a sandbox or trial account. We build what we write about, so readers can follow along and get the same result.",
  },
  {
    q: "How long does a post take?",
    a: "A typical tutorial takes 7 to 10 working days from approved outline to publish-ready draft, including testing and review. Monthly retainers can run faster.",
  },
  {
    q: "Who owns the content?",
    a: "You do. Posts are published under your brand, with bylines your way, and cross-posts point back to your site with canonical links.",
  },
];

export default function TechnicalWritingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40">
        <div className="shell">
          <Link href="/services" className="btn-ghost mb-10 !py-2">
            <ArrowLeft className="size-3.5" /> All services
          </Link>
          <div className="flex items-center gap-3 text-paper">
            <PencilIcon size={24} />
            <p className="label">Service 04 · Technical blogs</p>
          </div>
          <h1 className="display mt-8 max-w-[15ch] text-[clamp(3rem,9vw,7.5rem)]">
            Written by developers who <em>ship</em>.
          </h1>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-[40rem] text-lg leading-relaxed text-muted md:text-xl">
              Developers can tell in one paragraph whether the author has built the thing. Our technical blogs, tutorials
              and launch posts are written by experienced developers, with every code sample tested and every draft
              reviewed by an engineer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={contactHref("Technical blogs")} className="btn-primary">
                Commission a post <ArrowUpRight className="size-4" />
              </Link>
              <a href="#process" className="btn-ghost">
                How we work
              </a>
            </div>
          </div>
        </div>

        <div className="shell relative mt-16 md:mt-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-10 -top-10 h-64 rounded-full bg-orange/15 blur-[100px]" />
          <Reveal className="relative">
            <EditorDemo />
          </Reveal>
          <p className="mt-4 text-center font-mono text-[11px] text-subtle">Markdown in, a publish-ready post out.</p>
        </div>
      </section>

      {/* Writers */}
      <section className="shell mt-20 md:mt-28">
        <dl className="grid border-t border-line md:grid-cols-3">
          {writers.map((w, i) => (
            <div key={w.v} className={`border-b border-line p-5 md:p-8 ${i ? "md:border-l" : ""}`}>
              <dd className="display text-[clamp(2rem,4.5vw,3.5rem)]">
                {w.v}
                <span className="text-orange">.</span>
              </dd>
              <dt className="mt-3 max-w-[22rem] text-muted">{w.l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Published work */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="01"
          title={
            <>
              Published where developers <em>read</em>
            </>
          }
          intro="Placed in publications like Towards AI and on Medium, written with partner teams and built to rank."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {[
            { partner: "With Qdrant", pub: "Towards AI", title: "How Qdrant Reduced RAG Token Costs by 67% with Native ColBERT Reranking", domain: "pub.towardsai.net" },
            { partner: "Partner article", pub: "Medium", title: "The Developer's Guide to Breaking Free from OpenAI API Lock-in", domain: "medium.com/openxai" },
          ].map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col justify-between rounded-[1.75rem] bg-paper p-7 text-ink md:p-9">
                <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] tracking-[0.08em] uppercase">
                  <span className="text-orange-deep">{a.partner}</span>
                  <span className="text-ink/50">{a.pub}</span>
                </div>
                <p className="mt-8 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">{a.title}</p>
                <p className="mt-10 border-t border-ink/10 pt-4 text-sm text-ink/60">{a.domain}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="shell py-24 md:py-32">
        <SectionHead
          index="02"
          title={
            <>
              What we <em>write</em>
            </>
          }
          intro="Anything a developer reads before deciding to use your product, written in the voice of someone who already does."
        />
        <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
          {formats.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 4) * 0.06} className="group border-r border-b border-line p-6 transition-colors hover:bg-ink-2 md:p-7">
              <span className="grid size-11 place-items-center rounded-full border border-line-strong text-orange transition-colors group-hover:border-orange">
                <Icon size={20} />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold [font-stretch:90%]">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="shell scroll-mt-28 pb-24 md:pb-32">
        <SectionHead
          index="03"
          title={
            <>
              From brief to <em>published</em>
            </>
          }
          intro="Six steps, and two of them most content agencies skip: running the code and having an engineer sign off."
        />
        <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          <span aria-hidden className="absolute top-[22px] right-[8%] left-[8%] hidden h-px bg-line-strong lg:block" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative lg:px-3">
              <Reveal delay={i * 0.07}>
                <span
                  className={`relative grid size-11 place-items-center rounded-full border ${
                    i === 3 || i === 4 ? "border-orange bg-orange text-ink" : "border-line-strong bg-ink text-paper"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <p className="mt-5 font-mono text-xs text-orange">0{i + 1}</p>
                <h3 className="mt-1 font-display text-lg font-bold [font-stretch:90%]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Tested, then reviewed */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          size="sm"
          index="04"
          title={
            <>
              Tested, then <em>reviewed</em>
            </>
          }
          intro="Drafts live in a repo. Code samples run in CI, then engineers review the post the way they'd review a pull request."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start [&>*]:min-w-0">
          <Reveal>
            <TestTerminal />
            <p className="mt-4 px-1 text-sm leading-relaxed text-muted">
              <span className="text-paper">Step 04.</span> Every snippet is extracted and executed against pinned versions. A post with a broken sample doesn&apos;t reach review.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ReviewThread />
            <p className="mt-4 px-1 text-sm leading-relaxed text-muted">
              <span className="text-paper">Step 05.</span> A senior engineer checks accuracy, removes hype that won&apos;t hold up, and replaces claims with numbers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Distribution */}
      <section className="shell pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-8 md:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-orange">
                <GlobeIcon size={14} /> (05) Distribution included
              </span>
              <h2 className="display mt-6 text-[clamp(2.2rem,5.5vw,4.5rem)]">
                Published is not <em>done</em>.
              </h2>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
                Every post goes out to the developers it was written for: on your blog, cross-posted with canonical links, and shared with {stat.builders} builders in the Geek Room community.
              </p>
              <Link href="/services/github-stars" className="btn-ghost mt-8">
                Pair it with a GitHub star campaign <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {destinations.map((d, i) => (
                <Reveal
                  key={d}
                  delay={i * 0.06}
                  className={`rounded-full border px-5 py-3 font-display text-lg font-bold [font-stretch:90%] md:text-xl ${
                    i === 0 ? "border-orange bg-orange text-ink" : i === destinations.length - 1 ? "border-paper bg-paper text-ink" : "border-line-strong"
                  }`}
                >
                  {d}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PackageStrip current="technical-writing" />

      {/* FAQ */}
      <section className="shell grid gap-12 pb-24 md:pb-32 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead
          size="sm"
          index="06"
          title={
            <>
              Good <em>questions</em>
            </>
          }
        />
        <div className="border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-bold [font-stretch:90%]">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-lg transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[40rem] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ServiceCta
        title={
          <>
            Got a story <span className="[font-stretch:150%] font-light">to tell?</span>
          </>
        }
        body="Send us the topic, the audience and a link to your product. We'll come back with an outline and a timeline within a few days."
        href={contactHref("Technical blogs")}
        secondary={{ href: "/services/github-stars", label: "See GitHub campaigns" }}
      />
    </>
  );
}
