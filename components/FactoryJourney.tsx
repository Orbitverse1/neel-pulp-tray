"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useQuality, useReducedMotion } from "@/lib/hooks";

const JourneyScene = dynamic(() => import("./three/JourneyScene"), { ssr: false });

const STAGES = [
  { num: "01", title: "Recycled Paper", line: "Recovered paper and cardboard, sorted and ready for a second life." },
  { num: "02", title: "Pulp Preparation", line: "Paper is mixed with water and beaten into a smooth, workable pulp." },
  { num: "03", title: "Molding", line: "Pulp is pressed into molds that shape every cell of the tray." },
  { num: "04", title: "Drying & Inspection", line: "Fresh trays travel through drying and are checked piece by piece." },
  { num: "05", title: "Finished Trays", line: "Stacked, counted and prepared for bulk dispatch." },
  { num: "06", title: "Ready for Eggs", line: "The moment it all leads to - a tray ready to protect." },
];

export default function FactoryJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [titleOut, setTitleOut] = useState(false);
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
        setStage(Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length)));
        setTitleOut(self.progress > 0.1);
      },
    });
    return () => st.kill();
  }, [reduced]);

  if (reduced) {
    // Static fallback for prefers-reduced-motion.
    return (
      <section id="process" className="bg-[#efe9db] px-5 py-24 md:px-8" aria-label="Factory journey">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-forest/60">The Factory Journey</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-forest md:text-6xl">PULP SE PACK TAK.</h2>
          <ol className="mt-12 space-y-8">
            {STAGES.map((s) => (
              <li key={s.num} className="flex gap-6 border-b border-forest/10 pb-8">
                <span className="font-heading text-3xl font-bold text-yolk">{s.num}</span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-forest">{s.title}</h3>
                  <p className="mt-1 text-charcoal/70">{s.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="process" ref={wrapRef} className="relative h-[640vh]" aria-label="Factory journey: Pulp Se Pack Tak">
      <div className="sticky top-0 h-svh overflow-hidden">
        <JourneyScene progressRef={progressRef} reduced={reduced} dpr={quality.dpr} shadows={quality.shadows} />

        {/* Section title */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-20 z-10 text-center transition-all duration-700 ${
            titleOut ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-forest/60">The Factory Journey</p>
          <h2 className="mt-2 font-heading text-4xl font-bold tracking-tight text-forest md:text-6xl">
            PULP SE PACK TAK.
          </h2>
        </div>

        {/* Floating stage label */}
        <div className="pointer-events-none absolute bottom-10 left-5 z-10 max-w-sm md:bottom-14 md:left-12" aria-live="polite">
          {STAGES.map((s, i) => (
            <div
              key={s.num}
              className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${
                i === stage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              aria-hidden={i !== stage}
            >
              <span className="font-heading text-5xl font-bold text-yolk/90 md:text-6xl">{s.num}</span>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-forest md:text-3xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70 md:text-base">{s.line}</p>
            </div>
          ))}
          {/* spacer keeps label block height stable */}
          <div className="invisible">
            <span className="font-heading text-5xl font-bold md:text-6xl">00</span>
            <h3 className="mt-2 font-heading text-2xl font-semibold md:text-3xl">Placeholder</h3>
            <p className="mt-2 text-sm md:text-base">Placeholder line for layout.</p>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-hidden="true">
          {STAGES.map((s, i) => (
            <span
              key={s.num}
              className={`h-8 w-1 rounded-full transition-colors duration-300 ${i === stage ? "bg-yolk" : "bg-forest/15"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}