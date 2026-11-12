"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { siteConfig, whatsappEnquiryUrl } from "@/lib/config";
import { products } from "@/lib/products";
import { Reveal, MaskReveal } from "./Reveal";

interface FormState {
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  message: string;
}

const initial: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  product: "",
  quantity: "",
  message: "",
};

export default function Enquiry() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<string>("");

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = (): boolean => {
    const er: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!form.company.trim()) er.company = "Please enter your company name.";
    if (form.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a valid phone number (10+ digits).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Enter a valid email address.";
    if (!form.product) er.product = "Select a product.";
    if (!form.quantity.trim() || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      er.quantity = "Enter an estimated quantity.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const buildMessage = () =>
    [
      `Bulk enquiry - ${siteConfig.brand}`,
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Product: ${form.product}`,
      `Estimated quantity: ${form.quantity}`,
      form.message ? `Message: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus("Please fix the highlighted fields.");
      return;
    }
    // Optional backend POST when an endpoint is configured.
    if (siteConfig.formEndpoint) {
      try {
        await fetch(siteConfig.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, brand: siteConfig.brand }),
        });
      } catch {
        setStatus("The form endpoint could not be reached - opening WhatsApp instead.");
      }
    }
    // WhatsApp handoff: the visitor reviews and presses send in WhatsApp.
    window.open(whatsappEnquiryUrl(buildMessage()), "_blank", "noopener");
    setStatus("WhatsApp opened with your enquiry - press send there to submit it.");
  };

  const field =
    "w-full rounded-xl border border-forest/15 bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none";
  const err = (k: keyof FormState) =>
    errors[k] ? <p className="mt-1 text-xs font-medium text-[#a03d2a]">{errors[k]}</p> : null;

  return (
    <section id="contact" className="bg-forest py-24 text-cream md:py-32" aria-label="Bulk enquiry and contact">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/60">Bulk Enquiry</p>
          <h2 className="mt-3 max-w-2xl font-heading text-4xl font-bold tracking-tight md:text-6xl">
            <MaskReveal lines={["Let's talk trays."]} />
          </h2>
          <p className="mt-5 max-w-xl text-cream/70">
            Tell us what you need - tray type, quantity and destination - and we will get back with availability and
            pricing for your bulk order.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* contact info */}
          <Reveal>
            <div className="space-y-6">
              <a
                href={whatsappEnquiryUrl("Hello NEEL PULP TRAY, I would like to enquire about bulk egg trays.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-yolk px-7 py-3.5 text-sm font-bold text-charcoal transition-transform duration-300 hover:scale-[1.04]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Enquire on WhatsApp
              </a>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-yolk" aria-hidden="true" />
                  <span>
                    <span className="block text-cream/55">Phone</span>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="font-medium hover:underline">
                      {siteConfig.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-yolk" aria-hidden="true" />
                  <span>
                    <span className="block text-cream/55">Email</span>
                    <a href={`mailto:${siteConfig.email}`} className="font-medium hover:underline">
                      {siteConfig.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-yolk" aria-hidden="true" />
                  <span>
                    <span className="block text-cream/55">Factory</span>
                    <span className="font-medium">{siteConfig.address}</span>
                  </span>
                </li>
              </ul>
              {siteConfig.contactIsPlaceholder && (
                <p className="rounded-xl border border-yolk/40 bg-yolk/10 p-3 text-xs leading-relaxed text-yolk">
                  Contact details are placeholders. Configure NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_PHONE,
                  NEXT_PUBLIC_EMAIL and NEXT_PUBLIC_FACTORY_ADDRESS before launch.
                </p>
              )}
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="rounded-3xl bg-cream p-6 text-charcoal shadow-2xl md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="eq-name" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Full Name *
                  </label>
                  <input id="eq-name" className={field} value={form.name} onChange={set("name")} autoComplete="name" />
                  {err("name")}
                </div>
                <div>
                  <label htmlFor="eq-company" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Company Name *
                  </label>
                  <input id="eq-company" className={field} value={form.company} onChange={set("company")} autoComplete="organization" />
                  {err("company")}
                </div>
                <div>
                  <label htmlFor="eq-phone" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Phone Number *
                  </label>
                  <input id="eq-phone" type="tel" className={field} value={form.phone} onChange={set("phone")} autoComplete="tel" />
                  {err("phone")}
                </div>
                <div>
                  <label htmlFor="eq-email" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Email *
                  </label>
                  <input id="eq-email" type="email" className={field} value={form.email} onChange={set("email")} autoComplete="email" />
                  {err("email")}
                </div>
                <div>
                  <label htmlFor="eq-product" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Product Required *
                  </label>
                  <select id="eq-product" className={field} value={form.product} onChange={set("product")}>
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {err("product")}
                </div>
                <div>
                  <label htmlFor="eq-quantity" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                    Estimated Quantity *
                  </label>
                  <input
                    id="eq-quantity"
                    inputMode="numeric"
                    className={field}
                    value={form.quantity}
                    onChange={set("quantity")}
                    placeholder="e.g. 5000"
                  />
                  {err("quantity")}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="eq-message" className="mb-1.5 block text-xs font-semibold text-charcoal/70">
                  Message
                </label>
                <textarea
                  id="eq-message"
                  rows={4}
                  className={`${field} resize-none`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Delivery location, timeline, any special requirements..."
                />
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-cream transition-transform duration-300 hover:scale-[1.02]"
              >
                <Send size={16} aria-hidden="true" />
                Send Enquiry via WhatsApp
              </button>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-charcoal/55">
                Submitting opens WhatsApp with your enquiry pre-filled - you review and press send there. No data is
                stored on this site.
              </p>
              {status && (
                <p className="mt-3 rounded-lg bg-forest/5 p-2.5 text-center text-xs font-medium text-forest" role="status">
                  {status}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}