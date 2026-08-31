# Launch gate

Production deploys are **blocked** until every item below is done. Preview
deployments are fine at any time. The gate is enforced by
`scripts/check-launch-gate.mjs`, which runs before every build and fails the
build when `VERCEL_ENV=production`.

## The checklist

- [ ] **Real logo in place** — drop the file at `public/brand/logo.svg` (or
      `.png`). The Wordmark component picks it up everywhere automatically.
      Then derive the accent color from it in `app/globals.css` (`--color-accent`).
- [ ] **At least three real Before/After pairs** — export the photos into
      `public/gallery/`, register them in `src/content/gallery.ts` with
      `isPlaceholder: false`, and delete the placeholder entries.
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
- [ ] **Square per-Service deep-link ids captured** — open each Service on
      the Square booking page, copy its id from the URL, fill
      `squareServiceId` in `src/content/services.ts`, then flip
      `squareServiceIdsCaptured`.

## Verifying

```sh
node scripts/check-launch-gate.mjs                    # report
VERCEL_ENV=production node scripts/check-launch-gate.mjs  # what production sees
```

When all items pass, promote to production (see `scripts/launch-wizard.sh`
for domain + DNS).
