"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * useLayoutEffect on the client so the real preference is resolved BEFORE
 * the browser paints after hydration — the "reduced" server assumption never
 * flashes and swapping variants (e.g. the reveal wipe) causes no visible
 * layout shift. Falls back to useEffect during SSR to avoid React's warning.
 */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The motion-preference gate. Every animation on the site consults this —
 * nothing animates without asking.
 *
 * - "reduced": the visitor asked for reduced motion. Effects off.
 * - "lite":    small viewport / data-saver. Calm, cheap motion only.
 * - "full":    the whole show.
 */
export type MotionPreference = "full" | "lite" | "reduced";

const MotionPreferenceContext = createContext<MotionPreference>("full");

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const LITE_QUERY = "(max-width: 767px)";

function resolvePreference(): MotionPreference {
  if (typeof window === "undefined") return "full";
  if (window.matchMedia(REDUCED_QUERY).matches) return "reduced";
  const saveData = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData;
  if (saveData || window.matchMedia(LITE_QUERY).matches) return "lite";
  return "full";
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  // Server render assumes "reduced" so no effect ever flashes before hydration.
  const [preference, setPreference] = useState<MotionPreference>("reduced");

  useIsoLayoutEffect(() => {
    const update = () => setPreference(resolvePreference());
    update();
    const queries = [window.matchMedia(REDUCED_QUERY), window.matchMedia(LITE_QUERY)];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return (
    <MotionPreferenceContext.Provider value={preference}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

/** The one gate all motion routes through. */
export function useMotionPreference(): MotionPreference {
  return useContext(MotionPreferenceContext);
}
