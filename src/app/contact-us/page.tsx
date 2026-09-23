import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Geek Room team.",
};

export default function ContactPage() {
  const cards = [
    { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    {
      Icon: MapPin,
      label: "Address",
      value: site.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`,
    },
    { Icon: LinkedinIcon, label: "LinkedIn", value: "Geek Room", href: site.socials.linkedin },
    { Icon: InstagramIcon, label: "Instagram", value: "@geekroom__", href: site.socials.instagram },
  ];

  return (
    <section className="noise relative isolate overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-paper grid-fade absolute inset-0" />
        <span className="absolute -left-20 top-20 size-[520px] rounded-full bg-teal/20 blur-[140px]" />
        <span className="absolute -right-20 bottom-0 size-[520px] rounded-full bg-orange/20 blur-[140px]" />
      </div>

      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-orange">Contact</span>
            <span className="h-px w-8 bg-line-strong" />
            We reply fast
          </p>
          <h1 className="display mt-6 text-[clamp(3rem,8vw,7rem)]">
            Let&apos;s <em>talk</em>
          </h1>
          <p className="mt-6 max-w-[440px] text-lg leading-relaxed text-muted">
            Partnering on a hackathon, bringing a speaker, or hiring from the community — drop us a line.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {cards.map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group rounded-2xl border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-teal" />
                  <ArrowUpRight className="size-4 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                </div>
                <p className="label mt-5">{label}</p>
                <p className="mt-1.5 text-sm break-words text-paper">{value}</p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
