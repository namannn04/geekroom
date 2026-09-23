import Link from "next/link";
import { footerLinks, site } from "@/data/site";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-surface pt-14 pb-8">
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5">
        {footerLinks.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[15px] text-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative mt-12 flex items-center justify-center gap-6 px-5">
        <span className="absolute inset-x-[5%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {[
          { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
          { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
        ].map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="relative grid h-[50px] w-[70px] place-items-center rounded-md border border-white/40 bg-surface text-white/60 transition-colors hover:border-white hover:text-white"
          >
            <Icon className="size-6" />
          </a>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-3 px-5 text-sm md:flex-row md:px-10">
        <Link href="/contact-us" className="text-muted transition-colors hover:text-fg">
          Contact : {site.email}
        </Link>
        <p className="text-fg/90">
          All rights reserved by {site.name} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
