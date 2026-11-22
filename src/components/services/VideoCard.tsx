import Image from "next/image";
import { Play } from "lucide-react";

/** A video thumbnail with a play badge, duration and title row, like a YouTube card. */
export default function VideoCard({
  src,
  title,
  meta,
  duration,
  priority = false,
}: {
  src: string;
  title: string;
  meta: string;
  duration: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-ink-2 p-3">
      <div className="group relative aspect-video overflow-hidden rounded-[1rem]">
        <Image src={src} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-ink/70 text-paper backdrop-blur transition-transform duration-300 group-hover:scale-110">
            <Play className="size-6 translate-x-0.5 fill-current" />
          </span>
        </span>
        <span className="absolute right-3 bottom-3 rounded-md bg-ink/80 px-2 py-1 font-mono text-xs text-paper">{duration}</span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-2 pt-4 pb-2">
        <p className="font-display text-lg leading-snug font-bold [font-stretch:90%]">{title}</p>
        <p className="font-mono text-[11px] tracking-[0.06em] text-subtle uppercase">{meta}</p>
      </div>
    </div>
  );
}
