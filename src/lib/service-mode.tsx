"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ServiceMode } from "@/content";

/**
 * The global Service Mode state (Mobile default, URL-independent).
 * Flipping it re-renders every price on the page.
 */
interface ServiceModeState {
  mode: ServiceMode;
  setMode: (mode: ServiceMode) => void;
}

const ServiceModeContext = createContext<ServiceModeState>({
  mode: "mobile",
  setMode: () => {},
});

export function ServiceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ServiceMode>("mobile");
  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return (
    <ServiceModeContext.Provider value={value}>
      {children}
    </ServiceModeContext.Provider>
  );
}

export function useServiceMode(): ServiceModeState {
  return useContext(ServiceModeContext);
}
