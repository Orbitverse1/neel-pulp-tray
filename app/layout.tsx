import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are bundled locally (OFL-licensed Archivo + Inter, latin subset).
// This removes the runtime/build-time Google Fonts network fetch entirely,
// which also fixes dev-server stalls on networks that block Google Fonts.
const archivo = localFont({
  src: "./fonts/Archivo-Variable.ttf",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neelpulptray.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "NEEL PULP TRAY | Paper Egg Tray Manufacturer",
  description:
    "Discover NEEL PULP TRAY, a paper egg tray manufacturing brand focused on sustainable molded pulp packaging and reliable egg protection.",
  openGraph: {
    title: "NEEL PULP TRAY | Paper Egg Tray Manufacturer",
    description:
      "Premium molded paper egg trays designed to protect eggs while supporting a more sustainable packaging future.",
    type: "website",
    images: [{ url: "/poster-hero.jpg", width: 1440, height: 810, alt: "NEEL PULP TRAY 3D showroom" }],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#173D32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}