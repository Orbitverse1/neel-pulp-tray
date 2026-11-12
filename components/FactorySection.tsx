"use client";

import { useEffect, useRef } from "react";
import { Recycle, Droplets, Layers3, Wind, SearchCheck, PackageCheck, ImageIcon } from "lucide-react";
import { factoryFacts } from "@/lib/config";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { Reveal, MaskReveal } from "./Reveal";

const STEPS = [
  { icon: Recycle, title: "Recycled paper collection", text: "Recovered paper and cardboard are gathered and sorted as the raw material for every tray." },
  { icon: Droplets, title: "Pulp preparation", text: "Paper is soaked and beaten with water into a smooth, even pulp." },
  { icon: Layers3, title: "Molding", text: "The pulp is pressed into molds that form the shape of each cell and post." },
  { icon: Wind, title: "Drying", text: "Freshly molded trays are dried until they reach their final strength." },
  { icon: SearchCheck, title: "Quality checking", text: "Trays are inspected for shape, fit and finish before they move on." },
  { icon: PackageCheck, title: "Packaging & dispatch", text: "Checked trays are stacked, packed and prepared for bulk dispatch." },
];

// Illustrative placeholder panel - replace with real factory photographs.
function FactoryImage({ label, parallax }: { label: string; parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !parallax || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
    return () => ctx.revert();
  }, [parallax, reduced]);

  return (
    <div className="overflow-hidden rounded-3xl border border-forest/10 bg-kraft/40 shadow-sm">
      <div ref={ref} className="paper-grain flex aspect-[4/3] flex-col items-center justify-center gap-3 p-6 text-center">
        <ImageIcon size={30} className="text-forest/35" aria-hidden="true" />
        <p className="font-heading text-sm font-semibold text-forest/70">{label}</p>
        <p className="max-w-[240px] text-[11px] leading-relaxed text-charcoal/55">
          Illustrative placeholder - replace with an actual factory photograph.
        </p>
      </div>
    </div>
  );
}

export default function FactorySection() {
  return (
    <section id="factory" className="bg-cream py-24 md:py-32" aria-label="Factory and manufacturing">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-forest/60">Factory & Manufacturing</p>
          <h2 className="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight text-forest md:text-6xl">
            <MaskReveal lines={["Built on a simple,", "honest process."]} />
          </h2>
        </Reveal>

        <div className="mt-16 space-y-16 md:space-y-24">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <Reveal>
                <FactoryImage label={step.title} parallax />
              </Reveal>
              <Reveal delay={0.1}>
                <span className="font-heading text-5xl font-bold text-kraft md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 flex items-center gap-3 font-heading text-2xl font-bold text-forest md:text-3xl">
                  <step.icon size={26} className="text-leaf" aria-hidden="true" />
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-charcoal/70">{step.text}</p>
              </Reveal>
            </div>
          ))}
        </div>

        {/* editable factory facts */}
        <Reveal className="mt-24">
          <div className="rounded-3xl border border-forest/10 bg-forest p-8 text-cream md:p-12">
            <h3 className="font-heading text-2xl font-bold md:text-3xl">Factory at a glance</h3>
            <p className="mt-2 max-w-lg text-sm text-cream/70">
              Placeholder facts below - each value is editable and will be replaced with confirmed factory information.
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {factoryFacts.map((f) => (
                <div key={f.label} className="rounded-2xl bg-cream/10 p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-cream/60">{f.label}</dt>
                  <dd className="mt-1.5 font-heading text-lg font-semibold text-yolk">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}