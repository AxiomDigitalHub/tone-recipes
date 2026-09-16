/**
 * Provider-agnostic social posting types.
 *
 * The whole point of this layer: the content generator and the scheduler never
 * know or care WHICH service publishes. A `Publisher` is an interface; Zernio is
 * one implementation, a local queue is the fallback. If Zernio doesn't work out,
 * swap the adapter — nothing else changes.
 */

export type Platform = "x" | "instagram" | "tiktok" | "youtube";

/** A piece of Fader & Knob content we want to promote (recipe, blog post, etc.). */
export interface ContentItem {
  title: string;
  description: string;
  url: string; // canonical faderandknob.com URL
  imageUrl?: string; // absolute URL to a hero image (for X/IG)
  tags?: string[];
  category?: string;
  /** Optional absolute URL to a video asset (required for TikTok / YouTube). */
  videoUrl?: string;
}

/** One platform-native post the generator produced from a ContentItem. */
export interface GeneratedPost {
  platform: Platform;
  /** Main caption / tweet text / video description. */
  content: string;
  /** Hashtags WITHOUT the leading # (renderer/adapter adds them per platform). */
  hashtags: string[];
  /** Media the post needs. `kind: "video"` items gate TikTok/YouTube. */
  media: Array<{ kind: "image" | "video"; url?: string }>;
  /** YouTube only. */
  title?: string;
  /** X only: extra tweets to thread after `content`. */
  thread?: string[];
  /**
   * Set when the post cannot publish autonomously yet (e.g. TikTok/YouTube need
   * a video we don't have). The scheduler queues these instead of publishing.
   */
  blockedReason?: string;
}

export interface PublishResult {
  platform: Platform;
  ok: boolean;
  /** Provider post id / permalink when ok. */
  ref?: string;
  /** Why it didn't publish (queued, blocked, error). */
  detail?: string;
  /** true when it was intentionally queued (not a failure). */
  queued?: boolean;
}

/** The one seam every publishing backend implements. */
export interface Publisher {
  name: string;
  publish(post: GeneratedPost): Promise<PublishResult>;
}
