"use client";

import dynamic from "next/dynamic";
import DeferredDecoration from "@/components/motion/DeferredDecoration";

const ChinkuBot = dynamic(() => import("@/components/three/ChinkuBot"), { ssr: false });

export default function ChinkuDock() {
  return (
    <DeferredDecoration
      className="chinku-dock pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden h-[180px] lg:block"
      fallback={null}
    >
      <ChinkuBot />
    </DeferredDecoration>
  );
}
