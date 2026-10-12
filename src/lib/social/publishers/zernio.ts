import type { GeneratedPost, Platform, Publisher, PublishResult } from "../types";

/**
 * Zernio adapter (https://zernio.com) — one implementation of `Publisher`.
 * Provider-agnostic by design: if Zernio doesn't work out, delete this file and
 * write another adapter to the same interface; nothing upstream changes.
 *
 * Env:
 *   ZERNIO_API_KEY    — required (Bearer token; mint one via the CLI device flow
 *                       at https://zernio.com/auth.md)
 *   ZERNIO_PROFILE_ID — optional (scopes the account lookup to one profile)
 *
 * Shapes below are checked against https://zernio.com/openapi.yaml (verified
 * 2026-10-10). Three traps that spec documents and that are easy to get wrong:
 *   1. Accounts come back keyed on `_id`, not `accountId`.
 *   2. `threadItems[0]` must be the FIRST tweet, not the second — when
 *      threadItems is present the top-level `content` is never published.
 *   3. HTTP 207 is a 2xx: `res.ok` is true even when every platform failed.
 *      Branch on the status code and then on `post.status`.
 */

const BASE = "https://zernio.com/api/v1";

/** Zernio's platform slugs. X is "twitter" in the SocialAccount enum. */
const PLATFORM_MAP: Record<Platform, string> = {
  x: "twitter",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
};

const YOUTUBE_TITLE_MAX = 100;

interface ZernioAccount {
  _id?: string;
  /** Tolerated aliases — the spec says `_id`, but don't break on a variant. */
  accountId?: string;
  id?: string;
  platform: string;
  username?: string;
  isActive?: boolean;
  needsReconnection?: boolean;
}

interface ZernioPlatformResult {
  platform?: string;
  status?: string;
  error?: string | null;
  errorMessage?: string;
  platformPostId?: string;
  platformPostUrl?: string;
}

interface ZernioPostResponse {
  message?: string;
  error?: string;
  warnings?: string[];
  platformResults?: ZernioPlatformResult[];
  post?: {
    _id?: string;
    status?: string;
    platforms?: ZernioPlatformResult[];
  };
}

export class ZernioPublisher implements Publisher {
  name = "zernio";
  private apiKey: string;
  private profileId?: string;
  private accountsCache: ZernioAccount[] | null = null;

  constructor(apiKey = process.env.ZERNIO_API_KEY, profileId = process.env.ZERNIO_PROFILE_ID) {
    if (!apiKey) throw new Error("ZERNIO_API_KEY is not set");
    this.apiKey = apiKey;
    this.profileId = profileId;
  }

  private headers(extra: Record<string, string> = {}) {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  private async accounts(): Promise<ZernioAccount[]> {
    if (this.accountsCache) return this.accountsCache;
    const q = this.profileId ? `?profileId=${encodeURIComponent(this.profileId)}` : "";
    const res = await fetch(`${BASE}/accounts${q}`, { headers: this.headers() });
    if (!res.ok) throw new Error(`Zernio GET /accounts ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { accounts?: ZernioAccount[] } | ZernioAccount[];
    this.accountsCache = Array.isArray(data) ? data : data.accounts ?? [];
    return this.accountsCache;
  }

  private async accountIdFor(platform: Platform): Promise<string | null> {
    const want = PLATFORM_MAP[platform];
    const acct = (await this.accounts()).find(
      (a) => a.platform === want && a.isActive !== false && a.needsReconnection !== true,
    );
    // The spec's SocialAccount keys the id as `_id`; the aliases are belt-and-braces.
    return acct?._id ?? acct?.accountId ?? acct?.id ?? null;
  }

  /**
   * Per-platform extras. Each value IS the platform's *PlatformData schema —
   * its fields sit directly on platformSpecificData, not under a nested
   * `<platform>Settings` key (a misplaced field is dropped and reported in the
   * response `warnings`, so it fails silently rather than loudly).
   */
  private platformSpecificData(post: GeneratedPost): Record<string, unknown> {
    const hasMedia = post.media.some((m) => m.url);
    const data: Record<string, unknown> = {};

    if (post.platform === "tiktok") {
      data.privacyLevel = "PUBLIC_TO_EVERYONE";
      data.allowComment = true;
      data.allowDuet = true;
      data.allowStitch = true;
      data.contentPreviewConfirmed = true;
      data.expressConsentGiven = true;
    }

    if (post.platform === "youtube") {
      if (post.title) data.title = post.title.slice(0, YOUTUBE_TITLE_MAX);
      data.visibility = "public";
      data.madeForKids = false;
      // Our clips are model-generated (Replicate/Grok). YouTube's synthetic-media
      // disclosure is the honest setting and matches the site's authorship rules.
      if (hasMedia) data.containsSyntheticMedia = true;
    }

    if (post.platform === "x") {
      // threadItems[0] is the ROOT tweet. The top-level `content` is NOT
      // published once this array is present, so the root must be included.
      if (post.thread?.length) {
        data.threadItems = [post.content, ...post.thread].map((content) => ({
          content,
          mediaItems: [],
        }));
      }
      // X's label covers AI-generated *media*, not AI-written text.
      if (hasMedia) data.madeWithAi = true;
    }

    return data;
  }

  async publish(post: GeneratedPost): Promise<PublishResult> {
    if (post.blockedReason) {
      return { platform: post.platform, ok: false, queued: true, detail: post.blockedReason };
    }
    try {
      const accountId = await this.accountIdFor(post.platform);
      if (!accountId) {
        return {
          platform: post.platform,
          ok: false,
          detail: `No connected ${post.platform} account in Zernio (${PLATFORM_MAP[post.platform]}). Connect it in the Zernio dashboard.`,
        };
      }

      const hashtagLine = post.hashtags.map((t) => `#${t}`).join(" ");
      // X/IG/TikTok: hashtags must live in the caption — Zernio's `hashtags`
      // field is stored for reference only and never appended at publish time.
      // YouTube: keywords go in the top-level `tags` array instead.
      const caption =
        post.platform === "youtube" ? post.content : `${post.content}\n\n${hashtagLine}`.trim();

      const mediaItems = post.media
        .filter((m) => m.url)
        .map((m) => ({ type: m.kind, url: m.url }));

      const extras = this.platformSpecificData(post);

      const body = {
        content: caption,
        publishNow: true, // fully autonomous per the chosen config
        mediaItems,
        ...(post.platform === "youtube" && post.hashtags.length ? { tags: post.hashtags } : {}),
        platforms: [
          {
            platform: PLATFORM_MAP[post.platform],
            accountId,
            ...(Object.keys(extras).length ? { platformSpecificData: extras } : {}),
          },
        ],
      };

      const res = await fetch(`${BASE}/posts`, {
        method: "POST",
        // A UUID per logical post makes a retry after a 5xx/timeout safe: the
        // same key inside 24h returns the original post instead of double-posting.
        headers: this.headers({ "Idempotency-Key": crypto.randomUUID() }),
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let parsed: ZernioPostResponse = {};
      try {
        parsed = JSON.parse(text) as ZernioPostResponse;
      } catch {
        /* non-JSON body — fall through to the raw text in `detail` */
      }

      if (!res.ok) {
        const msg = parsed.error ?? parsed.message ?? text;
        return { platform: post.platform, ok: false, detail: `Zernio POST /posts ${res.status}: ${msg}` };
      }

      const warn = parsed.warnings?.length ? ` [warnings: ${parsed.warnings.join("; ")}]` : "";
      const result = parsed.platformResults?.[0] ?? parsed.post?.platforms?.[0];
      const ref = result?.platformPostUrl ?? result?.platformPostId ?? parsed.post?._id;

      // 207 is a 2xx: the post was saved but the inline publish did not fully
      // succeed. `post.status` tells the outcomes apart.
      if (res.status === 207) {
        const status = parsed.post?.status;
        const why = result?.error ?? result?.errorMessage ?? parsed.error ?? parsed.message ?? text;
        if (status === "scheduled") {
          // Every platform hit a transient error and was reset to pending.
          // Zernio retries automatically — not a failure.
          return {
            platform: post.platform,
            ok: false,
            queued: true,
            ref,
            detail: `transient error, Zernio will retry: ${why}${warn}`,
          };
        }
        return {
          platform: post.platform,
          ok: false,
          ref,
          detail: `Zernio 207 (post.status=${status ?? "unknown"}): ${why}${warn}`,
        };
      }

      return {
        platform: post.platform,
        ok: true,
        ref,
        detail: `published via Zernio${ref ? ` → ${ref}` : ""}${warn}`,
      };
    } catch (err) {
      return {
        platform: post.platform,
        ok: false,
        detail: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
