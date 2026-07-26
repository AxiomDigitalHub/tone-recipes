/**
 * /.well-known/agents.json — agent-facing service index.
 *
 * The discovery target for the _index._agents / _mcp._agents SVCB
 * records (DNS-AID, draft-mozleywilliams-dnsop-dnsaid). Same honesty
 * rule as the api-catalog: only surfaces that actually exist —
 * the anonymous read-only MCP server and the authenticated Axl chat
 * API. No fictional protocols, no aspirational endpoints.
 */

import { SITE_URL } from "@/lib/constants";

export function GET() {
  const index = {
    name: "Fader & Knob",
    description:
      "Guitar tone recipes: song-accurate signal chains with verified settings for Helix, Quad Cortex, TONEX, Fractal, Kemper, Katana, and pedalboards.",
    services: [
      {
        id: "recipes-mcp",
        protocol: "mcp",
        transport: "streamable-http",
        endpoint: `${SITE_URL}/api/mcp`,
        authentication: "none",
        description:
          "Read-only MCP server over the full recipe corpus: search_recipes, get_recipe, list_recipes.",
      },
      {
        id: "axl-tone-chat",
        protocol: "https+json",
        endpoint: `${SITE_URL}/api/tone-chat`,
        authentication: "oauth2-bearer",
        documentation: `${SITE_URL}/auth.md`,
        description:
          "Ask Axl — streaming AI tone assistant grounded in the recipe corpus. Requires a bearer token; agents can self-serve accounts (see documentation).",
      },
    ],
    documentation: `${SITE_URL}/auth.md`,
    api_catalog: `${SITE_URL}/.well-known/api-catalog`,
  };

  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
