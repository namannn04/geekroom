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

  // Scroll reveals measure their trigger points once. When the page height changes later
  // (filters, accordions, late images), those points go stale: on a page that got shorter,
  // reveals near the bottom sit past the end of the page and never fire, leaving the CTA
  // panel clipped to a slash and the footer hidden. Re-measure whenever the height changes.
  useEffect(() => {
    let height = document.body.scrollHeight;
    let timer = 0;
    const observer = new ResizeObserver(() => {
      const next = document.body.scrollHeight;
      if (Math.abs(next - height) < 2) return;
      height = next;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return children;
}
