import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHead from "@/components/ui/SectionHead";
// import JoinCta from "@/components/ui/JoinCta";
import EventIndex, { EventIndexFromUrl } from "@/components/events/EventIndex";

export const metadata: Metadata = {
  title: "Events",
  description: "Hackathons, global hackathons, vibe-a-thons, meetups and hiring events organised by Geek Room.",
};

export default function EventsPage() {
  return (
    <>
      <section className="shell pt-36 pb-12 md:pt-44">
        <SectionHead
          as="h1"
          index="07"
          title={
            <>
              Explore the <em>best</em> hackathons
            </>
          }
          intro="Every Geek Room edition on one axis, from the first Code Kshetra in 2024 to Code Cubicle 6.0 in 2026: in-person finales, plus global hackathons and vibe-a-thons open to builders anywhere. Pick a dot or a row."
        />
      </section>

      <section className="shell pb-24 md:pb-32">
        {/* ?category= is only known in the browser; the unfiltered index is prerendered meanwhile */}
        <Suspense fallback={<EventIndex />}>
          <EventIndexFromUrl />
        </Suspense>
      </section>

      {/* <JoinCta /> */}
    </>
  );
}
