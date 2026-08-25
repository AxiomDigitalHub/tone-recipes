import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).limited).toBe(false);
    }
    expect(rateLimit(key, 3, 60_000).limited).toBe(true);
  });

  it("reports remaining correctly", () => {
    const key = `t-${Math.random()}`;
    expect(rateLimit(key, 5, 60_000).remaining).toBe(4);
    expect(rateLimit(key, 5, 60_000).remaining).toBe(3);
  });

  it("keys are independent buckets", () => {
    const a = `t-${Math.random()}`;
    const b = `t-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).limited).toBe(true);
    expect(rateLimit(b, 1, 60_000).limited).toBe(false);
  });
});

describe("getClientIp trust order", () => {
  const req = (headers: Record<string, string>) =>
    new Request("http://x/", { headers });

  it("cf-connecting-ip wins over x-forwarded-for", () => {
    // Cloudflare sets cf-connecting-ip itself; x-forwarded-for is
    // client-appendable, so trusting its first entry would hand abusers a
    // fresh rate-limit bucket per request.
    expect(
      getClientIp(
        req({ "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "6.6.6.6" }),
      ),
    ).toBe("1.2.3.4");
  });

  it("falls back to x-forwarded-for first entry (local dev)", () => {
    expect(getClientIp(req({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe(
      "9.9.9.9",
    );
  });

  it("returns 'unknown' with no headers", () => {
    expect(getClientIp(req({}))).toBe("unknown");
  });
});
