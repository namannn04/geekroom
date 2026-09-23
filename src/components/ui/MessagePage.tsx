import Link from "next/link";
import Blobs from "./Blobs";
import Reveal from "./Reveal";
import JoinCta from "./JoinCta";

/** Centered message layout shared by the thank-you and 404 pages. */
export default function MessagePage({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden">
      <Blobs
        className="-z-10"
        blobs={[
          { color: "#13a7b4", className: "-left-20 top-[200px] size-[480px] opacity-70" },
          { color: "#f15a22", className: "-right-20 top-[260px] size-[480px] opacity-70" },
        ]}
      />
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-[140px] text-center">
        <Reveal>
          {eyebrow && <p className="font-display text-2xl font-semibold capitalize md:text-4xl">{eyebrow}</p>}
          <h1 className="heading-xl mt-2">{title}</h1>
          {body && <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-relaxed text-muted">{body}</p>}
          <Link
            href="/"
            className="btn-bebas mt-10 inline-block rounded-sm bg-fg px-8 py-3.5 text-base text-bg transition-transform hover:scale-105"
          >
            Back to home
          </Link>
        </Reveal>
      </section>
      <JoinCta />
    </div>
  );
}
