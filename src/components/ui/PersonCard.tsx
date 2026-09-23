import Image from "next/image";
import type { Person } from "@/data/site";
import { LinkedinIcon, ShareIcon } from "./Icons";

/**
 * Photo card with a notched share button that reveals a LinkedIn link on hover.
 */
export default function PersonCard({ person, className = "" }: { person: Person; className?: string }) {
  return (
    <article className={`group relative bg-surface ${className}`}>
      <div className="relative aspect-[280/286] overflow-hidden">
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="(min-width: 768px) 290px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute left-5 top-[calc(100%*286/400)] z-10 -translate-y-1/2 md:top-auto md:bottom-[114px] md:translate-y-1/2">
        <div className="relative flex flex-col items-center">
          <span className="grid size-12 place-items-center rounded-full bg-surface text-white/70 ring-4 ring-surface">
            <ShareIcon />
          </span>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${person.name} on LinkedIn`}
            className="pointer-events-none absolute bottom-full mb-2 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
          >
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </div>

      <div className="px-5 pt-10 pb-6">
        <h3 className="font-display text-lg font-semibold">{person.name}</h3>
        <p className="mt-1 text-sm text-fg/85">{person.role}</p>
      </div>
    </article>
  );
}
