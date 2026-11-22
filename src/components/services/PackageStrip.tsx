import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ServiceIcon from "@/components/services/ServiceIcon";
import { serviceList } from "@/data/services";

/** "Part of the Developer Growth Package": all ten services, with the current one highlighted. */
export default function PackageStrip({ current, index = "" }: { current?: string; index?: string }) {
  return (
    <section className="shell pb-24 md:pb-32">
      <div className="rounded-[2rem] border border-line bg-ink-2 p-7 md:p-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-orange">{index && `(${index}) `}Developer Growth Package</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.6rem)]">
              One package, <em>every channel</em>
            </h2>
            <p className="mt-4 max-w-[36rem] leading-relaxed text-muted">
              Ten services that work as one developer-relations engine. Content builds awareness, community builds trust, and hackathons turn both into real usage.
            </p>
          </div>
          <Link href="/services" className="btn-ghost">
            See the package <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {serviceList.map((s) => {
            const active = s.slug === current;
            return (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex h-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    active ? "border-orange bg-orange text-ink" : "border-line text-muted hover:border-line-strong hover:text-paper"
                  }`}
                >
                  <span className={`font-mono text-[11px] ${active ? "text-ink/70" : "text-subtle"}`}>{s.index}</span>
                  <ServiceIcon icon={s.icon} className={`size-4 shrink-0 ${active ? "" : "text-orange"}`} />
                  <span className="leading-snug">{s.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
