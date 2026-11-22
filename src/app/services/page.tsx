import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";
import ServiceCta from "@/components/services/ServiceCta";
import { contactHref, moreFormats, serviceGroups, serviceList } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: `The Developer Growth Package: one partnership that puts your product in front of ${stat.builders} developers, founders and builders through content, community, hackathons and real developer feedback.`,
  path: "/services",
});

const numbers = [
  [stat.builders, "Builders in the community"],
  [stat.registrations, "Hackathon registrations"],
  [stat.events, "Events run"],
  [stat.speakers, "Speakers and mentors"],
];

/* Results from the partnership proposal, each traceable to a partner engagement */
const results = [
  { value: "62K", label: "GitHub stars for Pathway", note: "with 1.7K forks", href: "/services/github-stars" },
  { value: "7.2K", label: "stars for arc-task-gen", note: "from a brand-new repo", href: "/services/github-stars" },
  { value: "10K+", label: "views per Reddit campaign", note: "for multiple partner companies", href: "/services/reddit-marketing" },
  { value: "14,500+", label: "applications, Code Kshetra 2.0", note: "for just 150 spots", href: "/event/ck2.0" },
];

const steps = [
  { title: "Kickoff", when: "Week 1", text: "Goals, audience and product deep-dive with your team." },
  { title: "Plan", when: "Week 2", text: "A 12-month calendar of content, sessions and hackathons." },
  { title: "Launch", when: "Ongoing", text: "Campaigns, content and events go live across every channel." },
  { title: "Report", when: "Monthly", text: "Reach, sign-ups, GitHub growth and developer feedback in one report." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="shell pt-36 md:pt-44">
        <SectionHead
          as="h1"
          index="Developer Growth Package"
          title={
            <>
              Grow with the <em>smarter</em> community
            </>
          }
          intro={`A single partnership that puts your product in front of ${stat.builders} developers, founders and builders, through content, community, hackathons and real developer feedback.`}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={contactHref("Developer growth package")} className="btn-primary">
            Book a 30-minute call <ArrowUpRight className="size-4" />
          </Link>
          <a href="#package" className="btn-ghost">
            See the ten services
          </a>
        </div>
        <dl className="mt-16 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {numbers.map(([v, l], i) => (
            <div key={l} className={`border-b border-line p-5 md:p-8 ${i % 2 ? "border-l" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <dd className="display text-[clamp(2rem,5vw,4rem)]">
                {v.replace("+", "")}
                {v.endsWith("+") && <span className="text-orange">+</span>}
              </dd>
              <dt className="mt-2 text-muted">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* The package */}
      <section id="package" className="shell scroll-mt-28 py-24 md:py-32">
        <SectionHead
          index="01"
          title={
            <>
              One package, <em>every channel</em>
            </>
          }
          intro="Ten services that work as one developer-relations engine. Content builds awareness, community builds trust, and hackathons turn both into real usage."
        />
        <div className="mt-14 space-y-12">
          {serviceGroups.map((g) => {
            const items = serviceList.filter((s) => s.group === g.key);
            return (
              <div key={g.key}>
                <p className="flex items-baseline gap-3 border-b border-line pb-4">
                  <span className="display text-[clamp(1.6rem,3vw,2.4rem)]">{g.title}</span>
                  <span className="font-mono text-xs text-orange">{g.line}</span>
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {items.map((s, i) => (
                    <Reveal key={s.slug} delay={(i % 4) * 0.06} className="h-full">
                      <Link
                        href={s.href}
                        className="group flex h-full flex-col rounded-[1.5rem] border border-line bg-ink-2 p-6 transition-colors hover:border-orange"
                      >
                        <span className="flex items-center justify-between">
                          <span className="grid size-11 place-items-center rounded-xl bg-orange/10 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                            <ServiceIcon icon={s.icon} />
                          </span>
                          <span className="font-mono text-xs text-subtle tabular-nums">{s.index}</span>
                        </span>
                        <span className="mt-8 font-display text-2xl leading-tight font-bold [font-stretch:90%]">{s.title}</span>
                        <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.summary}</span>
                        <span className="mt-6 inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase">
                          Explore <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              Results, not <em>reach</em>
            </>
          }
          intro="A few numbers from work we've already done with partners."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.06} className="h-full">
              <Link
                href={r.href}
                className={`group flex h-full flex-col justify-between rounded-[1.5rem] p-6 transition-colors ${
                  i === 1 ? "bg-orange text-ink" : "border border-line bg-ink-2 hover:border-line-strong"
                }`}
              >
                <p className="display text-[clamp(2.8rem,5vw,4rem)]">{r.value}</p>
                <div className="mt-8">
                  <p className="font-display text-lg leading-snug font-bold [font-stretch:90%]">{r.label}</p>
                  <p className={`mt-1 text-sm ${i === 1 ? "text-ink/70" : "text-muted"}`}>{r.note}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="03"
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

      {/* More formats */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-4 md:grid-cols-[0.8fr_1fr_1fr] md:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="label">Also from Geek Room</p>
            <p className="display mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">More ways to work together</p>
          </div>
          {moreFormats.map((s) => (
            <Link key={s.slug} href={s.href} className="group flex flex-col rounded-[1.5rem] border border-line p-6 transition-colors hover:border-orange">
              <span className="grid size-11 place-items-center rounded-xl bg-ink-3 text-orange">
                <ServiceIcon icon={s.icon} />
              </span>
              <span className="mt-6 font-display text-xl font-bold [font-stretch:90%]">{s.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.summary}</span>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase">
                Learn more <ArrowUpRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ServiceCta
        title={
          <>
            Ready to grow <span className="[font-stretch:150%] font-light">with developers?</span>
          </>
        }
        body="Book a 30-minute call. We'll map your goals to the package and send you a plan within a week."
        href={contactHref("Developer growth package")}
        secondary={{ href: "/brochure", label: "Read the partnership proposal" }}
      />
    </>
  );
}
