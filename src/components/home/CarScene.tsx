/**
 * The 2D car for the wash sequence: one sedan silhouette drawn identically
 * in every stage layer, so the scrub edge wiping across the viewport washes
 * the car itself — grime to foam to gloss. Token-driven colors throughout;
 * dies when the owner's real stills land.
 */
export type CarStage = "dirty" | "foam" | "sealed" | "interior";

/** Deterministic pseudo-random helper so bubbles/beads render stably. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const FOAM_SPOTS: Array<[number, number, number]> = Array.from(
  { length: 26 },
  (_, i) => {
    const t = i / 26;
    // Clusters along hood, roof, and upper doors.
    const x = 140 + t * 620 + (jitter(i) - 0.5) * 60;
    const y =
      110 +
      Math.sin(t * Math.PI) * -18 +
      jitter(i + 40) * 70 +
      (x > 600 ? 30 : 0);
    const r = 9 + jitter(i + 80) * 14;
    return [x, y, r];
  },
);

const BEADS: Array<[number, number, number]> = Array.from(
  { length: 34 },
  (_, i) => {
    const x = 150 + jitter(i + 7) * 620;
    const y = 108 + jitter(i + 53) * 78;
    const r = 1.8 + jitter(i + 91) * 2.4;
    return [x, y, r];
  },
);

const GRIME: Array<[number, number, number]> = Array.from(
  { length: 22 },
  (_, i) => {
    const x = 120 + jitter(i + 13) * 660;
    const y = 190 + jitter(i + 67) * 52;
    const r = 6 + jitter(i + 29) * 16;
    return [x, y, r];
  },
);

export function CarScene({
  stage,
  className = "",
}: {
  stage: CarStage;
  className?: string;
}) {
  const id = (name: string) => `${name}-${stage}`;
  const clean = stage === "sealed" || stage === "interior";

  return (
    <svg
      viewBox="0 0 900 320"
      data-car-scene={stage}
      role="img"
      aria-label={`Illustration — the car, ${stage} stage`}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          {stage === "dirty" ? (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-slot-dirty) 62%, var(--color-surface-raised))"
              />
              <stop offset="1" stopColor="var(--color-slot-dirty-deep)" />
            </>
          ) : stage === "foam" ? (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-slot-clean) 70%, var(--color-ink-faint))"
              />
              <stop offset="1" stopColor="var(--color-slot-clean-deep)" />
            </>
          ) : (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-ink) 16%, var(--color-surface-raised))"
              />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          )}
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          {stage === "interior" ? (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-accent) 55%, var(--color-slot-warm))"
              />
              <stop offset="1" stopColor="var(--color-slot-warm)" />
            </>
          ) : (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-ink) 22%, var(--color-base))"
              />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          )}
        </linearGradient>
        <linearGradient id={id("gloss")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-accent-bright)" stopOpacity="0.75" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse
        cx="450"
        cy="266"
        rx="340"
        ry="14"
        fill="var(--color-base)"
        opacity={0.8}
      />

      {/* Body */}
      <path
        d="M 104,246
           C 90,236 84,210 88,192
           C 92,176 110,168 150,162
           L 200,152
           C 230,128 270,106 320,98
           C 360,92 430,92 470,94
           C 560,96 640,116 700,160
           L 760,168
           C 788,172 800,178 812,196
           C 824,206 828,232 806,247
           L 704,250
           A 54,54 0 0 0 596,250
           L 304,250
           A 54,54 0 0 0 196,250
           L 140,250 Z"
        fill={`url(#${id("body")})`}
        stroke={
          clean
            ? "color-mix(in srgb, var(--color-accent) 35%, transparent)"
            : "color-mix(in srgb, var(--color-ink-faint) 40%, transparent)"
        }
        strokeWidth="1.5"
      />

      {/* Glass */}
      <path
        d="M 445,106 C 396,103 352,105 324,111 C 288,120 256,138 232,152 L 445,152 Z"
        fill={`url(#${id("glass")})`}
        opacity={stage === "interior" ? 0.95 : 0.85}
      />
      <path
        d="M 462,106 C 520,110 580,128 640,156 L 462,156 Z"
        fill={`url(#${id("glass")})`}
        opacity={stage === "interior" ? 0.95 : 0.85}
      />

      {/* Interior hint: headrests glowing through the glass */}
      {stage === "interior" && (
        <>
          <rect x="330" y="118" width="26" height="30" rx="8" fill="var(--color-slot-warm-deep)" />
          <rect x="470" y="122" width="26" height="28" rx="8" fill="var(--color-slot-warm-deep)" />
        </>
      )}

      {/* Character line */}
      <path
        d="M 120,192 C 320,182 620,180 786,190"
        stroke="color-mix(in srgb, var(--color-ink-faint) 50%, transparent)"
        strokeWidth="1.2"
      />

      {/* Wheels */}
      {[250, 650].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="250" r="46" fill="var(--color-base)" />
          <circle
            cx={cx}
            cy="250"
            r="45"
            stroke="color-mix(in srgb, var(--color-ink-faint) 60%, transparent)"
            strokeWidth="2"
          />
          <circle
            cx={cx}
            cy="250"
            r="26"
            stroke={clean ? "var(--color-accent-dim)" : "var(--color-ink-faint)"}
            strokeWidth="3"
            opacity={0.9}
          />
          <circle cx={cx} cy="250" r="7" fill="var(--color-ink-faint)" />
        </g>
      ))}

      {/* Stage: dirty — grime along the lower body, dull haze */}
      {stage === "dirty" && (
        <g>
          {GRIME.map(([x, y, r], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={r}
              ry={r * 0.55}
              fill="var(--color-slot-dirty-deep)"
              opacity={0.5}
            />
          ))}
          <path
            d="M 200,152 C 230,128 270,106 320,98 C 360,92 430,92 470,94 C 560,96 640,116 700,160"
            stroke="var(--color-slot-dirty)"
            strokeWidth="6"
            opacity="0.35"
          />
        </g>
      )}

      {/* Stage: foam — suds clinging to the upper body */}
      {stage === "foam" && (
        <g>
          {FOAM_SPOTS.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="var(--color-ink)"
              opacity={0.82}
            />
          ))}
          {FOAM_SPOTS.filter((_, i) => i % 3 === 0).map(([x, y, r], i) => (
            <circle
              key={`hl-${i}`}
              cx={x - r * 0.3}
              cy={y - r * 0.3}
              r={r * 0.3}
              fill="var(--color-ink)"
              opacity={0.95}
            />
          ))}
        </g>
      )}

      {/* Stage: sealed — specular gloss + water beading */}
      {clean && (
        <path
          d="M 300,102 C 420,94 540,102 640,134"
          stroke={`url(#${id("gloss")})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity={stage === "sealed" ? 0.85 : 0.5}
        />
      )}
      {stage === "sealed" && (
        <g>
          {BEADS.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="color-mix(in srgb, var(--color-ink) 70%, var(--color-accent))"
              opacity={0.55}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
