/**
 * Filename-safe slug for generated preset files (.hlx/.json/.tsl) and their
 * download-pack zips. One definition — this was previously copy-pasted
 * byte-identically into all three platform generators, which is exactly how
 * platform slugs drift apart.
 */
export function slugifyPresetName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
