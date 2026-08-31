import { business } from "./business";
import { sellableServices } from "./services";

/** Canonical site origin. Vercel previews override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atbrosdetailing.com";

/** "9:00 AM" -> "09:00", "5:30 PM" -> "17:30". */
export function to24h(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error(`Unparseable time: ${time}`);
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return `${String(hours).padStart(2, "0")}:${match[2]}`;
}

/**
 * LocalBusiness JSON-LD: hours, phone, Instagram, and the cities served —
 * and deliberately NO street address (the drop-off location is shared on
 * Booking, never published).
 */
export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoWash"],
    "@id": `${SITE_URL}/#business`,
    name: business.name,
    url: SITE_URL,
    telephone: business.phoneE164,
    image: `${SITE_URL}/opengraph-image`,
    sameAs: [business.instagramUrl],
    priceRange: "$50–$250",
    areaServed: business.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    openingHoursSpecification: business.hours
      .filter((h) => h.hours !== null)
      .map((h) => {
        const [opens, closes] = (h.hours as string).split("–").map((s) => s.trim());
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.day,
          opens: to24h(opens),
          closes: to24h(closes),
        };
      }),
    makesOffer: sellableServices.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name },
      url: `${SITE_URL}/services/${s.slug}`,
    })),
  };
}
