/**
 * /.well-known/openid-configuration — redirect to the real issuer.
 *
 * F&K is not an OIDC provider, so serving a discovery document here with
 * a faderandknob.com issuer would be a lie (and fail issuer validation).
 * Auth for this site's APIs is the Supabase project, which publishes its
 * own discovery document — agents probing the conventional path get
 * redirected there. Canonical discovery entry point for the resource
 * side is /.well-known/oauth-protected-resource (RFC 9728).
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
