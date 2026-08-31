"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMotionPreference } from "@/lib/motion";
import type { PriceResult } from "@/content";
import { formatPrice } from "@/content";

/**
 * A price that rolls when it changes (Service Mode / Vehicle Size flips).
 * Under reduced motion it simply swaps.
 */
export function PriceRoll({
  price,
  className = "",
}: {
  price: PriceResult;
  className?: string;
}) {
  const preference = useMotionPreference();
  const label = formatPrice(price);

  if (preference === "reduced") {
    return (
      <span className={className} data-price={label}>
        {label}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex overflow-hidden ${className}`}
      data-price={label}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          initial={{ y: "0.9em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.9em", opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
