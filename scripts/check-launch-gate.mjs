#!/usr/bin/env node
/**
 * The launch gate (ticket #12; spec "Launch gate").
 *
 * Production deploys are blocked until the site stops standing on fakes:
 *   1. Real logo in public/brand/
 *   2. At least three real Before/After pairs in the gallery manifest
 *   3. Founder story supplied (About no longer placeholder)
 *   4. Owner has approved the copy
 *   5. Open pricing questions answered
 *   6. Square per-Service deep-link ids captured
 *
 * Wired as `pnpm build` -> this script -> `next build`. It only blocks when
 * VERCEL_ENV=production; previews and local builds always pass (with a
 * report). Flags 3-6 live in launch-approvals.json, flipped by a human.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];

// 1. Real logo
if (
  !existsSync(path.join(root, "public/brand/logo.svg")) &&
  !existsSync(path.join(root, "public/brand/logo.png"))
) {
  failures.push("Real logo missing: drop it at public/brand/logo.svg (or .png)");
}

// 2. Three real Before/After pairs
const gallerySource = readFileSync(
  path.join(root, "src/content/gallery.ts"),
  "utf8",
);
const beforeAftersSection = gallerySource.split("finishedCars")[0];
const realPairs = (beforeAftersSection.match(/isPlaceholder:\s*false/g) ?? [])
  .length;
if (realPairs < 3) {
  failures.push(
    `Need at least 3 real Before/After pairs in the gallery manifest (have ${realPairs})`,
  );
}

// 3-6. Human-flipped approvals
const approvals = JSON.parse(
  readFileSync(path.join(root, "launch-approvals.json"), "utf8"),
);
const approvalChecks = {
  founderStorySupplied: "Founder story still placeholder (About page)",
  ownerCopyApproved: "Owner has not approved the site copy",
  pricingQuestionsAnswered:
    "Open pricing questions unanswered (Full Detail / Interior Detail on larger vehicles)",
  squareServiceIdsCaptured:
    "Square per-Service deep-link ids not captured (squareServiceId is null)",
};
for (const [flag, message] of Object.entries(approvalChecks)) {
  if (!approvals[flag]) failures.push(`${message} — flip "${flag}" in launch-approvals.json`);
}

const isProduction = process.env.VERCEL_ENV === "production";

if (failures.length === 0) {
  console.log("Launch gate: all clear. Production is a go.");
  process.exit(0);
}

console.log(
  `Launch gate: ${failures.length} item(s) outstanding${isProduction ? "" : " (non-blocking outside production)"}:`,
);
for (const failure of failures) console.log(`  ✗ ${failure}`);

if (isProduction) {
  console.error("\nProduction build BLOCKED by the launch gate (see docs/launch-gate.md).");
  process.exit(1);
}
process.exit(0);
