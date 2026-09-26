import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
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
    { Icon: LinkedinIcon, label: "LinkedIn", value: "Geek Room", href: site.socials.linkedin },
    { Icon: InstagramIcon, label: "Instagram", value: "@geekroom__", href: site.socials.instagram },
  ];

  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHead
            as="h1"
            index="Hi"
            title={
              <>
                Let&apos;s <em>talk</em>
              </>
            }
            intro="Partnering on a hackathon, bringing a speaker, or hiring from the community? Drop us a line."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {cards.map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group border-t border-line py-5 transition-colors hover:border-orange"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-orange" />
                  <ArrowUpRight className="size-4 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                </div>
                <p className="label mt-5">{label}</p>
                <p className="mt-1.5 text-sm break-words text-paper">{value}</p>
              </a>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
