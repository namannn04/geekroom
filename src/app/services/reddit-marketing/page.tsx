import type { Metadata } from "next";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getService } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";

const service = getService("reddit-marketing");

export const metadata: Metadata = pageMetadata({
  title: service.title,
  description: service.intro,
  path: service.href,
});

export default function Page() {
  return (
    <ServiceDetail
      service={service}
      title={<>Reddit <em>marketing</em></>}
      showcase={
        <div className="space-y-3">
          <div className="rounded-[1.5rem] bg-orange p-8 text-ink">
            <p className="font-mono text-xs tracking-[0.06em] uppercase">Track record</p>
            <p className="display mt-4 text-[clamp(4rem,9vw,7rem)]">10K+</p>
            <p className="mt-2 max-w-[24rem] text-lg leading-snug">views per campaign, delivered for multiple partner companies.</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-ink-2 p-6">
            <p className="label">Typical communities</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {["r/programming", "r/MachineLearning", "r/LocalLLaMA", "r/Python", "r/webdev", "r/devops", "r/datascience", "r/SideProject"].map((r) => (
                <li key={r} className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-paper">
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">We follow every subreddit&apos;s rules and Reddit&apos;s guidelines. No spam, no fake accounts, ever.</p>
          </div>
        </div>
      }
      faqs={[
          { q: "Isn't marketing on Reddit risky?", a: "Only when it's done badly. We lead with value (tutorials, benchmarks, honest stories), follow each subreddit's rules and Reddit's guidelines, and never use fake accounts." },
          { q: "Do we need to be involved?", a: "For launch threads and AMAs, yes: developers want to hear from your team directly. We handle the mapping, posts and ongoing engagement." },
          { q: "Which subreddits do you target?", a: "Wherever your users discuss tools, problems and alternatives, from r/programming and r/MachineLearning to niche communities for your stack." },
        ]}
      cta={{
        title: <>Show up <span className="[font-stretch:150%] font-light">the right way.</span></>,
        body: "Tell us about your product and your users. We'll map the communities and plan a value-first presence.",
      }}
    />
  );
}
