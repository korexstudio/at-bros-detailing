/**
 * Full-bleed macro art for the wash sequence: the shoulder curve of a
 * fender in extreme close-up, carried through four surface states —
 * grime film, clinging foam, sealed gloss with beading, and stitched
 * leather under warm cabin light. No figurative car: gradients, light,
 * and surface, which is what vector art renders premium.
 *
 * One identical composition in every layer, so the scrub edge wiping
 * across the viewport transforms the surface itself. Token-driven
 * throughout; replaced wholesale when stage photos land.
 */
export type StageArt = "dirty" | "foam" | "sealed" | "interior";

function jitter(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** y of the fender shoulder curve at x (matches the PANEL path below). */
function shoulderY(x: number): number {
  const t = x / 1000;
  const mt = 1 - t;
  return mt * mt * mt * 430 + 3 * mt * mt * t * 360 + 3 * mt * t * t * 330 + t * t * t * 395;
}

/** The panel below the shoulder curve. */
const PANEL_PATH =
  "M 0,430 C 250,360 520,330 1000,395 L 1000,600 L 0,600 Z";
/** The shoulder line itself, for rim light. */
const SHOULDER_PATH = "M 0,430 C 250,360 520,330 1000,395";

const BEADS: Array<[number, number, number]> = Array.from({ length: 90 }, (_, i) => {
  const x = 20 + jitter(i + 7) * 960;
  const top = shoulderY(x) + 14;
  const y = top + jitter(i + 53) * (585 - top);
  const r = 2.2 + jitter(i + 91) * 4.6;
  return [x, y, r];
});

const GRIME_BLOBS: Array<[number, number, number]> = Array.from({ length: 18 }, (_, i) => {
  const x = 30 + jitter(i + 13) * 940;
  const top = shoulderY(x) + 16;
  const y = top + jitter(i + 67) * (575 - top);
  const r = 44 + jitter(i + 29) * 80;
  return [x, y, r];
});

const WATER_SPOTS: Array<[number, number, number]> = Array.from({ length: 12 }, (_, i) => {
  const x = 60 + jitter(i + 101) * 880;
  const top = shoulderY(x) + 26;
  const y = top + jitter(i + 113) * (560 - top);
  const r = 7 + jitter(i + 127) * 12;
  return [x, y, r];
});

const FOAM_MASSES: Array<[number, number, number]> = Array.from({ length: 34 }, (_, i) => {
  const x = 10 + (i / 34) * 980 + (jitter(i) - 0.5) * 40;
  const y = shoulderY(x) - 2 + jitter(i + 40) * 30;
  const r = 15 + jitter(i + 80) * 24;
  return [x, y, r];
});

const FOAM_BUBBLES: Array<[number, number, number]> = Array.from({ length: 70 }, (_, i) => {
  const x = 10 + jitter(i + 31) * 980;
  const y = shoulderY(x) - 20 + jitter(i + 43) * 80;
  const r = 2.5 + jitter(i + 59) * 7;
  return [x, y, r];
});

/** Quilt stitch lines for the leather stage: two diagonal families. */
function quiltLines(direction: 1 | -1): string[] {
  const lines: string[] = [];
  for (let k = -6; k < 16; k += 1) {
    const offset = k * 95;
    const x1 = direction === 1 ? offset : offset + 300;
    const x2 = direction === 1 ? offset + 300 : offset;
    lines.push(`M ${x1},600 L ${x2},330`);
  }
  return lines;
}

export function StageSurface({
  stage,
  className = "",
}: {
  stage: StageArt;
  className?: string;
}) {
  const id = (name: string) => `${name}-${stage}`;

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      data-stage-art={stage}
      role="img"
      aria-label={`Illustration — ${stage} surface, macro`}
      className={className}
      fill="none"
    >
      <defs>
        <filter id={id("blurL")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={id("blurM")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id("blurS")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        {/* Backdrop */}
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0.6" y2="1">
          {stage === "dirty" ? (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-slot-dirty) 26%, var(--color-base))" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          ) : stage === "foam" ? (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-slot-clean) 55%, var(--color-base))" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="var(--color-surface)" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          )}
        </linearGradient>

        {/* Panel paint */}
        <linearGradient id={id("panel")} x1="0" y1="0" x2="0" y2="1">
          {stage === "dirty" ? (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-slot-dirty) 45%, var(--color-surface-raised))" />
              <stop offset="1" stopColor="var(--color-slot-dirty-deep)" />
            </>
          ) : stage === "foam" ? (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-slot-clean) 80%, var(--color-ink-faint))" />
              <stop offset="1" stopColor="var(--color-slot-clean-deep)" />
            </>
          ) : stage === "sealed" ? (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-ink) 14%, var(--color-surface-raised))" />
              <stop offset="0.45" stopColor="var(--color-surface)" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="color-mix(in srgb, var(--color-ink) 7%, var(--color-surface-raised))" />
              <stop offset="1" stopColor="var(--color-surface)" />
            </>
          )}
        </linearGradient>

        {/* Bead: a droplet with a bright core */}
        <radialGradient id={id("bead")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="var(--color-ink)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.05" />
        </radialGradient>

        {/* Warm cabin glow (interior stage) */}
        <radialGradient id={id("glow")} cx="0.22" cy="0.18" r="0.85">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.08" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id("spec")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent-bright)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-accent-bright)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--color-accent-bright)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="1000" height="600" fill={`url(#${id("bg")})`} />
      {stage === "interior" && (
        <rect width="1000" height="600" fill={`url(#${id("glow")})`} />
      )}

      {/* The panel */}
      <path d={PANEL_PATH} fill={`url(#${id("panel")})`} />

      {/* Rim light along the shoulder */}
      <path
        d={SHOULDER_PATH}
        stroke={
          stage === "sealed"
            ? "var(--color-accent)"
            : stage === "interior"
              ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
              : stage === "foam"
                ? "color-mix(in srgb, var(--color-ink) 40%, transparent)"
                : "color-mix(in srgb, var(--color-ink-faint) 35%, transparent)"
        }
        strokeWidth={stage === "sealed" ? 2.5 : 1.5}
      />

      {/* ------------------------------------------------ dirty */}
      {stage === "dirty" && (
        <g>
          {/* Dust film first, so grime reads on top of it */}
          <path d={PANEL_PATH} fill="var(--color-slot-dirty)" opacity="0.28" />
          {GRIME_BLOBS.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={
                i % 3 === 0
                  ? "var(--color-slot-dirty)"
                  : "var(--color-slot-dirty-deep)"
              }
              opacity="0.65"
              filter={`url(#${id("blurL")})`}
            />
          ))}
          {/* Dried road-spray streaks along the panel */}
          {[470, 505, 545].map((y, i) => (
            <rect
              key={`streak-${i}`}
              x={-20}
              y={y}
              width="1040"
              height={10 + i * 4}
              fill="var(--color-slot-dirty-deep)"
              opacity="0.35"
              filter={`url(#${id("blurM")})`}
            />
          ))}
          {WATER_SPOTS.map(([x, y, r], i) => (
            <circle
              key={`ws-${i}`}
              cx={x}
              cy={y}
              r={r}
              stroke="color-mix(in srgb, var(--color-ink-faint) 60%, transparent)"
              strokeWidth="1.8"
              opacity="0.75"
            />
          ))}
        </g>
      )}

      {/* ------------------------------------------------ foam */}
      {stage === "foam" && (
        <g>
          {/* Suds clusters hugging the shoulder — tight, barely blurred */}
          {FOAM_MASSES.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="var(--color-ink)"
              opacity={0.8 + jitter(i + 5) * 0.2}
              filter={`url(#${id("blurS")})`}
            />
          ))}
          {/* Runnels sliding down the panel */}
          {[140, 300, 460, 620, 780, 920].map((x, i) => (
            <rect
              key={`run-${i}`}
              x={x}
              y={shoulderY(x) + 4}
              width={6 + jitter(i + 3) * 6}
              height={60 + jitter(i + 9) * 120}
              rx="6"
              fill="var(--color-ink)"
              opacity="0.4"
              filter={`url(#${id("blurS")})`}
            />
          ))}
          {/* Crisp bubbles layered over the masses */}
          {FOAM_BUBBLES.map(([x, y, r], i) => (
            <circle
              key={`b-${i}`}
              cx={x}
              cy={y}
              r={r}
              fill="var(--color-ink)"
              opacity={0.7 + jitter(i + 11) * 0.3}
            />
          ))}
          {/* Tiny specular pops inside the foam */}
          {FOAM_BUBBLES.filter((_, i) => i % 4 === 0).map(([x, y, r], i) => (
            <circle
              key={`s-${i}`}
              cx={x - r * 0.35}
              cy={y - r * 0.35}
              r={Math.max(0.8, r * 0.28)}
              fill="var(--color-ink)"
            />
          ))}
        </g>
      )}

      {/* ------------------------------------------------ sealed */}
      {stage === "sealed" && (
        <g>
          {/* Specular sweep hugging the curve */}
          <path
            d="M 40,470 C 300,395 620,365 960,420"
            stroke={`url(#${id("spec")})`}
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.75"
            filter={`url(#${id("blurM")})`}
          />
          <path
            d="M 40,470 C 300,395 620,365 960,420"
            stroke={`url(#${id("spec")})`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Beading */}
          {BEADS.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={`url(#${id("bead")})`} />
              <circle
                cx={x - r * 0.3}
                cy={y - r * 0.35}
                r={Math.max(0.7, r * 0.22)}
                fill="var(--color-ink)"
                opacity="0.9"
              />
            </g>
          ))}
        </g>
      )}

      {/* ------------------------------------------------ interior */}
      {stage === "interior" && (
        <g>
          {/* Quilted leather: two diagonal stitch families, clipped to the panel */}
          <clipPath id={id("panelClip")}>
            <path d={PANEL_PATH} />
          </clipPath>
          <g clipPath={`url(#${id("panelClip")})`}>
            {quiltLines(1).map((d, i) => (
              <path
                key={`q1-${i}`}
                d={d}
                stroke="color-mix(in srgb, var(--color-accent-dim) 55%, transparent)"
                strokeWidth="1.4"
                strokeDasharray="7 6"
                opacity="0.65"
              />
            ))}
            {quiltLines(-1).map((d, i) => (
              <path
                key={`q2-${i}`}
                d={d}
                stroke="color-mix(in srgb, var(--color-accent-dim) 55%, transparent)"
                strokeWidth="1.4"
                strokeDasharray="7 6"
                opacity="0.65"
              />
            ))}
            {/* Soft sheen across the leather */}
            <path
              d="M 30,480 C 300,410 620,385 970,435"
              stroke={`url(#${id("spec")})`}
              strokeWidth="34"
              strokeLinecap="round"
              opacity="0.35"
              filter={`url(#${id("blurL")})`}
            />
          </g>
        </g>
      )}

      {/* Bottom fade into the copy overlay */}
      <rect
        y="440"
        width="1000"
        height="160"
        fill="var(--color-base)"
        opacity="0.25"
      />
    </svg>
  );
}
