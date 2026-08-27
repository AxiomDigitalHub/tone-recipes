import { describe, it, expect } from "vitest";
import { WESTERN_COUNTRIES, isBlockedGeo } from "@/lib/geo";

describe("geo allowlist", () => {
  it("allows core Western markets", () => {
    for (const c of ["US", "CA", "GB", "IE", "AU", "NZ", "DE", "FR", "NL", "SE", "PR"]) {
      expect(isBlockedGeo(c), `${c} should be allowed`).toBe(false);
    }
  });

  it("blocks non-Western countries (incl. the old blocklist)", () => {
    // Old blocklist must remain blocked under the allowlist — nothing
    // previously blocked may become reachable.
    for (const c of ["IR", "KP", "SY", "CU", "CN", "RU", "BY"]) {
      expect(isBlockedGeo(c), `${c} must stay blocked`).toBe(true);
    }
    for (const c of ["PH", "IN", "BR", "JP", "KR", "SG", "ZA", "MX"]) {
      expect(isBlockedGeo(c), `${c} should be blocked`).toBe(true);
    }
  });

  it("fails open on missing or undetermined country", () => {
    expect(isBlockedGeo("")).toBe(false); // no cf-ipcountry header (local dev)
    expect(isBlockedGeo("XX")).toBe(false); // Cloudflare couldn't determine
  });

  it("blocks Tor (T1 is a definite code outside the list)", () => {
    expect(isBlockedGeo("T1")).toBe(true);
  });

  it("list contains only ISO-alpha-2-shaped codes", () => {
    for (const c of WESTERN_COUNTRIES) {
      expect(c).toMatch(/^[A-Z]{2}$/);
    }
  });
});
