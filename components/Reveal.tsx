"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

// Fade-and-rise entrance on scroll into view.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 86%" },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Masked line-by-line heading reveal.
export function MaskReveal({ lines, className = "", lineClassName = "" }: { lines: string[]; className?: string; lineClassName?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current!.querySelectorAll(".mask-line > span"), {
        y: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "power4.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span className={lineClassName}>{line}</span>
        </span>
      ))}
    </span>
  );
}