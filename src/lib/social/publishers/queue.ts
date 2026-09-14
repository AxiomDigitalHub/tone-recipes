import fs from "fs";
import path from "path";
import type { GeneratedPost, Publisher, PublishResult } from "../types";

/**
 * Fallback publisher: append the post to a local JSONL queue instead of
 * publishing. Used when no live provider is configured, and for posts that are
 * `blockedReason` (e.g. TikTok/YouTube waiting on a video). A human — or a later
 * job once media exists — drains the queue.
 *
 * Durable and dependency-free on purpose, so the generator half of this tool is
 * useful even with zero API access. Can be pointed at a Supabase table later.
 */
export class QueuePublisher implements Publisher {
  name = "queue";
  private file: string;

  constructor(file = path.join(process.cwd(), "docs", "social-queue", "queue.jsonl")) {
    this.file = file;
  }

  async publish(post: GeneratedPost): Promise<PublishResult> {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const row = {
        queuedAt: new Date().toISOString(),
        status: post.blockedReason ? "blocked" : "pending",
        blockedReason: post.blockedReason ?? null,
        post,
      };
      fs.appendFileSync(this.file, JSON.stringify(row) + "\n");
      return {
        platform: post.platform,
        ok: false,
        queued: true,
        detail: post.blockedReason
          ? `queued (blocked: ${post.blockedReason})`
          : `queued to ${path.relative(process.cwd(), this.file)}`,
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
