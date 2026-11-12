"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, PackageCheck, MessageSquareQuote } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useQuality, useReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "./SmoothScroll";
import { MaskReveal } from "./Reveal";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function Hero() {
  const reduced = useReducedMotion();
  const quality = useQuality();
  const introRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (reduced || !introRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current!.querySelectorAll("[data-intro]"),
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.5 }
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="home" className="relative flex min-h-svh items-center overflow-hidden" aria-label="Intro">
      {/* Static poster while the 3D scene loads */}
      <div
        className={`absolute inset-0 bg-cream bg-cover bg-center transition-opacity duration-700 ${
          sceneReady ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: "url(/poster-hero.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/30 to-cream" aria-hidden="true" />
      <HeroScene reduced={reduced} dpr={quality.dpr} shadows={quality.shadows} onCreated={() => setSceneReady(true)} />

      <div ref={introRef} className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <p data-intro className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest/20 bg-cream/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-forest backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-yolk" aria-hidden="true" />
          Sustainable Packaging. Strong Protection.
        </p>
        <h1 className="max-w-4xl font-heading text-[10.5vw] font-bold leading-[1.02] tracking-tight text-forest sm:text-6xl md:text-7xl lg:text-[5.2rem]">
          <MaskReveal lines={["From Recycled Paper", "to Reliable Protection."]} />
        </h1>
        <p data-intro className="mt-6 max-w-xl text-base leading-relaxed text-charcoal/75 md:text-lg">
          Premium molded paper egg trays designed to protect eggs while supporting a more sustainable packaging future.
        </p>
        <div data-intro className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() => scrollToSection("#products")}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-cream transition-transform duration-300 hover:scale-[1.04]"
          >
            <PackageCheck size={17} aria-hidden="true" />
            Explore Products
          </button>
          <button
            onClick={() => scrollToSection("#contact")}
            className="inline-flex items-center gap-2 rounded-full border-2 border-forest/80 px-7 py-3.5 text-sm font-semibold text-forest transition-colors duration-300 hover:bg-forest hover:text-cream"
          >
            <MessageSquareQuote size={17} aria-hidden="true" />
            Get Bulk Quote
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("#process")}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-forest/60 transition-colors hover:text-forest"
        aria-label="Scroll to the factory journey"
      >
        <ArrowDown className="animate-bounce" size={22} />
      </button>
    </section>
  );
}