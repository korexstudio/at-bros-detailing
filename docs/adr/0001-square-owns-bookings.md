---
status: accepted
---

# Square owns bookings; the site never does

The owner already takes paid appointments through a Square booking page with a calendar, payments, and per-Service deep links. Every "Book now" on the site links out to that page rather than embedding Square's widget (which would drop Square's plain UI into a premium design) or building native booking (which would mean rebuilding availability, payments, and no-show handling for a solo business). Quote Requests that Square can't price go by text/call, not a form.

## Consequences

- Service pages must carry Square deep links, so adding a Service means adding it on Square first.
- Prices on the site mirror Square and must be kept in sync by hand.
- No server-side code is needed for conversion; the site can be fully static.
