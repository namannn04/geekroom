import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import Timeline from "@/components/about/Timeline";
import Chapters from "@/components/about/Chapters";
import Team from "@/components/about/Team";
import Voices from "@/components/home/Voices";
// import JoinCta from "@/components/ui/JoinCta";

export const metadata: Metadata = {
  title: "About Us",
  description: "How Geek Room grew from a WhatsApp group into a nationwide builder ecosystem across 400+ colleges and 20+ campus chapters.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <Chapters />
      <Team />
      <Voices index="04" />
      {/* <JoinCta /> */}
    </>
  );
}
