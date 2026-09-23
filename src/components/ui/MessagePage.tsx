import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DotField from "./DotField";
import GeekMark from "./GeekMark";
import Reveal from "./Reveal";

/** Full-height centred message used by the thank-you and 404 pages. */
export default function MessagePage({ label, title, body }: { label?: string; title: string; body?: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24">
      <DotField className="absolute inset-0 -z-10 opacity-70" />
      <Reveal className="shell flex flex-col items-center text-center">
        <GeekMark className="w-28" />
        <h1 className="display mt-10 text-[clamp(4rem,16vw,13rem)]">{title}</h1>
        {label && <p className="mt-2 font-display text-2xl font-extrabold uppercase [font-stretch:120%]">{label}</p>}
        {body && <p className="mt-6 max-w-[480px] text-lg leading-relaxed text-muted">{body}</p>}
        <Link href="/" className="btn-primary mt-10">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </Reveal>
    </section>
  );
}
