"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VehicleSize } from "@/content";

/**
 * The global Vehicle Size state, the twin of Service Mode: pick it once
 * and every price on the site follows, from the home cards to the
 * Service page. Sedan by default, in memory only.
 *
 * `chosen` records whether the visitor explicitly picked a size. Until
 * they do, the default is not treated as information: a Quote Request
 * must not claim "Sedan" for a truck owner who never touched the control.
 */
interface VehicleSizeState {
  size: VehicleSize;
  chosen: boolean;
  setSize: (size: VehicleSize) => void;
}

const VehicleSizeContext = createContext<VehicleSizeState>({
  size: "sedan",
  chosen: false,
  setSize: () => {},
});

export function VehicleSizeProvider({ children }: { children: ReactNode }) {
  const [size, setSizeState] = useState<VehicleSize>("sedan");
  const [chosen, setChosen] = useState(false);
  const setSize = useCallback((next: VehicleSize) => {
    setSizeState(next);
    setChosen(true);
  }, []);
  const value = useMemo(
    () => ({ size, chosen, setSize }),
    [size, chosen, setSize],
  );
  return (
    <VehicleSizeContext.Provider value={value}>
      {children}
    </VehicleSizeContext.Provider>
  );
}

export function useVehicleSize(): VehicleSizeState {
  return useContext(VehicleSizeContext);
}
