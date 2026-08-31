/**
 * The 2D car for the wash sequence: one sedan silhouette drawn identically
 * in every stage layer, so the scrub edge wiping across the viewport washes
 * the car itself — grime to foam to gloss. Token-driven colors throughout;
 * dies when the owner's real stills land.
 *
 * Geometry notes: proportions follow a real executive fastback — wheelbase
 * ~58% of length, roof height ~29% of length, arches cut into the rocker,
 * greenhouse with A/B/C pillars, flush handles, slivered lamps.
 */
export type CarStage = "dirty" | "foam" | "sealed" | "interior";

/** Deterministic pseudo-random helper so bubbles/beads render stably. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Suds clusters hugging the hood, roof, and upper doors. */
const FOAM_SPOTS: Array<[number, number, number]> = Array.from(
  { length: 30 },
  (_, i) => {
    const t = i / 30;
    const x = 180 + t * 660 + (jitter(i) - 0.5) * 50;
    // Follow the top surface: roof low band mid-car, hood band at the front.
    const surface = x < 620 ? 104 + Math.abs(x - 440) * 0.06 : 150 + (x - 620) * 0.1;
    const y = surface + jitter(i + 40) * 46;
    const r = 8 + jitter(i + 80) * 13;
    return [x, y, r];
  },
);

const BEADS: Array<[number, number, number]> = Array.from(
  { length: 40 },
  (_, i) => {
    const x = 280 + jitter(i + 7) * 560;
    const surface = x < 620 ? 108 + Math.abs(x - 440) * 0.06 : 152 + (x - 620) * 0.1;
    const y = surface + jitter(i + 53) * 40;
    const r = 1.6 + jitter(i + 91) * 2.2;
    return [x, y, r];
  },
);

const GRIME: Array<[number, number, number]> = Array.from(
  { length: 24 },
  (_, i) => {
    const x = 150 + jitter(i + 13) * 700;
    const y = 212 + jitter(i + 67) * 44;
    const r = 6 + jitter(i + 29) * 15;
    return [x, y, r];
  },
);

const SPOKE_ANGLES = [0, 72, 144, 216, 288];

function Wheel({ cx, clean }: { cx: number; clean: boolean }) {
  return (
    <g>
      {/* Tire */}
      <circle cx={cx} cy="240" r="60" fill="var(--color-base)" />
      <circle
        cx={cx}
        cy="240"
        r="59"
        stroke="color-mix(in srgb, var(--color-ink-faint) 45%, transparent)"
        strokeWidth="1.5"
      />
      {/* Rim */}
      <circle
        cx={cx}
        cy="240"
        r="36"
        fill="color-mix(in srgb, var(--color-ink-faint) 18%, var(--color-base))"
        stroke={clean ? "var(--color-accent-dim)" : "var(--color-ink-faint)"}
        strokeWidth="2"
      />
      {SPOKE_ANGLES.map((angle) => (
        <line
          key={angle}
          x1={cx}
          y1="240"
          x2={cx}
          y2="209"
          stroke={clean ? "var(--color-accent-dim)" : "var(--color-ink-faint)"}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.85"
          transform={`rotate(${angle} ${cx} 240)`}
        />
      ))}
      <circle cx={cx} cy="240" r="8" fill="var(--color-ink-faint)" />
    </g>
  );
}

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
      viewBox="0 0 1000 340"
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
                stopColor="color-mix(in srgb, var(--color-slot-dirty) 55%, var(--color-surface-raised))"
              />
              <stop offset="0.55" stopColor="color-mix(in srgb, var(--color-slot-dirty) 35%, var(--color-base))" />
              <stop offset="1" stopColor="var(--color-slot-dirty-deep)" />
            </>
          ) : stage === "foam" ? (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-ink-faint) 42%, var(--color-surface-raised))"
              />
              <stop offset="0.55" stopColor="var(--color-surface-raised)" />
              <stop offset="1" stopColor="var(--color-slot-clean-deep)" />
            </>
          ) : (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-ink) 30%, var(--color-surface-raised))"
              />
              <stop offset="0.5" stopColor="var(--color-surface-raised)" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          )}
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          {stage === "interior" ? (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-accent) 60%, var(--color-slot-warm))"
              />
              <stop offset="1" stopColor="var(--color-slot-warm)" />
            </>
          ) : (
            <>
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--color-ink) 30%, var(--color-base))"
              />
              <stop offset="0.7" stopColor="color-mix(in srgb, var(--color-ink) 8%, var(--color-base))" />
              <stop offset="1" stopColor="var(--color-base)" />
            </>
          )}
        </linearGradient>
        <linearGradient id={id("gloss")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-accent-bright)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("reflect")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-base)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-base)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="500" cy="304" rx="410" ry="12" fill="var(--color-base)" opacity="0.85" />

      {/* Body silhouette — rear at left, nose at right */}
      <path
        d="M 96,262
           C 78,254 70,236 72,214
           C 73,196 80,184 96,176
           L 118,170
           C 160,162 200,158 246,156
           C 300,110 360,92 440,88
           C 480,86 520,86 552,90
           C 600,96 640,116 676,150
           L 700,156
           C 740,158 790,164 830,176
           C 862,184 884,196 894,214
           C 900,230 898,248 886,258
           L 862,264
           L 824,264
           A 69,69 0 0 0 686,264
           L 314,264
           A 69,69 0 0 0 176,264
           L 130,264
           Z"
        fill={`url(#${id("body")})`}
        stroke={
          clean
            ? "color-mix(in srgb, var(--color-accent) 30%, transparent)"
            : "color-mix(in srgb, var(--color-ink-faint) 35%, transparent)"
        }
        strokeWidth="1.5"
      />

      {/* Horizon reflection along the lower body */}
      <path
        d="M 110,206 C 380,194 700,196 884,214 L 886,258 L 862,264 L 824,264
           A 69,69 0 0 0 686,264 L 314,264 A 69,69 0 0 0 176,264 L 130,264 L 96,262
           C 82,256 74,240 72,222 Z"
        fill={`url(#${id("reflect")})`}
        opacity="0.6"
      />

      {/* Greenhouse */}
      <path
        d="M 262,158
           C 306,116 362,100 438,96
           C 478,94 516,95 545,99
           C 588,106 624,124 654,152
           L 262,158 Z"
        fill={`url(#${id("glass")})`}
        opacity={stage === "interior" ? 0.95 : 0.9}
      />
      {/* Interior hint: headrests through the glass */}
      {stage === "interior" && (
        <>
          <rect x="468" y="114" width="26" height="34" rx="9" fill="var(--color-slot-warm-deep)" />
          <rect x="348" y="120" width="24" height="32" rx="9" fill="var(--color-slot-warm-deep)" />
        </>
      )}
      {/* B-pillar */}
      <path d="M 448,96 L 464,96 L 478,157 L 460,157 Z" fill={`url(#${id("body")})`} />
      {/* Beltline chrome */}
      <path
        d="M 258,158 C 380,152 560,152 660,153"
        stroke={clean ? "var(--color-accent-dim)" : "color-mix(in srgb, var(--color-ink-faint) 60%, transparent)"}
        strokeWidth="2"
      />

      {/* Door seams + handles */}
      <path
        d="M 468,160 C 470,200 470,238 466,262"
        stroke="color-mix(in srgb, var(--color-base) 70%, transparent)"
        strokeWidth="2"
      />
      <path
        d="M 330,160 C 332,200 332,238 330,262"
        stroke="color-mix(in srgb, var(--color-base) 70%, transparent)"
        strokeWidth="2"
      />
      <rect x="496" y="172" width="34" height="7" rx="3.5" fill="color-mix(in srgb, var(--color-ink-faint) 55%, transparent)" />
      <rect x="356" y="172" width="34" height="7" rx="3.5" fill="color-mix(in srgb, var(--color-ink-faint) 55%, transparent)" />

      {/* Mirror */}
      <path
        d="M 648,146 L 672,139 C 680,137 682,146 675,150 L 652,155 Z"
        fill={`url(#${id("body")})`}
        stroke="color-mix(in srgb, var(--color-ink-faint) 40%, transparent)"
        strokeWidth="1"
      />

      {/* Headlight + taillight slivers */}
      <path
        d="M 806,172 L 860,186 C 868,188 868,197 858,196 L 802,187 Z"
        fill={
          stage === "dirty"
            ? "color-mix(in srgb, var(--color-ink-faint) 50%, var(--color-base))"
            : "color-mix(in srgb, var(--color-ink) 75%, var(--color-accent))"
        }
        opacity="0.95"
      />
      <path
        d="M 96,178 L 132,172 L 134,185 L 98,191 Z"
        fill={clean ? "var(--color-accent)" : "var(--color-accent-dim)"}
        opacity="0.9"
      />
      {/* Lower intake */}
      <path
        d="M 846,232 L 892,226 L 894,241 L 848,247 Z"
        fill="var(--color-base)"
        opacity="0.9"
      />

      <Wheel cx={245} clean={clean} />
      <Wheel cx={755} clean={clean} />

      {/* Stage: dirty — grime along the lower body, dulled top edge */}
      {stage === "dirty" && (
        <g>
          {GRIME.map(([x, y, r], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={r}
              ry={r * 0.5}
              fill="var(--color-slot-dirty-deep)"
              opacity="0.45"
            />
          ))}
          <path
            d="M 246,156 C 300,110 360,92 440,88 C 480,86 520,86 552,90 C 600,96 640,116 676,150"
            stroke="var(--color-slot-dirty)"
            strokeWidth="5"
            opacity="0.35"
          />
        </g>
      )}

      {/* Stage: foam — suds clinging to the upper body */}
      {stage === "foam" && (
        <g>
          {FOAM_SPOTS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="var(--color-ink)" opacity="0.85" />
          ))}
          {FOAM_SPOTS.filter((_, i) => i % 3 === 0).map(([x, y, r], i) => (
            <circle
              key={`hl-${i}`}
              cx={x - r * 0.3}
              cy={y - r * 0.3}
              r={r * 0.32}
              fill="var(--color-ink)"
              opacity="1"
            />
          ))}
        </g>
      )}

      {/* Stage: sealed/interior — specular gloss; sealed adds beading */}
      {clean && (
        <>
          <path
            d="M 340,94 C 430,86 510,88 580,98"
            stroke={`url(#${id("gloss")})`}
            strokeWidth="6"
            strokeLinecap="round"
            opacity={stage === "sealed" ? 0.9 : 0.55}
          />
          <path
            d="M 706,158 C 760,162 812,170 856,180"
            stroke={`url(#${id("gloss")})`}
            strokeWidth="5"
            strokeLinecap="round"
            opacity={stage === "sealed" ? 0.75 : 0.4}
          />
        </>
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
              opacity="0.55"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
