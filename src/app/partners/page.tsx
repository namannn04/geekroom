import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import ServiceCta from "@/components/services/ServiceCta";
import PartnerMark from "@/components/partners/PartnerMark";
import PartnerDirectory from "@/components/partners/PartnerDirectory";
import PartnerTestimonials from "@/components/partners/PartnerTestimonials";
import { directory, featuredPartnerships, partnerCategories } from "@/data/partners";
import { contactHref } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Partners",
  description: "The companies, platforms, universities and communities behind Geek Room's hackathons and meetups, from AI labs and cloud platforms to fintech and hiring partners.",
  path: "/partners",
});

const partnerOf = (name: string) => directory.find((p) => p.name === name);

// Two balanced marquee rows, full logos leading each so the first screen reads as a logo wall
const ordered = [...directory.filter((p) => p.logo && !p.mark), ...directory.filter((p) => !p.logo || p.mark)];
const rowA = ordered.filter((_, i) => i % 2 === 0);
const rowB = ordered.filter((_, i) => i % 2 === 1);

function Marquee({ items, reverse = false }: { items: typeof directory; reverse?: boolean }) {
  return (
    <div className="testimonial-mask testimonial-row overflow-hidden">
      <ul className="testimonial-track flex w-max items-center" style={{ animationDuration: "70s", animationDirection: reverse ? "reverse" : "normal" }}>
        {[...items, ...items, ...items, ...items].map((p, i) => (
          <li key={`${p.name}-${i}`} aria-hidden={i >= items.length || undefined} className="grid h-20 shrink-0 place-items-center px-8 opacity-80 transition-opacity hover:opacity-100 md:px-12">
            <PartnerMark name={p.name} logo={p.logo} mark={p.mark} invert={p.invert} size="lg" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 md:pt-44">
        <div className="shell">
          <SectionHead
            as="h1"
            index="Partners"
            title={
              <>
                The companies who <em>back</em> the build
              </>
            }
            intro="AI labs, cloud platforms, fintech leaders, universities and communities. Some sponsor, some co-host, some bring their tech, a venue or the prizes. All of them help builders ship."
          />
        </div>
        <div className="mt-16 space-y-2 border-y border-line py-6 md:mt-20">
          <Marquee items={rowA} />
          <Marquee items={rowB} reverse />
        </div>
      </section>

      {/* Numbers */}
      <section className="shell mt-16 md:mt-20">
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {[
            [stat.companies, "Companies worked with"],
            [stat.events, "Events run"],
            [`${partnerCategories.length}`, "Partner categories"],
            [stat.builders, "Builders reached"],
          ].map(([v, l], i) => (
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

      {/* Featured partnerships */}
      <section className="shell py-24 md:py-32">
        <SectionHead
          index="01"
          title={
            <>
              Partnerships that <em>delivered</em>
            </>
          }
          intro="A few of the events our partners made possible, with the numbers from each event page."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {featuredPartnerships.map((f, i) => (
            <Reveal key={f.event} delay={(i % 2) * 0.08} className="h-full">
              <Link
                href={f.href}
                className={`group flex h-full flex-col justify-between gap-10 rounded-[1.75rem] p-7 transition-colors md:p-9 ${
                  i === 0 ? "bg-orange text-ink" : "border border-line bg-ink-2 hover:border-line-strong"
                }`}
              >
                <div className="flex flex-wrap items-center gap-6">
                  {f.partners.map((name) => (
                    <span key={name} className={`inline-flex items-center ${i === 0 ? "rounded-xl bg-ink px-4 py-3" : ""}`}>
                      <PartnerMark name={name} logo={partnerOf(name)?.logo} mark={partnerOf(name)?.mark} invert={partnerOf(name)?.invert} />
                    </span>
                  ))}
                </div>
                <div>
                  <p className="display text-[clamp(3rem,6vw,5rem)]">{f.stat.value}</p>
                  <p className={`font-mono text-xs tracking-[0.04em] uppercase ${i === 0 ? "text-ink/70" : "text-subtle"}`}>{f.stat.label}</p>
                  <p className={`mt-6 max-w-[30rem] leading-relaxed ${i === 0 ? "" : "text-muted"}`}>{f.text}</p>
                  <span className={`mt-6 flex items-center justify-between font-mono text-xs tracking-[0.06em] uppercase ${i === 0 ? "" : "text-orange"}`}>
                    {f.event}
                    <span
                      className={`grid size-11 place-items-center rounded-full transition-transform duration-300 group-hover:-rotate-45 ${
                        i === 0 ? "bg-ink text-paper" : "bg-paper text-ink"
                      }`}
                    >
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Directory */}
      <section id="directory" className="shell scroll-mt-28 pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              Every <em>partner</em>, by category
            </>
          }
          intro={`Companies and organizations from our events, Luma listings and public acknowledgements. A selection of the ${stat.companies} we've worked with.`}
        />
        <div className="mt-14">
          <PartnerDirectory />
        </div>
      </section>

      {/* Testimonials */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="03"
          title={
            <>
              What partners <em>say</em>
            </>
          }
        />
        <Reveal className="mt-14">
          <PartnerTestimonials />
        </Reveal>
      </section>

      <ServiceCta
        title={
          <>
            Put your logo <span className="[font-stretch:150%] font-light">on the wall.</span>
          </>
        }
        body="Run a content series, launch on GitHub and Reddit, hear from real developers or put your product at the center of a hackathon. Tell us what you have in mind."
        href={contactHref("Developer growth package")}
        secondary={{ href: "/services", label: "See what we offer" }}
      />
    </>
  );
}
