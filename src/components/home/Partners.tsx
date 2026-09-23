import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { partnerGrid, partners } from "@/data/site";

export default function Partners() {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="blob left-[5%] top-[20%] size-[420px] bg-[#b3141f]/70" />
        <span className="blob right-[5%] top-[10%] size-[520px] bg-[#0b3fb5]/70" />
      </div>

      <div className="container-x">
        <Reveal>
          <h2 className="heading-lg">Partners</h2>
        </Reveal>

        {/* Staggered logo wall (desktop) */}
        <Reveal className="mt-10 hidden grid-cols-6 md:grid" delay={0.1}>
          {partnerGrid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              if (cell === "big") {
                // GitHub tile spans the left 2x2 block in rows 1-2
                if (r !== 1) return null;
                return (
                  <div
                    key={key}
                    className="col-span-1 row-span-2 grid aspect-[1/2] place-items-center bg-surface transition-colors hover:bg-surface-2 lg:col-span-1"
                  >
                    <Image src="/images/partners/github.png" alt="GitHub" width={96} height={96} />
                  </div>
                );
              }
              if (cell === null) {
                // The "Our Partners" label sits in the last column of row 1
                if (r === 1 && c === 5)
                  return (
                    <div key={key} className="grid aspect-square place-items-center bg-white text-sm text-black">
                      Our Partners
                    </div>
                  );
                return <div key={key} className="aspect-square" />;
              }
              if (cell === "label") return null;
              return (
                <div
                  key={key}
                  className="group grid aspect-square place-items-center border border-white/5 bg-surface transition-colors hover:bg-surface-2"
                  title={cell.name}
                >
                  <Image
                    src={cell.logo}
                    alt={cell.name}
                    width={120}
                    height={29}
                    className="h-auto w-[65%] max-w-[120px] opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
              );
            }),
          )}
        </Reveal>

        {/* Simple grid (mobile) */}
        <div className="mt-8 grid grid-cols-3 gap-px bg-white/5 md:hidden">
          {partners.map((p) => (
            <div key={p.name} className="grid aspect-square place-items-center bg-surface p-3">
              <Image src={p.logo} alt={p.name} width={120} height={29} className="h-auto w-[80%] max-h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
