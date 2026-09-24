"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ChinkuBot = dynamic(() => import("@/components/three/ChinkuBot"), { ssr: false });

/**
 * Fixed dock for Chinku, the Geek Room robot. He sits in the bottom-left corner at the top
 * of a page and glides to the bottom-right by the end of it. three.js is only fetched once
 * the browser is idle, and only on screens wide enough that he never covers content.
 */
export default function ChinkuDock() {
  const dock = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let handle = 0;
    const start = () => {
      if (!mq.matches) return;
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      handle = idle(() => setReady(true), { timeout: 2500 });
    };
    start();
    mq.addEventListener("change", start);
    return () => {
      mq.removeEventListener("change", start);
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
    };
  }, []);

  return (
    <div
      ref={dock}
      aria-hidden
      className="pointer-events-none fixed bottom-2 left-0 z-30 hidden h-[168px] w-[110px] will-change-transform md:block"
      style={{ transform: "translate3d(24px,0,0)" }}
    >
      {ready && <ChinkuBot dock={dock} />}
    </div>
  );
}
