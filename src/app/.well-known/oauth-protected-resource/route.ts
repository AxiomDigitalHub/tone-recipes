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
    bearer_methods_supported: ["header"],
    resource_name: "Fader & Knob",
    resource_documentation: `${SITE_URL}/llms.txt`,
  };

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
