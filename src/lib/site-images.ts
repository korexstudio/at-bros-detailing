import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side drop-in image detection (same pattern as the wash stages):
 * put a .jpg/.png/.webp at the named spot under public/ and the section
 * uses it instead of its labeled placeholder. Delete the file to revert.
 *
 * Server components only — this touches the filesystem.
 */
export function detectImage(relPathWithoutExt: string): string | null {
  for (const ext of ["jpg", "png", "webp"]) {
    const rel = `${relPathWithoutExt}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", rel))) {
      return `/${rel}`;
    }
  }
  return null;
}
