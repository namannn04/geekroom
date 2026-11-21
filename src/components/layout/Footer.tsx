"use client";

import GeekMark from "@/components/ui/GeekMark";
import Link from "next/link";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { EASE_EXPO, EASE_OUT, reveal } from "@/lib/motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { footerColumns, site, type FooterLink } from "@/data/site";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";
import { useLenis } from "@/components/motion/SmoothScroll";

const wordmark = "Geek Room".split("");

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Closing band: headline lines rise, then the link columns follow one by one
      gsap.from("[data-cta-line]", {
        yPercent: 110,
        duration: 1,
        stagger: 0.08,
        ease: EASE_EXPO,
        scrollTrigger: reveal("[data-cta]", "top 92%"),
      });
      gsap.from("[data-col]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: EASE_OUT,
        scrollTrigger: reveal("[data-cols]", "top 92%"),
      });
      // Wordmark letters rise from below the fold as the footer arrives
      gsap.from("[data-letter]", {
        yPercent: 100,
        duration: 1.1,
        stagger: 0.045,
        ease: EASE_EXPO,
        scrollTrigger: reveal("[data-wordmark]", "top 95%"),
      });
    },
    { scope: root },
  );

  const socials = [
    { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <footer ref={root} className="site-footer relative overflow-hidden border-t border-line bg-ink-2">
      {/* Closing call to action */}
      <div data-cta className="shell grid gap-10 border-b border-line pt-20 pb-14 md:pt-24 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="label">Work with Geek Room</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5rem)]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-cta-line className="block">
                Let&apos;s build
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-cta-line className="block">
                something <em>together</em>.
              </span>
            </span>
          </h2>
        </div>
        <div className="lg:justify-self-end">
          <p className="max-w-[26rem] leading-relaxed text-muted">
            Hackathons, hiring challenges, developer marketing and technical content for teams that want to reach 150K+ builders.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}?subject=Partnering%20with%20Geek%20Room`} className="btn-primary">
              Partner with us <ArrowUpRight className="size-3.5" />
            </a>
            <a href={site.socials.linktree} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Join the community <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div data-cols className="shell grid grid-cols-2 gap-x-6 gap-y-12 pt-16 pb-12 sm:gap-x-8 lg:grid-cols-[1.35fr_repeat(4,1fr)]">
        <div data-col className="col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <GeekMark className="h-8 w-auto" />
            <span className="font-display text-lg font-bold uppercase">Geek Room</span>
          </Link>
          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-muted">
            A global builder community: hackathons, vibe-a-thons, meetups and hiring challenges for 150K+ developers,
            founders and companies.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm text-paper transition-colors hover:text-orange"
          >
            {site.email}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-all hover:-translate-y-0.5 hover:border-paper hover:text-paper"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} data-col aria-label={col.title}>
            <p className="label">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <FooterItem link={l} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Oversized wordmark, cropped by the bottom edge */}
      <div aria-hidden data-wordmark className="shell select-none overflow-hidden">
        <p className="display flex translate-y-[14%] justify-between text-[17vw] leading-[0.8] whitespace-nowrap text-paper lg:text-[15.5rem]">
          {wordmark.map((ch, i) => (
            <span key={i} data-letter className={`inline-block ${ch === " " ? "w-[0.25em]" : ""}`}>
              {ch}
            </span>
          ))}
        </p>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-4 py-5 text-sm text-subtle md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs tracking-[0.06em] uppercase">Learn · Connect · Grow</p>
          <button
            type="button"
            onClick={toTop}
            className="group flex items-center gap-2 font-mono text-xs tracking-[0.06em] uppercase transition-colors hover:text-paper"
          >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-all group-hover:-translate-y-0.5 group-hover:border-paper">
              <ArrowUp className="size-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

/** A footer link: an orange tick slides in on hover; optional "New" badge or event count. */
function FooterItem({ link: l }: { link: FooterLink }) {
  return (
    <Link href={l.href} className="group inline-flex flex-wrap items-center gap-y-1 text-sm text-muted transition-colors hover:text-paper">
      <span className="h-px w-0 bg-orange transition-all duration-300 group-hover:mr-2 group-hover:w-3" aria-hidden />
      {l.label}
      {l.badge && (
        <span className="ml-2 rounded-full bg-orange px-1.5 py-px font-mono text-[10px] font-semibold tracking-[0.04em] text-ink uppercase">
          {l.badge}
        </span>
      )}
      {l.count !== undefined && (
        <span className="ml-2 font-mono text-[11px] text-subtle tabular-nums" aria-label={`${l.count} events`}>
          {String(l.count).padStart(2, "0")}
        </span>
      )}
    </Link>
  );
}
