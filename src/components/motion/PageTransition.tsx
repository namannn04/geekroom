"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Let Next.js navigate immediately, including hashes, modified clicks and history. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
