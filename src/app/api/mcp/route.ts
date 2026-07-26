import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/constants";
import {
  retrieveRecipes,
  serializeRecipe,
  buildCatalog,
  getRecipeBySlug,
} from "@/lib/tone-chat/retrieval";
import type { Platform } from "@/types/recipe";

/**
 * POST /api/mcp — Model Context Protocol server over the recipe corpus.
 *
 * Stateless Streamable HTTP transport, hand-rolled like the OAuth
 * discovery surface (no MCP SDK: its zod@3 peer dep conflicts with our
 * zod@4, and a read-only tools server needs ~none of the SDK). Every
 * POST gets a plain application/json JSON-RPC response; no sessions,
 * no SSE, no server-initiated messages.
 *
 * Tools are read-only lookups over the static in-bundle corpus — no LLM
 * calls, no Supabase, no auth. The same honesty rule as Axl applies:
 * verified platform translations are quoted exactly; everything else
 * points at the recipe page instead of guessing.
 *
 * Advertised via /.well-known/agents.json and the _mcp._agents /
 * _index._agents SVCB records (DNS-AID; see AI_SEARCH_PLAYBOOK §9).
 */

const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const SERVER_INFO = {
  name: "fader-and-knob",
  title: "Fader & Knob Tone Recipes",
  version: "1.0.0",
};
const INSTRUCTIONS =
  "Look up guitar tone recipes: song-accurate signal chains with verified " +
  "settings for Line 6 Helix, Quad Cortex, TONEX, Fractal, Kemper, Boss " +
  "Katana, and real pedalboards. Use search_recipes to find recipes for a " +
  "song, artist, or sound; get_recipe for full settings (pass the user's " +
  "modeler as `platform` to get its verified translation); list_recipes to " +
  "browse everything. Platform translations are verified — quote them " +
  "exactly. If a recipe lacks the user's platform, link the recipe page " +
  "rather than guessing block names.";

const PLATFORMS: Platform[] = [
  "pedalboard",
  "helix",
  "quad_cortex",
  "tonex",
  "fractal",
  "kemper",
  "katana",
];

const TOOLS = [
  {
    name: "search_recipes",
    title: "Search tone recipes",
    description:
      "Search the Fader & Knob recipe corpus by song, artist, gear, genre, " +
      "or tone description. Returns matching recipes with their slugs; call " +
      "get_recipe with a slug for full settings.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "What to find — song title, artist, gear, genre, or a tone description (e.g. 'ambient worship lead').",
        },
        platform: {
          type: "string",
          enum: PLATFORMS,
          description:
            "Optional: only return recipes with a verified translation for this modeler.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 10,
          description: "Max results (default 5).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_recipe",
    title: "Get full recipe",
    description:
      "Fetch one recipe by slug: description, original rig, full signal " +
      "chain with settings, and the verified translation for the requested " +
      "platform when available.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Recipe slug from search_recipes or list_recipes.",
        },
        platform: {
          type: "string",
          enum: PLATFORMS,
          description:
            "Optional: include the verified settings translation for this modeler.",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_recipes",
    title: "List all recipes",
    description:
      "The full recipe catalog, one line per recipe: artist, song, title, " +
      "slug, and which platform translations exist.",
    inputSchema: { type: "object", properties: {} },
  },
];

function isPlatform(v: unknown): v is Platform {
  return typeof v === "string" && (PLATFORMS as string[]).includes(v);
}

function textResult(text: string, isError = false) {
  return { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) };
}

function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "search_recipes": {
      const query = typeof args.query === "string" ? args.query : "";
      if (!query.trim()) return textResult("`query` is required.", true);
      const limit =
        typeof args.limit === "number" ? Math.min(Math.max(1, args.limit), 10) : 5;
      const platform = isPlatform(args.platform) ? args.platform : null;
      let results = retrieveRecipes(query, 20);
      if (platform) {
        results = results.filter((r) => r.recipe.platform_translations[platform]);
      }
      results = results.slice(0, limit);
      if (results.length === 0) {
        return textResult(
          `No recipes matched "${query}"${platform ? ` with a ${platform} translation` : ""}. Try broader terms, or list_recipes for the full catalog.`,
        );
      }
      const lines = results.map((r) => {
        const platforms = Object.keys(r.recipe.platform_translations).join(", ");
        return `- ${r.artistName} — ${r.songTitle}: ${r.recipe.title}\n  slug: ${r.recipe.slug} | platforms: ${platforms} | ${SITE_URL}/recipe/${r.recipe.slug}`;
      });
      return textResult(lines.join("\n"));
    }
    case "get_recipe": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      const found = getRecipeBySlug(slug);
      if (!found) {
        return textResult(
          `No recipe with slug "${slug}". Use search_recipes or list_recipes to find valid slugs.`,
          true,
        );
      }
      const platform = isPlatform(args.platform) ? [args.platform] : [];
      const body = serializeRecipe(found, platform);
      return textResult(`${body}\nFull page: ${SITE_URL}/recipe/${found.recipe.slug}`);
    }
    case "list_recipes":
      return textResult(buildCatalog());
    default:
      return null;
  }
}

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: number | string | null;
  method?: string;
  params?: Record<string, unknown>;
}

function handleMessage(msg: JsonRpcRequest): Record<string, unknown> | null {
  const { id, method, params = {} } = msg;
  // Notifications (no id) get no response body.
  if (id === undefined || id === null) return null;

  const respond = (result: unknown) => ({ jsonrpc: "2.0", id, result });
  const fail = (code: number, message: string) => ({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  });

  switch (method) {
    case "initialize": {
      const requested = (params as { protocolVersion?: string }).protocolVersion;
      const protocolVersion =
        requested && PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : PROTOCOL_VERSIONS[0];
      return respond({
        protocolVersion,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return respond({});
    case "tools/list":
      return respond({ tools: TOOLS });
    case "tools/call": {
      const name = (params as { name?: string }).name ?? "";
      const args =
        ((params as { arguments?: Record<string, unknown> }).arguments as
          | Record<string, unknown>
          | undefined) ?? {};
      const result = callTool(name, args);
      if (result === null) return fail(-32602, `Unknown tool: ${name}`);
      return respond(result);
    }
    default:
      return fail(-32601, `Method not found: ${method}`);
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Protocol-Version, Mcp-Session-Id",
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = rateLimit(`mcp:${ip}`, 120, 60_000);
  if (limited) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32000, message: "Rate limited" } },
      { status: 429, headers: CORS_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // Batches were allowed pre-2025-06-18; support them for older clients.
  if (Array.isArray(body)) {
    const responses = body
      .map((m) => handleMessage(m as JsonRpcRequest))
      .filter((r): r is Record<string, unknown> => r !== null);
    if (responses.length === 0) {
      return new NextResponse(null, { status: 202, headers: CORS_HEADERS });
    }
    return NextResponse.json(responses, { headers: CORS_HEADERS });
  }

  const response = handleMessage(body as JsonRpcRequest);
  if (response === null) {
    return new NextResponse(null, { status: 202, headers: CORS_HEADERS });
  }
  return NextResponse.json(response, { headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Stateless transport: no server-initiated streams, no sessions to delete.
export function GET() {
  return NextResponse.json(
    { error: "Method not allowed. POST JSON-RPC messages to this endpoint." },
    { status: 405, headers: { ...CORS_HEADERS, Allow: "POST, OPTIONS" } },
  );
}
