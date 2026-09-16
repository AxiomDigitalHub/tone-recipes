import type { ContentItem, GeneratedPost, Platform } from "./types";

/**
 * Turn one Fader & Knob ContentItem into platform-native posts.
 *
 * Pure and deterministic — no network, no IO — so it's trivially testable and
 * the scheduler can dry-run it. Copy is deliberately practical/peer-to-peer
 * (the F&K voice), never markety. TikTok/YouTube are marked `blockedReason`
 * unless a `videoUrl` is supplied, because both platforms require video.
 */

const DEFAULT_TAGS = ["guitartone", "helix", "line6helix", "worshipguitar"];

function hashtagsFor(item: ContentItem, extra: string[] = []): string[] {
  const fromTags = (item.tags ?? []).map((t) => t.replace(/[^a-z0-9]/gi, ""));
  // de-dupe, keep order, drop empties
  return Array.from(new Set([...fromTags, ...extra, ...DEFAULT_TAGS])).filter(
    Boolean,
  );
}

/** A short, non-clickbait hook from the title. */
function hook(item: ContentItem): string {
  return item.title.replace(/^How to /i, "").replace(/\s*\(.*?\)\s*$/, "").trim();
}

/** Trim to a hard char budget on a word boundary. */
function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export function generatePosts(item: ContentItem): GeneratedPost[] {
  const h = hook(item);
  const heroImage = item.imageUrl
    ? [{ kind: "image" as const, url: item.imageUrl }]
    : [];
  const video = item.videoUrl
    ? [{ kind: "video" as const, url: item.videoUrl }]
    : [];

  const posts: GeneratedPost[] = [];

  // ── X (Twitter) ──────────────────────────────────────────────────────────
  // Lead tweet is the hook + link; the "how" goes in a threaded second tweet
  // so the value is visible even if nobody clicks (AEO: named + quotable).
  posts.push({
    platform: "x",
    content: clamp(`${h}\n\n${item.url}`, 275),
    thread: [clamp(item.description, 275)],
    hashtags: hashtagsFor(item).slice(0, 3),
    media: heroImage,
  });

  // ── Instagram ────────────────────────────────────────────────────────────
  // Caption = hook + value + CTA. IG kills links in captions, so "link in bio".
  posts.push({
    platform: "instagram",
    content: clamp(
      `${h}\n\n${item.description}\n\nFull walkthrough — link in bio → faderandknob.com`,
      2000,
    ),
    hashtags: hashtagsFor(item, ["guitarist", "ampsim", "tonequest"]).slice(0, 15),
    media: heroImage, // v1: single hero image; carousel slides are phase 2
  });

  // ── TikTok (video required) ─────────────────────────────────────────────
  posts.push({
    platform: "tiktok",
    content: clamp(`${h} 🎸 ${item.description}`, 2000),
    hashtags: hashtagsFor(item, ["guitartok", "worshiptok"]).slice(0, 8),
    media: video,
    blockedReason: video.length
      ? undefined
      : "TikTok requires a video asset — none supplied. Queued pending video.",
  });

  // ── YouTube Shorts (video required) ──────────────────────────────────────
  posts.push({
    platform: "youtube",
    title: clamp(`${h} #Shorts`, 100),
    content: clamp(`${item.description}\n\n${item.url}`, 4000),
    hashtags: hashtagsFor(item).slice(0, 12), // ≤500 chars total, well under
    media: video,
    blockedReason: video.length
      ? undefined
      : "YouTube requires a video asset — none supplied. Queued pending video.",
  });

  return posts;
}

/** Convenience: only the posts that can publish right now (no blockedReason). */
export function publishablePosts(item: ContentItem): GeneratedPost[] {
  return generatePosts(item).filter((p) => !p.blockedReason);
}

export const ALL_PLATFORMS: Platform[] = ["x", "instagram", "tiktok", "youtube"];
