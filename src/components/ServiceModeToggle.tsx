"use client";

import { SERVICE_MODE_LABELS, SERVICE_MODES, DROP_OFF_DISCOUNT } from "@/content";
import { useServiceMode } from "@/lib/service-mode";

/**
 * The Service Mode toggle. One global state: flip it anywhere and every
 * price on the page follows.
 */
export function ServiceModeToggle() {
  const { mode, setMode } = useServiceMode();

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <div
        role="radiogroup"
        aria-label="Service mode"
        className="inline-flex rounded-full border border-line bg-surface p-1"
      >
        {SERVICE_MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            data-mode={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              mode === m
                ? "bg-accent font-medium text-base"
                : "text-ink-dim hover:text-ink"
            }`}
          >
            {SERVICE_MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <span className="text-xs text-ink-faint">
        Drop-off saves ${DROP_OFF_DISCOUNT} on every Service.
      </span>
    </div>
  );
}
