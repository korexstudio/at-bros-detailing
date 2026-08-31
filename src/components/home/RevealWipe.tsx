"use client";

import { useEffect, useRef } from "react";
import type { BeforeAfterPair } from "@/content";
import { useMotionPreference } from "@/lib/motion";
import { CompareSlider } from "@/components/CompareSlider";

/**
 * The signature showpiece: as the visitor scrolls, a clean edge sweeps
 * across a real Before/After — the transformation happening under their
 * thumb. Pinned for the section's duration, scrubbed forward and backward.
 *
 * Under reduced motion or mobile-lite it degrades to the Gallery's manual
 * compare slider. It is only mounted at all when the manifest holds a real
 * pair (the honesty gate lives in the server component that renders this).
 */
export function RevealWipe({ pair }: { pair: BeforeAfterPair }) {
  const preference = useMotionPreference();
  const rootRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preference !== "full") return;
    const root = rootRef.current;
    const after = afterRef.current;
    const edge = edgeRef.current;
    if (!root || !after || !edge) return;

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
        const progress = { value: 0 };
        const apply = () => {
          const pct = progress.value * 100;
          after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
          edge.style.left = `${pct}%`;
          edge.style.opacity = pct > 0.5 && pct < 99.5 ? "1" : "0";
        };
        apply();

        gsap.to(progress, {
          value: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
          },
        });

        // Parallax depth inside the frame.
        gsap.fromTo(
          root.querySelectorAll("[data-wipe-parallax]"),
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "+=140%", scrub: true },
          },
        );
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [preference]);

  // Calm fallback: the manual compare slider.
  if (preference !== "full") {
    return (
      <section
        data-section="showpiece"
        data-testid="reveal-wipe-fallback"
        className="mx-auto max-w-6xl px-5 py-24 sm:px-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent">
          The transformation
        </p>
        <h2 className="font-display mt-3 text-display-lg leading-tight">
          Drag the line yourself.
        </h2>
        <div className="mt-8">
          <CompareSlider pair={pair} />
        </div>
      </section>
    );
  }

  return (
    <section data-section="showpiece" data-testid="reveal-wipe">
      <div ref={rootRef} className="relative h-svh overflow-hidden">
        {/* Before layer */}
        <div data-wipe-parallax className="absolute inset-[-4%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pair.before}
            alt={`Before — ${pair.alt}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        {/* After layer, clipped by scroll progress */}
        <div
          ref={afterRef}
          className="absolute inset-0"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <div data-wipe-parallax className="absolute inset-[-4%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pair.after}
              alt={`After — ${pair.alt}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </div>
        {/* The clean edge with its light sweep */}
        <div
          ref={edgeRef}
          aria-hidden
          className="absolute inset-y-0 w-[2px] bg-accent transition-opacity"
          style={{
            left: "0%",
            opacity: 0,
            boxShadow:
              "0 0 28px 6px color-mix(in srgb, var(--color-accent) 45%, transparent)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-base to-transparent pb-16 pt-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Before / After
          </p>
          <p className="font-display mt-2 text-display-md">Keep scrolling.</p>
        </div>
      </div>
    </section>
  );
}
