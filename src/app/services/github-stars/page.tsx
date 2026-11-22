import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  BookIcon,
  CodeIcon,
  CommentDiscussionIcon,
  GraphIcon,
  IssueOpenedIcon,
  MarkGithubIcon,
  MegaphoneIcon,
  PeopleIcon,
  RocketIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "@primer/octicons-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import RepoCard from "@/components/services/github/RepoCard";
import StarChart from "@/components/services/github/StarChart";
import StargazerFeed from "@/components/services/github/StargazerFeed";
import ReadmeMakeover from "@/components/services/github/ReadmeMakeover";
import ContributionGraph from "@/components/services/github/ContributionGraph";
import ServiceCta from "@/components/services/ServiceCta";
import { contactHref } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "GitHub Star Campaigns",
  description: `Grow your open-source repo's GitHub stars with real developers. Geek Room audits your README, runs your launch and puts your project in front of ${stat.builders} builders through hackathons, workshops and community channels.`,
  path: "/services/github-stars",
});

const playbook = [
  {
    icon: CodeIcon,
    title: "Repo audit",
    text: "We go through your repo the way a first-time visitor does: README, quickstart, topics, social preview, license and issue labels. You get a fix list ranked by impact.",
  },
  {
    icon: RocketIcon,
    title: "Launch plan",
    text: "A dated plan for launch week: which channels, in what order, with what message. We write the launch posts and line up the community moments around them.",
  },
  {
    icon: MegaphoneIcon,
    title: "Community push",
    text: `Your repo goes out to ${stat.builders} builders across our WhatsApp, Discord, LinkedIn, Instagram and newsletter, framed as something worth trying, not an ad.`,
  },
  {
    icon: PeopleIcon,
    title: "Build with it",
    text: "Sponsored hackathon tracks, live workshops and starter repos get developers using your project hands-on. People star what they actually ship with.",
  },
  {
    icon: BookIcon,
    title: "Content that lasts",
    text: "Tutorials and deep dives from our technical writing team keep new developers finding your repo long after launch week.",
    link: { href: "/services/technical-writing", label: "Technical writing" },
  },
  {
    icon: GraphIcon,
    title: "Weekly reporting",
    text: "Stars, unique visitors, clones, referrers and new contributors every week, so you can see which channels moved the needle.",
  },
];

const channels = [
  { title: "Hackathon tracks", text: "Code Cubicle, HackBLR and our global hackathons, with a prize track built around your repo." },
  { title: "Live workshops", text: "Hands-on sessions where 100s of developers clone, run and star your project together." },
  { title: "Community channels", text: `Launch posts across our WhatsApp, Discord, LinkedIn and Instagram, reaching ${stat.builders} builders.` },
  { title: "Campus chapters", text: "20+ chapters across India that run meetups and build sessions with partner tools." },
  { title: "Good first issues", text: "Contributor drives that turn stargazers into people opening issues and pull requests." },
];

const never = [
  "Bots, fake accounts or bought stars",
  "Star-for-star rings or giveaways that trade prizes for stars",
  "Spam in other communities' channels",
];

const faqs = [
  {
    q: "Can you guarantee a number of stars?",
    a: "We set targets with you based on your repo and our channels, and we report against them every week. We don't sell a fixed number of stars, because the only way to guarantee one is to fake it.",
  },
  {
    q: "What kind of repos work best?",
    a: "Developer tools, SDKs, AI and infra projects, frameworks and CLIs that a developer can try in a few minutes. If it can be built with at a hackathon, it is a great fit.",
  },
  {
    q: "How long does a campaign run?",
    a: "Most campaigns run 6 to 12 weeks: a short setup and README pass, a launch week, then sustained pushes through events and content.",
  },
  {
    q: "Is this allowed by GitHub?",
    a: "Yes. We only bring real developers to your repo and let them decide. Inauthentic stars break GitHub's Acceptable Use Policies, so we never use them.",
  },
];

export default function GithubStarsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div className="shell">
          <Link href="/services" className="btn-ghost mb-10 !py-2">
            <ArrowLeft className="size-3.5" /> All services
          </Link>
          <div className="flex items-center gap-3 text-paper">
            <MarkGithubIcon size={28} />
            <p className="label">Service 04 · Developer marketing</p>
          </div>
          <h1 className="display mt-8 max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)]">
            Stars from <em>real</em> developers.
          </h1>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-[40rem] text-lg leading-relaxed text-muted md:text-xl">
              GitHub stars are how developers decide what to try next. We put your open-source project in front of
              {stat.builders} builders, make sure the repo is ready for them, and run the campaign that turns visitors into
              stargazers and contributors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={contactHref("GitHub star campaign")} className="btn-primary">
                Plan my campaign <ArrowUpRight className="size-4" />
              </Link>
              <a href="#playbook" className="btn-ghost">
                See the playbook
              </a>
            </div>
          </div>
        </div>

        <div className="shell relative mt-16 md:mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 -top-10 h-64 rounded-full bg-orange/20 blur-[100px]"
          />
          <Reveal className="relative">
            <RepoCard />
          </Reveal>
          <p className="mt-4 text-center font-mono text-[11px] text-subtle">
            Try the Star button. Repo and numbers are illustrative.
          </p>
        </div>
      </section>

      {/* Proof band */}
      <section className="shell mt-20 md:mt-28">
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {[
            [stat.builders, "Developers in the community"],
            ["25K+", "Hackathon registrations"],
            [stat.companies, "Partner companies"],
            [stat.countries, "Countries builders join from"],
          ].map(([v, l], i) => (
            <div key={l} className={`border-b border-line p-5 md:p-8 ${i % 2 ? "border-l" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <dd className="display text-[clamp(2rem,5vw,4rem)]">
                {v.replace("+", "")}
                <span className="text-orange">+</span>
              </dd>
              <dt className="mt-2 text-muted">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Star history */}
      <section className="shell py-24 md:py-32">
        <SectionHead
          index="01"
          title={
            <>
              What a campaign <em>looks like</em>
            </>
          }
          intro="Stars don't arrive in a straight line. They jump when developers meet your project in the right place, then keep climbing when there's a reason to come back."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.45fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <StarChart />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-4">
            <StargazerFeed />
            <div className="flex-1 rounded-[1.75rem] bg-ink-2 p-6">
              <p className="label">Every star has a source</p>
              <p className="mt-3 leading-relaxed text-muted">
                We tag every link and track referrers, so your report shows which event, post or tutorial brought each wave of stargazers.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Playbook */}
      <section id="playbook" className="shell grid scroll-mt-28 gap-12 pb-24 md:pb-32 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHead
            size="sm"
            index="02"
            title={
              <>
                The <em>playbook</em>
              </>
            }
            intro={`Six moves, run by the team behind ${stat.events} developer events. Each one makes the next work harder.`}
          />
        </div>
        <div className="grid border-t border-l border-line sm:grid-cols-2">
          {playbook.map(({ icon: Icon, title, text, link }, i) => (
            <Reveal key={title} delay={(i % 2) * 0.08} className="group relative border-r border-b border-line p-6 transition-colors hover:bg-ink-2 md:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full border border-line-strong text-orange transition-colors group-hover:border-orange">
                    <Icon size={20} />
                  </span>
                  <span className="label tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold [font-stretch:90%]">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{text}</p>
                {link && (
                  <Link href={link.href} className="mt-4 inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase hover:text-paper">
                    {link.label} <ArrowUpRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* README makeover */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="03"
          title={
            <>
              A README worth <em>starring</em>
            </>
          }
          intro="Traffic is wasted on a repo that doesn't explain itself. Before we send anyone your way, we fix the page they land on."
        />
        <Reveal className="mt-14">
          <ReadmeMakeover />
        </Reveal>
      </section>

      {/* Channels + contributions */}
      <section className="shell grid gap-12 pb-24 md:pb-32 lg:grid-cols-2 lg:items-center [&>*]:min-w-0">
        <div>
          <SectionHead
            size="sm"
            index="04"
            title={
              <>
                Stargazers who <em>stick</em>
              </>
            }
            intro="The best stars come with issues, pull requests and discussions attached. Our channels put your repo in developers' hands, not just in their feed."
          />
          <ul className="mt-10 border-t border-line">
            {channels.map((c) => (
              <li key={c.title} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <span className="font-display text-lg font-bold [font-stretch:90%]">{c.title}</span>
                <span className="leading-relaxed text-muted">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <Reveal className="space-y-4">
          <ContributionGraph />
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: IssueOpenedIcon, v: "+48", l: "issues opened" },
              { icon: CodeIcon, v: "+31", l: "PRs merged" },
              { icon: CommentDiscussionIcon, v: "+120", l: "discussions" },
            ].map(({ icon: Icon, v, l }) => (
              <div key={l} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <Icon size={16} className="text-[#3fb950]" />
                <p className="mt-3 font-display text-2xl font-bold [font-stretch:90%] text-[#e6edf3]">{v}</p>
                <p className="text-[12px] text-[#8b949e]">{l}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[11px] text-subtle">Illustrative figures for a 12-week campaign.</p>
        </Reveal>
      </section>

      {/* Clean stars promise */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-10 rounded-[2rem] border border-line bg-ink-2 p-8 md:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#238636]/15 px-3 py-1 font-mono text-xs text-[#3fb950]">
              <ShieldCheckIcon size={14} /> Clean stars only
            </span>
            <h2 className="display mt-6 text-[clamp(2.2rem,5.5vw,4.5rem)]">
              Every star is a <em>person</em>.
            </h2>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
              Fake stars get repos flagged, fool nobody who looks closely and bring zero users. We grow your count the slow-fast way: by getting
              real developers to try your project and like it.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="label">We never use</li>
            {never.map((n) => (
              <li key={n} className="flex items-start gap-3 rounded-xl border border-line p-4">
                <XCircleIcon size={18} className="mt-0.5 shrink-0 text-orange" />
                <span className="text-paper">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="shell grid gap-12 pb-24 md:pb-32 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead
          size="sm"
          index="05"
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
            Ready to <span className="[font-stretch:150%] font-light">launch?</span>
          </>
        }
        body="Tell us about your repo and where you want it to be. We'll come back with a campaign plan, a timeline and a README fix list."
        href={contactHref("GitHub star campaign")}
        secondary={{ href: "/services/technical-writing", label: "Pair it with technical writing" }}
      />
    </>
  );
}
