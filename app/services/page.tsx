import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, priceFor, sellableServices } from "@/content";

export const metadata: Metadata = {
  title: "Car Detailing Services & Pricing — 626 / San Gabriel Valley",
  description:
    "Every AT Bros Detailing Service with straight prices: exterior, interior, clay & seal, paint enhancement, and more. Mobile or drop-off across the San Gabriel Valley.",
};

export default function ServicesIndex() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Services</p>
      <h1 className="font-display mt-4 text-display-lg leading-tight">
        Every Service, priced straight.
      </h1>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {sellableServices.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-accent"
            >
              <span>
                <span className="font-display text-xl">{s.name}</span>
                <span className="mt-1 block text-sm text-ink-dim">{s.pitch}</span>
              </span>
              <span className="shrink-0 text-sm text-ink-dim group-hover:text-accent">
                from {formatPrice(priceFor(s, "sedan", "mobile"))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
