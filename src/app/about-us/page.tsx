import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import Timeline from "@/components/about/Timeline";
import GlobalReach from "@/components/about/GlobalReach";
import Team from "@/components/about/Team";
import Voices from "@/components/home/Voices";
// import JoinCta from "@/components/ui/JoinCta";

export const metadata: Metadata = {
  title: "About Us",
  description: "How Geek Room grew from a WhatsApp group into a global builder community of 150K+ developers, founders and 500+ partner companies.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <GlobalReach />
      <Team />
      <Voices index="04" />
      {/* <JoinCta /> */}
    </>
  );
}
