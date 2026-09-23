import { ArrowUpRight } from "lucide-react";
import GeekMark from "./GeekMark";
import Reveal from "./Reveal";
import { site } from "@/data/site";

/** Closing call-to-action band used at the bottom of most pages. */
export default function JoinCta() {
  return (
    <section className="shell pb-24 md:pb-32">
      <Reveal className="noise relative overflow-hidden rounded-[2rem] bg-signal px-6 py-16 text-ink md:px-16 md:py-24">
        <div aria-hidden className="grid-paper absolute inset-0 opacity-40 [--line:rgba(8,9,10,0.12)]" />
        <GeekMark className="absolute -right-10 -bottom-16 w-[340px] opacity-20 mix-blend-multiply md:w-[480px]" />
        <div className="relative max-w-[820px]">
          <p className="font-mono text-xs tracking-[0.18em] uppercase">Stay in the loop</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5.5rem)]">
            Hear it first. <em>Join the room.</em>
          </h2>
          <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-ink/75">
            New hackathons, meetups and announcements land on our socials before anywhere else.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-ink text-paper hover:bg-ink/85"
            >
              Join on LinkedIn <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-ink/30 hover:bg-ink/10"
            >
              Follow on Instagram <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
