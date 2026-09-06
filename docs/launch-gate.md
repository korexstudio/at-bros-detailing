# Launch gate

Production deploys are **blocked** until every item below is done. Preview
deployments are fine at any time. The gate is enforced by
`scripts/check-launch-gate.mjs`, which runs before every build and fails the
build when it would go live on the real domain: `VERCEL_ENV=production` AND
a custom domain (not `*.vercel.app`) is assigned to the project. Until
atbrosdetailing.com is attached, the default production alias is treated as
a preview and only gets the report.

## The checklist

- [x] **Real logo in place** — drop the file at `public/brand/logo.svg` (or
      `.png`). The Wordmark component picks it up everywhere automatically.
      Then derive the accent color from it in `app/globals.css` (`--color-accent`).
      _Done 2026-09-05: badge knocked out to a cream monochrome for the dark
      base (source kept at `docs/brand/logo-original.png`); accent is now the
      logo's steel blue. A vector or transparent master from the designer
      would still sharpen the header icon._
- [x] **At least three real Before/After pairs** — export the photos into
      `public/gallery/`, register them in `src/content/gallery.ts` with
      `isPlaceholder: false`, and delete the placeholder entries. Export
      real photos as AVIF or WebP sized close to their largest rendered
      width (~1600px) — the placeholders are SVGs, so format discipline
      starts when real rasters land.
- [ ] **Founder story supplied** — replace the placeholder block in
      `app/about/page.tsx` with the owner's story, then flip
      `founderStorySupplied` in `launch-approvals.json`.
- [ ] **Owner copy approval** — the owner reads every page and signs off.
      Flip `ownerCopyApproved`.
- [ ] **Open pricing questions answered** (see
      `docs/research/square-booking-services.md`): Full Detail and Interior
      Detail on larger vehicles — fixed bump or quoted? Update
      `src/content/services.ts` accordingly, then flip
      `pricingQuestionsAnswered`.
- [x] **Square per-Service deep-link ids captured** — open each Service on
      the Square booking page, copy its id from the URL, fill
      `squareServiceId` in `src/content/services.ts`, then flip
      `squareServiceIdsCaptured`.

## Verifying

```sh
node scripts/check-launch-gate.mjs                    # report
LAUNCH_GATE_STRICT=1 VERCEL_ENV=production node scripts/check-launch-gate.mjs  # what a real launch sees
```

When all items pass, promote to production (see `scripts/launch-wizard.sh`
for domain + DNS).
