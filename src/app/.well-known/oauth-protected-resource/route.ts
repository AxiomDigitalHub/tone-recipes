/**
 * /.well-known/oauth-protected-resource — RFC 9728 Protected Resource
 * Metadata for agent auth discovery.
 *
 * Honesty rule: F&K does not run an authorization server; Supabase does.
 * This document says exactly that — our /api routes accept bearer tokens
 * issued by the Supabase project, whose issuer serves its own OIDC
 * discovery (+ JWKS). Agents chain: 401 WWW-Authenticate → this doc →
 * Supabase's /.well-known/openid-configuration.
 */

import { SITE_URL } from "@/lib/constants";
import { authIssuer } from "@/lib/oauth-discovery";

export function GET() {
  const issuer = authIssuer();
  if (!issuer) return new Response(null, { status: 404 });

  const metadata = {
    resource: SITE_URL,
    authorization_servers: [issuer],
    // Genuinely empty: access is governed by account plan/role, not token
    // scopes. Present (vs. omitted) because auth.md validators require it.
    scopes_supported: [],
    bearer_methods_supported: ["header"],
    resource_name: "Fader & Knob",
    resource_documentation: `${SITE_URL}/auth.md`,
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
