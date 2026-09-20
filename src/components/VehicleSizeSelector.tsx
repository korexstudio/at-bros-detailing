"use client";

import { VEHICLE_SIZES, VEHICLE_SIZE_LABELS } from "@/content";
import { useVehicleSize } from "@/lib/vehicle-size";

/**
 * The Vehicle Size selector. One global state: pick it anywhere and
 * every price on the site follows.
 */
export function VehicleSizeSelector() {
  const { size, setSize } = useVehicleSize();

  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-[0.25em] text-ink-faint">
        Vehicle size
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {VEHICLE_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={size === s}
            onClick={() => setSize(s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              size === s
                ? "border-accent bg-accent/10 text-accent"
                : "border-line text-ink-dim hover:border-ink-faint hover:text-ink"
            }`}
          >
            {VEHICLE_SIZE_LABELS[s]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
