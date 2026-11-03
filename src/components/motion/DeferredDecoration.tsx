"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";

class DecorationBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Keep optional graphics out of the critical loading path and off small screens. */
export default function DeferredDecoration({ children, fallback, className = "", minWidth = 1024 }: {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  minWidth?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px) and (prefers-reduced-motion: no-preference)`);
    let visible = false;
    let idle: number | undefined;
    const cancel = () => {
      if (idle !== undefined) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
        idle = undefined;
      }
    };
    const update = () => {
      cancel();
      if (!media.matches || !visible || document.hidden) {
        setReady(false);
        return;
      }
      const start = () => { idle = undefined; setReady(true); };
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 2500 })
        : window.setTimeout(start, 1200);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: "100px" });
    if (root.current) observer.observe(root.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      cancel();
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [minWidth]);

  return <div ref={root} className={className} aria-hidden>
    {ready ? <DecorationBoundary fallback={fallback}>{children}</DecorationBoundary> : fallback}
  </div>;
}
