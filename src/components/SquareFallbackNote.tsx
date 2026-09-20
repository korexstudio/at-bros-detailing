import { squareBookingUrl, type Service, type VehicleSize } from "@/content";

/**
 * The line under every Book by text action: what the tap does, and the
 * Square deep link for anyone who would rather book and pay online.
 */
export function SquareFallbackNote({
  lead,
  service,
  size,
}: {
  lead: string;
  service: Service;
  size: VehicleSize;
}) {
  return (
    <p className="mt-5 text-xs text-ink-faint">
      {lead} Prefer to book online?{" "}
      <a
        href={squareBookingUrl(service, size)}
        data-testid="book-square"
        className="text-ink-dim underline-offset-4 hover:text-accent hover:underline"
      >
        Use our Square page
      </a>
      .
    </p>
  );
}
