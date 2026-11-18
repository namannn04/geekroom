import Hero from "@/components/home/Hero";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import Offerings from "@/components/home/Offerings";
import Impact from "@/components/home/Impact";
import Story from "@/components/home/Story";
import Speakers from "@/components/home/Speakers";
import Partners from "@/components/home/Partners";
import CommunityPartners from "@/components/ui/CommunityPartners";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
// import JoinCta from "@/components/ui/JoinCta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Offerings />
      <Impact />
      <Story />
      <Speakers />
      <Partners />
      <CommunityPartners className="pb-24 md:pb-32" />
      <Testimonials />
      <Faq />
      {/* <JoinCta /> */}
    </>
  );
}
