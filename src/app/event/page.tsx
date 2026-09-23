import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Blobs from "@/components/ui/Blobs";
import Reveal from "@/components/ui/Reveal";
import EventGrid from "@/components/events/EventGrid";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Hackathons, meetups and tech events organised by Geek Room across India.",
};

export default function EventsPage() {
  return (
    <div className="relative isolate">
      <Blobs
        className="-z-10"
        blobs={[
          { color: "#c9621c", className: "left-[15%] top-[300px] size-[560px] opacity-80" },
          { color: "#1d3bd6", className: "right-[0%] top-[420px] size-[600px] opacity-80" },
        ]}
      />
      <PageHeader title="Our Events" />
      <section className="container-x relative z-10 pt-16 pb-24 md:pt-24">
        <Reveal>
          <h2 className="heading-lg text-center">Explore the best hackathons</h2>
        </Reveal>
        <div className="mt-12">
          <EventGrid items={events} />
        </div>
      </section>
    </div>
  );
}
