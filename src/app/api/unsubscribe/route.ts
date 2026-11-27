import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

/**
 * GET  /api/unsubscribe?token=... — link footer click (returns HTML page)
 * POST /api/unsubscribe?token=... — Gmail / Apple Mail one-click unsubscribe
 *   per RFC 8058 (List-Unsubscribe-Post)
 *
 * Both paths are idempotent: re-unsubscribing returns 200, never errors.
 * We use the service role here because the row's `unsubscribed_at` column
 * isn't writable by anon — RLS lets anyone INSERT a subscriber but only
 * service role UPDATE/DELETE.
 */

function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set",
    );
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function handleUnsubscribe(token: string | null): Promise<{
  ok: boolean;
  email?: string;
  status: number;
  message: string;
}> {
  if (!token) {
    return { ok: false, status: 400, message: "Missing token." };
  }
  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return { ok: false, status: 400, message: "Invalid or expired link." };
  }

  let supabase;
  try {
    supabase = getAdminClient();
  } catch (err) {
    console.error("[unsubscribe] admin client init failed:", err);
    return {
      ok: false,
      status: 500,
      message: "Server misconfigured. Please email hello@faderandknob.com.",
    };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() } as never)
    .eq("email", email)
    .is("unsubscribed_at", null);

  if (error) {
    console.error("[unsubscribe] update error:", error);
    return {
      ok: false,
      status: 500,
      message: "Couldn't process unsubscribe. Please email hello@faderandknob.com.",
    };
  }

  return { ok: true, email, status: 200, message: "Unsubscribed." };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const result = await handleUnsubscribe(token);
  // One-click POST per RFC 8058 expects 200 with empty body on success.
  if (result.ok) return new NextResponse(null, { status: 200 });
  return NextResponse.json({ error: result.message }, { status: result.status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const result = await handleUnsubscribe(token);

  const safeEmail = (result.email ?? "").replace(/[<>&"]/g, "");
  const title = result.ok ? "You're unsubscribed" : "Unsubscribe failed";
  const body = result.ok
    ? `<p>No more newsletters will be sent to ${
        safeEmail ? `<strong>${safeEmail}</strong>` : "this address"
      }.</p>
       <p>If this was a mistake, you can re-subscribe at
         <a href="https://faderandknob.com">faderandknob.com</a>.
       </p>`
    : `<p>${result.message}</p>`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} · Fader &amp; Knob</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; background: #ffffff; color: #131416; font-family: Karla, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif; }
    main { max-width: 560px; margin: 0 auto; padding: 80px 24px; }
    .wordmark { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: #131416; margin: 0 0 32px; padding-bottom: 16px; border-bottom: 1px solid #dcdfe2; }
    h1 { font-size: 32px; line-height: 1.15; font-weight: 600; margin: 0 0 16px; letter-spacing: -0.025em; }
    p { font-size: 16px; line-height: 1.6; margin: 12px 0; color: #4a4f55; }
    strong { color: #131416; font-weight: 600; }
    .foot { border-top: 1px solid #dcdfe2; margin-top: 32px; padding-top: 16px; color: #666c73; font-size: 14px; }
    a { color: #131416; text-decoration: underline; text-underline-offset: 3px; }
  </style>
</head>
<body>
  <main>
    <p class="wordmark">Fader &amp; Knob</p>
    <h1>${title}</h1>
    ${body}
    <div class="foot">
      Questions? <a href="mailto:hello@faderandknob.com">hello@faderandknob.com</a>
    </div>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: result.status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
