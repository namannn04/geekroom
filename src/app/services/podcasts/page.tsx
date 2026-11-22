import type { Metadata } from "next";
import VideoCard from "@/components/services/VideoCard";
import SectionHead from "@/components/ui/SectionHead";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("podcasts");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Podcasts & <em>discussions</em></>}
      showcase={
        <div>
          <VideoCard src="/images/services/podcast-bifrost.webp" title="Build with Bifrost: One Gateway. Every Model." meta="YouTube · 1:07:01" duration="1:07:01" />
          <p className="mt-3 px-1 text-sm text-subtle">Hosted by Akshay Sharma with Bifrost&apos;s founding and GTM engineers.</p>
        </div>
      }
      extra={
      <section className="shell pb-24 md:pb-32">
        <SectionHead
          index="02"
          title={
            <>
              One episode, <em>a week</em> of content
            </>
          }
          intro="Every conversation keeps working after it airs. We cut it down for every feed your developers scroll."
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Full episode", "YouTube and Spotify, chaptered and searchable."],
            ["Shorts and reels", "The sharpest moments, cut for vertical feeds."],
            ["Posts and threads", "Quotes and takeaways for LinkedIn and X."],
            ["Blog material", "The story written up for search and AI answers."],
          ].map(([t, d], i) => (
            <li key={t} className="relative rounded-[1.25rem] border border-line bg-ink-2 p-6">
              <p className="font-mono text-xs text-orange">0{i + 1}</p>
              <p className="mt-6 font-display text-xl font-bold [font-stretch:90%]">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>
      }
      faqs={[
          { q: "Who hosts the episodes?", a: "Geek Room hosts from our team lead the conversation, like Akshay Sharma on Build with Bifrost, with your founders and engineers as guests." },
          { q: "Do you handle production?", a: "Yes. We plan the episode with you, record, edit, design the thumbnail and publish across our channels." },
          { q: "Can we use the content ourselves?", a: "Of course. You get the full episode and the clips to share on your own channels too." },
        ]}
      cta={{
        title: <>Got a story <span className="[font-stretch:150%] font-light">worth telling?</span></>,
        body: "Tell us about your product and who should be on the mic. We'll shape the episode and the clips around it.",
      }}
    />
  );
}
