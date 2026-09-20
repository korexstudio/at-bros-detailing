---
status: accepted
---

# Bookings are requested by pre-filled text; Square stays the online option

ADR-0001 sent every "Book now" straight to the Square booking page. On 2026-09-19 the owner asked for booking to work the way a competitor's site he likes does: the visitor picks what they want and one tap opens a text to his number with the request written out. That is how he already takes most work (his Instagram bio says "Call or Text to book"), and a text lets him quote larger vehicles and juggle his evening hours in a way Square's calendar cannot.

So every "Book now" now leads to a Book by text section (or, on a Service page, opens the text directly) that carries the Service, Vehicle Size, Service Mode, timing, and whatever the visitor typed. The site still sends nothing itself: the `sms:` link hands off to the phone's messages app, so there is no server, no form endpoint, and no data held.

Square is not removed. It remains the price source of truth the catalog mirrors, and its per-Service deep links stay one tap away for anyone who prefers to book and pay online.

## Consequences

- Booking demand now lands in the owner's messages, not Square's calendar. He confirms times by hand.
- Prices still mirror Square and must be re-synced by hand; Square remains the place a Service is added first.
- The site stays fully static.
- If texting proves unmanageable, reversing this is a one-line change per call site back to the Square deep link.
