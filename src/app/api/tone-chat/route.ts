import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { retrieveRecipes, serializeRecipe, buildCatalog } from "@/lib/tone-chat/retrieval";
import type { Platform } from "@/types/recipe";

/**
 * POST /api/tone-chat
 *
 * Streaming AI tone assistant grounded in the recipe corpus.
 *
 * Body: {
 *   messages: { role: "user" | "assistant"; content: string }[],
 *   platform?: Platform   // user's modeler, biases retrieval + answers
 * }
 *
 * Gating:
 *   - Requires authentication (Bearer token) — no anonymous chat, ever.
 *     The endpoint would be scraped to death and the signup requirement
 *     doubles as lead capture.
 *   - Daily message caps per role, counted in tone_chat_usage via the
 *     atomic increment_tone_chat_usage() RPC (service role).
 *   - Free accounts get Haiku; Pass+ gets Sonnet ("smarter tone advice"
 *     is part of what the subscription buys).
 *
 * Response: streamed plain text (the assistant turn). Remaining daily
 * messages are reported in the `x-tone-chat-remaining` header.
 */

const FREE_DAILY_CAP = 10;
const PASS_DAILY_CAP = 200;
const FREE_MODEL = "claude-haiku-4-5";
const PASS_MODEL = "claude-sonnet-4-6";
const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4000;

const PAID_ROLES = new Set(["pass", "premium", "creator", "admin", "super_admin"]);

const VALID_PLATFORMS = new Set<string>([
  "pedalboard", "helix", "quad_cortex", "tonex", "fractal", "kemper", "katana",
]);

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(platform?: Platform): string {
  return `You are the Fader & Knob tone assistant — a friendly, deeply knowledgeable guitar-tone nerd embedded in faderandknob.com. Fader & Knob publishes "tone recipes": researched breakdowns of iconic guitar tones with the original rig AND translations for modelers (Line 6 Helix, Quad Cortex, Fractal, Kemper, TONEX, Boss Katana) plus real pedalboards.

Your job: help players dial in tones — artist/song tones, genre tones, or fixing what they have ("too harsh", "won't cut through the mix").

Rules:
- Ground answers in the recipe excerpts provided in each request when they're relevant. Link recipes as markdown: [Recipe title](/recipe/slug). Recommend at most 2-3 recipes per answer.
- When no recipe matches, say so plainly and give your best general advice anyway — amp choice, drive stacking, EQ moves, pickup selection. You know tone deeply beyond the catalog.
- Be specific. "Mids around 6, treble backed off to 4" beats "adjust your EQ". When the user's platform is known, name actual blocks/models for it.
- Keep answers tight: a few short paragraphs or a compact list. This is a chat, not an article.
- Signal-chain ordering advice follows the standard: drive → amp → cab → modulation → delay → reverb, with noted exceptions.
- Stay on topic (guitar/bass tone, gear, modelers, recording guitar). Politely decline anything else in one sentence.
- Never invent recipe pages or settings and never claim a recipe exists if it isn't in the catalog below.
${platform ? `\nThe user plays a ${platform.replace("_", " ")} — bias platform-specific advice toward it.\n` : ""}
## Recipe catalog (every recipe on the site)
${buildCatalog()}`;
}

export async function POST(req: NextRequest) {
  // Cheap pre-auth abuse valve, mirrors /api/checkout.
  const { limited } = rateLimit(`tone-chat:${getClientIp(req)}`, 20, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests. Take a breath." }, { status: 429 });
  }

  let body: { messages?: ChatMessage[]; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ---- Validate input shape before doing any work ----
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages[] is required." }, { status: 400 });
  }
  if (messages.length > MAX_HISTORY_MESSAGES) {
    return NextResponse.json(
      { error: "Conversation too long — start a fresh chat." },
      { status: 400 },
    );
  }
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_MESSAGE_CHARS
    ) {
      return NextResponse.json({ error: "Malformed message in messages[]." }, { status: 400 });
    }
  }
  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from the user." }, { status: 400 });
  }
  const platform =
    body.platform && VALID_PLATFORMS.has(body.platform)
      ? (body.platform as Platform)
      : undefined;

  // ---- Auth ----
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Sign in to chat about your tone.", redirect: "/login?next=/tone-chat" },
      { status: 401 },
    );
  }
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  // ---- Env guards (after auth so callers can't probe config) ----
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[tone-chat] ANTHROPIC_API_KEY not set");
    return NextResponse.json(
      { error: "Tone Chat isn't configured yet. Please try again later." },
      { status: 503 },
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[tone-chat] SUPABASE_SERVICE_ROLE_KEY not set");
    return NextResponse.json(
      { error: "Tone Chat isn't configured yet. Please try again later." },
      { status: 503 },
    );
  }

  // ---- Role + daily cap (service role: read profile, atomic increment) ----
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "free";
  const isPaid = PAID_ROLES.has(role);
  const cap = isPaid ? PASS_DAILY_CAP : FREE_DAILY_CAP;

  const { data: usedToday, error: usageError } = await admin.rpc(
    "increment_tone_chat_usage",
    { p_user_id: user.id },
  );
  if (usageError || typeof usedToday !== "number") {
    console.error("[tone-chat] usage increment failed:", usageError?.message);
    return NextResponse.json(
      { error: "Couldn't check your daily usage. Try again in a minute." },
      { status: 500 },
    );
  }
  if (usedToday > cap) {
    return NextResponse.json(
      {
        error: isPaid
          ? "You've hit today's ceiling. Resets at midnight UTC."
          : `Free accounts get ${FREE_DAILY_CAP} messages a day. Upgrade to the Pass for effectively unlimited tone talk.`,
        upgrade: !isPaid,
        remaining: 0,
      },
      { status: 429 },
    );
  }
  const remaining = Math.max(0, cap - usedToday);

  // ---- Retrieval: ground the answer in real recipes ----
  const userMessages = messages.filter((m) => m.role === "user");
  const lastUser = userMessages[userMessages.length - 1].content;
  const prevUser = userMessages.length > 1 ? userMessages[userMessages.length - 2].content : "";
  // Last message dominates; previous adds context for follow-ups like
  // "what about on the Katana?".
  const retrieved = retrieveRecipes(`${lastUser} ${lastUser} ${prevUser}`, 4);

  const contextBlock =
    retrieved.length > 0
      ? `<recipe_excerpts>\nRelevant recipes for the latest question (full settings — use these):\n\n${retrieved
          .map((r) => serializeRecipe(r, platform))
          .join("\n\n")}\n</recipe_excerpts>\n\n`
      : "";

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m, i) => ({
    role: m.role,
    content:
      i === messages.length - 1 ? `${contextBlock}${m.content}` : m.content,
  }));

  // ---- Stream the answer ----
  const anthropic = new Anthropic();
  const model = isPaid ? PASS_MODEL : FREE_MODEL;

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 1024,
    // The system prompt (incl. ~4.6K-token catalog) is stable per
    // platform choice and exceeds the minimum cacheable prefix, so
    // repeat messages within the 5-min TTL read it at ~0.1x price.
    system: [
      {
        type: "text",
        text: buildSystemPrompt(platform),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream.on("error", (err) => {
        console.error("[tone-chat] stream error:", err);
        controller.enqueue(
          encoder.encode("\n\n_Something glitched mid-answer. Ask again?_"),
        );
        controller.close();
      });
      stream.on("end", () => controller.close());
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "x-tone-chat-remaining": String(remaining),
    },
  });
}
