/**
 * Geo allowlist: traffic policy is WESTERN-ONLY (owner decision,
 * 2026-08-27). Replaces the earlier blocklist (OFAC + CN/RU/BY) — an
 * allowlist supersedes it, since everything the blocklist named is
 * outside the allowlist anyway.
 *
 * The middleware reads Cloudflare's cf-ipcountry header and 403s any
 * request whose country is definitively known and NOT in this set.
 * Fail-open by design: a missing header (local dev, a host fronting the
 * app without Cloudflare) or Cloudflare's "XX" (undetermined) passes
 * through — degrading open beats locking everyone out on a config slip.
 * Cloudflare's "T1" (Tor) is a definite code not in the set → blocked.
 *
 * Known tradeoff, accepted: this blocks real guitarists in non-Western
 * markets with active worship scenes (Philippines, Singapore, South
 * Korea, Brazil...). If that ever changes, this set is the only thing
 * to edit. Major search/AI crawlers (Googlebot, Bingbot, GPTBot,
 * ClaudeBot) egress from US datacenters and are unaffected.
 *
 * List: anglosphere + EU + EFTA + European microstates + US territories.
 */
export const WESTERN_COUNTRIES: ReadonlySet<string> = new Set([
  // Anglosphere
  "US", "CA", "GB", "IE", "AU", "NZ",
  // US territories (Cloudflare reports these as their own codes)
  "PR", "GU", "VI", "AS", "MP",
  // UK crown dependencies / territories
  "IM", "JE", "GG", "GI",
  // Western / Northern / Southern Europe
  "FR", "DE", "NL", "BE", "LU", "AT", "CH", "LI",
  "ES", "PT", "IT", "MT", "GR", "CY",
  "DK", "SE", "NO", "FI", "IS",
  // European microstates
  "AD", "MC", "SM", "VA",
  // Central/Eastern EU members
  "PL", "CZ", "SK", "HU", "SI", "HR", "RO", "BG", "EE", "LV", "LT",
]);

/**
 * True when the request should be geo-blocked. Only blocks on a
 * DEFINITE non-Western country code — empty ("no header") and "XX"
 * ("Cloudflare couldn't determine") fail open.
 */
export function isBlockedGeo(country: string): boolean {
  return country !== "" && country !== "XX" && !WESTERN_COUNTRIES.has(country);
}
