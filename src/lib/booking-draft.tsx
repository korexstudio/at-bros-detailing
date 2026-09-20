"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * The Service a visitor picked on a pricing card on the way to the Book by
 * text form. In memory only; the form reads it once and the visitor can
 * still change it there.
 */
interface BookingDraftState {
  serviceSlug: string | undefined;
  chooseService: (slug: string) => void;
}

const BookingDraftContext = createContext<BookingDraftState>({
  serviceSlug: undefined,
  chooseService: () => {},
});

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [serviceSlug, setServiceSlug] = useState<string | undefined>(undefined);
  const chooseService = useCallback((slug: string) => setServiceSlug(slug), []);
  const value = useMemo(
    () => ({ serviceSlug, chooseService }),
    [serviceSlug, chooseService],
  );
  return (
    <BookingDraftContext.Provider value={value}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft(): BookingDraftState {
  return useContext(BookingDraftContext);
}
