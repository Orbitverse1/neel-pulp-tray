"use client";

import { Recycle, Layers, Feather, ShieldCheck, Leaf, PackageCheck } from "lucide-react";
import { Reveal, MaskReveal } from "./Reveal";

const FEATURES = [
  {
    icon: Recycle,
    title: "Recycled paper materials",
    text: "Trays are molded from recovered paper, giving used paper a practical second life.",
  },
  {
    icon: Layers,
    title: "Molded pulp construction",
    text: "The molded pulp structure cushions eggs against everyday knocks and vibration.",
  },
  {
    icon: Feather,
    title: "Lightweight by design",
    text: "Light trays are easy to handle, stack and transport in bulk.",
  },
  {
    icon: ShieldCheck,
    title: "Product protection",
    text: "Individual cells hold each egg separately to reduce contact and breakage.",
  },
  {
    icon: Leaf,
    title: "Recyclable again",
    text: "Molded paper trays can return to the paper recycling stream after use.",
  },
  {
    icon: PackageCheck,
    title: "Practical packaging",
    text: "A straightforward, dependable format for farms, hatcheries and distributors.",
  },
];

export default function Sustainability() {
  return (
    <section id="sustainability" className="bg-[#eef0e6] py-24 md:py-32" aria-label="Sustainability and quality">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-forest/60">Sustainability & Quality</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight text-forest md:text-6xl">
            <MaskReveal lines={["Paper today.", "Protection tomorrow."]} />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-charcoal/70">
            Molded pulp packaging starts from recovered paper and can be recycled again - a practical packaging choice
            with a lighter footprint.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <article className="h-full rounded-3xl border border-forest/10 bg-cream p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/20 text-forest">
                  <f.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-forest">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}