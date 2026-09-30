import type { Metadata } from "next";
import Image from "next/image";
import "./brochure.css";

export const metadata: Metadata = {
  title: "Partnership Brochure",
  description: "Explore Geek Room's hackathons, developer community, case studies, and sponsorship opportunities.",
};

const pages = [
  "Partner with Geek Room",
  "Trusted by",
  "Why companies work with us",
  "Numbers that compound",
  "What you get",
  "Case studies and scale",
  "Built on partner problems",
  "Our work",
  "Series, workshops and meetups",
  "Explore the best hackathons",
  "Gallery",
  "Sponsorship menu",
  "What each tier includes",
  "Let's build together",
];

export default function BrochurePage() {
  return (
    <div className="brochure-page">
      <header className="brochure-intro">
        <div>
          <p className="brochure-eyebrow">Geek Room · Partnership brochure</p>
          <h1>Build with the developer community.</h1>
        </div>
        <a className="brochure-download" href="/global-hackathon-geekroom.pdf" download>
          Download brochure <span aria-hidden="true">↘</span>
        </a>
      </header>

      <div className="brochure-pages">
        {pages.map((title, index) => (
          <section className="brochure-slide" key={title} aria-label={`Page ${index + 1}: ${title}`}>
            <Image
              src={`/images/brochure-2026/page-${String(index + 1).padStart(2, "0")}.webp`}
              alt={`Brochure page ${index + 1}: ${title}`}
              width={1800}
              height={1272}
              sizes="(max-width: 1440px) 100vw, 1440px"
              priority={index === 0}
            />
          </section>
        ))}
      </div>

      <footer className="brochure-outro">
        <p>Ready to build together?</p>
        <a href="mailto:team@geekroom.co.in">team@geekroom.co.in ↗</a>
      </footer>
    </div>
  );
}
