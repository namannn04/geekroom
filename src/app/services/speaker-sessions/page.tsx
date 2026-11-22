import type { Metadata } from "next";
import Image from "next/image";
import { Award, Camera, Mic, Presentation, Radio, Users, Wrench } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFaq from "@/components/services/ServiceFaq";
import ServiceCta from "@/components/services/ServiceCta";
import LiveSession from "@/components/services/speaker/LiveSession";
import { LinkedinIcon } from "@/components/ui/Icons";
import { speakers } from "@/data/site";
import { contactHref } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Speaker Sessions",
  description: "Put your engineers on stage at Geek Room meetups, hackathons and online sessions. Talks, hands-on workshops and livestreams that get your tech into builders' hands.",
  path: "/services/speaker-sessions",
});

const formats = [
  { icon: Presentation, title: "Stage talks", text: "A slot at our meetups and hackathon openings, in front of a room that came to learn.", time: "20–30 min" },
  { icon: Wrench, title: "Hands-on workshops", text: "Everyone builds with your product on their own laptop, with your team helping on the floor.", time: "60–90 min" },
  { icon: Radio, title: "Online sessions", text: "Livestreams and webinars for builders anywhere, promoted across our channels.", time: "45–60 min" },
  { icon: Award, title: "Judge and mentor", text: "Your engineers mentor teams and judge at our hackathons, where builders meet your tools under pressure.", time: "Event day" },
];

const outcomes = [
  { icon: Users, title: "A room of builders", text: "Developers, founders and students who chose to show up for a technical talk." },
  { icon: Wrench, title: "Hands on your product", text: "Workshops end with people having built something with your tools, not just watched." },
  { icon: Camera, title: "Content after", text: "Photos, clips and recap posts across our channels, ready for yours too." },
  { icon: Mic, title: "Feedback, live", text: "Real questions from real users, which beats any survey your team can send." },
];

const faqs = [
  { q: "Who should speak?", a: "Engineers and builders, not slides from marketing. The talks that land best are honest about what was hard and show working code." },
  { q: "Can we run a workshop instead of a talk?", a: "Yes, and we recommend it. Workshops get your product onto laptops, which is the outcome most teams actually want." },
  { q: "Where do sessions happen?", a: "At our meetups and hackathons in Delhi NCR, Bengaluru and beyond, at partner offices, and online for builders anywhere." },
  { q: "Can you help with the talk itself?", a: "We'll help shape the abstract and run order so it fits the audience, and our technical writing team can turn it into a blog post afterwards." },
];

export default function SpeakerSessionsPage() {
  return (
    <>
      <ServiceHero
        icon={<Mic className="size-6" />}
        label="Also from Geek Room · Developer relations"
        title={
          <>
            Your engineers, <em>on stage</em>.
          </>
        }
        intro="Builders adopt the tools they've seen someone like them use. Speaker sessions put your team in front of our community at meetups, hackathons and online, and get your tech into their hands natively."
        primary={{ href: contactHref("Speaker session"), label: "Book a session" }}
        secondary={{ href: "#formats", label: "See formats" }}
        titleWidth="max-w-[14ch]"
      >
        <Reveal>
          <LiveSession />
        </Reveal>
      </ServiceHero>

      {/* Formats */}
      <section id="formats" className="shell scroll-mt-28 py-24 md:py-32">
        <SectionHead
          index="01"
          title={
            <>
              Pick your <em>format</em>
            </>
          }
          intro="From a 20-minute talk to judging a whole hackathon. Most partners mix two or three."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map(({ icon: Icon, title, text, time }, i) => (
            <Reveal key={title} delay={i * 0.07} className="group flex h-full flex-col rounded-[1.5rem] border border-line bg-ink-2 p-6 transition-colors hover:border-orange">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-ink-3 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-[11px] text-subtle">{time}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold [font-stretch:90%]">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Past speakers */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              Who&apos;s taken the <em>stage</em>
            </>
          }
          intro="Engineers and builders from Meta, NielsenIQ and fast-growing AI startups have spoken at Geek Room events."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {speakers.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <figure className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ink-3">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} on LinkedIn`}
                      className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-paper text-ink opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      <LinkedinIcon className="size-4" />
                    </a>
                  )}
                </div>
                <figcaption className="mt-3">
                  <p className="font-display text-lg leading-tight font-bold [font-stretch:90%]">{p.name}</p>
                  <p className="text-sm text-muted">{p.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-10 rounded-[2rem] border border-line bg-ink-2 p-8 md:p-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-xs text-orange">(03) What you walk away with</p>
            <h2 className="display mt-6 text-[clamp(2.2rem,5vw,4.2rem)]">
              Not just <em>applause</em>.
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {outcomes.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl border border-line p-5">
                <Icon className="size-5 text-orange" />
                <p className="mt-4 font-display text-lg font-bold [font-stretch:90%]">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceFaq index="04" faqs={faqs} />

      <ServiceCta
        title={
          <>
            Got something <span className="[font-stretch:150%] font-light">to show?</span>
          </>
        }
        body="Tell us who would speak and what they'd cover. We'll find the right event and audience for it."
        href={contactHref("Speaker session")}
        secondary={{ href: "/services/technical-writing", label: "Turn it into a blog post" }}
      />
    </>
  );
}
