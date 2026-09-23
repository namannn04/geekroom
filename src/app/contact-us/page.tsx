import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Blobs from "@/components/ui/Blobs";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Geek Room team.",
};

export default function ContactPage() {
  const items = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    {
      label: "Address",
      value: site.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`,
    },
  ];

  return (
    <div className="relative isolate overflow-hidden">
      <Blobs
        className="-z-10"
        blobs={[
          { color: "#0a57ff", className: "-left-20 top-[80px] size-[520px] opacity-80" },
          { color: "#00f0ff", className: "left-[5%] top-[380px] size-[560px] opacity-90" },
          { color: "#ff5a3c", className: "-right-20 top-[160px] size-[520px] opacity-80" },
          { color: "#ffa066", className: "right-[10%] top-[420px] size-[420px] opacity-80" },
        ]}
      />
      <PageHeader title="Contact Us" />

      <section className="container-x relative z-10 pt-10 pb-28 md:pt-16">
        <Reveal className="grid bg-surface py-6 md:grid-cols-2 md:py-7">
          {items.map((it, i) => (
            <a
              key={it.label}
              href={it.href}
              target={i === 1 ? "_blank" : undefined}
              rel={i === 1 ? "noopener noreferrer" : undefined}
              className={`group mx-6 flex flex-col items-center py-4 text-center md:mx-7 md:border-x md:border-white/20 ${
                i === 1 ? "border-t border-white/10 md:ml-0 md:border-t-0 md:border-l-0" : ""
              }`}
            >
              <span className="font-display text-2xl font-medium">{it.label}</span>
              <span className="mt-3 text-[15px] text-fg/85 transition-colors group-hover:text-teal">{it.value}</span>
            </a>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
