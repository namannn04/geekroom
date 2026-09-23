"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { footerColumns, site } from "@/data/site";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";

const wordmark = "Geek Room".split("");

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  // Wordmark letters rise from below the fold as the footer arrives
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-letter]", {
        yPercent: 100,
        fontStretch: "50%",
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  const socials = [
    { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="shell grid gap-12 pt-20 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/brand/logo.png" alt="" width={44} height={38} className="h-9 w-auto" />
            <span className="font-display text-lg font-bold uppercase">Geek Room</span>
          </Link>
          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-muted">
            One of India&apos;s biggest student tech communities: hackathons, meetups and speaker sessions for 50,000+
            builders.
          </p>
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
          <div key={col.title}>
            <p className="label">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="label">Contact</p>
          <a
            href={`mailto:${site.email}`}
            className="group mt-5 flex items-center gap-1.5 text-sm text-paper transition-colors hover:text-orange"
          >
            {site.email}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.address}</p>
        </div>
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
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-sm text-subtle md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Learn, connect, grow.</p>
        </div>
      </div>
    </footer>
  );
}
