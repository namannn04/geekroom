import PersonCard from "@/components/ui/PersonCard";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { speakers } from "@/data/site";

export default function Speakers() {
  const [samyam, nishchay, ayon, manav, sonu] = speakers;

  return (
    <section className="container-x relative z-10 py-16 md:py-28">
      <div className="grid gap-5 md:grid-cols-[1fr_280px_280px] md:gap-x-10">
        {/* Column 1: heading, counter and one card */}
        <div className="flex flex-col">
          <Reveal>
            <h2 className="heading-lg">Expert insights from our speakers</h2>
            <p className="mt-10 font-display text-6xl font-semibold text-white/25 md:text-7xl">
              <CountUp to={35} suffix="+" />
            </p>
            <p className="mt-1 text-[15px]">Awesome members</p>
          </Reveal>
          <Reveal className="mt-10 w-full md:ml-auto md:max-w-[324px]" delay={0.1}>
            <PersonCard person={ayon} />
          </Reveal>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-5">
          <Reveal delay={0.1}>
            <PersonCard person={samyam} />
          </Reveal>
          <Reveal delay={0.2}>
            <PersonCard person={manav} />
          </Reveal>
        </div>

        {/* Column 3, offset down for the staggered look */}
        <div className="flex flex-col gap-5 md:pt-[100px]">
          <Reveal delay={0.15}>
            <PersonCard person={nishchay} />
          </Reveal>
          <Reveal delay={0.25}>
            <PersonCard person={sonu} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
