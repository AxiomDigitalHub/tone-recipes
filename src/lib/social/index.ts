import type { ContentItem, Publisher, PublishResult } from "./types";
import { generatePosts } from "./generate";
import { ZernioPublisher } from "./publishers/zernio";
import { QueuePublisher } from "./publishers/queue";

export * from "./types";
export { generatePosts, publishablePosts, ALL_PLATFORMS } from "./generate";

/**
 * Pick the live publisher. Zernio when a key is present, otherwise the local
 * queue. Swapping providers is a one-line change here — the seam that makes the
 * "zernio may not work" risk cheap.
 */
export function getPublisher(): Publisher {
  if (process.env.ZERNIO_API_KEY) {
    try {
      return new ZernioPublisher();
    } catch {
      /* fall through to queue if construction fails */
    }
  }
  return new QueuePublisher();
}

/**
 * Generate every platform post for an item and route each one:
 *  - blocked posts (e.g. no video yet) always go to the queue
 *  - the rest go to the live publisher (or queue, if that's what's configured)
 * `dryRun` generates + reports without publishing or queueing.
 */
export async function promoteContent(
  item: ContentItem,
  opts: { dryRun?: boolean } = {},
): Promise<{ post: import("./types").GeneratedPost; result: PublishResult | null }[]> {
  const live = getPublisher();
  const queue = new QueuePublisher();
  const posts = generatePosts(item);
  const out = [];
  for (const post of posts) {
    if (opts.dryRun) {
      out.push({ post, result: null });
      continue;
    }
    const publisher = post.blockedReason ? queue : live;
    out.push({ post, result: await publisher.publish(post) });
  }
  return out;
}
