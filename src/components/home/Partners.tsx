import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { partners } from "@/data/site";

export default function Partners() {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="blob left-[5%] top-[20%] size-[420px] bg-[#b3141f]/70" />
        <span className="blob right-[5%] top-[10%] size-[520px] bg-[#0b3fb5]/70" />
      </div>

      <div className="container-x relative">
        <Reveal className="md:absolute md:top-[calc(12.5%*0.5)] md:left-[100px]">
          <h2 className="heading-lg">Partners</h2>
        </Reveal>

        {/* Staggered logo wall: 8 columns x 4 rows of square tiles */}
        <Reveal
          delay={0.1}
          className="mt-8 grid grid-cols-3 gap-px md:mt-0 md:grid-cols-8 md:grid-rows-4 md:gap-0"
        >
          {partners.map((p) => (
            <div
              key={p.name}
              title={p.name}
              style={{ "--c": p.col, "--r": p.row } as React.CSSProperties}
              className={`group grid aspect-square place-items-center border border-white/5 bg-surface transition-colors hover:bg-surface-2 md:[grid-column-start:var(--c)] md:[grid-row-start:var(--r)] ${
                p.big ? "col-span-3 aspect-[3/2] md:col-span-2 md:row-span-2 md:aspect-square" : ""
              }`}
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={p.big ? 128 : 120}
                height={p.big ? 128 : 29}
                className={`h-auto opacity-90 transition-opacity group-hover:opacity-100 ${
                  p.big ? "w-20 md:w-32" : "w-[70%] max-w-[120px]"
                }`}
              />
            </div>
          ))}
          <div className="col-span-3 grid place-items-center bg-white py-6 text-sm text-black md:col-span-1 md:col-start-8 md:row-start-2 md:aspect-square md:py-0">
            Our Partners
          </div>
        </Reveal>
      </div>
    </section>
  );
}
