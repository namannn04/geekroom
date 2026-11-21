import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  label: string;
  title: React.ReactNode;
  intro: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** Width of the title in ch, so long titles wrap where they should */
  titleWidth?: string;
  children?: React.ReactNode;
};

/** Shared top of every service page: back link, label, big title, intro and two actions, then an optional demo. */
export default function ServiceHero({ icon, label, title, intro, primary, secondary, titleWidth = "max-w-[15ch]", children }: Props) {
  return (
    <section className="relative pt-32 md:pt-40">
      <div className="shell">
        <Link href="/services" className="btn-ghost mb-10 !py-2">
          <ArrowLeft className="size-3.5" /> All services
        </Link>
        <div className="flex items-center gap-3 text-paper">
          {icon}
          <p className="label">{label}</p>
        </div>
        <h1 className={`display mt-8 text-[clamp(3rem,9vw,7.5rem)] ${titleWidth}`}>{title}</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[40rem] text-lg leading-relaxed text-muted md:text-xl">{intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={primary.href} className="btn-primary">
              {primary.label} <ArrowUpRight className="size-4" />
            </Link>
            {secondary && (
              <a href={secondary.href} className="btn-ghost">
                {secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="shell relative mt-16 md:mt-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-10 -top-10 h-64 rounded-full bg-orange/15 blur-[100px]" />
          <div className="relative">{children}</div>
        </div>
      )}
    </section>
  );
}
