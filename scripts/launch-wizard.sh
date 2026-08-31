#!/usr/bin/env bash
# Launch wizard: walks a human through the steps only a human can do —
# linking the repo to Vercel, registering atbrosdetailing.com, pointing DNS
# at Vercel, and promoting to production behind the launch gate.
#
# Run it from the repo root:  bash scripts/launch-wizard.sh
set -u

DOMAIN="atbrosdetailing.com"
bold() { printf '\033[1m%s\033[0m\n' "$*"; }
step() { printf '\n\033[1;33m== Step %s: %s ==\033[0m\n' "$1" "$2"; }
ask() { read -r -p "$1 [y/N] " reply; [[ "$reply" =~ ^[Yy] ]]; }
pause() { read -r -p "Press Enter when done... " _; }

bold "AT Bros Detailing — launch wizard"
echo "This walks you through deploy, domain, DNS, and production promotion."
echo "Safe to re-run; every step verifies before moving on."

# ---------------------------------------------------------------- Step 1
step 1 "Link the repo to Vercel"
echo "  a) Log in at https://vercel.com (use the maintainer's account)."
echo "  b) 'Add New… > Project' and import korexstudio/at-bros-detailing."
echo "  c) Framework preset: Next.js. Build command and output: defaults."
echo "  d) Deploy. Every push then gets a preview; merges to main deploy automatically."
pause
if ask "Did the first deployment finish and give you a *.vercel.app preview URL?"; then
  read -r -p "Paste the preview URL to verify: " PREVIEW_URL
  if curl -sf -o /dev/null "$PREVIEW_URL"; then
    bold "  ✓ Preview reachable: $PREVIEW_URL"
  else
    echo "  ✗ Could not reach $PREVIEW_URL — check the deployment logs on Vercel, then re-run."
    exit 1
  fi
else
  echo "  Finish the import on vercel.com and re-run this wizard."
  exit 1
fi

# ---------------------------------------------------------------- Step 2
step 2 "Confirm analytics"
echo "  In the Vercel project: Analytics tab > Enable (the site already ships"
echo "  the <Analytics /> component; no cookie banner is needed)."
pause
echo "  Visit the preview URL once, then confirm a page view appears in the tab."
ask "Analytics recording?" || { echo "  Re-check and re-run."; exit 1; }
bold "  ✓ Analytics live"

# ---------------------------------------------------------------- Step 3
step 3 "Register ${DOMAIN}"
echo "  The OWNER should register the domain (their card, their account) at"
echo "  any registrar — Namecheap, Cloudflare Registrar, Porkbun."
echo "  No extras needed: no hosting, no email add-ons, no 'website builder'."
if ask "Is ${DOMAIN} registered?"; then
  if nslookup "$DOMAIN" >/dev/null 2>&1; then
    bold "  ✓ ${DOMAIN} resolves at the registrar level"
  else
    echo "  (Domain not resolving yet — normal within the first hour; continuing.)"
  fi
else
  echo "  Register it and re-run from here."
  exit 1
fi

# ---------------------------------------------------------------- Step 4
step 4 "Point DNS at Vercel"
echo "  a) In the Vercel project: Settings > Domains > Add > ${DOMAIN}"
echo "     (also add www.${DOMAIN}; set it to redirect to the apex)."
echo "  b) Vercel shows the records to create. At the registrar's DNS panel:"
echo "       A     @    76.76.21.21"
echo "       CNAME www  cname.vercel-dns.com"
echo "     (If Vercel shows different values, use Vercel's.)"
pause
echo "  Checking DNS propagation (can take minutes to hours)..."
if nslookup "$DOMAIN" | grep -q "76.76.21.21"; then
  bold "  ✓ Apex A record points at Vercel"
else
  echo "  ~ Not propagated yet. Vercel's Domains tab shows live status;"
  echo "    re-run this wizard later to re-verify. Continuing."
fi

# ---------------------------------------------------------------- Step 5
step 5 "The launch gate"
node scripts/check-launch-gate.mjs
if VERCEL_ENV=production node scripts/check-launch-gate.mjs >/dev/null 2>&1; then
  bold "  ✓ Launch gate clear — production is allowed"
else
  echo "  ✗ The launch gate is closed (see docs/launch-gate.md)."
  echo "    Production builds on Vercel will FAIL until every item is done."
  echo "    That is intentional: we do not launch on fakes."
  exit 1
fi

# ---------------------------------------------------------------- Step 6
step 6 "Go live"
echo "  With the gate clear: merge to main (or 'Promote to Production' on"
echo "  Vercel). Then verify:"
echo "    - https://${DOMAIN} loads with the real logo"
echo "    - Book now lands on the Square booking page"
echo "    - https://${DOMAIN}/sitemap.xml renders"
echo "  Finally, submit the sitemap in Google Search Console."
bold "Done. Go wash something."
