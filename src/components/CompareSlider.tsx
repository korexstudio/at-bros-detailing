"use client";

import { useId, useState } from "react";
import type { BeforeAfterPair } from "@/content";

/**
 * The Before/After drag-to-compare slider.
 *
 * The handle is a real <input type="range"> stretched over the figure, so
 * mouse drag, touch drag, and keyboard arrows all work for free and the
 * control is screen-reader labelled. Both sides carry visible labels.
 */
export function CompareSlider({ pair }: { pair: BeforeAfterPair }) {
  const [percent, setPercent] = useState(50);
  const id = useId();

  return (
    <figure data-testid="compare-slider" className="group">
      <div className="relative aspect-[3/2] w-full select-none overflow-hidden rounded-xl border border-line">
        {/* Before fills the frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.before}
          alt={`Before — ${pair.alt}`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* After is clipped to the slider position. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
          data-testid="after-pane"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pair.after}
            alt={`After — ${pair.alt}`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Divider + handle */}
        <div
          aria-hidden
          className="absolute inset-y-0 w-0.5 bg-accent"
          style={{ left: `${percent}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-base/80 text-accent">
            ⇔
          </span>
        </div>

        <span className="absolute left-3 top-3 rounded bg-base/70 px-2 py-0.5 text-xs text-ink-dim">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded bg-accent/80 px-2 py-0.5 text-xs font-medium text-base">
          After
        </span>

        {/* The actual control: an invisible range input over the whole frame. */}
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          aria-label={`Compare before and after — ${pair.alt}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>
      <figcaption className="mt-2 text-xs text-ink-faint">
        {pair.isPlaceholder ? "Placeholder — replaced by real work at launch. " : ""}
        Drag or use arrow keys to compare.
      </figcaption>
    </figure>
  );
}
