# Social posting queue

Runtime state for `scripts/social-post.ts` (the automated social tool).

- `queue.jsonl` — posts that couldn't publish live (no `ZERNIO_API_KEY`) or are
  video-gated (TikTok/YouTube waiting on a video asset). Drain by publishing
  manually or once media exists.
- `promoted.log` — slugs already promoted, so `--auto` never re-posts the same one.
  A slug is only recorded once something actually published; a run where every
  platform queued or failed stays unlogged and is retried next time.

Both are gitignored — they're runtime data, not source.

## Platforms

| Platform  | State |
|-----------|-------|
| Instagram | Live via Zernio (the only connected account). |
| X         | Off. Zernio bills X as a paid add-on, so the generator is gated behind `SOCIAL_X_ENABLED=1` in `src/lib/social/generate.ts`. The post copy is still there if that changes. |
| TikTok    | Publishes once the post has a live video (below), queues otherwise. |
| YouTube   | Same gate as TikTok, posted as a Short. |

## Video clips for TikTok / YouTube

`scripts/generate-social-clip.ts` turns a blog hero image into a 1080x1920
vertical clip with Grok Imagine (~$0.30, ~6s):

```bash
npx tsx scripts/generate-social-clip.ts --auto            # next post up for promotion
npx tsx scripts/generate-social-clip.ts --slug <slug>
npx tsx scripts/generate-social-clip.ts --slug <slug> --force   # re-bills Grok
```

It writes `public/videos/blog/<slug>.mp4`. The heroes are 16:9 studio shots, so
the clip is animated at native 16:9 and composited into a vertical frame over a
blurred copy of itself, with the post title drawn across the top — a hard 9:16
crop would cut the gear in half.

**The clip has to ship before it can post.** TikTok and YouTube fetch the file
from the public URL, so `social-post.ts` asks the live site for
`https://faderandknob.com/videos/blog/<slug>.mp4` and only attaches the video on
a 200. Anything else — including a 404 because the file is still only local —
leaves those two queued. So the order is **generate → commit → deploy → post**,
which in practice means generating a clip at least one run ahead of the post
that needs it. The daily task doesn't commit, so that step is manual or belongs
to a separate job.

The raw 16:9 render is cached in `.next/cache/social-clips/`; re-running only
redoes the free ffmpeg composite unless you pass `--force`.

Clips are model-generated, so the publisher sets the AI-disclosure flags
(`containsSyntheticMedia` on YouTube, `madeWithAi` on X) whenever media is attached.
