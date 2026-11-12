"use client";

import { useEffect, useState } from "react";

import { MessageCircle } from "lucide-react";

// Brand icons (lucide no longer ships brand logos) - simple inline SVGs.
const brandIcon = (path: string) =>
  function BrandIcon({ size = 16 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: path }} />
    );
  };
const Instagram = brandIcon('<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>');
const Facebook = brandIcon('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>');
const Linkedin = brandIcon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>');
import Logo from "./Logo";
import { siteConfig, whatsappEnquiryUrl } from "@/lib/config";
import { products } from "@/lib/products";
import { scrollToSection } from "./SmoothScroll";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Factory", href: "#factory" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  // Deterministic across server/client render: 2026 fallback until mounted.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <footer className="border-t border-cream/10 bg-charcoal py-14 text-cream/80" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              {siteConfig.tagline} Molded paper egg trays made for dependable everyday protection.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Instagram, label: "Instagram (placeholder)" },
                { icon: Facebook, label: "Facebook (placeholder)" },
                { icon: Linkedin, label: "LinkedIn (placeholder)" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-yolk hover:text-yolk"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-cream">Navigate</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(l.href);
                    }}
                    className="text-cream/60 transition-colors hover:text-yolk"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-cream">Products</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <a
                    href="#products"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#products");
                    }}
                    className="text-cream/60 transition-colors hover:text-yolk"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-cream">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
              <li>{siteConfig.phone}</li>
              <li>{siteConfig.email}</li>
              <li className="leading-relaxed">{siteConfig.address}</li>
            </ul>
            <a
              href={whatsappEnquiryUrl("Hello NEEL PULP TRAY, I would like to enquire about bulk egg trays.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-yolk/50 px-4 py-2 text-xs font-semibold text-yolk transition-colors hover:bg-yolk hover:text-charcoal"
            >
              <MessageCircle size={14} aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row">
          <p>
            &copy; {year} {siteConfig.brand}. All rights reserved.
          </p>
          <p>Paper egg tray manufacturing - bulk and B2B enquiries.</p>
        </div>
      </div>
    </footer>
  );
}