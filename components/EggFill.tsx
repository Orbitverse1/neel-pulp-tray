"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useQuality, useReducedMotion } from "@/lib/hooks";

const EggFillScene = dynamic(() => import("./three/EggFillScene"), { ssr: false });

export default function EggFill() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phase, setPhase] = useState<"intro" | "filling" | "done">("intro");
  const reduced = useReducedMotion();
  const quality = useQuality();

  useEffect(() => {
    if (reduced || !wrapRef.current) return;
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
        // Hide the intro hint directly as well: the moment the fill starts the
        // drop path must be clear of text, independent of React render timing.
        if (hintRef.current) hintRef.current.style.opacity = self.progress > 0.02 ? "0" : "1";
        setPhase(self.progress > 0.74 ? "done" : self.progress > 0.02 ? "filling" : "intro");
      },
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section
      ref={wrapRef}
      className={reduced ? "relative" : "relative h-[520vh]"}
      aria-label="Signature egg filling animation"
    >
      <div className={`${reduced ? "" : "sticky top-0"} h-svh overflow-hidden`}>
        <EggFillScene progressRef={progressRef} reduced={reduced} dpr={quality.dpr} shadows={quality.shadows} />

        {/* intro hint */}
        <div
          ref={hintRef}
          className={`pointer-events-none absolute inset-x-0 top-24 z-10 text-center transition-all duration-500 ${
            phase === "intro" && !reduced ? "opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-forest/55">The Signature Moment</p>
          <p className="mt-2 font-heading text-xl font-semibold text-forest/85">Keep scrolling - the tray fills itself.</p>
        </div>

        {/* final headline */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 text-center transition-all duration-700 ${
            phase === "done" || reduced ? "translate-y-[-50%] opacity-100" : "translate-y-[-40%] opacity-0"
          }`}
        >
          <h2 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-forest drop-shadow-[0_2px_18px_rgba(245,241,232,0.9)] md:text-6xl">
            Designed to Protect Every Egg.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/75 md:text-base">
            Reliable molded pulp packaging for everyday handling and transport.
          </p>
        </div>
      </div>
    </section>
  );
}