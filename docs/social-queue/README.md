# Social posting queue

Runtime state for `scripts/social-post.ts` (the automated social tool).

- `queue.jsonl` — posts that couldn't publish live (no `ZERNIO_API_KEY`) or are
  video-gated (TikTok/YouTube waiting on a video asset). Drain by publishing
  manually or once media exists.
- `promoted.log` — slugs already promoted, so `--auto` never re-posts the same one.

Both are gitignored — they're runtime data, not source.
