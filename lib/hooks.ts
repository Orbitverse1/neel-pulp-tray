"use client";

import { useEffect, useState } from "react";

// Null during SSR / first render so scenes can pick a safe default.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export interface Quality {
  dpr: number;
  shadows: boolean;
  isMobile: boolean;
}

export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>({ dpr: 1.5, shadows: true, isMobile: false });
  useEffect(() => {
    const compute = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 768;
      const isMobile = coarse || narrow;
      setQuality({
        dpr: isMobile ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.5),
        shadows: !isMobile,
        isMobile,
      });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return quality;
}