import type { Metadata } from "next";
import { stat } from "@/data/stats";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("developer-marketing");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Developer <em>marketing</em></>}
      showcase={
        <div className="space-y-3">
          {[
            [stat.whatsappGroups, "WhatsApp groups", "Active builder groups across colleges, cities and tech stacks."],
            [stat.builders, "Builders reached", "Developers, founders and students in our community."],
            [stat.partners, "Partner companies", "A network that amplifies what we launch together."],
          ].map(([v, t, d]) => (
            <div key={t} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-6 rounded-[1.25rem] border border-line bg-ink-2 p-6">
              <p className="display text-[clamp(2.4rem,4vw,3.4rem)] text-orange">{v}</p>
              <div>
                <p className="font-display text-lg font-bold [font-stretch:90%]">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-[1.25rem] bg-orange p-7 text-ink">
            <p className="font-mono text-xs tracking-[0.06em] uppercase">The difference</p>
            <p className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Not ads in a feed. Recommendations from a community developers already trust.</p>
          </div>
        </div>
      }
      faqs={[
          { q: "What does a launch campaign include?", a: "A coordinated push on launch day across our WhatsApp groups, LinkedIn, X, Instagram, YouTube and email, followed by activations that get builders hands-on." },
          { q: "Is this paid advertising?", a: "No. Your product reaches developers through a community they already trust, framed as something worth trying, not an ad." },
          { q: "Can it run all year?", a: "Yes. Beyond launches we keep an always-on presence: a steady drumbeat of posts, updates and conversations." },
        ]}
      cta={{
        title: <>Launch where <span className="[font-stretch:150%] font-light">builders talk.</span></>,
        body: "Tell us what you're launching and who it's for. We'll plan the campaign across every channel we run.",
      }}
    />
  );
}
