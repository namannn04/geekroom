import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import JoinCta from "@/components/ui/JoinCta";
import EventExplorer from "@/components/events/EventExplorer";

export const metadata: Metadata = {
  title: "Events",
  description: "Hackathons, meetups and tech events organised by Geek Room across India.",
};

export default function EventsPage() {
  return (
    <>
      <section className="noise relative isolate overflow-hidden pt-36 pb-12 md:pt-44">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="grid-paper grid-fade absolute inset-0" />
          <span className="absolute left-[20%] top-10 size-[520px] rounded-full bg-orange/15 blur-[140px]" />
          <span className="absolute right-0 top-40 size-[520px] rounded-full bg-teal/20 blur-[140px]" />
        </div>
        <div className="shell">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-orange">Events</span>
              <span className="h-px w-8 bg-line-strong" />
              Hackathons · Meetups
            </p>
            <h1 className="display mt-6 text-[clamp(3rem,9vw,8.5rem)]">
              Explore the <em>best</em> hackathons
            </h1>
            <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-muted">
              Every Geek Room event, from flagship Code Cubicle editions to North India&apos;s largest hackathon.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-24 md:pb-32">
        <EventExplorer />
      </section>

      <JoinCta />
    </>
  );
}
