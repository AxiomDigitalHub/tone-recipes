import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";

/**
 * OAuth discovery plumbing (RFC 9728).
 *
 * faderandknob.com is a *resource server*, not an authorization server:
 * the /api routes accept Supabase-issued bearer tokens, and the issuer
 * is the Supabase project (`${NEXT_PUBLIC_SUPABASE_URL}/auth/v1`), which
 * serves its own OIDC discovery + JWKS. We therefore publish Protected
 * Resource Metadata pointing at Supabase rather than pretending to be
 * an issuer ourselves — same honesty rule as /.well-known/api-catalog.
 */

/** Supabase auth issuer, e.g. https://<ref>.supabase.co/auth/v1. Null if env unset. */
export function authIssuer(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  return base ? `${base}/auth/v1` : null;
}

export const RESOURCE_METADATA_URL = `${SITE_URL}/.well-known/oauth-protected-resource`;

/**
 * 401 with the RFC 9728 §5.1 breadcrumb so agents hitting an /api route
 * unauthenticated can discover where to authenticate. Body shape is
 * whatever the route already sent — this only standardizes the header.
 */
export function unauthorized(body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Bearer resource_metadata="${RESOURCE_METADATA_URL}"`,
    },
  });
}
