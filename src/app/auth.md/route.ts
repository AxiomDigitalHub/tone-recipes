import { SITE_URL } from "@/lib/constants";
import { authIssuer } from "@/lib/oauth-discovery";
import { PUBLISHABLE_KEY, agentAuth } from "@/lib/agent-auth";

/**
 * /auth.md — agent registration & authentication instructions
 * (https://workos.com/auth-md discovery convention).
 *
 * Documents only the flow that actually exists: email+password signup
 * against our Supabase GoTrue instance, JWT bearer access to
 * /api/tone-chat, logout for revocation. Everything below was verified
 * live in production on 2026-07-25. Companion metadata:
 * /.well-known/oauth-protected-resource (RFC 9728) and
 * /.well-known/oauth-authorization-server.
 */

export function GET() {
  const issuer = authIssuer();
  if (!issuer) return new Response(null, { status: 404 });

  const content = `# auth.md

> How agents register and authenticate on Fader & Knob — ${SITE_URL}

Fader & Knob is a guitar tone reference site. Nearly all of it — tone
recipes, gear pages, guides, the blog — is public and needs **no
authentication**. Start at [llms.txt](${SITE_URL}/llms.txt) for a content
map. You only need an account for the authenticated API below.

## Identity & credential model

- **Identity:** an email + password account. Accounts are created against
  our Supabase auth server (\`${issuer}\`), which is the token issuer.
  Signup returns a session immediately — there is no email-confirmation
  step.
- **Credentials:** a short-lived JWT access token (ES256, issuer
  \`${issuer}\`, expires in ~3600s) plus a rotating refresh token. Verify
  tokens against the JWKS at \`${issuer}/.well-known/jwks.json\`.
- **No OAuth scopes.** Capability is determined by the account's plan
  (free vs. paid), not by token scopes.
- Google sign-in exists in the web UI only; it is interactive and not for
  agents.
- All requests to the auth server require the public API key header:
  \`apikey: ${PUBLISHABLE_KEY}\`
  (the same publishable key the web app ships in its JS bundle).

## Register a user

Register **only on behalf of a real human user, with their real email**,
and give them the password — the account is theirs, not yours. One account
per human; do not create throwaway accounts.

\`\`\`bash
curl -X POST "${issuer}/signup" \\
  -H "apikey: ${PUBLISHABLE_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"<strong generated password>"}'
\`\`\`

The response includes \`access_token\`, \`refresh_token\`, and the user
object. The session is usable immediately.

Prefer a human-driven signup? Send your user to
[${SITE_URL}/signup](${SITE_URL}/signup) (email) or
[${SITE_URL}/login](${SITE_URL}/login) (Google) instead.

## Get and refresh tokens

\`\`\`bash
# Sign in (password grant)
curl -X POST "${issuer}/token?grant_type=password" \\
  -H "apikey: ${PUBLISHABLE_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"..."}'

# Refresh
curl -X POST "${issuer}/token?grant_type=refresh_token" \\
  -H "apikey: ${PUBLISHABLE_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"refresh_token":"..."}'
\`\`\`

## Authenticated API

**POST ${SITE_URL}/api/tone-chat** — the AI tone assistant, grounded in
the recipe corpus. Requires \`Authorization: Bearer <access_token>\`.
Unauthenticated calls get a 401 with a \`WWW-Authenticate\` header
pointing at our protected-resource metadata (RFC 9728 §5.1).

\`\`\`bash
curl -X POST "${SITE_URL}/api/tone-chat" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"How do I get the Texas Flood lead tone on Helix?"}]}'
\`\`\`

- Body: \`{ messages: {role: "user"|"assistant", content: string}[], platform?: string }\`
  where platform is one of \`pedalboard | helix | quad_cortex | tonex | fractal | kemper | katana\`.
- Response: streamed plain text. Remaining daily messages are reported in
  the \`x-tone-chat-remaining\` response header.
- Caps: free accounts 10 messages/day; paid plans 200/day. Respect the cap
  — don't burn a human's daily allowance on retries.

## Human-in-the-loop only

- **Payments:** paid plans and set packs go through Stripe checkout at
  [${SITE_URL}/pricing](${SITE_URL}/pricing). Hand off to your user —
  agents must never enter payment details or complete a purchase.
- **Tone requests** (paid feature) are submitted via the web UI at
  [${SITE_URL}/request](${SITE_URL}/request).

## Revocation

- \`POST ${issuer}/logout\` with the \`apikey\` header and
  \`Authorization: Bearer <access_token>\` revokes the session and its
  refresh token.
- Users can take back control at any time by resetting their password from
  [${SITE_URL}/login](${SITE_URL}/login), which invalidates existing
  sessions.

## OAuth discovery metadata

- Protected resource (RFC 9728): [${SITE_URL}/.well-known/oauth-protected-resource](${SITE_URL}/.well-known/oauth-protected-resource)
- Authorization server: [${SITE_URL}/.well-known/oauth-authorization-server](${SITE_URL}/.well-known/oauth-authorization-server)
- Issuer's own OIDC discovery: [${issuer}/.well-known/openid-configuration](${issuer}/.well-known/openid-configuration)
  — note: it advertises \`/oauth/authorize\` and \`/oauth/token\`
  endpoints that are currently disabled for this project; use the
  endpoints in this document instead.

What we do **not** support (yet): dynamic client registration, ID-JAG
identity assertions, OAuth scopes, anonymous accounts. This file only
documents what actually works.

## agent_auth

\`\`\`json
${JSON.stringify(agentAuth(issuer), null, 2)}
\`\`\`
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
