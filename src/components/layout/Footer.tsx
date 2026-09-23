import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerColumns, site } from "@/data/site";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";

export default function Footer() {
  const socials = [
    { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="shell grid gap-12 pt-20 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/brand/logo.png" alt="" width={44} height={38} className="h-9 w-auto" />
            <span className="font-display text-lg font-bold uppercase">Geek Room</span>
          </Link>
          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-muted">
            One of India&apos;s biggest student tech communities — hackathons, meetups and speaker sessions for 50,000+
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
            <p className="eyebrow">{col.title}</p>
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
          <p className="eyebrow">Contact</p>
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

      {/* Oversized outlined wordmark */}
      <div aria-hidden className="shell select-none">
        <p className="display translate-y-[18%] text-center text-[15vw] leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--line-strong)] lg:text-[196px]">
          Geek Room
        </p>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 font-mono text-[11px] tracking-[0.12em] text-subtle uppercase md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Learn — Connect — Grow</p>
        </div>
      </div>
    </footer>
  );
}
