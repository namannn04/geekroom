import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, ClipboardCheck, Lightbulb, Megaphone, Mic2, Trophy } from "lucide-react";
import GeekMark from "@/components/ui/GeekMark";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Funnel from "@/components/ui/Funnel";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFaq from "@/components/services/ServiceFaq";
import ServiceCta from "@/components/services/ServiceCta";
import HackathonSimulator from "@/components/services/hackathon/HackathonSimulator";
import { getEvent } from "@/data/events";
import { contactHref } from "@/data/services";
import { stat } from "@/data/stats";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Exclusive Hackathons",
  description: `Host an exclusive hackathon with Geek Room. We design the problem statements around your product, reach ${stat.builders} builders, shortlist, mentor, judge and run the finale at your office.`,
  path: "/services/hackathons",
});

const cases = ["ck2.0", "cc6.0", "hackblr1", "cc5.0"].map((slug) => getEvent(slug)!).filter((e) => e.funnel);

const included = [
  { icon: Lightbulb, title: "Problem design", text: "Tracks and problem statements built around your APIs, so every project is a showcase of your product." },
  { icon: Megaphone, title: "Outreach", text: `Campaigns across our community channels, campus chapters and socials, reaching ${stat.builders} builders.` },
  { icon: ClipboardCheck, title: "Shortlisting", text: "We review every profile and team, so the people in the room are the ones you want to meet." },
  { icon: Mic2, title: "Mentors and judges", text: "Your engineers mentor and judge alongside our network, on a rubric we agree with you up front." },
  { icon: Building2, title: "On-site finale", text: "Venue setup, food, swag, stage and run of show at your office. You turn up, we run it." },
  { icon: Trophy, title: "After the event", text: "Winners, photos and recap content across our channels, plus a report with every project link." },
];

const venues = ["Microsoft Bengaluru", "Microsoft Gurugram", "Microsoft Hyderabad", "Mastercard Gurugram", "Paytm Noida", "Battery Smart Gurugram", "Plaksha University"];

const faqs = [
  { q: "How far ahead should we plan?", a: "Six to eight weeks is comfortable for an in-person finale: about two weeks to design tracks and launch, three to four weeks of registrations, then shortlisting and the event." },
  { q: "Can it be online?", a: "Yes. Our global hackathons run fully online and are open to builders anywhere. Many partners pick an online round followed by an in-person finale." },
  { q: "Who owns the projects?", a: "Teams own what they build unless agreed otherwise. We share every submission link with you, and many teams keep building on your product after the event." },
  { q: "Can we hire from it?", a: "Absolutely. Several of our hackathons double as hiring drives. See our hiring challenges for how we score and shortlist candidates." },
];

export default function HackathonsPage() {
  return (
    <>
      <ServiceHero
        icon={<GeekMark className="h-7 w-auto" />}
        label="Service 01 · Brand and engagement"
        title={
          <>
            A hackathon built around <em>you</em>.
          </>
        }
        intro={`We've run ${stat.events} developer events, with finales at Microsoft, Mastercard and Paytm. An exclusive hackathon puts your product in the hands of the sharpest builders we know, and gets it seen by the rest of our ${stat.builders} community.`}
        primary={{ href: contactHref("Host a hackathon"), label: "Plan a hackathon" }}
        secondary={{ href: "#cases", label: "See past results" }}
        titleWidth="max-w-[13ch]"
      >
        <Reveal>
          <HackathonSimulator />
        </Reveal>
      </ServiceHero>

      {/* Included */}
      <section className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHead
            size="sm"
            index="01"
            title={
              <>
                Run end to <em>end</em>
              </>
            }
            intro="You bring the product and a few engineers. We handle everything else, from the first poster to the last photo."
          />
        </div>
        <div className="grid border-t border-l border-line sm:grid-cols-2">
          {included.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 2) * 0.08} className="group border-r border-b border-line p-6 transition-colors hover:bg-ink-2 md:p-8">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full border border-line-strong text-orange transition-colors group-hover:border-orange">
                  <Icon className="size-5" />
                </span>
                <span className="label tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold [font-stretch:90%]">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section id="cases" className="shell scroll-mt-28 pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              Real <em>numbers</em>
            </>
          }
          intro="From our own event pages: how many builders applied, and how many made it to the room."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {cases.map((e, i) => (
            <Reveal key={e.slug} delay={(i % 2) * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-ink-2">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image src={e.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/40 to-transparent" />
                  <p className="absolute bottom-4 left-6 font-mono text-xs text-paper">
                    {e.date} · {e.city}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="display text-[clamp(1.8rem,3vw,2.6rem)]">{e.title}</h3>
                  <div className="mt-6 flex-1">
                    <Funnel stages={e.funnel!} compact />
                  </div>
                  <Link href={`/event/${e.slug}`} className="mt-6 inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase hover:text-paper">
                    Read the event page <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Venues marquee */}
      <section className="pb-24 md:pb-32">
        <div className="shell">
          <p className="label">Finales we&apos;ve run on site</p>
        </div>
        <div className="testimonial-mask testimonial-row mt-6 overflow-hidden">
          <div className="testimonial-track flex w-max gap-4">
            {[...venues, ...venues, ...venues, ...venues].map((v, i) => (
              <span key={i} className="display shrink-0 text-[clamp(2.5rem,6vw,5rem)] text-paper/90">
                {v}
                <span className="px-6 text-orange">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <ServiceFaq index="03" faqs={faqs} />

      <ServiceCta
        title={
          <>
            Your office, <span className="[font-stretch:150%] font-light">full of builders.</span>
          </>
        }
        body="Tell us what you want builders to make with your product. We'll come back with tracks, a timeline and a budget."
        href={contactHref("Host a hackathon")}
        secondary={{ href: "/services/hiring-challenges", label: "Hire from it too" }}
      />
    </>
  );
}
