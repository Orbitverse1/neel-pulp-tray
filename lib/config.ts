// Central editable site configuration.
// Every value can be overridden with the NEXT_PUBLIC_* environment variables
// documented in .env.example. The defaults below are placeholders.

export const siteConfig = {
  brand: "NEEL PULP TRAY",
  tagline: "Sustainable Packaging. Strong Protection.",

  // Contact details (placeholders until real values are configured).
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+91 90000 00000",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919000000000").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_EMAIL ?? "sales@example.com",
  address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? "Factory address to be added, India",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",

  // True when the site is still running on placeholder contact data.
  contactIsPlaceholder: !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
};

// Editable factory facts. Shown in the Factory section.
// Every entry is a placeholder until the factory confirms real values.
export const factoryFacts = [
  { label: "Factory location", value: "To be confirmed", placeholder: true },
  { label: "Production capacity", value: "To be confirmed", placeholder: true },
  { label: "Machinery", value: "To be confirmed", placeholder: true },
  { label: "Years of experience", value: "To be confirmed", placeholder: true },
  { label: "Quality standards", value: "To be confirmed", placeholder: true },
];

export function whatsappEnquiryUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}