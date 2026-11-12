"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { scrollToSection } from "./SmoothScroll";
import { useReducedMotion } from "@/lib/hooks";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Factory", href: "#factory" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/85 shadow-[0_1px_0_rgba(23,61,50,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8" aria-label="Main">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go("#home");
          }}
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                className="text-[13px] font-medium tracking-wide text-charcoal/75 transition-colors hover:text-forest"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("#contact")}
            className="hidden rounded-full bg-forest px-5 py-2.5 text-[13px] font-semibold tracking-wide text-cream transition-transform duration-300 hover:scale-[1.04] hover:bg-forest/90 sm:block"
          >
            Get Bulk Quote
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-t border-forest/10 bg-cream/97 shadow-xl backdrop-blur-lg lg:hidden"
          >
            <ul className="space-y-1 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.href);
                    }}
                    className="block py-2.5 font-heading text-2xl font-semibold text-forest"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-4">
                <button
                  onClick={() => go("#contact")}
                  className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream"
                >
                  Get Bulk Quote
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}