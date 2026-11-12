"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Boxes, Ruler, Recycle, AlertCircle } from "lucide-react";
import { products } from "@/lib/products";
import { useQuality, useReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "./SmoothScroll";
import { Reveal, MaskReveal } from "./Reveal";

const ProductsScene = dynamic(() => import("./three/ProductsScene"), { ssr: false });

export default function Products() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const selected = products.find((p) => p.id === selectedId) ?? null;

  return (
    <section id="products" className="relative bg-[#ece5d3] py-24 md:py-32" aria-label="Products">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-forest/60">Product Showroom</p>
          <h2 className="mt-3 max-w-2xl font-heading text-4xl font-bold tracking-tight text-forest md:text-6xl">
            <MaskReveal lines={["The 30-cell", "egg tray."]} />
          </h2>
          <p className="mt-5 max-w-xl text-charcoal/70">
            Select the tray on the shelf to inspect it. We currently make the 30-cell egg tray - dimensions and
            materials are confirmed with the factory before listing.
          </p>
        </Reveal>
      </div>

      {/* 3D shelf */}
      <div className="relative mx-auto mt-10 h-[62vh] min-h-[420px] w-full max-w-[1600px]">
        <ProductsScene
          selectedId={selectedId}
          onSelect={setSelectedId}
          reduced={reduced}
          dpr={quality.dpr}
          shadows={quality.shadows}
        />

        {/* quick select pills (keyboard + mobile friendly) */}
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 flex-wrap justify-center gap-2 px-4" role="group" aria-label="Select a product">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              aria-pressed={selectedId === p.id}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedId === p.id
                  ? "bg-forest text-cream"
                  : "bg-cream/80 text-forest shadow-sm backdrop-blur-sm hover:bg-cream"
              }`}
            >
              {p.cells}-cell
            </button>
          ))}
        </div>

        {/* spec chip */}
        {selected && (
          <div className="absolute bottom-5 left-1/2 w-[min(92vw,480px)] -translate-x-1/2" role="status">
            <div className="rounded-2xl border border-forest/10 bg-cream/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-lg font-bold text-forest">{selected.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-charcoal/70">
                    <Boxes size={13} aria-hidden="true" /> {selected.cells} cells
                    <span className="mx-1 text-forest/30">|</span>
                    <Recycle size={13} aria-hidden="true" /> {selected.material}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/60">
                    <Ruler size={13} aria-hidden="true" /> {selected.dimensions}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-cream"
                >
                  <ArrowLeft size={13} aria-hidden="true" /> Back
                </button>
              </div>
              {selected.unconfirmed && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#8a6b1d]">
                  <AlertCircle size={12} aria-hidden="true" /> Sample specification - to be confirmed with the factory.
                </p>
              )}
              <button
                onClick={() => scrollToSection("#contact")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2 text-xs font-semibold text-cream hover:bg-forest/90"
              >
                Enquire about this tray <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* product cards */}
      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <article className="group flex h-full flex-col rounded-3xl border border-forest/10 bg-cream p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-forest/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest">
                  {p.cells} cells
                </span>
                {p.unconfirmed && (
                  <span className="rounded-full bg-yolk/20 px-2.5 py-1 text-[10px] font-semibold text-[#8a6b1d]">
                    Sample
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-forest">{p.name}</h3>
              <dl className="mt-3 space-y-1.5 text-sm text-charcoal/70">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-charcoal/50">Dimensions</dt>
                  <dd>{p.dimensions}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-charcoal/50">Material</dt>
                  <dd>{p.material}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-5">
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-transform duration-300 group-hover:translate-x-1"
                >
                  Enquire <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}