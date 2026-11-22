import type { Metadata } from "next";
import DxReport from "@/components/services/feedback/DxReport";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("developer-feedback");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Developer <em>feedback</em></>}
      showcase={
        <DxReport />
      }
      faqs={[
          { q: "Who gives the feedback?", a: "Developers from our community matched to your target audience: by stack, seniority and the problems your product solves." },
          { q: "What do we get at the end?", a: "A clear DX report: scores by area, the top friction points, direct developer quotes and a prioritized list of fixes." },
          { q: "How is it different from a survey?", a: "Developers complete real tasks with your product and docs, then we follow up with structured questions and recorded user calls." },
        ]}
      cta={{
        title: <>Hear it before <span className="[font-stretch:150%] font-light">the market does.</span></>,
        body: "Tell us which part of your product you want tested and who your users are. We'll recruit the right builders.",
      }}
    />
  );
}
