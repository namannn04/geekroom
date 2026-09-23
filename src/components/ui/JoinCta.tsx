import Reveal from "./Reveal";
import { site } from "@/data/site";

/** "Join the community" banner shown above the footer on inner pages. */
export default function JoinCta() {
  return (
    <section className="container-x relative z-10 py-20">
      <Reveal className="relative overflow-hidden rounded-md border border-line bg-surface px-6 py-12 md:px-12">
        <span
          aria-hidden
          className="blob -right-20 -top-20 size-80 opacity-60"
          style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-orange))" }}
        />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="heading-md max-w-xl">Hear new announcements & join a wonderful community</h2>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bebas rounded-md bg-fg px-10 py-4 text-base text-bg transition-transform hover:scale-[1.03]"
          >
            Join Now
          </a>
        </div>
      </Reveal>
    </section>
  );
}
