import ServiceHero from "@/components/services/ServiceHero";
import ServiceIcon from "@/components/services/ServiceIcon";
import ServiceFaq from "@/components/services/ServiceFaq";
import ServiceCta from "@/components/services/ServiceCta";
import PackageStrip from "@/components/services/PackageStrip";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import { contactHref, type Service } from "@/data/services";

type Props = {
  service: Service;
  /** Title with an <em> accent, e.g. <>Podcasts & <em>discussions</em></> */
  title: React.ReactNode;
  /** Proof or demo shown beside the service points */
  showcase: React.ReactNode;
  /** Optional heading for the points section */
  pointsTitle?: React.ReactNode;
  /** Optional extra section between the points and the package strip */
  extra?: React.ReactNode;
  faqs?: { q: string; a: string }[];
  cta: { title: React.ReactNode; body: string };
};

/** Shared layout for a package service page. */
export default function ServiceDetail({ service, title, showcase, pointsTitle, extra, faqs, cta }: Props) {
  return (
    <>
      <ServiceHero
        icon={<ServiceIcon icon={service.icon} className="size-6" />}
        label={`Service ${service.index} · ${service.eyebrow}`}
        title={title}
        intro={service.intro}
        primary={{ href: contactHref(service.topic), label: "Start a conversation" }}
        secondary={{ href: "#how", label: "How it works" }}
        titleWidth="max-w-[16ch]"
      />

      <section id="how" className="shell grid scroll-mt-28 gap-12 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-start [&>*]:min-w-0">
        <div>
          <SectionHead
            size="sm"
            index="01"
            title={pointsTitle ?? (
              <>
                What you <em>get</em>
              </>
            )}
          />
          <ol className="mt-10 border-t border-line">
            {service.points.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-5">
                <span className="font-mono text-xs text-orange tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-bold [font-stretch:90%]">{p.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {service.channels && (
            <div className="mt-8">
              <p className="label">{service.channels.label}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.channels.items.map((c) => (
                  <li key={c} className="rounded-full border border-line-strong px-4 py-2 text-sm text-paper">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Reveal className="lg:sticky lg:top-28">{showcase}</Reveal>
      </section>

      {extra}

      <PackageStrip current={service.slug} />

      {faqs && faqs.length > 0 && <ServiceFaq index={extra ? "03" : "02"} faqs={faqs} />}

      <ServiceCta
        title={cta.title}
        body={cta.body}
        href={contactHref(service.topic)}
        secondary={{ href: "/services", label: "See all ten services" }}
      />
    </>
  );
}

/** Card wrapper used by showcases */
export function ShowcaseCard({ children, caption, className = "" }: { children: React.ReactNode; caption?: React.ReactNode; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[1.5rem] border border-line bg-ink-2">{children}</div>
      {caption && <figcaption className="mt-3 px-1 text-sm text-subtle">{caption}</figcaption>}
    </figure>
  );
}
