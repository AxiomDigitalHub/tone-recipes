import type { GeneratedPost, Platform, Publisher, PublishResult } from "../types";

/**
 * Zernio adapter (https://zernio.com) — one implementation of `Publisher`.
 * Provider-agnostic by design: if Zernio doesn't work out, delete this file and
 * write another adapter to the same interface; nothing upstream changes.
 *
 * Env:
 *   ZERNIO_API_KEY    — required (Bearer token from the Zernio dashboard)
 *   ZERNIO_PROFILE_ID — optional (scopes accounts to one profile)
 *
 * ⚠️ TWO THINGS TO VERIFY against your Zernio dashboard once a key exists — I
 * couldn't test them without one:
 *   1. The platform string for X. This maps "x" → "twitter"; Zernio may expect
 *      "x". Fix PLATFORM_MAP if posts to X 400.
 *   2. accountId resolution. This calls GET /v1/accounts and matches on the
 *      mapped platform string. Confirm your connected accounts show up there.
 */

const BASE = "https://zernio.com/api/v1";

const PLATFORM_MAP: Record<Platform, string> = {
  x: "twitter",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
};

interface ZernioAccount {
  platform: string;
  accountId: string;
  username?: string;
  isActive?: boolean;
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

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
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
      (a) => a.platform === want && a.isActive !== false,
    );
    return acct?.accountId ?? null;
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
          detail: `No connected ${post.platform} account in Zernio (${PLATFORM_MAP[post.platform]}).`,
        };
      }

      const hashtagLine = post.hashtags.map((t) => `#${t}`).join(" ");
      // X/IG/TikTok: hashtags live in the caption. YouTube: separate tags field.
      const caption =
        post.platform === "youtube"
          ? post.content
          : `${post.content}\n\n${hashtagLine}`.trim();

      const mediaItems = post.media
        .filter((m) => m.url)
        .map((m) => ({ type: m.kind, url: m.url }));

      // Per-platform extras Zernio requires.
      const platformSpecificData: Record<string, unknown> = {};
      if (post.platform === "tiktok") {
        platformSpecificData.tiktokSettings = {
          privacy_level: "PUBLIC_TO_EVERYONE",
          allow_comment: true,
          allow_duet: true,
          allow_stitch: true,
          content_preview_confirmed: true,
          express_consent_given: true,
        };
      }
      if (post.platform === "youtube") {
        platformSpecificData.title = post.title;
        platformSpecificData.tags = post.hashtags;
        platformSpecificData.visibility = "public";
      }
      if (post.platform === "x" && post.thread?.length) {
        platformSpecificData.threadItems = post.thread.map((t) => ({
          content: t,
          mediaItems: [],
        }));
      }

      const body = {
        content: caption,
        publishNow: true, // fully autonomous per the chosen config
        ...(this.profileId ? { profileId: this.profileId } : {}),
        mediaItems,
        platforms: [
          {
            platform: PLATFORM_MAP[post.platform],
            accountId,
            ...(Object.keys(platformSpecificData).length ? { platformSpecificData } : {}),
          },
        ],
      };

      const res = await fetch(`${BASE}/posts`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (!res.ok) {
        return { platform: post.platform, ok: false, detail: `Zernio POST /posts ${res.status}: ${text}` };
      }
      let ref: string | undefined;
      try {
        ref = (JSON.parse(text) as { id?: string; postId?: string }).id ??
          (JSON.parse(text) as { postId?: string }).postId;
      } catch {
        /* non-JSON ok */
      }
      return { platform: post.platform, ok: true, ref, detail: "published via Zernio" };
    } catch (err) {
      return {
        platform: post.platform,
        ok: false,
        detail: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
