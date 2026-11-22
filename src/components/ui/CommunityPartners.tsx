import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { communityPartners } from "@/data/site";

export default function CommunityPartners({ className = "" }: { className?: string }) {
  return (
    <section className={`shell ${className}`}>
      <p className="label">Community partners</p>
      <ul className="mt-3 flex flex-wrap border-t border-line">
        {communityPartners.map((p) => (
          <li key={p.name} className="border-b border-line">
            {(() => {
              const cls =
                "group flex h-24 items-center gap-3 pr-8 transition-colors hover:text-orange";
              const inner = (
                <>
                  <Image
                    src={p.logo}
                    alt={"wordmark" in p ? "" : p.name}
                    width={240}
                    height={55}
                    className={`w-auto opacity-90 transition-opacity group-hover:opacity-100 ${"height" in p ? p.height : "h-10"}`}
                  />
                  {"wordmark" in p && <span className="font-display text-3xl font-extrabold [font-stretch:90%]">{p.name}</span>}
                  <ArrowUpRight className="size-5 text-subtle group-hover:text-orange" />
                </>
              );
              return p.url.startsWith("/") ? (
                <Link href={p.url} className={cls}>{inner}</Link>
              ) : (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              );
            })()}
          </li>
        ))}
      </ul>
    </section>
  );
}
