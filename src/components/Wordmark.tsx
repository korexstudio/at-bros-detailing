import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * THE single swap point for the brand mark.
 *
 * The real logo lives at public/brand/logo.png: the round AT Bros badge,
 * knocked out to transparency and remapped to a single cream tone so it
 * sits on the dark base (source: docs/brand/logo-original.png). A round
 * badge cannot carry a 28px header on its own, so the badge renders as an
 * icon beside the typographic wordmark. Delete the file and the
 * typographic wordmark stands alone again.
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
  const lg = size === "lg";

  const text = (
    <span
      className={`font-display tracking-[0.18em] uppercase ${
        lg ? "text-4xl" : "text-lg"
      }`}
    >
      AT&nbsp;Bros<span className="text-accent">.</span>
    </span>
  );

  if (!logo) return <span className={className}>{text}</span>;

  return (
    <span className={`inline-flex items-center ${lg ? "gap-4" : "gap-2.5"} ${className}`}>
      <Image
        src={logo}
        alt=""
        aria-hidden
        width={lg ? 56 : 28}
        height={lg ? 56 : 28}
        className={lg ? "h-14 w-14" : "h-7 w-7"}
        priority
      />
      {text}
    </span>
  );
}
