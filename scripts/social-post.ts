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
 * ZERNIO_API_KEY is set, else the local queue) — video-gated TikTok/YouTube
 * always go to the queue.
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

function itemFromSlug(slug: string): ContentItem {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  const { data } = matter(fs.readFileSync(file, "utf-8"));
  return {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    url: `${SITE}/blog/${slug}`,
    imageUrl: data.image ? `${SITE}${data.image}` : undefined,
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
    return new Set(fs.readFileSync(PROMOTED_LOG, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean));
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
    const item = itemFromSlug(s);
    console.log(`\n──────── ${item.title}\n   ${item.url}`);
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
    // In --auto --live mode, record the slug so we never re-promote it.
    if (auto && live) markPromoted(s);
  }
  console.log("\n");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
