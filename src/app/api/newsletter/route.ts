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

export async function POST(request: Request) {
  // Rate limit: 5 signup attempts per minute per IP
  const { limited } = rateLimit(`newsletter:${getClientIp(request)}`, 5, 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const email: string | undefined = body?.email;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const supabase = getClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.toLowerCase(), source: "website" } as any);

    if (error) {
      // Unique constraint violation — already subscribed
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }
      console.error("Newsletter subscribe error:", error);
      return NextResponse.json(
        { error: "Unable to subscribe. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json(
      { error: "Unable to subscribe. Please try again later." },
      { status: 500 },
    );
  }
}
