import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless unsubscribe tokens. Format: `<base64url(email)>.<hmac>`.
 * No DB lookup required to validate — we recover the email from the token
 * itself and verify the HMAC. Tokens don't expire (people unsubscribe
 * years after subscribing all the time).
 *
 * Required env var: NEWSLETTER_UNSUBSCRIBE_SECRET (any high-entropy string).
 * Rotating the secret invalidates all outstanding unsubscribe links — only
 * do that if a secret leaks.
 */

const SECRET = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;

function getSecret(): string {
  if (!SECRET) {
    throw new Error(
      "NEWSLETTER_UNSUBSCRIBE_SECRET is not set. Add it to .env.local and the deploy env before sending any newsletter.",
    );
  }
  return SECRET;
}

function b64urlEncode(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf-8") : buf;
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(
    s.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  ).toString("utf-8");
}

function hmac(email: string): string {
  return createHmac("sha256", getSecret()).update(email).digest("base64url");
}

export function signUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${b64urlEncode(normalized)}.${hmac(normalized)}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encEmail, providedHmac] = parts;
  let email: string;
  try {
    email = b64urlDecode(encEmail).trim().toLowerCase();
  } catch {
    return null;
  }
  if (!email.includes("@")) return null;

  const expected = hmac(email);
  // Constant-time compare. Both sides must be the same length for
  // timingSafeEqual; bail early if they aren't.
  const a = Buffer.from(providedHmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? email : null;
}

/**
 * Public URL to one-click unsubscribe for a given email. Used in email
 * footers and the `List-Unsubscribe` header.
 */
export function unsubscribeUrl(email: string, siteUrl?: string): string {
  const base =
    siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://faderandknob.com";
  return `${base.replace(/\/$/, "")}/api/unsubscribe?token=${signUnsubscribeToken(email)}`;
}
