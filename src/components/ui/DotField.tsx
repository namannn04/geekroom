"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas dot grid that swells and tints teal → orange around the pointer.
 * Idles with a slow travelling wave when there is no pointer (touch, reduced motion).
 */
export default function DotField({ className = "", gap = 26 }: { className?: string; gap?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const radius = 180;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / radius);
          const wave = reduced ? 0 : (Math.sin(x * 0.012 + y * 0.008 + t * 0.0009) + 1) / 2;
          const k = Math.max(near, wave * 0.18);
          const size = 1 + k * 2.6;
          // teal (25,179,191) → orange (255,90,31) across the canvas, brightened near the pointer
          const mix = x / w;
          const r = Math.round(25 + (255 - 25) * mix);
          const g = Math.round(179 + (90 - 179) * mix);
          const b = Math.round(191 + (31 - 191) * mix);
          ctx.fillStyle = k > 0.2 ? `rgba(${r},${g},${b},${0.25 + k * 0.75})` : `rgba(244,241,234,${0.1 + k * 0.4})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [gap]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
