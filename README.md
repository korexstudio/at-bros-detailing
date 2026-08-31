# AT Bros Detailing — marketing site

Premium marketing site for AT Bros Detailing (mobile & drop-off car
detailing, San Gabriel Valley). Square owns bookings (ADR-0001); every
"Book now" deep-links to the Square booking page, and Quote Requests go by
`sms:`/`tel:`. Fully static Next.js — no server-side conversion logic.

## Commands

```sh
pnpm dev          # dev server
pnpm build        # launch-gate report + production build
pnpm test         # Seam A: unit tests (Vitest)
pnpm e2e          # Seam B: e2e against the built site (Playwright; build first)
pnpm test:all     # everything in one command
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

## Where things live

- **`src/content/`** — Seam A, the single typed source of truth: Service
  catalog, pricing rules (`priceFor`), link builders, business facts,
  gallery manifest, JSON-LD. Prices mirror Square: update Square first,
  then `src/content/services.ts`.
- **`public/brand/logo.svg`** — drop the real logo here; the wordmark swaps
  site-wide automatically.
- **`public/gallery/` + `src/content/gallery.ts`** — drop photos in, register
  them in the manifest. Real pairs (`isPlaceholder: false`) unlock the
  reveal-wipe showpiece.
- **`docs/launch-gate.md`** — what blocks production, and how the gate is
  enforced.
- **`scripts/launch-wizard.sh`** — interactive walkthrough for Vercel,
  domain, and DNS (human-only steps).
- **`CONTEXT.md` / `docs/adr/`** — vocabulary and decisions. Use the
  glossary's terms.

## Maintainer recipes

- **Change a price**: edit the Service in `src/content/services.ts`; unit
  tests verify Drop-off stays exactly the discount less.
- **Add a Service**: add it on Square, then add one catalog entry — the
  page, sitemap entry, OG image, and JSON-LD offer appear automatically.
- **Grow the gallery**: files into `public/gallery/`, entries into the
  manifest. A unit test fails if a registered image is missing on disk.
