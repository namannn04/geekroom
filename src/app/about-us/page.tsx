import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import Timeline from "@/components/about/Timeline";
import Team from "@/components/about/Team";
import Voices from "@/components/home/Voices";
import JoinCta from "@/components/ui/JoinCta";

export const metadata: Metadata = {
  title: "About Us",
  description: "How Geek Room grew from a WhatsApp group into one of India's biggest student tech communities.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <Team />
      <Voices index="03" />
      <JoinCta />
    </>
  );
}
