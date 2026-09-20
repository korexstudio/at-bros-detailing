"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ServiceMode } from "@/content";

/**
 * The global Service Mode state (Mobile default, URL-independent).
 * Flipping it re-renders every price on the page.
 *
 * `chosenMode` is the mode only once the visitor has explicitly picked
 * one. Until then the default is not treated as information, so a
 * Booking text does not claim "Mobile" for someone who never looked.
 */
interface ServiceModeState {
  mode: ServiceMode;
  chosenMode: ServiceMode | undefined;
  setMode: (mode: ServiceMode) => void;
}

const ServiceModeContext = createContext<ServiceModeState>({
  mode: "mobile",
  chosenMode: undefined,
  setMode: () => {},
});

export function ServiceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ServiceMode>("mobile");
  const [chosen, setChosen] = useState(false);
  const setMode = useCallback((next: ServiceMode) => {
    setModeState(next);
    setChosen(true);
  }, []);
  const value = useMemo(
    () => ({ mode, chosenMode: chosen ? mode : undefined, setMode }),
    [mode, chosen, setMode],
  );
  return (
    <ServiceModeContext.Provider value={value}>
      {children}
    </ServiceModeContext.Provider>
  );
}

export function useServiceMode(): ServiceModeState {
  return useContext(ServiceModeContext);
}
