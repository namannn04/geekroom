import type { Metadata } from "next";
import Image from "next/image";
import "./brochure.css";

export const metadata: Metadata = {
  title: "Global Partnerships Brochure",
  description: "Put your product, API and brand in front of 100,000+ student developers worldwide.",
};

const A = "/images/brochure";

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`brochure-frame ${className}`}>{children}</section>;
}

function TopBar() {
  return (
    <div className="brochure-topbar">
      <Image src={`${A}/asset-004.png`} alt="Global community" width={44} height={44} />
      <span />
      <Image src={`${A}/asset-005.png`} alt="Geek Room" width={62} height={42} />
    </div>
  );
}

const reasons = [
  ["Reach 100,000+ student developers", "One campaign into one of the world's largest student dev communities."],
  ["Launch products to the global dev ecosystem", "Put your product in builders' hands during a live event."],
  ["Run API adoption campaigns", "Make your API a required, judged part of the challenge."],
  ["Hire engineers through hackathons", "Watch talent build, then recruit straight from the finalists."],
  ["Build awareness among Gen Z developers", "Stay top-of-mind with the next wave of engineers."],
  ["Collect qualified developer leads", "Full participant database, ready to drop into your funnel."],
];

const snapshot = [
  ["100,000+", "Developers"], ["10+", "Cities worldwide"], ["50+", "Events conducted"],
  ["100k+", "Campaign reach"], ["50+", "Industry partners"], ["20,000+", "Registrations, largest event"],
];

const audience = [
  ["AI Startups", "LLMs, agents & AI infrastructure"], ["Developer Tools", "APIs, SDKs, DevX & infrastructure"],
  ["GTM Teams", "Marketing & growth teams selling to developers"], ["Open-Source Projects", "Growing contributors & adoption"],
  ["Budding Startups", "Early-stage teams who need reach fast"], ["Founders & Builders", "People building their startup right now"],
];

const events = [
  ["Code Cubicle Series", "3.0 · 4.0 · 5.0, with Mastercard", "25,000+ registrations"],
  ["Hack Bangalore", "HackBLR 1.0", "5,000+ applications"],
  ["Code Kshetra", "GROQ, Reactive Network & Pathway", "15,000+ registrations"],
  ["Battery Smart HackSmart", "Hiring hackathon, Gurgaon", "20 engineers hired"],
  ["One Cluster", "Multi-city developer programme", "Community-led"],
  ["The Grand Prix", "Flagship enterprise activation", "Offline flagship"],
];

const packages = [
  { label: "Shared collaboration", price: "From $2,000", note: "Co-branded with 2-3 other partners", points: ["Hackathon or workshop track", "Your problem statement", "Mentor & judging seat", "Logo on all creatives", "Participant database"] },
  { label: "Exclusive", price: "$3,500", note: "Sole partner, no shared branding", popular: true, points: ["Event naming rights", "Online or offline hackathon", "Keynote slot", "Hiring + full database access", "Dedicated marketing campaign"] },
  { label: "Growth campaign", price: "Mutual", note: "Commercials decided together", points: ["GitHub stars & repo growth", "Scale awareness campaigns", "Community-wide activation", "Content & social push", "Outcome-based scope"] },
  { label: "Custom", price: "Let's talk", note: "Built around your goal", dark: true, points: ["Everything in Exclusive", "Multi-event series", "Custom problem statements", "End-to-end ops", "Tailored scope & pricing"] },
];

export default function BrochurePage() {
  return (
    <div className="brochure-page">
      <Frame className="brochure-cover">
        <div className="cover-head"><Image src={`${A}/asset-001.png`} alt="Geek Room India" width={76} height={80} /><span>Partnerships brochure</span></div>
        <div className="cover-copy">
          <p className="eyebrow">Geek Room brings</p>
          <h1>Exposure to the Global<br/><em>Developer Ecosystem</em></h1>
          <p>Put your product, API and brand in front of 100,000+ student developers worldwide - through hackathons, workshops and campaigns we run end to end.</p>
        </div>
        <div className="cover-photo"><Image src={`${A}/asset-000.png`} alt="Global technology hubs" fill priority sizes="100vw" /><Image className="cover-badge" src={`${A}/asset-002.png`} alt="Global AI Hackathon" width={150} height={40} /></div>
      </Frame>

      <Frame><TopBar/><div className="center-copy"><h2>Who we are</h2><p>Geek Room is a global developer community building high-quality developer ecosystems across continents. We bring together ambitious student developers, builders, designers and problem-solvers through hackathons, workshops, open-source initiatives and innovation-driven events.</p><blockquote>“We don't just host events - we build environments where developers grow.”</blockquote></div></Frame>

      <Frame><TopBar/><h2>Why companies work with us</h2><div className="reason-grid">{reasons.map(([title,copy])=><article key={title}><b>✓</b><h3>{title}</h3><p>{copy}</p></article>)}</div></Frame>

      <Frame><TopBar/><h2>Community snapshot</h2><div className="snapshot-layout"><div className="snapshot-grid">{snapshot.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div><figure><Image src={`${A}/asset-012.png`} alt="Map of active technology hubs" width={290} height={390}/><figcaption>Active across global tech hubs</figcaption></figure></div></Frame>

      <Frame><TopBar/><h2>What you get</h2><div className="benefits"><div><h3>Your brand & access</h3>{["Event naming rights","Title & primary branding placement","Logo on all creatives & certificates","Custom, company-defined problem statements","Mandatory product / API usage","Opening keynote slot","Mentor & judging-panel seats","Participant database + hiring access","Dedicated marketing campaign"].map(x=><p key={x}>{x}</p>)}</div><div><h3>We run it end to end</h3>{["Venue & food","Mentors, judges & speakers","Marketing & social media management","Outreach & registrations","Planning & management","Online & offline rounds","Hosting & on-ground ops","Design & creatives","Event shoot for promotion"].map(x=><p key={x}>{x}</p>)}</div></div></Frame>

      <Frame><TopBar/><h2>Case studies · Scale</h2><div className="case-grid"><Case logo="asset-019.png" title="GROQ · Reactive Network · Pathway" goal="Developer awareness & adoption" stats={[["10,000+","registrations"],["500+","project submissions"],["100k+","campaign impressions"]]} copy="Flagship hackathon run in collaboration with three prominent partners across AI, Web3 and real-time data."/><Case logo="asset-020.png" title="Mastercard · Code Cubicle 3.0" goal="Brand awareness & hiring" stats={[["5,000+","registrations"],["2 rounds","online + offline, Gurugram"],["1st","hackathon Mastercard ever ran"]]} copy="An exclusive Mastercard event with hiring opportunities for participants, judged by their AI Garage leadership."/></div></Frame>

      <Frame><TopBar/><h2>Case studies · Hiring</h2><div className="case-grid"><Case logo="asset-025.png" title="InvoLead Hiring Hackathon" goal="Talent discovery & hiring" stats={[["3,000+","registrations"],["200+","in the offline round"],["10","offers made"]]} copy="Built as a hiring funnel from day one - candidates were assessed on shipped code, not resumes."/><Case logo="asset-027.png" title="Battery Smart · HackSmart" goal="Hiring engineers at scale" stats={[["3,000+","registrations"],["200","offline finalists"],["20","engineers hired across India"]]} copy="A 36-hour offline build in Gurgaon with judging, demos and on-site hiring."/></div></Frame>

      <Frame><TopBar/><h2>Who should work with us</h2><p className="subline">If your audience is developers, we're built for you.</p><div className="audience-grid">{audience.map(([t,c])=><article key={t}><i/><h3>{t}</h3><p>{c}</p></article>)}</div></Frame>

      <Frame className="work-cover"><div className="work-title"><Image src={`${A}/asset-032.png`} alt="Geek Room India" width={76} height={80}/><div><p>Proof, not promises</p><h2>Our Work</h2></div></div><div className="work-image"><Image src={`${A}/asset-031.png`} alt="Developers connected across global cities" fill sizes="70vw"/></div></Frame>

      <Frame><TopBar/><h2>Recent events</h2><div className="events-wrap"><Image src={`${A}/asset-036.png`} alt="Geek Room events across cities" width={420} height={250}/><div className="event-list">{events.map(([t,s,n])=><div key={t}><p><b>{t}</b><small>{s}</small></p><strong>{n}</strong></div>)}</div></div><div className="event-footer"><b>100+ <small>events delivered</small></b><span>Across 10+ cities worldwide, plus online and global editions.</span></div></Frame>

      <Frame><TopBar/><h2>Gallery</h2><div className="gallery-wrap"><Image src={`${A}/asset-040.png`} alt="Geek Room event gallery" width={660} height={418}/><p>Real rooms. Real builders.<br/>Real hiring.</p></div></Frame>

      <Frame><TopBar/><h2>Trusted by</h2><div className="trusted"><Image src={`${A}/asset-044.png`} alt="Geek Room technology partners" width={850} height={425}/></div></Frame>

      <section id="packages"><Frame><TopBar/><h2>Partnership packages</h2><div className="packages">{packages.map(p=><article className={`${p.popular?"popular ":""}${p.dark?"dark":""}`} key={p.label}>{p.popular&&<span>Most popular</span>}<p className="pkg-label">{p.label}</p><h3>{p.price}</h3><small>{p.note}</small><ul>{p.points.map(x=><li key={x}>✓ {x}</li>)}</ul></article>)}</div></Frame></section>

      <Frame className="brochure-cta"><div className="cta-top"><Image src={`${A}/asset-058.png`} alt="Geek Room India" width={76} height={80}/><span>Geek Room · Global</span></div><div className="cta-copy"><p>Let's talk</p><h2>Let's build with the world's<br/>developers.</h2><div className="cta-pills"><span>100k+ developers</span><span>Packages from $2,000</span><span>30+ offers made via our hackathons</span></div></div><div className="cta-contact"><p>Start the conversation<br/><a href="mailto:team@geekroom.co.in">team@geekroom.co.in</a></p><a href="https://linktr.ee/geekroom" target="_blank" rel="noreferrer">linktr.ee/geekroom</a></div></Frame>
    </div>
  );
}

function Case({logo,title,goal,stats,copy}:{logo:string;title:string;goal:string;stats:string[][];copy:string}) {
  return <article className="case"><div className="case-head"><Image src={`${A}/${logo}`} alt="" width={70} height={38}/><p><b>{title}</b><small><em>Goal</em> {goal}</small></p></div>{stats.map(([n,l])=><div className="case-stat" key={l}><strong>{n}</strong><span>{l}</span></div>)}<p className="case-copy">{copy}</p></article>;
}
