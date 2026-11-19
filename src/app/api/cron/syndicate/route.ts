import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import {
  buildExcerptHtml,
  buildFullHtml,
  cleanBodyHtml,
  extractByClass,
  htmlToMarkdown,
  type SyndicationPost,
} from "@/lib/syndication/content";
import { PLATFORMS, isEnabled, type Article, type Platform } from "@/lib/syndication/platforms";

/**
 * GET /api/cron/syndicate
 *
 * Republishes blog posts to outside platforms with attribution back to
 * faderandknob.com. Spec + platform setup: docs/SYNDICATION.md. Fired daily
 * from the droplet by .github/workflows/syndicate-cron.yml (a GH runner
 * can't reach this origin through Cloudflare Bot Fight Mode).
 *
 * Guardrails, all on by default:
 *   - full copies only where the platform sets a canonical to F&K; the rest
 *     get an excerpt (see src/lib/syndication/platforms.ts).
 *   - full copies wait SYNDICATE_DELAY_DAYS (default 7) after our publish
 *     date so Google indexes the original first.
 *   - SYNDICATE_PER_RUN (default 2) posts per platform per run, so a backlog
 *     drips out instead of landing as a burst.
 *   - SYNDICATE_DRAFT defaults to true: remote posts are created as drafts
 *     until someone has eyeballed a few and sets SYNDICATE_DRAFT=false.
 *   - posts older than SYNDICATE_SINCE (ISO date, default 30 days before
 *     the run) are never picked up, so turning this on doesn't dump the
 *     whole archive. Move the date back to backfill deliberately.
 *
 * Query params (all still require CRON_SECRET):
 *   ?dry=1                     plan + render, no platform calls, no DB writes
 *   ?dry=1&platform=x&slug=y   return the exact HTML that would be sent
 *   ?platform=x                run one platform only
 *   ?slug=y                    run one post only (ignores the date window)
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_ATTEMPTS = 3;
const EXCERPT_DELAY_DAYS = 1;
const MIN_BODY_CHARS = 500;
const DAY_MS = 86_400_000;

interface LedgerRow {
  platform: string;
  slug: string;
  status: "pending" | "published" | "failed";
  attempts: number;
  updated_at: string;
}

function intEnv(name: string, fallback: number): number {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function internalOrigin(req: NextRequest): string {
  const port = req.nextUrl.port || process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

function toSyndicationPost(p: BlogPost): SyndicationPost {
  const image = p.image ? `${SITE_URL}${p.image.startsWith("/") ? "" : "/"}${p.image}` : undefined;
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    author: p.author,
    date: p.date,
    tags: p.tags,
    takeaways: p.takeaways,
    imageUrl: image,
    canonicalUrl: `${SITE_URL}/blog/${p.slug}`,
  };
}

export async function GET(req: NextRequest) {
  // ---- Cron auth ----
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Cron not configured." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const dry = params.get("dry") === "1";
  const onlyPlatform = params.get("platform");
  const onlySlug = params.get("slug");

  const draft = (process.env.SYNDICATE_DRAFT ?? "true").trim() !== "false";
  const delayDays = intEnv("SYNDICATE_DELAY_DAYS", 7);
  const perRun = intEnv("SYNDICATE_PER_RUN", 2);
  const now = Date.now();
  const sinceEnv = process.env.SYNDICATE_SINCE?.trim();
  const since = sinceEnv ? Date.parse(sinceEnv) : now - 30 * DAY_MS;
  if (Number.isNaN(since)) {
    return NextResponse.json({ error: `Bad SYNDICATE_SINCE: ${sinceEnv}` }, { status: 500 });
  }

  const platforms = PLATFORMS.filter((p) => !onlyPlatform || p.id === onlyPlatform);
  if (onlyPlatform && platforms.length === 0) {
    return NextResponse.json({ error: `Unknown platform: ${onlyPlatform}` }, { status: 400 });
  }
  const enabled = platforms.filter(isEnabled);
  const disabled = platforms
    .filter((p) => !isEnabled(p))
    .map((p) => ({ platform: p.id, missingEnv: p.requiredEnv.filter((k) => !process.env[k]?.trim()) }));

  // ---- Ledger (optional in dry mode so a preview works before migration 029) ----
  let admin: SupabaseClient | null = null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && supabaseUrl) {
    admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else if (!dry) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let ledger: LedgerRow[] = [];
  if (admin) {
    const { data, error } = await admin
      .from("syndication_ledger")
      .select("platform, slug, status, attempts, updated_at");
    if (error) {
      if (!dry) {
        console.error("[syndicate] ledger read failed:", error.message);
        return NextResponse.json(
          { error: "Ledger read failed. Is migration 029 applied?", detail: error.message },
          { status: 500 },
        );
      }
    } else {
      ledger = (data ?? []) as LedgerRow[];
    }
  }
  const ledgerKey = (platform: string, slug: string) => `${platform}:${slug}`;
  const ledgerMap = new Map(ledger.map((r) => [ledgerKey(r.platform, r.slug), r]));

  const stuck = ledger
    .filter((r) => r.status === "pending" && now - Date.parse(r.updated_at) > 3_600_000)
    .map((r) => ({ platform: r.platform, slug: r.slug, since: r.updated_at }));

  // Oldest first, so a backlog goes out in publish order.
  const allPosts = getAllPosts().slice().reverse();

  // ---- Rendered body, fetched once per slug over loopback ----
  const bodyCache = new Map<string, string>();
  const origin = internalOrigin(req);
  async function renderedBody(slug: string): Promise<string> {
    const cached = bodyCache.get(slug);
    if (cached !== undefined) return cached;
    const res = await fetch(`${origin}/blog/${encodeURIComponent(slug)}`, {
      headers: { accept: "text/html", "user-agent": "fk-syndicator" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`render of /blog/${slug} returned ${res.status}`);
    const body = extractByClass(await res.text(), "post-body");
    if (!body) throw new Error(`no .post-body in /blog/${slug}`);
    bodyCache.set(slug, body);
    return body;
  }

  async function buildArticle(platform: Platform, post: SyndicationPost): Promise<Article> {
    let html: string;
    if (platform.mode === "full") {
      const body = cleanBodyHtml(await renderedBody(post.slug), {
        origin: SITE_URL,
        flattenTables: platform.flattenTables,
      });
      const textLen = body.replace(/<[^>]+>/g, "").trim().length;
      if (textLen < MIN_BODY_CHARS) {
        throw new Error(`cleaned body for ${post.slug} is only ${textLen} chars; refusing to syndicate`);
      }
      html = buildFullHtml(post, body);
    } else {
      html = buildExcerptHtml(post);
    }
    return { post, html, markdown: htmlToMarkdown(html) };
  }

  // ---- Single-article preview ----
  if (dry && onlyPlatform && onlySlug) {
    const p = allPosts.find((x) => x.slug === onlySlug);
    if (!p) return NextResponse.json({ error: `No post ${onlySlug}` }, { status: 404 });
    const article = await buildArticle(platforms[0], toSyndicationPost(p));
    const wantMd = params.get("format") === "md";
    return new NextResponse(wantMd ? article.markdown : article.html, {
      headers: { "content-type": wantMd ? "text/markdown; charset=utf-8" : "text/html; charset=utf-8" },
    });
  }

  const results: Record<string, unknown>[] = [];

  // A dry run plans every platform, so the output can be checked before any
  // tokens exist; real runs only touch platforms whose env is complete.
  for (const platform of dry ? platforms : enabled) {
    const delayMs = (platform.mode === "full" ? delayDays : EXCERPT_DELAY_DAYS) * DAY_MS;
    const candidates = allPosts
      .filter((p) => {
        if (onlySlug) return p.slug === onlySlug;
        const t = Date.parse(p.date);
        return !Number.isNaN(t) && t >= since && t <= now - delayMs;
      })
      .filter((p) => {
        const row = ledgerMap.get(ledgerKey(platform.id, p.slug));
        return !row || (row.status === "failed" && row.attempts < MAX_ATTEMPTS);
      })
      .slice(0, onlySlug ? 1 : perRun);

    for (const p of candidates) {
      const post = toSyndicationPost(p);
      const base = { platform: platform.id, slug: p.slug, mode: platform.mode };
      const existing = ledgerMap.get(ledgerKey(platform.id, p.slug));

      let article: Article;
      try {
        article = await buildArticle(platform, post);
      } catch (e) {
        results.push({ ...base, outcome: "render_failed", error: (e as Error).message });
        continue;
      }

      if (dry) {
        results.push({
          ...base,
          outcome: isEnabled(platform) ? "would_publish" : "would_publish_once_configured",
          draft,
          htmlChars: article.html.length,
        });
        continue;
      }
      const db = admin!;

      // Claim the slot before the remote call (see migration 029).
      const attempts = (existing?.attempts ?? 0) + 1;
      const claim = existing
        ? await db
            .from("syndication_ledger")
            .update({ status: "pending", attempts, error: null, updated_at: new Date().toISOString() })
            .eq("platform", platform.id)
            .eq("slug", p.slug)
            .eq("status", "failed")
            .select("id")
        : await db
            .from("syndication_ledger")
            .insert({ platform: platform.id, slug: p.slug, mode: platform.mode, status: "pending" })
            .select("id");
      if (claim.error || !claim.data?.length) {
        results.push({ ...base, outcome: "claim_skipped", error: claim.error?.message ?? "already claimed" });
        continue;
      }

      try {
        const r = await platform.publish(article, { draft });
        await db
          .from("syndication_ledger")
          .update({
            status: "published",
            remote_id: r.remoteId,
            remote_url: r.remoteUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("platform", platform.id)
          .eq("slug", p.slug);
        results.push({ ...base, outcome: draft ? "drafted" : "published", url: r.remoteUrl });
      } catch (e) {
        const message = (e as Error).message.slice(0, 1000);
        console.error(`[syndicate] ${platform.id}/${p.slug} failed:`, message);
        await db
          .from("syndication_ledger")
          .update({ status: "failed", error: message, updated_at: new Date().toISOString() })
          .eq("platform", platform.id)
          .eq("slug", p.slug);
        results.push({ ...base, outcome: "failed", error: message });
      }
    }
  }

  const failed = results.filter((r) => r.outcome === "failed" || r.outcome === "render_failed").length;
  return NextResponse.json(
    {
      dry,
      draft,
      window: { since: new Date(since).toISOString(), fullDelayDays: delayDays, perRun },
      enabled: enabled.map((p) => ({ platform: p.id, mode: p.mode })),
      disabled,
      results,
      stuckPending: stuck,
    },
    // A run where every attempt failed should page someone via the workflow.
    { status: failed > 0 && failed === results.length ? 502 : 200 },
  );
}
