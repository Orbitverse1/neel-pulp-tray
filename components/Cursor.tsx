"use client";

import { useEffect, useRef } from "react";

// Subtle desktop cursor dot that grows over interactive elements.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !ref.current) return;
    const el = ref.current;
    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let scale = 1;
    let tScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement;
      tScale = target.closest("a, button, [role='button'], input, select, textarea, label") ? 2.4 : 1;
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      scale += (tScale - scale) * 0.18;
      el.style.transform = `translate(${x - 8}px, ${y - 8}px) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: "translate(-100px, -100px)" }}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-4 w-4 rounded-full bg-forest/30 mix-blend-multiply md:block"
    />
  );
}