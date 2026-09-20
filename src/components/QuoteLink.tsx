"use client";

import type { ReactNode } from "react";
import { quoteRequestHref, type Service } from "@/content";
import { useVehicleSize } from "@/lib/vehicle-size";

/**
 * A Quote Request link: a pre-filled text to the business. Carries the
 * Service, and the Vehicle Size once the visitor has explicitly chosen one.
 */
export function QuoteLink({
  service,
  className,
  children,
  ...rest
}: {
  service?: Service;
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
}) {
  const { chosenSize } = useVehicleSize();
  const href = quoteRequestHref({ service, vehicleSize: chosenSize });
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
