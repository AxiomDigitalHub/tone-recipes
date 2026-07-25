/**
 * auth.md agent-auth surface — shared constants for:
 *   /auth.md
 *   /.well-known/oauth-authorization-server
 * (companion to src/lib/oauth-discovery.ts, which owns the RFC 9728
 * resource-metadata side).
 *
 * Honesty rule (AI_SEARCH_PLAYBOOK §9): every URL advertised here is a
 * real, live endpoint, verified end-to-end in production on 2026-07-25 —
 * signup returned a session, the password grant returned a JWT, and that
 * JWT got a 200 from POST /api/tone-chat (bad tokens get 401). Nothing
 * fictional — no dynamic client registration, no ID-JAG, no scopes — is
 * advertised.
 */
import { SITE_URL } from "@/lib/constants";

/**
 * Supabase publishable (anon) key. Required as an `apikey` header on all
 * GoTrue calls. Public by design — the web app ships it in its JS bundle —
 * so printing it in /auth.md exposes nothing new.
 */
export const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_6qYeIQ-aTz0VBooam4rStw_A6uk6a7J";

/**
 * The auth.md `agent_auth` block, embedded in both /auth.md and the
 * authorization-server metadata so the two can never drift apart.
 * `issuer` is authIssuer() from oauth-discovery.ts.
 */
export function agentAuth(issuer: string) {
  return {
    skill: `${SITE_URL}/auth.md`,
    register_uri: `${issuer}/signup`,
    registration_methods_supported: ["email_password"],
    identity_types_supported: ["email"],
    email: {
      credential_types_supported: ["jwt_access_token", "refresh_token"],
      token_uri: `${issuer}/token?grant_type=password`,
      claim_uri: `${SITE_URL}/login`,
      revocation_uri: `${issuer}/logout`,
    },
    claim_uri: `${SITE_URL}/login`,
    revocation_uri: `${issuer}/logout`,
    documentation: `${SITE_URL}/auth.md`,
  };
}
