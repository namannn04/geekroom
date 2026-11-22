import type { Metadata } from "next";
import Image from "next/image";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("seo-geo");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>SEO & <em>GEO</em></>}
      showcase={
        <div className="space-y-4">
          {[
            { src: "/images/services/seo-infer-a-thon.webp", w: 1230, h: 600, q: "infer a thon", note: "Google AI Overview names Geek Room and links our page" },
            { src: "/images/services/seo-global-ai-hackathon.webp", w: 1230, h: 720, q: "global ai hackathon", note: "Geek Room's event in the top result and the AI Overview" },
          ].map((s) => (
            <figure key={s.q} className="overflow-hidden rounded-[1.5rem] border border-line bg-ink-2 p-3">
              <Image src={s.src} alt={`Google results for "${s.q}"`} width={s.w} height={s.h} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full rounded-[1rem]" />
              <figcaption className="px-2 pt-3 pb-1 text-sm text-muted">
                <span className="font-semibold text-paper">&ldquo;{s.q}&rdquo;</span> · {s.note}
              </figcaption>
            </figure>
          ))}
        </div>
      }
      faqs={[
          { q: "What is GEO?", a: "Generative engine optimization: structuring content so AI assistants like ChatGPT, Perplexity and Google AI Overviews cite it when developers ask about your space." },
          { q: "Do you work on our site or yours?", a: "Both. We publish content across our channels and developer publications, and advise on the pages on your own site." },
          { q: "How do you produce content at this pace?", a: "Our open-source pipeline turns research into reviewed drafts as GitHub PRs, and engineers review every piece before it ships." },
        ]}
      cta={{
        title: <>Be the answer <span className="[font-stretch:150%] font-light">they find.</span></>,
        body: "Tell us the searches and questions that matter for your product. We'll build the content to win them.",
      }}
    />
  );
}
