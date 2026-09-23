import type { ReactNode } from "react";

/** Seamless horizontal marquee; children are rendered twice for the loop. */
export default function Marquee({
  children,
  className = "",
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] ${className}`}>
      <div
        className={`animate-marquee flex w-max group-hover:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
