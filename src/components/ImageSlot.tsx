/**
 * A named placeholder for a real photo. Each slot says exactly which asset
 * belongs in it, so filling the site with real work is a checklist, not a
 * design task. Pass `src` to render the real image instead.
 */
export function ImageSlot({
  label,
  src,
  alt = "",
  aspect = "aspect-[3/2]",
  className = "",
  tone = "neutral",
  frameless = false,
  eager = false,
}: {
  /** What real asset goes here, e.g. "Hero — best Finished Car glamour shot". */
  label: string;
  src?: string;
  alt?: string;
  aspect?: string;
  className?: string;
  tone?: "neutral" | "dirty" | "clean";
  /** Full-bleed: no rounding or border (hero backdrop). */
  frameless?: boolean;
  /** Load immediately — for the LCP hero image only. */
  eager?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className={`${aspect} w-full object-cover ${
          frameless ? "" : "rounded-xl"
        } ${className}`}
      />
    );
  }

  const toneClass =
    tone === "dirty"
      ? "from-slot-dirty to-slot-dirty-deep"
      : tone === "clean"
        ? "from-slot-clean to-slot-clean-deep"
        : "from-surface-raised to-base";

  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${label}`}
      className={`${aspect} flex w-full items-end rounded-xl border border-line bg-gradient-to-br p-4 ${toneClass} ${className}`}
    >
      <span className="rounded bg-base/70 px-2.5 py-1.5 text-xs text-ink-faint">
        📷 {label}
      </span>
    </div>
  );
}
