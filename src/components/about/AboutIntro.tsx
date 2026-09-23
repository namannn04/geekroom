import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { stats } from "@/data/site";

export default function AboutIntro() {
  const [rating, eventsCount, years] = stats;

  return (
    <section className="container-x relative z-10 pb-20">
      <Reveal className="mx-auto max-w-[1000px] text-center">
        <h2 className="heading-lg">
          Our journey is a testament to our dedication and passion for creating extraordinary events.
        </h2>
        <p className="mx-auto mt-10 max-w-[620px] text-[15px] leading-relaxed text-muted">
          Geek Room started in 2023 as a small WhatsApp group with a big goal: bring together everyone in tech who
          thinks alike. Since then we&apos;ve grown, hit plenty of milestones and built lasting relationships with our
          partners and, above all, our MEMBERS.
        </p>
      </Reveal>

      <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
        <Reveal className="relative mx-auto aspect-[603/346] w-full max-w-[520px]">
          <Image src="/images/brand/logo.png" alt="Geek Room logo" fill sizes="520px" className="object-contain" />
        </Reveal>

        <div className="relative grid h-[300px] grid-cols-2 md:block">
          <StatCard className="md:absolute md:left-[8%] md:top-0" stat={rating} delay={0.1} />
          <StatCard className="md:absolute md:right-0 md:top-[5%]" stat={eventsCount} delay={0.2} />
          <p className="col-span-2 self-center text-center text-sm md:absolute md:left-[50%] md:top-[36%] md:-translate-x-1/2">
            <CountUp to={50000} suffix="+" /> Members
          </p>
          <StatCard className="md:absolute md:left-[40%] md:top-[55%]" stat={years} delay={0.3} />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  className,
  delay,
}: {
  stat: { value: number; suffix: string; label: string };
  className?: string;
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={`flex min-h-[108px] w-full flex-col items-center justify-center bg-surface px-6 py-4 text-center md:w-[208px] ${className}`}
    >
      <span className="font-display text-3xl font-medium">
        <CountUp to={stat.value} suffix={stat.suffix} />
      </span>
      <span className="mt-2 text-sm leading-tight font-medium">{stat.label}</span>
    </Reveal>
  );
}
