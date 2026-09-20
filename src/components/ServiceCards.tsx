import { sellableServices } from "@/content";
import { ServiceCard } from "./ServiceCard";

/** Every sellable Service as a grid of live-priced cards. */
export function ServiceCards() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sellableServices.map((s) => (
        <ServiceCard key={s.slug} service={s} />
      ))}
    </ul>
  );
}
