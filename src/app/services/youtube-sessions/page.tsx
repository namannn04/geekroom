import type { Metadata } from "next";
import VideoCard from "@/components/services/VideoCard";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("youtube-sessions");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Sessions on <em>YouTube</em> & more</>}
      showcase={
        <div>
          <VideoCard src="/images/services/youtube-seo-pipeline.webp" title="Open-Source SEO Content Pipeline with Graftcode and MCP" meta="YouTube · 9:52" duration="9:52" />
          <p className="mt-3 px-1 text-sm text-subtle">From our channel: a full partner workflow, built live on screen.</p>
        </div>
      }
      faqs={[
          { q: "What does a session look like?", a: "A real project built end to end with your product, either recorded as a tutorial or streamed live with Q&A from our community." },
          { q: "Where are sessions published?", a: "On YouTube first, then LinkedIn Live, X, Instagram and our community calls, so one session reaches every feed." },
          { q: "Will it keep getting views?", a: "That's the goal. Sessions are titled, chaptered and optimized for search so they keep pulling views for months." },
        ]}
      cta={{
        title: <>Show it <span className="[font-stretch:150%] font-light">being built.</span></>,
        body: "Tell us what developers should build with your product. We'll plan the session, run it and publish it everywhere.",
      }}
    />
  );
}
