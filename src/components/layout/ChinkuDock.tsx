"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChinkuBot = dynamic(() => import("@/components/three/ChinkuBot"), { ssr: false });

/**
 * A full-width strip along the bottom of the screen where Chinku, the Geek Room robot, drives:
 * bottom-left at the top of a page, bottom-right by the end of it. three.js is only fetched once
 * the browser is idle, and only on screens wide enough that he never covers content.
 */
export default function ChinkuDock() {
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
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden h-[200px] md:block">
      {ready && <ChinkuBot />}
    </div>
  );
}
