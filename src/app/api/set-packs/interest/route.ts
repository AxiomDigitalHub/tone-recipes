import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_PACKS = new Set([
  "classic-rock",
  "90s-alternative",
  "blues",
  // Add new coming-soon packs here as they're announced.
]);

export async function POST(request: Request) {
  const { limited } = rateLimit(`set-pack-interest:${getClientIp(request)}`, 5, 60_000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const email: string | undefined = body?.email;
    const packSlug: string | undefined = body?.pack_slug;
    const source: string | undefined = body?.source;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (!packSlug || !ALLOWED_PACKS.has(packSlug)) {
      return NextResponse.json(
        { error: "Unknown set pack." },
        { status: 400 },
      );
    }

    const supabase = getClient();

    const { error } = await supabase
      .from("set_pack_interest")
      .insert({
        email: email.toLowerCase(),
        pack_slug: packSlug,
        source: source ?? "set_packs_page",
      } as any);

    if (error) {
      // Unique (email, pack_slug) — already on the list. Idempotent success.
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }
      console.error("Set pack interest insert error:", error);
      return NextResponse.json(
        { error: "Unable to save. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Set pack interest route error:", err);
    return NextResponse.json(
      { error: "Unable to save. Please try again later." },
      { status: 500 },
    );
  }
}
