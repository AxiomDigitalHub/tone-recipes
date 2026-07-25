/**
 * /.well-known/oauth-authorization-server — RFC 8414-style metadata,
 * served here (not 307'd to the issuer) for two reasons:
 *
 * 1. Supabase's own OIDC discovery doc advertises `/oauth/authorize` and
 *    `/oauth/token`, but that OAuth-server feature is DISABLED for this
 *    project (both return `feature_disabled` — verified 2026-07-25).
 *    Redirecting agents there hands them metadata full of dead endpoints.
 *    The endpoints below are the ones that actually work: GoTrue's native
 *    /token (password + refresh_token grants), /signup, and JWKS.
 * 2. The auth.md convention wants an `agent_auth` block in this document
 *    (registration discovery for agents), which a redirect can't carry.
 *
 * `issuer` remains the Supabase project — we are not pretending to be
 * the issuer, just publishing accurate metadata about it at the path
 * agents probe on the resource origin. authorization_endpoint is
 * deliberately omitted: no redirect-based grant works today, and
 * advertising one would be fiction. Full flow docs: /auth.md.
 */

import { SITE_URL } from "@/lib/constants";
import { authIssuer } from "@/lib/oauth-discovery";
import { agentAuth } from "@/lib/agent-auth";

export function GET() {
  const issuer = authIssuer();
  if (!issuer) return new Response(null, { status: 404 });

  const metadata = {
    issuer,
    token_endpoint: `${issuer}/token`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    grant_types_supported: ["password", "refresh_token"],
    response_types_supported: [],
    scopes_supported: [],
    service_documentation: `${SITE_URL}/auth.md`,
    agent_auth: agentAuth(issuer),
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
