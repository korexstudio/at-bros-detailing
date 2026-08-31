import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * THE single swap point for the brand mark.
 *
 * Drop the real logo at public/brand/logo.svg (or .png) and every wordmark
 * on the site — header, hero, footer — switches to it. Until then, a
 * typographic wordmark stands in.
 */
const LOGO_CANDIDATES = ["brand/logo.svg", "brand/logo.png"] as const;

function findLogo(): string | null {
  for (const candidate of LOGO_CANDIDATES) {
    if (existsSync(path.join(process.cwd(), "public", candidate))) {
      return `/${candidate}`;
    }
  }
  return null;
}

export function Wordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const logo = findLogo();
  const heightClass = size === "lg" ? "h-14" : "h-7";

  if (logo) {
    return (
      <Image
        src={logo}
        alt="AT Bros Detailing"
        width={size === "lg" ? 220 : 120}
        height={size === "lg" ? 56 : 28}
        className={`${heightClass} w-auto ${className}`}
        priority
      />
    );
  }

  return (
    <span
      className={`font-display tracking-[0.18em] uppercase ${
        size === "lg" ? "text-4xl" : "text-lg"
      } ${className}`}
    >
      AT&nbsp;Bros<span className="text-accent">.</span>
    </span>
  );
}
