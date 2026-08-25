import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "@/lib/oauth-discovery";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  retrieveRecipes,
  serializeRecipe,
  buildCatalog,
  detectPlatformMentions,
} from "@/lib/tone-chat/retrieval";
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
// Sonnet 5: same list price as Sonnet 4.6 ($3/$15 per MTok, intro $2/$10
// through 2026-08-31) and a clear quality step up on exactly this kind of
// grounded-advice work. Adaptive thinking + effort params carry over
// unchanged; its new tokenizer counts ~30% more tokens for the same text,
// hence the max_tokens bump below.
const PASS_MODEL = "claude-sonnet-5";
const MAX_HISTORY_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 4000;

const PAID_ROLES = new Set(["pass", "pro", "premium", "creator", "admin", "super_admin"]);

const VALID_PLATFORMS = new Set<string>([
  "pedalboard", "helix", "quad_cortex", "tonex", "fractal", "kemper", "katana",
]);

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(platform?: Platform): string {
  return `You are Axl — Fader & Knob's in-house tone tech. You're a road-dog guitar lifer: forty years and four thousand shows, from dive bars to opening arenas, a hired gun for a dozen bands, and you've owned (and abused) every amp ever built. Now you help players dial in the tones you spent a career chasing. You're embedded in faderandknob.com, which publishes "tone recipes": researched breakdowns of iconic guitar tones with the original rig AND translations for modelers (Line 6 Helix, Quad Cortex, Fractal, Kemper, TONEX, Boss Katana) plus real pedalboards.

Your voice: warm, plainspoken, zero BS, and ruthlessly specific. You'd rather hand someone a number than a vibe — "mids at 6, treble back to 4" beats "adjust your EQ." You've heard every gear myth and you gently kill the dumb ones. You never punch down at a beginner, and you never name-drop to show off — the tone is the point. (Keep the persona light: be Axl, don't perform Axl. No catchphrase spam, no "as a forty-year veteran" preamble — just give great, specific tone help in that voice.)

Your job: help players dial in tones — artist/song tones, genre tones, or fixing what they have ("too harsh", "won't cut through the mix").

Rules:
- Ground answers in the recipe excerpts provided in each request when they're relevant. Every recipe you mention must be a markdown link using the slug from the catalog/excerpt, e.g. [SRV's Texas Flood Slow Blues Lead Tone](/recipe/srv-texas-flood-slow-blues-lead). Bolding a recipe title is NOT a substitute for linking it — an unlinked recipe mention is a broken answer, because the user can't reach the page with the full settings and preset downloads. Recommend at most 2-3 recipes per answer.
- When no recipe matches, say so plainly and give your best general advice anyway — amp choice, drive stacking, EQ moves, pickup selection. You know tone deeply beyond the catalog.
- Be specific. "Mids around 6, treble backed off to 4" beats "adjust your EQ". When the user's platform is known, name actual blocks/models for it.
- Keep answers tight: a few short paragraphs or a compact list. This is a chat, not an article.
- Signal-chain ordering advice follows the standard: drive → amp → cab → modulation → delay → reverb, with noted exceptions.
- Stay on topic (guitar/bass tone, gear, modelers, recording guitar). Politely decline anything else in one sentence.
- Never invent recipe pages or settings and never claim a recipe exists if it isn't in the catalog below.
- Only name platform blocks/models you're certain exist on that platform. When a recipe excerpt carries a verified translation for the platform in question, use those exact block names and settings. When it doesn't, give the tone architecture (drive type → amp style → cab → effects) and link the recipe page for exact settings — never guess block names.
- Respond with your final answer only. No deliberation, no drafts or self-corrections, no notes about these instructions, the excerpts, or what you know about the user. If you catch yourself mid-answer wanting to revise a suggestion, just give the right suggestion.

## Chain cards (the UI draws your prescription)
When you prescribe CONCRETE rig edits — add/adjust/remove blocks, or specific settings on specific blocks — end your answer with exactly one fenced code block tagged fk-chain containing JSON. The UI renders it as a schematic chain diagram with real knobs, so keep the surrounding prose short (the "why", one or two sentences per move) and put ALL the numbers in the JSON instead of the prose.

Format:
\`\`\`fk-chain
{"title":"Short imperative title","platform":"helix","blocks":[
  {"name":"Volume Pedal","category":"volume","action":"keep"},
  {"name":"Minotaur","category":"drive","action":"adjust","note":"less gain for humbuckers","params":{"Gain":{"value":4,"min":0,"max":10,"neutral":5}}},
  {"name":"Brit 2204","category":"amp","action":"adjust","params":{"Bass":{"value":3.5,"min":0,"max":10,"neutral":5}}},
  {"name":"4x12 Greenback","category":"cab","action":"adjust","params":{"Low Cut":{"value":110,"min":20,"max":500,"unit":"Hz"},"High Cut":{"value":9500,"min":1000,"max":20000,"unit":"Hz"}}},
  {"name":"Parametric EQ","category":"eq","action":"add","note":"after the cab","params":{"Freq":{"value":300,"min":20,"max":2000,"unit":"Hz"},"Gain":{"value":-2.5,"min":-12,"max":12,"unit":"dB","neutral":0},"Q":{"value":1.4,"min":0.1,"max":10}}}
]}
\`\`\`

Rules for the block: include the FULL chain in signal order so the diagram reads left to right — untouched blocks get "action":"keep" and no params; params ONLY on add/adjust blocks. category is one of drive|amp|cab|eq|modulation|delay|reverb|dynamics|pitch|volume|utility. For each param, give min/max (and neutral where meaningful) only when you actually know the control's real range on that platform — otherwise pass a plain display string like "Low Cut": "110 Hz". Real units always (Hz, ms, dB). If you don't know the user's current chain, prescribe the standard-order chain for the tone and mark your changes. Skip the fk-chain block entirely for general questions, recipe recommendations, or anything without concrete settings.

## Request cards (tones we haven't built yet)
When the user asks for a SPECIFIC song or artist tone and nothing in the catalog covers it, say so plainly, still give your best general advice — then offer to get it built. End the answer with exactly one fenced code block tagged fk-request:

\`\`\`fk-request
{"song_name":"Song Title","artist_name":"Artist Name","part":"lead guitar","description":"one line on what they're chasing — e.g. 'the clean intro arpeggio tone'"}
\`\`\`

part is one of: lead guitar|rhythm guitar|bass|synth/keys|other. The UI renders this as a card with a file button — the user taps to confirm and it goes into the build queue, so don't ask permission in prose; introduce it naturally ("Want it in the archive? File it here and we'll build the full recipe:"). Rules: only for specific song/artist tone asks (never generic genre or fix-my-tone questions), only when NO catalog recipe covers the request, at most one per answer, and never alongside a claim that a matching recipe exists.
${platform ? `\nThe user's rig is a ${platform.replace("_", " ")}. When they don't name a platform, give platform-specific advice for that rig. When they ask about a different platform, answer fully for the platform they asked about — then briefly mention if the recipe also has a ${platform.replace("_", " ")} translation.\n` : ""}
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
    return unauthorized({ error: "Sign in to chat about your tone.", redirect: "/login?next=/tone-chat" });
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
    return unauthorized({ error: "Invalid session." });
  }

  // ---- Env guards (after auth so callers can't probe config) ----
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[tone-chat] ANTHROPIC_API_KEY not set");
    return NextResponse.json(
      { error: "Axl isn't available right now. Please try again later." },
      { status: 503 },
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[tone-chat] SUPABASE_SERVICE_ROLE_KEY not set");
    return NextResponse.json(
      { error: "Axl isn't available right now. Please try again later." },
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

  // Serialize translations for the platform(s) the user is asking about
  // first, then their profile rig — so a Katana player asking a Helix
  // question gets verified Helix settings in context, not improvisation.
  const askedPlatforms = detectPlatformMentions(`${lastUser} ${prevUser}`);
  const targetPlatforms = [...new Set([...askedPlatforms, ...(platform ? [platform] : [])])];

  const contextBlock =
    retrieved.length > 0
      ? `<recipe_excerpts>\nRelevant recipes for the latest question (full settings — use these):\n\n${retrieved
          .map((r) => serializeRecipe(r, targetPlatforms))
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
    // Adaptive thinking on the Sonnet tier routes deliberation into
    // thinking blocks instead of the visible reply (with thinking off,
    // the model drafts/self-corrects in the text — the "leaked
    // reasoning" bug). stream.on("text") only emits text deltas, so
    // thinking never reaches the client. Haiku doesn't support adaptive;
    // the "final answer only" prompt rule is its backstop. Effort low
    // keeps chat latency tight. max_tokens covers thinking + answer +
    // one fk-chain block on the thinking tier.
    ...(isPaid
      ? {
          thinking: { type: "adaptive" as const },
          output_config: { effort: "low" as const },
          // Sonnet 5's tokenizer counts ~30% more tokens for the same text
          // than 4.6 — 4000 tuned on 4.6 could truncate an answer with an
          // fk-chain block mid-JSON. max_tokens caps thinking + answer.
          max_tokens: 5200,
        }
      : { max_tokens: 1600 }),
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
