import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import "./brochure.css";

export const metadata: Metadata = {
  title: "Partner with Geek Room",
  description: "Reach 150K+ developers through Geek Room hackathons, meetups, hiring challenges and brand partnerships.",
};

const images = "/images/brochure";

const reasons = [
  "Reach 150,000+ student developers",
  "Build awareness among Gen Z developers",
  "Hire engineers through hackathons",
  "Run API adoption campaigns",
  "Get quality products built on your product",
];

const reach = [
  { value: "150K+", label: "Developers" },
  { value: "70+", label: "Events conducted" },
  { value: "20+", label: "Chapters" },
];

const channels = [
  { name: "WhatsApp", value: "100+", label: "groups" },
  { name: "Discord", value: "2K+", label: "members" },
  { name: "LinkedIn", value: "17,000", label: "followers" },
  { name: "Instagram", value: "11,000", label: "followers" },
];

const benefits = [
  { title: "Event naming rights", body: "Your brand on the event itself, across every touchpoint." },
  { title: "Mentoring & judging", body: "Your engineers on the floor and on the panel." },
  { title: "Brand & access", body: "Stage time, booths and direct access to developers." },
  { title: "Products built on your stack", body: "Problem statements that turn participants into users." },
];

const operations = ["Event shoot", "Promotion", "Online & offline rounds", "Logistics", "Venue setup"];

const caseStudies = [
  {
    tag: "Flagship · Delhi",
    title: "Code Kshetra",
    metric: "13,000+",
    metricLabel: "registrations",
    body: "A 36-hour flagship hackathon backed by over two months of sustained marketing across our channels, building demand long before day one.",
  },
  {
    tag: "First in India",
    title: "Mastercard Hackathon",
    metric: "7,000+",
    metricLabel: "registrations",
    body: "Mastercard's first hackathon with a developer community in India. We brought the right builders to the problem statement, and participants were hired from it.",
  },
  {
    tag: "EV · Gurugram",
    title: "HackSmart × Battery Smart",
    metric: "200+",
    metricLabel: "projects in under a month",
    body: "Participants learned Battery Smart's technology and worked on its real charging problems, from 5,000+ registrations.",
  },
  {
    tag: "MLH Hackdays · Bengaluru",
    title: "HackBLR",
    metric: "100+",
    metricLabel: "companies involved",
    body: "Teams built voice AI and agent products around real company use cases, working alongside people from more than 100 companies.",
  },
];

const eventList = [
  ["Code Cubicle 6.0", "Noida"], ["AI Race GrandPrix", "Noida"], ["HackBLR (MLH)", "Bengaluru"],
  ["Hack Geek Room", "NCR"], ["HackSmart 2026", "Gurugram"], ["GR Meetup #2", "Gurugram"],
  ["Code Cubicle 5.0", "Bengaluru"], ["Code Cubicle 4.0", "Hyderabad"], ["Code Kshetra 2.0", "Delhi"],
  ["Code Seva", "Gurugram"], ["Hire-A-Thon × InvoLead", "Gurugram"], ["Code Cubicle 3.0", "Gurugram"],
  ["Code Cubicle 2.0", "Gurugram"], ["Code Cubicle 1.0", "Noida"], ["Code Kshetra 1.0", "Delhi"],
];

const packages = [
  {
    category: "Global · virtual",
    title: "Global virtual hackathon",
    tiers: [["Track Partner", "$5,000"], ["Community Partner", "$3,000"], ["Supporting Partner", "$2,000"]],
    note: "Reach developers across geographies.",
  },
  {
    category: "India · in person",
    title: "India in-person hackathon",
    tiers: [["Track Partner", "$2,500"], ["Community Partner", "$1,500"], ["Supporting Partner", "$1,000"]],
    note: "Major Indian cities, in-person audience.",
  },
  {
    category: "Short format",
    title: "Vibeathon",
    tiers: [["Track Partner", "$2,000"]],
    note: "Two track partner slots available. Price per track.",
  },
  {
    category: "Exclusive · hiring",
    title: "Hireathon",
    tiers: [["Exclusive Partner", "$5,000"]],
    note: "One company. The entire event is designed around its hiring needs.",
  },
];

const trackBenefits = [
  "Dedicated track", "API integration", "Analytics", "Website logo", "Social promotion", "Newsletter",
  "Workshop session", "Judging involvement", "Recruitment access", "Participant data", "Custom content", "Event branding",
];

function SectionIntro({ eyebrow, children, lead }: { eyebrow: string; children: ReactNode; lead?: string }) {
  return (
    <div className="brochure-section-intro">
      <p className="brochure-eyebrow">{eyebrow}</p>
      <h2>{children}</h2>
      {lead && <p className="brochure-lead">{lead}</p>}
    </div>
  );
}

export default function BrochurePage() {
  return (
    <div className="brochure-site">
      <section className="brochure-hero">
        <div className="brochure-container brochure-hero-grid">
          <div className="brochure-hero-copy">
            <p className="brochure-eyebrow">Partnerships · Geek Room</p>
            <h1>Partner with <em>Geek Room.</em></h1>
            <p>We run hackathons, meetups and hiring challenges where 150K+ builders across 400+ colleges learn, connect and build in public.</p>
            <div className="brochure-actions">
              <a className="brochure-button brochure-button-primary" href="#partnerships">Explore partnerships <span aria-hidden>↗</span></a>
              <a className="brochure-button brochure-button-outline" href="/global-hackathon-geekroom.pdf" download>Download PDF <span aria-hidden>↓</span></a>
            </div>
          </div>
          <div className="brochure-hero-photo">
            <Image src={`${images}/cover-builders.webp`} alt="Developers collaborating at a Geek Room event" fill priority sizes="(max-width: 800px) 100vw, 45vw" />
            <span className="brochure-photo-tag tag-one">150K+ builders</span>
            <span className="brochure-photo-tag tag-two">20+ campus chapters</span>
            <span className="brochure-photo-tag tag-three">70+ events conducted</span>
          </div>
        </div>
      </section>

      <section className="brochure-section brochure-trust">
        <div className="brochure-container brochure-trust-grid">
          <div>
            <SectionIntro eyebrow="The company we keep">Trusted <em>by builders.</em></SectionIntro>
            <p className="brochure-lead">AI labs, cloud platforms, developer tools and global brands have built, hired and launched with our community.</p>
          </div>
          <div className="brochure-logos"><Image src={`${images}/trusted-partners.webp`} alt="Geek Room partner brands including Battery Smart, Qdrant, Microsoft, AWS, Mastercard, GitHub, Groq and more" width={1010} height={645} sizes="(max-width: 800px) 100vw, 55vw" /></div>
        </div>
      </section>

      <section className="brochure-section brochure-why">
        <div className="brochure-container">
          <SectionIntro eyebrow="Why partner with us">What your company <em>can build here.</em></SectionIntro>
          <div className="brochure-reasons">
            {reasons.map((reason, index) => <article key={reason} className={index === reasons.length - 1 ? "is-accent" : ""}><span>{String(index + 1).padStart(2, "0")}</span><h3>{reason}</h3></article>)}
          </div>
        </div>
      </section>

      <section className="brochure-section brochure-reach">
        <div className="brochure-container">
          <SectionIntro eyebrow="Community & reach">Numbers that <em>compound.</em></SectionIntro>
          <div className="brochure-stat-grid">{reach.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
          <div className="brochure-reach-bottom"><h3>Our volume speaks for us.</h3><p>Thousands of developers talk about our hackathons across our channels, turning reach into relevant conversations.</p></div>
          <div className="brochure-channel-grid">{channels.map((channel) => <div key={channel.name}><span>{channel.name}</span><strong>{channel.value} <small>{channel.label}</small></strong></div>)}</div>
        </div>
      </section>

      <section className="brochure-section brochure-benefits">
        <div className="brochure-container">
          <SectionIntro eyebrow="What you get">A partnership built <em>around your goal.</em></SectionIntro>
          <div className="brochure-benefit-layout">
            <div className="brochure-benefit-grid">{benefits.map((benefit, index) => <article key={benefit.title} className={index === 3 ? "is-teal" : ""}><span>{String(index + 1).padStart(2, "0")}</span><h3>{benefit.title}</h3><p>{benefit.body}</p></article>)}</div>
            <aside className="brochure-benefit-aside"><h3>Beyond one city.</h3><p>We take your brand into multiple countries, with products built on your stack and content from each region we run in.</p><div><h4>We run it for you</h4><ul>{operations.map((item) => <li key={item}>{item}</li>)}</ul></div></aside>
          </div>
        </div>
      </section>

      <section className="brochure-section brochure-work" id="work">
        <div className="brochure-container">
          <SectionIntro eyebrow="Proof in practice">Built on <em>partner problems.</em></SectionIntro>
          <div className="brochure-case-grid">{caseStudies.map((study) => <article key={study.title}><span>{study.tag}</span><h3>{study.title}</h3><p className="brochure-case-number"><strong>{study.metric}</strong> {study.metricLabel}</p><p>{study.body}</p></article>)}</div>
        </div>
      </section>

      <section className="brochure-photo-band">
        <Image src={`${images}/team-at-event.webp`} alt="Geek Room community and partners at a live event" fill sizes="100vw" />
        <div className="brochure-container"><p className="brochure-eyebrow">Our work</p><h2>Rooms full of <em>builders.</em></h2><p>Every event. Every city. Real people building together.</p></div>
      </section>

      <section className="brochure-section brochure-formats">
        <div className="brochure-container">
          <SectionIntro eyebrow="Series · workshops · meetups">More ways to <em>show up.</em></SectionIntro>
          <div className="brochure-format-grid">
            <article><Image src={`${images}/code-cubicle.webp`} alt="Code Cubicle 6.0 event artwork" width={1456} height={822} sizes="(max-width: 800px) 100vw, 50vw" /><div><span>Long-running series</span><h3>Code Cubicle</h3><strong>5+ <small>editions · 6th next</small></strong><p>Five editions across Noida, Gurugram, Hyderabad and Bengaluru, hosted at Microsoft, Mastercard and Paytm offices.</p></div></article>
            <article><Image src={`${images}/workshop-stage.webp`} alt="People gathered for a Geek Room workshop" width={1024} height={961} sizes="(max-width: 800px) 100vw, 50vw" /><div><span>Industry-led</span><h3>Workshops & meetups</h3><strong>15+ <small>workshops</small></strong><p>Industry professionals teach and speak, from Geek Room Meetup #2 to the AI Race Month workshops.</p></div></article>
          </div>
        </div>
      </section>

      <section className="brochure-section brochure-events">
        <div className="brochure-container">
          <SectionIntro eyebrow="Selected events · 2024–2026">Explore the <em>hackathons.</em></SectionIntro>
          <ol>{eventList.map(([name, city], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><small>{city}</small></li>)}</ol>
          <Link className="brochure-text-link" href="/event">See all events <span aria-hidden>↗</span></Link>
        </div>
      </section>

      <section className="brochure-section brochure-gallery">
        <div className="brochure-container"><SectionIntro eyebrow="Inside the room">This is what it <em>looks like.</em></SectionIntro>
          <div className="brochure-gallery-grid">
            <Image src={`${images}/gallery-race-month.webp`} alt="AI Race Month workshop" width={2254} height={2731} sizes="(max-width: 800px) 100vw, 40vw" />
            <Image src={`${images}/gallery-builders.webp`} alt="Developers collaborating around a laptop" width={1200} height={800} sizes="(max-width: 800px) 100vw, 30vw" />
            <Image src={`${images}/gallery-meetup.webp`} alt="Attendees engaging at a Geek Room meetup" width={1200} height={800} sizes="(max-width: 800px) 100vw, 30vw" />
            <Image src={`${images}/gallery-hackathon.webp`} alt="Builders working at a Geek Room hackathon" width={2066} height={772} sizes="(max-width: 800px) 100vw, 60vw" />
          </div>
        </div>
      </section>

      <section className="brochure-section brochure-packages" id="partnerships">
        <div className="brochure-container">
          <SectionIntro eyebrow="Sponsorship menu">Find your <em>format.</em></SectionIntro>
          <div className="brochure-package-grid">{packages.map((pkg, index) => <article key={pkg.title} className={index === 3 ? "is-accent" : ""}><p className="brochure-package-category">{pkg.category}</p><h3>{pkg.title}</h3><dl>{pkg.tiers.map(([tier, price]) => <div key={tier}><dt>{tier}</dt><dd>{price}</dd></div>)}</dl><p>{pkg.note}</p></article>)}</div>
        </div>
      </section>

      <section className="brochure-section brochure-includes">
        <div className="brochure-container">
          <SectionIntro eyebrow="What each tier includes">The details, <em>made clear.</em></SectionIntro>
          <div className="brochure-includes-grid"><article><p className="brochure-eyebrow">Global & India hackathons</p><h3>Track Partner</h3><ul>{trackBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><p><strong>Community & Supporting Partners</strong><br />All Track Partner benefits except the dedicated track and workshop session.</p></article><div><article><p className="brochure-eyebrow">$2,000 / track</p><h3>Vibeathon</h3><p>A short, high-energy format with product or API integration, branding, social promotion, judging, analytics and lead generation.</p></article><article className="is-teal"><p className="brochure-eyebrow">$5,000 · exclusive</p><h3>Hireathon</h3><p>End-to-end execution, a custom challenge, participant sourcing, candidate engagement, evaluation and post-event insights.</p></article></div></div>
        </div>
      </section>

      <section className="brochure-cta"><div className="brochure-container"><p className="brochure-eyebrow">Next move</p><h2>Let&apos;s build <em>together.</em></h2><div className="brochure-actions"><a className="brochure-button brochure-button-light" href="mailto:team@geekroom.co.in">team@geekroom.co.in <span aria-hidden>↗</span></a><a className="brochure-button brochure-button-outline" href="/global-hackathon-geekroom.pdf" download>Download the brochure <span aria-hidden>↓</span></a></div></div></section>
    </div>
  );
}
