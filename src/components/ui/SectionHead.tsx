import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Numbered section header: `01 — LABEL` eyebrow, big display title, optional intro. */
export default function SectionHead({ index, label, title, intro, align = "left", className = "" }: Props) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="text-orange">{index}</span>
        <span className="h-px w-8 bg-line-strong" />
        {label}
      </p>
      <h2 className="display mt-5 text-[clamp(2.4rem,6vw,5.25rem)]">{title}</h2>
      {intro && (
        <p className={`mt-6 max-w-[560px] text-base leading-relaxed text-muted md:text-lg ${centered ? "mx-auto" : ""}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
