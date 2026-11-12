# NEEL PULP TRAY

Premium 3D marketing website for NEEL PULP TRAY - a paper egg tray manufacturing brand.
Tagline: Sustainable Packaging. Strong Protection.

Immersive scroll experience inspired by cinematic 3D virtual showrooms:
a scroll-driven factory journey ("PULP SE PACK TAK") followed by a signature
scroll-controlled animation where an empty paper egg tray fills with eggs.

## Requirements

- **Node.js 22 or 24** (64-bit). The project is tested and builds cleanly on
  Node 22 (v22.23.4) and Node 24 (v24.11.0). Node 20 and older, or 25 and
  newer, are not supported (see `engines` in package.json).
- npm 10 or newer (bundled with Node 22/24).
- Windows, macOS or Linux. On Windows, use the 64-bit Node installer from
  nodejs.org so the correct SWC binary is installed automatically.
- `.nvmrc` is included (`22`). If you use nvm-windows or nvm, run
  `nvm use` in this folder to switch to a supported version.

## Tech Stack

- Next.js 15.5 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- React Three Fiber 9 + Three.js + Drei 10 (procedural 3D, no external models needed)
- GSAP + ScrollTrigger (scroll-driven timelines, labels, entrances)
- Lenis (smooth scrolling, synced with ScrollTrigger)
- Framer Motion (mobile menu), Lucide React (icons)
- Fonts: Archivo + Inter variable fonts, self-hosted in `app/fonts/` and
  loaded with `next/font/local` (no Google Fonts network request, so the
  dev server never stalls waiting for fonts on a slow connection).

## Getting Started

If you have an OLD copy of this project on your machine, start clean first:

```bash
# delete these inside the project folder if they exist:
#   node_modules/   package-lock.json   .next/
```

Then:

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

A `package-lock.json` is included for reproducible installs. If you deleted
it as part of a cleanup, `npm install` regenerates it.

Production:

```bash
npm run build
npm start
```

## Configuration (IMPORTANT)

All contact details are placeholders until these env vars are set
(see `.env.example`):

- `NEXT_PUBLIC_WHATSAPP_NUMBER` - digits only, with country code (no +).
  Receives every enquiry: the form opens WhatsApp with the enquiry pre-filled.
- `NEXT_PUBLIC_PHONE` - shown in Contact + Footer.
- `NEXT_PUBLIC_EMAIL` - shown in Contact + Footer.
- `NEXT_PUBLIC_FACTORY_ADDRESS` - shown in Contact + Footer.
- `NEXT_PUBLIC_FORM_ENDPOINT` - OPTIONAL. When set (e.g. a Formspree/Getform
  endpoint or your own API route), the enquiry form also POSTs the enquiry as
  JSON to that URL. When empty, enquiries go through WhatsApp only.
  There is intentionally NO fake "submission success" - the visitor always
  reviews and sends the message in WhatsApp themselves.

## Editing Content

- Products: `lib/products.ts` - every listed tray is a SAMPLE placeholder
  (6/10/12/18/30-cell). Replace with confirmed factory products; each is
  labeled "Sample - to be confirmed" in the UI until you set `unconfirmed: false`.
- Factory facts: `lib/config.ts` (`factoryFacts`) - all "To be confirmed" placeholders.
- Factory photos: `components/FactorySection.tsx` uses clearly-labeled
  illustrative placeholder panels. Replace the `FactoryImage` component's
  contents with real photographs (put them in `public/` and use `<Image>`).
  Never present illustrations as real factory photos.
- Hero poster: `public/poster-hero.jpg` - the static image shown while the 3D
  hero scene loads (also the Open Graph image).

## 3D Notes

- The egg tray, eggs and factory props are 100% procedural Three.js geometry
  (no GLB downloads). To use Blender-made GLB models later, export .glb,
  place in `public/models/`, and load with drei's `useGLTF`.
- Performance: pixel ratio capped (1.5 desktop / 1.25 mobile), InstancedMesh
  for all 30 eggs in the fill animation, shadows disabled on mobile,
  fog-limited draw distance in the journey.
- `prefers-reduced-motion`: smooth scroll, pinning and camera motion are
  disabled; the journey becomes a static stage list and the tray renders
  already filled.

## Deploy on Vercel

1. Push this folder to a GitHub repository (see below).
2. In Vercel: New Project -> Import the repo -> Framework: Next.js (auto-detected).
3. Add the `NEXT_PUBLIC_*` environment variables in Project Settings.
4. Deploy. Every push to `main` redeploys automatically.

## Push to GitHub (Orbitverse1)

1. Create a new empty repository on github.com under the Orbitverse1 account
   (e.g. `neel-pulp-tray`). Do not initialize it with a README.
2. In this folder, run the usual first-push flow:

```bash
git init
git add .
git commit -m "NEEL PULP TRAY website"
git branch -M main
```

3. Then connect the repo and push using the exact two commands GitHub shows
   on the new repository page under "Push an existing repository from the
   command line" (remote add + `git push -u origin main`).

## Project Structure

```
app/                  Next.js app router (layout, page, global styles)
app/fonts/            Self-hosted Archivo + Inter variable fonts (OFL licensed)
components/           Sections: Navbar, Hero, FactoryJourney, EggFill,
                      Products, FactorySection, Sustainability, Enquiry, Footer
components/three/     3D scenes + procedural geometry (tray, eggs, materials)
lib/                  config.ts (site config), products.ts (catalogue), hooks
public/               poster-hero.jpg (hero loading poster / OG image)
```