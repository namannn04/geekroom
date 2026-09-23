import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DotField from "./DotField";
import GeekMark from "./GeekMark";
import Reveal from "./Reveal";

/** Full-height centred message used by the thank-you and 404 pages. */
export default function MessagePage({ label, title, body }: { label?: string; title: string; body?: string }) {
  return (
    <section className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <DotField className="absolute inset-0 opacity-60" />
        <span className="absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/15 blur-[140px]" />
      </div>
      <Reveal className="shell flex flex-col items-center text-center">
        <GeekMark className="w-28" />
        {label && <p className="label mt-10">{label}</p>}
        <h1 className="display mt-4 text-[clamp(4rem,16vw,13rem)]">{title}</h1>
        {body && <p className="mt-6 max-w-[480px] text-lg leading-relaxed text-muted">{body}</p>}
        <Link href="/" className="btn-primary mt-10">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </Reveal>
    </section>
  );
}
