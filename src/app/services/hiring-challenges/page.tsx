import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Check, Code2, FileText, Target, Users, X } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Funnel from "@/components/ui/Funnel";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFaq from "@/components/services/ServiceFaq";
import ServiceCta from "@/components/services/ServiceCta";
import CandidateBoard from "@/components/services/hiring/CandidateBoard";
import { getEvent } from "@/data/events";
import { contactHref } from "@/data/services";
import { stat } from "@/data/stats";

export const metadata: Metadata = {
  title: "Hiring Challenges",
  description:
    "Skills-based hiring with Geek Room. Candidates solve your real problems, we score their work on a shared rubric, and you interview the people who already proved they can build.",
};

const steps = [
  { icon: Target, title: "Define the role", text: "We turn the job description into a challenge that tests what the role actually needs." },
  { icon: Users, title: "Reach candidates", text: `Students, final-years and working professionals from our ${stat.builders} community apply.` },
  { icon: Code2, title: "They build", text: "Online or on site, candidates ship a working project against your problem statement." },
  { icon: FileText, title: "We score", text: "Every submission is scored on a shared rubric, with notes your interviewers can use." },
  { icon: Briefcase, title: "You interview", text: "You get a ranked shortlist with repo, demo and scorecard for each candidate." },
];

const resume = ["Proficient in React, Node and AWS", "Team player with strong communication", "Built many projects in college", "Passionate about clean code"];
const proof = ["Shipped a working app in 24 hours, deployed live", "Explained trade-offs to judges in a 7-minute pitch", "Repo with tests, README and a demo video", "Scored 33/40 on your rubric, reviewer notes attached"];

const hacksmart = getEvent("hacksmart")!;
const hacksmart2 = getEvent("hacksmart-2")!;
const hireathon = getEvent("hireathon")!;

const faqs = [
  { q: "Online or in person?", a: "Either. Online rounds widen the pool, and an on-site final lets your team meet candidates. Most partners do both." },
  { q: "Which roles does this work for?", a: "Engineering roles of all kinds: backend, frontend, full stack, ML and data, DevOps. Also product and design roles where a working prototype says more than a portfolio." },
  { q: "How do candidates get scored?", a: "We agree the rubric with you up front. Reviewers from our network and your team score each submission, and every score comes with notes." },
  { q: "Is it fair to candidates?", a: "Yes. Problem statements are shared with everyone at the same time, judging uses the same rubric, and every participant gets feedback, not just the winners." },
];

export default function HiringPage() {
  return (
    <>
      <ServiceHero
        icon={<Briefcase className="size-6" />}
        label="Service 02 · Skills-based hiring"
        title={
          <>
            Hire what they <em>build</em>.
          </>
        }
        intro="Resumes all say the same thing. In a hiring challenge, candidates solve your real problems, we score the work, and you interview people who've already shown you what they can do."
        primary={{ href: contactHref("Hiring challenge"), label: "Run a challenge" }}
        secondary={{ href: "#proof", label: "Resume vs proof" }}
        titleWidth="max-w-[12ch]"
      >
        <Reveal>
          <CandidateBoard />
        </Reveal>
      </ServiceHero>

      {/* Resume vs proof */}
      <section id="proof" className="shell scroll-mt-28 py-24 md:py-32">
        <SectionHead
          index="01"
          title={
            <>
              Claims vs <em>proof</em>
            </>
          }
          intro="The same candidate, seen two ways. Only one of them tells you how they'll do on day one."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-[1.75rem] border border-line p-7 md:p-9">
            <p className="label">What a resume says</p>
            <ul className="mt-6 space-y-3">
              {resume.map((r) => (
                <li key={r} className="flex items-start gap-3 rounded-xl bg-ink-2 px-4 py-3 text-muted line-through decoration-subtle/60">
                  <X className="mt-0.5 size-4 shrink-0 text-subtle" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[1.75rem] bg-orange p-7 text-ink md:p-9">
            <p className="font-mono text-xs tracking-[0.04em]">What a hiring challenge shows</p>
            <ul className="mt-6 space-y-3">
              {proof.map((r) => (
                <li key={r} className="flex items-start gap-3 rounded-xl bg-ink/10 px-4 py-3">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              Five steps to a <em>shortlist</em>
            </>
          }
        />
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          <span aria-hidden className="absolute top-[22px] right-[10%] left-[10%] hidden h-px bg-line-strong lg:block" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative lg:px-4">
              <Reveal delay={i * 0.07}>
                <span className={`relative grid size-11 place-items-center rounded-full border ${i === 4 ? "border-orange bg-orange text-ink" : "border-line-strong bg-ink text-paper"}`}>
                  <Icon className="size-[18px]" />
                </span>
                <p className="mt-5 font-mono text-xs text-orange">0{i + 1}</p>
                <h3 className="mt-1 font-display text-xl font-bold [font-stretch:90%]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Case studies */}
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="03"
          title={
            <>
              Hiring we&apos;ve <em>run</em>
            </>
          }
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="h-full">
            <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-ink-2 p-7 md:p-9">
              <p className="label">Battery Smart × Geek Room</p>
              <h3 className="display mt-3 text-[clamp(2rem,3.4vw,3rem)]">HackSmart</h3>
              <p className="mt-3 max-w-[34rem] leading-relaxed text-muted">
                A hiring hackathon on battery intelligence, EV operations and cloud problems. Now in its second edition, with pre-placement interviews for eligible builders.
              </p>
              <div className="mt-8 flex-1">
                <Funnel stages={hacksmart.funnel!} compact />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href={`/event/${hacksmart.slug}`} className="inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase hover:text-paper">
                  HackSmart 2026 <ArrowUpRight className="size-3.5" />
                </Link>
                <Link href={`/event/${hacksmart2.slug}`} className="inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase hover:text-paper">
                  HackSmart 2.0, registrations open <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <Link href={`/event/${hireathon.slug}`} className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-line">
              <Image src={hireathon.image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              <div className="relative p-7 md:p-9">
                <p className="label">{hireathon.date}</p>
                <h3 className="display mt-3 text-[clamp(2rem,3.4vw,3rem)]">{hireathon.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{hireathon.tagline}. Candidates proved themselves on real problem statements, judged by InvoLead&apos;s tech panel.</p>
                <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs tracking-[0.06em] text-orange uppercase">
                  Read the event page <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <ServiceFaq index="04" faqs={faqs} />

      <ServiceCta
        title={
          <>
            Skip the <span className="[font-stretch:150%] font-light">resume pile.</span>
          </>
        }
        body="Tell us the roles you're hiring for and how many people you need. We'll design the challenge and come back with a timeline."
        href={contactHref("Hiring challenge")}
        secondary={{ href: "/services/hackathons", label: "Or host a full hackathon" }}
      />
    </>
  );
}
