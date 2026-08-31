import {
  business,
  formatPrice,
  priceFor,
  sellableServices,
} from "@/content";

/**
 * Seam A proof page: renders real business data straight from the content
 * module. Replaced by the Transformation narrative in ticket #5.
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{business.name}</h1>
      <p className="mt-2 text-ink-dim">
        Mobile &amp; drop-off detailing · {business.regionLong} ·{" "}
        {business.phoneDisplay}
      </p>

      <h2 className="mt-10 text-xl font-medium">Hours</h2>
      <ul className="mt-3 space-y-1 text-ink-dim">
        {business.hours.map((h) => (
          <li key={h.day}>
            {h.day}: {h.hours ?? "Closed"}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-medium">Services (Mobile)</h2>
      <ul className="mt-3 space-y-2">
        {sellableServices.map((s) => (
          <li key={s.slug} className="flex justify-between border-b border-line pb-2">
            <span>{s.name}</span>
            <span className="text-accent">
              {formatPrice(priceFor(s, "sedan", "mobile"))}
              {s.largerVehiclesQuoted ? " · larger vehicles quoted" : ""}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
