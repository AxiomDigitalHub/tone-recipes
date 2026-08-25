import { describe, it, expect } from "vitest";
import {
  signUnsubscribeToken,
  verifyUnsubscribeToken,
} from "@/lib/unsubscribe-token";

// NEWSLETTER_UNSUBSCRIBE_SECRET is injected by vitest.config.ts (the module
// reads it at load time).

describe("unsubscribe token", () => {
  it("round-trips an email", () => {
    const token = signUnsubscribeToken("Person@Example.com");
    expect(verifyUnsubscribeToken(token)).toBe("person@example.com");
  });

  it("rejects a tampered email segment", () => {
    const token = signUnsubscribeToken("a@example.com");
    const [, mac] = token.split(".");
    const forged = `${Buffer.from("b@example.com").toString("base64url")}.${mac}`;
    expect(verifyUnsubscribeToken(forged)).toBeNull();
  });

  it("rejects a tampered HMAC", () => {
    const token = signUnsubscribeToken("a@example.com");
    const [enc] = token.split(".");
    expect(verifyUnsubscribeToken(`${enc}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)).toBeNull();
  });

  it("rejects garbage", () => {
    expect(verifyUnsubscribeToken("not-a-token")).toBeNull();
    expect(verifyUnsubscribeToken("")).toBeNull();
    expect(verifyUnsubscribeToken("a.b.c")).toBeNull();
  });
});
