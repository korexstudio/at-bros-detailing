"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/lib/motion";
import { StageSurface, type StageArt } from "./StageSurface";

/**
 * The scroll-driven wash: ONE pinned frame carried through four surface
 * states as the visitor scrolls — grime, foam, sealed gloss, warm leather —
 * with the copy and a stage rail advancing in sync. Scrubs forward and
 * backward. The reveal wipe later is the Before/After payoff.
 *
 * Each layer shows either a real stage photo (dropped into public/stages/,
 * detected server-side and passed via `images`) or the macro StageSurface
 * illustration. Reduced motion / mobile-lite get calm stacked chapters.
 */
export type StageId = "wash" | "decontaminate" | "protect" | "interior";

/** Map of stage id -> public image path, or null to use the illustration. */
export type StageImages = Record<StageId, string | null>;

interface Stage {
  id: StageId;
  art: StageArt;
  kicker: string;
  title: string;
  body: string;
  /** The real still that replaces this layer's art (docs/stage-image-prompts.md). */
  shot: string;
}

const STAGES: Stage[] = [
  {
    id: "wash",
    art: "dirty",
    kicker: "Stage one",
    title: "Dirty",
    body: "Sun, freeway fallout, tunnel-wash swirls. This is where every car we touch starts.",
    shot: "public/stages/wash.jpg — the car dirty (see docs/stage-image-prompts.md)",
  },
  {
    id: "decontaminate",
    art: "foam",
    kicker: "Stage two",
    title: "Foam & decontaminate",
    body: "High-alkaline foam lifts the grime without touching the paint; iron remover dissolves what's bonded in.",
    shot: "public/stages/decontaminate.jpg — the same car mid-foam",
  },
  {
    id: "protect",
    art: "sealed",
    kicker: "Stage three",
    title: "Sealed",
    body: "Ceramic sealant locks the finish under a sacrificial layer — water beads and rolls for months.",
    shot: "public/stages/protect.jpg — sealed paint, water beading",
  },
  {
    id: "interior",
    art: "interior",
    kicker: "Stage four",
    title: "Inside too",
    body: "Deep vacuum, compressed air in the seams, conditioner bringing plastics and leather back to OEM matte.",
    shot: "public/stages/interior.jpg — warm-lit finished interior",
  },
];

const NO_IMAGES: StageImages = {
  wash: null,
  decontaminate: null,
  protect: null,
  interior: null,
};

function StageMedia({
  stage,
  image,
  className = "",
}: {
  stage: Stage;
  image: string | null;
  className?: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={`${stage.title} — stage photo`}
        data-stage-art={stage.art}
        className={`h-full w-full object-cover ${className}`}
        draggable={false}
      />
    );
  }
  return <StageSurface stage={stage.art} className={`h-full w-full ${className}`} />;
}

/** Calm fallback: stacked chapters, no pin, no parallax. */
function StackedChapters({ images }: { images: StageImages }) {
  return (
    <div data-section="process" data-testid="wash-sequence-stacked">
      {STAGES.map((stage) => (
        <section
          key={stage.id}
          data-chapter={stage.id}
          className="mx-auto flex min-h-[60svh] max-w-6xl items-center px-5 py-16 sm:px-8"
        >
          <div className="grid w-full items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line">
              <StageMedia stage={stage} image={images[stage.id]} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {stage.kicker}
              </p>
              <h2 className="font-display mt-3 text-display-lg leading-tight">
                {stage.title}
              </h2>
              <p className="mt-5 max-w-prose leading-relaxed text-ink-dim">
                {stage.body}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function WashSequence({ images = NO_IMAGES }: { images?: StageImages }) {
  const preference = useMotionPreference();
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const edgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preference !== "full") return;
    const root = rootRef.current;
    const edge = edgeRef.current;
    if (!root || !edge) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const transitions = STAGES.length - 1; // 3
        const progress = { value: 0 };

        const apply = () => {
          const p = progress.value * transitions; // 0..3
          // Wipe each layer in across its band.
          for (let i = 1; i < STAGES.length; i += 1) {
            const frac = Math.min(1, Math.max(0, p - (i - 1)));
            const layer = layerRefs.current[i];
            if (layer) layer.style.clipPath = `inset(0 ${(1 - frac) * 100}% 0 0)`;
          }
          // The glowing edge rides the active wipe.
          const active = Math.min(transitions - 1, Math.floor(p));
          const frac = Math.min(1, Math.max(0, p - active));
          const mid = frac > 0.004 && frac < 0.996;
          edge.style.left = `${frac * 100}%`;
          edge.style.opacity = mid ? "1" : "0";
          // Copy swap + stage rail. Sharp window: the outgoing block is fully
          // gone before the incoming one appears — never two texts overlaid.
          STAGES.forEach((_, i) => {
            const d = Math.abs(p - i);
            const o = Math.min(1, Math.max(0, (0.45 - d) / 0.2));
            const copy = copyRefs.current[i];
            if (copy) {
              copy.style.opacity = String(o);
              copy.style.visibility = o > 0.02 ? "visible" : "hidden";
              copy.style.transform = `translateY(${(1 - o) * 14}px)`;
            }
            const dot = dotRefs.current[i];
            if (dot) {
              dot.style.backgroundColor =
                Math.round(p) === i ? "var(--color-accent)" : "var(--color-line)";
            }
          });
        };
        apply();

        gsap.to(progress, {
          value: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=350%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
          },
        });
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [preference]);

  if (preference !== "full") return <StackedChapters images={images} />;

  return (
    <section data-section="process" data-testid="wash-sequence-pinned">
      <div ref={rootRef} className="relative h-svh overflow-hidden">
        {/* Stage layers: identical composition, wiped state to state. */}
        {STAGES.map((stage, i) => (
          <div
            key={stage.id}
            data-chapter={stage.id}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ clipPath: i === 0 ? "none" : "inset(0 100% 0 0)" }}
          >
            <StageMedia stage={stage} image={images[stage.id]} />
          </div>
        ))}

        {/* The clean edge riding the active wipe. */}
        <div
          ref={edgeRef}
          aria-hidden
          className="absolute inset-y-0 w-[2px] bg-accent"
          style={{
            left: "0%",
            opacity: 0,
            boxShadow:
              "0 0 28px 6px color-mix(in srgb, var(--color-accent) 45%, transparent)",
          }}
        />

        {/* Copy, swapping per stage. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-base via-base/70 to-transparent pb-16 pt-32">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="relative min-h-40 max-w-xl">
              {STAGES.map((stage, i) => (
                <div
                  key={stage.id}
                  ref={(el) => {
                    copyRefs.current[i] = el;
                  }}
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    visibility: i === 0 ? "visible" : "hidden",
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">
                    {stage.kicker}
                  </p>
                  <h2 className="font-display mt-2 text-display-lg leading-tight">
                    {stage.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-dim">{stage.body}</p>
                </div>
              ))}
            </div>
            {/* Stage rail */}
            <div className="mt-6 flex gap-2" aria-hidden>
              {STAGES.map((stage, i) => (
                <span
                  key={stage.id}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="h-1.5 w-8 rounded-full"
                  style={{
                    backgroundColor:
                      i === 0 ? "var(--color-accent)" : "var(--color-line)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
