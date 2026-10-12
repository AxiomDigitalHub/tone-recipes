/**
 * Fader & Knob automated social posting.
 *
 * Generates platform-native posts (X, Instagram, TikTok, YouTube) from a blog
 * post and routes them through the provider-agnostic publisher layer.
 *
 * Usage:
 *   npx tsx scripts/social-post.ts --slug lincoln-brewster-tone-helix   # dry-run (default)
 *   npx tsx scripts/social-post.ts --latest 3                            # newest 3 posts, dry-run
 *   npx tsx scripts/social-post.ts --slug <slug> --live                  # actually publish/queue
 *
 * Safe by default: prints what it WOULD do. Add --live to publish (Zernio if
 * ZERNIO_API_KEY is set, else the local queue). TikTok/YouTube need a video:
 * they publish when https://faderandknob.com/videos/blog/<slug>.mp4 is live
 * (see scripts/generate-social-clip.ts) and queue when it isn't.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { promoteContent, type ContentItem } from "@/lib/social";

const SITE = "https://faderandknob.com";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const hasFlag = (name: string) => process.argv.includes(`--${name}`);

/**
 * TikTok and YouTube fetch the video from a public URL, so a clip sitting in
 * public/videos/blog/ is useless until it has shipped. Ask the live site, and
 * treat anything but a 200 — including a network error — as "not there yet", so
 * the post stays queued rather than handing the networks a 404.
 */
async function liveVideoUrl(slug: string): Promise<string | undefined> {
  const url = `${SITE}/videos/blog/${slug}.mp4`;
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10_000) });
    return res.ok ? url : undefined;
  } catch {
    return undefined;
  }
}

async function itemFromSlug(slug: string): Promise<ContentItem> {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  const { data } = matter(fs.readFileSync(file, "utf-8"));
  return {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    url: `${SITE}/blog/${slug}`,
    imageUrl: data.image ? `${SITE}${data.image}` : undefined,
    videoUrl: await liveVideoUrl(slug),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: data.category ? String(data.category) : undefined,
  };
}

function slugsByDateDesc(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"));
      return { slug, date: String(data.date ?? "") };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((x) => x.slug);
}

function latestSlugs(n: number): string[] {
  return slugsByDateDesc().slice(0, n);
}

// --auto: newest post whose slug isn't in the promoted log yet, so an
// unattended daily run never re-posts the same thing.
const PROMOTED_LOG = path.join(process.cwd(), "docs", "social-queue", "promoted.log");
function promotedSlugs(): Set<string> {
  try {
    // Each line is `slug\t<iso timestamp>` — key the set on the slug only.
    return new Set(
      fs
        .readFileSync(PROMOTED_LOG, "utf-8")
        .split("\n")
        .map((l) => l.split("\t")[0].trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}
function markPromoted(slug: string) {
  fs.mkdirSync(path.dirname(PROMOTED_LOG), { recursive: true });
  fs.appendFileSync(PROMOTED_LOG, `${slug}\t${new Date().toISOString()}\n`);
}
function autoPickSlug(): string | null {
  const done = promotedSlugs();
  return slugsByDateDesc().find((s) => !done.has(s)) ?? null;
}

async function run() {
  const live = hasFlag("live");
  const auto = hasFlag("auto");
  const slug = arg("slug");
  const latest = arg("latest");
  let slugs: string[];
  if (auto) {
    const s = autoPickSlug();
    slugs = s ? [s] : [];
    if (!s) console.log("--auto: every post already promoted (see docs/social-queue/promoted.log). Nothing to do.");
  } else {
    slugs = slug ? [slug] : latest ? latestSlugs(Number(latest)) : latestSlugs(1);
  }

  console.log(`\n=== Fader & Knob social posting (${live ? "LIVE" : "DRY-RUN"}) ===`);
  console.log(`Publisher: ${process.env.ZERNIO_API_KEY ? "Zernio" : "local queue (no ZERNIO_API_KEY)"}\n`);

  for (const s of slugs) {
    const item = await itemFromSlug(s);
    console.log(`\n──────── ${item.title}\n   ${item.url}`);
    console.log(
      `   video: ${item.videoUrl ?? "none live — run `npx tsx scripts/generate-social-clip.ts --slug " + s + "`, then deploy"}`,
    );
    const results = await promoteContent(item, { dryRun: !live });
    for (const { post, result } of results) {
      const tags = post.hashtags.map((t) => `#${t}`).join(" ");
      const head = post.platform.toUpperCase().padEnd(10);
      const status = result
        ? result.ok
          ? `✅ ${result.detail ?? "published"}`
          : result.queued
            ? `📥 ${result.detail}`
            : `❌ ${result.detail}`
        : post.blockedReason
          ? `⏸  would queue — ${post.blockedReason}`
          : "📝 would publish";
      console.log(`\n  ${head} ${status}`);
      if (post.title) console.log(`    title: ${post.title}`);
      console.log(`    ${post.content.replace(/\n/g, "\n    ")}`);
      if (post.thread?.length) post.thread.forEach((t, i) => console.log(`    ↳ (${i + 2}/) ${t}`));
      console.log(`    ${tags}`);
      console.log(`    media: ${post.media.map((m) => `${m.kind}${m.url ? "" : "(none)"}`).join(", ") || "none"}`);
    }
    // In --auto --live mode, record the slug so we never re-promote it — but
    // only once something actually reached a network. Every queued path sets
    // ok:false, so ok===true means a real publish. A run where everything
    // queued or failed stays unmarked, so the next --auto run retries this post
    // instead of silently skipping past it forever.
    if (auto && live) {
      const published = results.filter(({ result }) => result?.ok);
      if (published.length > 0) {
        markPromoted(s);
      } else {
        console.log(
          `\n  ⚠️  Not marking as promoted — nothing published (queued or failed only).` +
            ` The next --auto run will retry this post.`,
        );
      }
    }
  }
  console.log("\n");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
