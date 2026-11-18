import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { communityPartners } from "@/data/site";

export default function CommunityPartners({ className = "" }: { className?: string }) {
  return (
    <section className={`shell ${className}`}>
      <p className="label">Community partners</p>
      <ul className="mt-3 flex flex-wrap border-t border-line">
        {communityPartners.map((p) => (
          <li key={p.name} className="border-b border-line">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 items-center gap-3 py-5 pr-8 font-display text-3xl font-extrabold [font-stretch:90%] transition-colors hover:text-orange"
            >
              <Image src={p.logo} alt={p.name} width={240} height={55} className="h-10 w-auto opacity-90 transition-opacity group-hover:opacity-100" />
              <ArrowUpRight className="size-5 text-subtle group-hover:text-orange" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
