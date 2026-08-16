import type { VerificationLevel } from "@/lib/verification";
import verificationData from "@/data/recipe-verification.json";

/**
 * Client-safe verification lookup.
 *
 * Deliberately its own module: `verification.ts` imports the three preset
 * generators and the DSP cost table, and a client component that reached for
 * the verdict through that file would ship all of it to the browser. Here the
 * verdict is just a JSON read.
 *
 * Regenerate the data with `npx tsx scripts/generate-verification-data.ts`.
 * An unknown slug grades as `unbuilt` — when we don't know, we don't claim.
 */
export function lookupVerificationLevel(slug: string): VerificationLevel {
  const entry = (verificationData as Record<string, { level?: string }>)[slug];
  const level = entry?.level;
  return level === "complete" || level === "partial" ? level : "unbuilt";
}
