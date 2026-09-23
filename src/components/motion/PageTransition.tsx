"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { events } from "@/data/events";
import { useLenis } from "./SmoothScroll";

type Phase = "idle" | "cover" | "reveal";

const ease = [0.76, 0, 0.24, 1] as const;

function labelFor(path: string) {
  if (path === "/") return "Home";
  if (path.startsWith("/about")) return "About";
  if (path.startsWith("/contact")) return "Contact";
  if (path.startsWith("/thank-you")) return "Thanks";
  if (path.startsWith("/event/")) return events.find((e) => path.endsWith(`/${e.slug}`))?.title ?? "Event";
  if (path.startsWith("/event")) return "Events";
  return "Geek Room";
}

/**
 * Intercepts internal link clicks, sweeps an angled orange panel (the "/" of the
 * </> mark) across the screen with the destination name, navigates underneath,
 * then pulls the panel away once the new route has rendered.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>("reveal");
  const [label, setLabel] = useState(() => labelFor(pathname));
  const pending = useRef<string | null>(null);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (prefersReducedMotion()) return;

      e.preventDefault();
      pending.current = url.pathname + url.search + url.hash;
      setLabel(labelFor(url.pathname));
      setPhase("cover");
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [onClick]);

  // New route rendered underneath the cover: reset scroll, re-measure triggers, reveal.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setPhase("reveal");
    });
  }, [pathname, lenis]);

  // Clear the reveal layer after it has animated away.
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setPhase("idle"), 1100);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <>
      {children}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="curtain"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[100]"
            initial={false}
          >
            {/* Orange slash leads, ink panel follows */}
            <motion.div
              className="absolute inset-0 bg-orange"
              initial={{ clipPath: phase === "cover" ? "polygon(0 0, 0 0, -20% 100%, -20% 100%)" : "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
              animate={{
                clipPath:
                  phase === "cover"
                    ? "polygon(0 0, 120% 0, 100% 100%, -20% 100%)"
                    : "polygon(120% 0, 120% 0, 100% 100%, 100% 100%)",
              }}
              transition={{ duration: 0.7, delay: phase === "reveal" ? 0.12 : 0, ease }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-ink"
              initial={{ clipPath: phase === "cover" ? "polygon(0 0, 0 0, -20% 100%, -20% 100%)" : "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
              animate={{
                clipPath:
                  phase === "cover"
                    ? "polygon(0 0, 120% 0, 100% 100%, -20% 100%)"
                    : "polygon(120% 0, 120% 0, 100% 100%, 100% 100%)",
              }}
              transition={{ duration: 0.7, delay: phase === "cover" ? 0.12 : 0, ease }}
              onAnimationComplete={() => {
                if (phase === "cover" && pending.current) router.push(pending.current);
              }}
            >
              <motion.p
                className="display px-6 text-center text-[clamp(2.75rem,11vw,9rem)] text-paper"
                initial={{ fontStretch: "50%", opacity: 0 }}
                animate={{ fontStretch: phase === "cover" ? "110%" : "150%", opacity: phase === "cover" ? 1 : 0 }}
                transition={{ duration: 0.8, ease }}
              >
                {label}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
