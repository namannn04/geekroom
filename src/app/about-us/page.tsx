import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Blobs from "@/components/ui/Blobs";
import AboutIntro from "@/components/about/AboutIntro";
import Milestones from "@/components/about/Milestones";
import Team from "@/components/about/Team";
import Reviews from "@/components/about/Reviews";

export const metadata: Metadata = {
  title: "About Us",
  description: "How Geek Room grew from a WhatsApp group into one of India's biggest student tech communities.",
};

export default function AboutPage() {
  return (
    <div className="relative isolate">
      <Blobs
        className="-z-10 h-[1100px]"
        blobs={[
          { color: "#13a7b4", className: "-left-40 top-[260px] size-[560px] opacity-90" },
          { color: "#c9621c", className: "-right-40 top-[180px] size-[620px] opacity-90" },
        ]}
      />
      <PageHeader title="About Us" />
      <AboutIntro />
      <Milestones />
      <Team />
      <Reviews />
    </div>
  );
}
