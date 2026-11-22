import type { Metadata } from "next";
import Image from "next/image";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("shorts-reels");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Shorts & <em>reels</em></>}
      showcase={
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { src: "/images/services/short-ai-explainer.webp", label: "AI explainers" },
            { src: null, label: "Yours next" },
            { src: "/images/services/short-product-explainer.webp", label: "Product explainers" },
          ].map((p) => (
            <figure key={p.label} className="text-center">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] border-[5px] border-ink-3 bg-ink-2">
                {p.src ? (
                  <Image src={p.src} alt={p.label} fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-cover" />
                ) : (
                  <div className="flex h-full flex-col justify-end bg-orange p-4 text-left text-ink">
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase sm:text-[10px]">Coming next</p>
                    <p className="display mt-2 text-[clamp(1.2rem,2.4vw,2rem)]">Your product, explained.</p>
                  </div>
                )}
              </div>
              <figcaption className="mt-3 font-mono text-[10px] tracking-[0.08em] text-subtle uppercase sm:text-[11px]">{p.label}</figcaption>
            </figure>
          ))}
        </div>
      }
      faqs={[
          { q: "Do you script and shoot the videos?", a: "Yes. Scripting, recording and editing are handled end to end, with your team's input on the message." },
          { q: "Can you reuse our existing content?", a: "Absolutely. Podcasts, sessions and hackathons are cut into scroll-stopping clips, so one recording becomes many shorts." },
          { q: "Which platforms do you publish on?", a: "YouTube Shorts, Instagram Reels, LinkedIn and X, with formats, hooks and captions tuned for each feed." },
        ]}
      cta={{
        title: <>Explain it in <span className="[font-stretch:150%] font-light">60 seconds.</span></>,
        body: "Tell us what developers should understand about your product. We'll turn it into shorts they actually watch.",
      }}
    />
  );
}
