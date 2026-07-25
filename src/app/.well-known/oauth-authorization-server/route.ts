/**
 * /.well-known/oauth-authorization-server — redirect to the real issuer.
 *
 * Same honesty rule as ../openid-configuration: F&K is a resource
 * server, not an authorization server. Supabase (the actual issuer)
 * publishes OIDC discovery but not the RFC 8414 alias, so both of our
 * conventional-path probes land on its openid-configuration document,
 * which carries the same fields (authorization_endpoint, token_endpoint,
 * jwks_uri, grant_types_supported).
 */

import { authIssuer } from "@/lib/oauth-discovery";

export function GET() {
  const issuer = authIssuer();
  if (!issuer) return new Response(null, { status: 404 });

  return new Response(null, {
    status: 307,
    headers: {
      Location: `${issuer}/.well-known/openid-configuration`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
