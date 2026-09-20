"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useMotionPreference } from "@/lib/motion";
import { scrollToId } from "@/lib/smooth-scroll";

/**
 * A link to a home-page section ("/#book"). On the home page it eases
 * there without a reload; elsewhere it navigates client-side and lets the
 * browser land on the hash. Falls back to a plain link when JavaScript
 * has not run.
 */
export function AnchorLink({
  href,
  className,
  children,
  onNavigate,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  /** Runs before the scroll, e.g. to preselect a Service on the form. */
  onNavigate?: () => void;
  "data-testid"?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const preference = useMotionPreference();
  const [path, id] = href.split("#");

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (!id || (path !== "" && path !== "/")) return;
    if (pathname === "/") {
      if (scrollToId(id, preference === "reduced")) event.preventDefault();
    } else {
      event.preventDefault();
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}
