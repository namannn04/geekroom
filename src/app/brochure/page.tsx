import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import PartnerMark from "@/components/partners/PartnerMark";
import ServiceIcon from "@/components/services/ServiceIcon";
import { directory } from "@/data/partners";
import { contactHref, getService, serviceList } from "@/data/services";
import { site } from "@/data/site";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Partnership Proposal 2027–28",
  description: `The Geek Room Developer Growth Package: ten services across content, community, hackathons and developer feedback, with package plans for teams that want to reach ${stat.builders} builders.`,
  path: "/brochure",
});

const PDF = "/geek-room-partnership-proposal.pdf";

const formats = ["Global hackathons", "Vibe-a-thons", "In-person finales", "Hiring challenges", "Meetups", "Speaker sessions"];
const flagships = [
  { name: "HackBLR", tag: "Hybrid", href: "/event/hackblr1" },
  { name: "Code Kshetra", tag: "Global", href: "/event/ck2.0" },
  { name: "Code Cubicle", tag: "India", href: "/event/cc6.0" },
  { name: "AI Race Month", tag: "Online", href: "/event/grandprix" },
  { name: "Hack Geek Room", tag: "Global", href: "/event/hackgr" },
];

const numbers = [
  { label: "Community", value: stat.builders, note: "Builders worldwide" },
  { label: "Registrations", value: stat.registrations, note: "Hackathon sign-ups" },
  { label: "Partners", value: stat.partners, note: "Partner companies" },
  { label: "Events", value: stat.events, note: "Online and in person" },
  { label: "Projects", value: "300+", note: "Hackathon submissions" },
  { label: "Stage", value: stat.speakers, note: "Speakers and mentors", hot: true },
];

const wallNames = ["GitHub", "Qdrant", "Mastercard", "Major League Hacking", "Groq", "Vapi", "Pathway", "OmniDimension", "Battery Smart", "NordVPN", "Superlinked"];
const wall = wallNames.map((n) => directory.find((p) => p.name === n)!).filter(Boolean);

const cases = [
  { city: "Bengaluru", title: "HackBLR", text: "MLH HackDays with Vapi voice-AI tracks and Qdrant. 1,500+ builders in one room.", href: "/event/hackblr1" },
  { city: "Global", title: "Code Kshetra 2.0", text: "Powered by Groq, Pathway and MLH. 14,500+ applications for 150 spots.", href: "/event/ck2.0" },
  { city: "Gurugram", title: "Code Cubicle 3.0", text: "Mastercard's first exclusive hackathon with Geek Room.", href: "/event/cc3.0" },
  { city: "Gurugram", title: "HackSmart", text: "Two hiring-hackathon editions with Battery Smart, at their HQ.", href: "/event/hacksmart-2" },
];

const plans = [
  {
    term: "1 month",
    name: "Monthly",
    price: "$2,500",
    per: "per month",
    sub: "Billed monthly",
    lead: null,
    items: ["2 technical blogs / month", "1 YouTube video / month, shared on every channel", "GitHub marketing", "Developer marketing", "Monthly performance report"],
    best: "Best for a single launch or campaign.",
  },
  {
    term: "3 months",
    name: "Quarterly",
    price: "$7,000",
    per: "for 3 months",
    sub: "≈ $2,333 / mo",
    save: "Save $500",
    lead: "All of Monthly, plus",
    items: ["Reddit marketing", "Shorts and reels", "1 hackathon", "Dedicated Geek Room team"],
    best: "Best for a product launch cycle.",
  },
  {
    term: "6 months",
    name: "Half-yearly",
    price: "$13,500",
    per: "for 6 months",
    sub: "≈ $2,250 / mo",
    save: "Save $1,500",
    lead: "All of Quarterly, plus",
    items: ["3 technical blogs / month", "Podcasts and discussions", "SEO and GEO", "Developer feedback round", "2 hackathons in total"],
    best: "Best for building lasting momentum.",
  },
  {
    term: "12 months",
    name: "Annual",
    price: "$25,000",
    per: "per year",
    sub: "≈ $2,083 / mo",
    save: "Save $5,000",
    lead: "All of Half-yearly, plus",
    items: ["4 technical blogs / month", "2 YouTube videos / month", "3 hackathons in total", "Quarterly strategy review"],
    best: "Recommended: all 10 services, all year.",
    popular: true,
  },
];

const alaCarte = [
  { slug: "github-stars", title: "GitHub Marketing", text: "Stars, forks and contributors for your open-source repo.", items: ["README, docs and example polish", "Community pushes across our channels", "Contributor challenges and good-first-issues"], price: "$1,000", per: "/ month" },
  { slug: "technical-writing", title: "Technical Blogs", text: "Code-first articles written and tested by engineers.", items: ["Research, code and editing included", "Placement in developer publications", "SEO and GEO optimized"], price: "$200", per: "/ blog" },
  { slug: "reddit-marketing", title: "Reddit Marketing", text: "A transparent, value-first presence where developers ask for opinions.", items: ["Subreddit mapping and strategy", "Value-first posts and launch threads", "Ongoing comment engagement"], price: "$750", per: "/ month" },
  { slug: "hackathons", title: "Hackathons", text: "A dedicated track or a hackathon built around your product.", items: ["Problem statements on your product", `Promotion to ${stat.builders} builders`, "Judging, mentors and winner showcase"], price: "$3,000", per: "/ event" },
];

const steps = [
  { title: "Kickoff", when: "Week 1", text: "Goals, audience and product deep-dive with your team." },
  { title: "Plan", when: "Week 2", text: "A 12-month calendar of content, sessions and hackathons." },
  { title: "Launch", when: "Ongoing", text: "Campaigns, content and events go live across every channel." },
  { title: "Report", when: "Monthly", text: "Reach, sign-ups, GitHub growth and developer feedback in one report." },
];

export default function BrochurePage() {
  return (
    <>
      {/* Cover */}
      <section className="shell pt-36 pb-20 md:pt-44">
        <p className="font-mono text-xs tracking-[0.08em] text-orange uppercase">Partnership proposal · 2027–28 · Developer Growth Package</p>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="display text-[clamp(3.2rem,9vw,7.5rem)]">
              Grow with the <em>smarter</em> community
            </h1>
            <p className="mt-8 max-w-[38rem] text-lg leading-relaxed text-muted md:text-xl">
              A single partnership that puts your product in front of {stat.builders} developers, founders and builders, through content, community, hackathons and real developer feedback.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={contactHref("Developer growth package")} className="btn-primary">
                Book a 30-minute call <ArrowUpRight className="size-4" />
              </Link>
              <a href={PDF} download className="btn-ghost">
                Download the PDF <ArrowDown className="size-3.5" />
              </a>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {[
              [stat.builders, "builders in the community"],
              [stat.partners, "partner companies"],
              [stat.registrations, "hackathon registrations"],
              [stat.events, "events run"],
            ].map(([v, l]) => (
              <li key={l} className="rounded-full border border-line-strong px-4 py-2.5 text-sm">
                <span className="font-mono text-orange">{v}</span> <span className="text-paper">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 01 Who we are */}
      <section className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.75fr_1.25fr] lg:items-start [&>*]:min-w-0">
        <div>
          <SectionHead
            size="sm"
            index="01"
            title={
              <>
                Built by <em>builders</em>
              </>
            }
          />
          <p className="label mt-10">What we run</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {formats.map((f) => (
              <li key={f} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-paper">
                {f}
              </li>
            ))}
          </ul>
          <p className="label mt-10">Flagship events</p>
          <ul className="mt-3 border-t border-line">
            {flagships.map((f) => (
              <li key={f.name} className="border-b border-line">
                <Link href={f.href} className="flex items-center justify-between py-3 transition-colors hover:text-orange">
                  <span className="font-display text-lg font-bold [font-stretch:90%]">{f.name}</span>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{f.tag}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {numbers.map((n) => (
              <div key={n.label} className={`rounded-[1.25rem] p-5 md:p-6 ${n.hot ? "bg-orange text-ink" : "border border-line bg-ink-2"}`}>
                <p className={`font-mono text-[11px] tracking-[0.06em] uppercase ${n.hot ? "text-ink/70" : "text-subtle"}`}>{n.label}</p>
                <p className="display mt-3 text-[clamp(2.4rem,4.5vw,3.6rem)]">{n.value}</p>
                <p className={`mt-1 text-sm ${n.hot ? "" : "text-muted"}`}>{n.note}</p>
              </div>
            ))}
          </div>
          {[
            { v: "14,500+", tag: "Code Kshetra 2.0", text: "applications for just 150 spots. Demand, not just reach." },
            { v: "1,500+", tag: "HackBLR · MLH HackDays", text: "builders in one room in Bengaluru." },
          ].map((r) => (
            <div key={r.tag} className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-[1.25rem] border border-line bg-ink-2 p-5 md:p-6">
              <p className="display text-[clamp(2.4rem,4.5vw,3.4rem)] text-orange">{r.v}</p>
              <div>
                <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{r.tag}</p>
                <p className="mt-1 text-paper">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 Track record */}
      <section className="shell py-20 md:py-28">
        <SectionHead
          index="02"
          title={
            <>
              Partners who <em>back the build</em>
            </>
          }
          intro="From global developer platforms to fintech leaders, these teams trusted Geek Room to put their product in builders' hands."
        />
        <ul className="theme-dark mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {wall.map((p) => (
            <li key={p.name} className="grid h-24 place-items-center rounded-[1.25rem] border border-line bg-ink-2 px-4">
              <PartnerMark name={p.name} logo={p.logo} mark={p.mark} invert={p.invert} size="sm" />
            </li>
          ))}
          <li className="grid h-24 place-items-center rounded-[1.25rem] border border-dashed border-orange px-4 text-center font-mono text-[11px] tracking-[0.06em] text-orange uppercase">
            Your logo here next
          </li>
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className="h-full">
              <Link href={c.href} className="group flex h-full flex-col rounded-[1.25rem] border border-line bg-ink-2 p-6 transition-colors hover:border-line-strong">
                <span className="font-mono text-[11px] tracking-[0.06em] text-orange uppercase">{c.city}</span>
                <span className="mt-4 font-display text-2xl font-bold [font-stretch:90%]">{c.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{c.text}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs tracking-[0.06em] text-subtle uppercase">
          Finales hosted at <span className="text-paper">Microsoft · Paytm · Mastercard</span>
        </p>
      </section>

      {/* 03 The package */}
      <section className="shell py-20 md:py-28">
        <SectionHead
          index="03"
          title={
            <>
              One package, <em>every channel</em>
            </>
          }
          intro="Ten services that work as one developer-relations engine. Content builds awareness, community builds trust, and hackathons turn both into real usage."
        />
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {serviceList.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 5) * 0.05} className="h-full">
              <Link href={s.href} className="group flex h-full flex-col rounded-[1.25rem] border border-line bg-ink-2 p-5 transition-colors hover:border-orange">
                <span className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-orange/10 text-orange">
                    <ServiceIcon icon={s.icon} className="size-[18px]" />
                  </span>
                  <span className="font-mono text-[11px] text-subtle">{s.index}</span>
                </span>
                <span className="mt-8 font-display text-xl leading-tight font-bold [font-stretch:90%]">{s.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 04 Package plans */}
      <section id="plans" className="shell scroll-mt-28 py-20 md:py-28">
        <SectionHead
          index="04"
          title={
            <>
              Pick your <em>commitment</em>
            </>
          }
          intro="Every plan comes with clear deliverables. Commit for longer and you get more channels, more content and more hackathons, at a lower monthly price."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-[1.5rem] p-6 md:p-7 ${p.popular ? "border-2 border-orange bg-ink-2" : "border border-line bg-ink-2"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className={`font-mono text-[11px] tracking-[0.06em] uppercase ${p.popular ? "text-orange" : "text-subtle"}`}>{p.term}</p>
                {p.popular && <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.06em] text-ink uppercase">Most popular</span>}
              </div>
              <p className="mt-4 font-display text-3xl font-bold [font-stretch:90%]">{p.name}</p>
              <p className="display mt-4 text-[clamp(2.6rem,4vw,3.4rem)]">{p.price}</p>
              <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{p.per}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-b border-line pb-5 text-sm">
                <span className="text-muted">{p.sub}</span>
                {p.save && <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.06em] uppercase ${p.popular ? "bg-orange text-ink" : "bg-orange/15 text-orange"}`}>{p.save}</span>}
              </div>
              {p.lead && <p className={`mt-5 font-mono text-[11px] tracking-[0.06em] uppercase ${p.popular ? "text-orange" : "text-subtle"}`}>{p.lead}</p>}
              <ul className="mt-4 flex-1 space-y-2.5">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-sm text-paper">
                    <Check className={`mt-0.5 size-4 shrink-0 ${p.popular ? "text-orange" : "text-teal"}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <p className={`mt-6 text-sm ${p.popular ? "font-semibold text-paper" : "text-muted"}`}>{p.best}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-subtle">All prices in USD, exclusive of applicable taxes.</p>
      </section>

      {/* 05 À la carte */}
      <section className="shell py-20 md:py-28">
        <SectionHead
          index="05"
          title={
            <>
              Individual <em>services</em>
            </>
          }
          intro="Need just one channel? Pick any service on its own, with no package commitment."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {alaCarte.map((a) => {
            const s = getService(a.slug);
            return (
              <div key={a.slug} className="grid gap-6 rounded-[1.5rem] border border-line bg-ink-2 p-6 sm:grid-cols-[1fr_auto] md:p-7">
                <div>
                  <span className="grid size-10 place-items-center rounded-lg bg-orange/10 text-orange">
                    <ServiceIcon icon={s.icon} className="size-[18px]" />
                  </span>
                  <Link href={s.href} className="mt-5 block font-display text-2xl font-bold [font-stretch:90%] hover:text-orange">
                    {a.title}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
                  <ul className="mt-4 space-y-2">
                    {a.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm text-paper">
                        <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-end border-line sm:border-l sm:pl-6 sm:text-right">
                  <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">Price</p>
                  <p className="display text-[clamp(2.4rem,4vw,3.2rem)]">{a.price}</p>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{a.per}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 06 How we work */}
      <section className="shell py-20 md:py-28">
        <SectionHead
          index="06"
          title={
            <>
              How we <em>work</em>
            </>
          }
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-[1.5rem] border border-line bg-ink-2 p-6">
              <div className="flex items-baseline justify-between">
                <span className="display text-4xl text-orange">0{i + 1}</span>
                <span className="font-mono text-xs tracking-[0.06em] text-subtle uppercase">{s.when}</span>
              </div>
              <p className="mt-6 font-display text-2xl font-bold [font-stretch:90%]">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 07 Let's talk */}
      <section className="shell pb-24 md:pb-32">
        <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-orange p-8 text-ink md:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Image src="/images/brochure/team-at-event.webp" alt="" fill sizes="100vw" className="object-cover opacity-10 mix-blend-multiply" />
          <div className="relative">
            <p className="font-mono text-xs tracking-[0.08em] uppercase">07 · Let&apos;s talk</p>
            <h2 className="display mt-5 text-[clamp(2.6rem,6.5vw,5.5rem)]">
              Let&apos;s map your <span className="[font-stretch:150%] font-light">growth plan.</span>
            </h2>
            <p className="mt-6 max-w-[32rem] text-lg leading-relaxed">Book a 30-minute call. We&apos;ll map your goals to the package and send you a plan within a week.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={contactHref("Developer growth package")} className="btn bg-ink text-paper hover:bg-ink-3">
                Book a call <ArrowUpRight className="size-3.5" />
              </Link>
              <a href={PDF} download className="btn border border-ink/40 hover:border-ink">
                Download the PDF <ArrowDown className="size-3.5" />
              </a>
            </div>
          </div>
          <dl className="relative border-t border-ink/20">
            {[
              ["Web", "geekroom.co.in", "/"],
              ["Email", site.email, `mailto:${site.email}`],
            ].map(([k, v, href]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-ink/20 py-4">
                <dt className="font-mono text-xs tracking-[0.06em] uppercase">{k}</dt>
                <dd>
                  <a href={href} className="font-display text-xl font-bold [font-stretch:90%] hover:underline">
                    {v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
