import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { features } from "@/data/site";

export default function Features() {
  return (
    <section className="container-x relative z-10 flex flex-col gap-16 py-16 md:gap-[70px]">
      {features.map((f, i) => (
        <div
          key={f.title}
          className={`flex flex-col items-center gap-8 md:gap-10 ${i % 2 ? "md:flex-row-reverse" : "md:flex-row"}`}
        >
          <Reveal className="relative aspect-[590/460] w-full overflow-hidden md:w-1/2" y={60}>
            <Image
              src={f.image}
              alt={f.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </Reveal>
          <Reveal className="w-full md:w-1/2" delay={0.1}>
            <h2 className="heading-md md:text-[52px]">{f.title}</h2>
            <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-muted">{f.body}</p>
          </Reveal>
        </div>
      ))}
    </section>
  );
}
