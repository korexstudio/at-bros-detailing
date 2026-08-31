"use client";

import { useEffect } from "react";
import { useMotionPreference } from "@/lib/motion";

/**
 * The home page's scroll motion: Lenis smooth scrolling, parallax depth in
 * the process chapters, and text reveals as sections enter.
 *
 * Everything routes through the motion-preference gate:
 * - "reduced": this component only stamps html[data-motion] and stops.
 * - "lite":    text reveals only — no smooth scroll, no parallax.
 * - "full":    the whole show.
 *
 * The gate value is mirrored to <html data-motion> so pure-CSS effects
 * (hero drift, sweep, grain) obey the same preference.
 */
export function MotionLayer() {
  const preference = useMotionPreference();

  useEffect(() => {
    document.documentElement.dataset.motion = preference;
    if (preference === "reduced") return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      let rafId = 0;
      let lenis: { destroy(): void } | undefined;

      if (preference === "full") {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const instance = new Lenis({ lerp: 0.12 });
        instance.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => {
          instance.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        lenis = instance;
        document.documentElement.dataset.smoothScroll = "on";
      }

      const ctx = gsap.context(() => {
        if (preference === "full") {
          // Parallax depth: media drifts against copy inside each chapter.
          gsap.utils.toArray<HTMLElement>('[data-parallax="media"]').forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: "none",
                scrollTrigger: { trigger: el, scrub: 0.6 },
              },
            );
          });
        }

        // Text reveals as sections enter (full + lite).
        gsap.utils
          .toArray<HTMLElement>("[data-section] h2, [data-parallax='copy'] p")
          .forEach((el) => {
            gsap.from(el, {
              y: 28,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });
      });

      cleanup = () => {
        cancelAnimationFrame(rafId);
        ctx.revert();
        lenis?.destroy();
        delete document.documentElement.dataset.smoothScroll;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [preference]);

  return null;
}
