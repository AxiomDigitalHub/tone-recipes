/**
 * Send the weekly "Tone of the Week" newsletter to active subscribers.
 *
 * Flags:
 *   --recipe=<slug>        Recipe slug to feature (required)
 *   --blog=<slug>          Blog post slug to feature (required)
 *   --tip="<text>"         Quick-tip paragraph (required, in quotes)
 *   --test=<email>         Send only to this address (skips the list)
 *   --dry-run              Print plan + recipient count, don't send
 *   --yes                  Skip the interactive confirmation
 *
 * Defaults: prompts interactively for confirmation before sending. Pulls
 * `newsletter_subscribers` where `unsubscribed_at IS NULL` via the service
 * role key.
 *
 * Required env: RESEND_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
 *               SUPABASE_SERVICE_ROLE_KEY, NEWSLETTER_UNSUBSCRIBE_SECRET.
 *
 * Example:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/send-tone-of-the-week.ts \
 *     --recipe=srv-pride-and-joy-rhythm \
 *     --blog=big-muff-settings-guide \
 *     --tip="Roll your volume knob to 7 for the verse and back to 10 for the chorus — same preset, two dynamics."
 *
 *   # Smoke test to yourself first:
 *   npx tsx scripts/send-tone-of-the-week.ts --recipe=... --blog=... --tip="..." --test=you@example.com
 */

import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { toneRecipes, songs } from "../src/lib/data";
import { getAllPosts } from "../src/lib/blog";
import { sendToneOfTheWeek } from "../src/lib/email";

interface Args {
  recipe?: string;
  blog?: string;
  tip?: string;
  test?: string;
  dryRun: boolean;
  yes: boolean;
}

function parseArgs(): Args {
  const out: Args = { dryRun: false, yes: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--yes") out.yes = true;
    else if (a.startsWith("--recipe=")) out.recipe = a.slice(9);
    else if (a.startsWith("--blog=")) out.blog = a.slice(7);
    else if (a.startsWith("--tip=")) out.tip = a.slice(6);
    else if (a.startsWith("--test=")) out.test = a.slice(7);
  }
  return out;
}

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

async function loadSubscribers(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) fail("Supabase env vars missing.");
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null);
  if (error) fail(`Supabase read failed: ${error.message}`);
  const emails = ((data as { email: string }[] | null) ?? [])
    .map((r) => r.email.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  // Dedup defensively (the unique constraint should already handle this).
  return [...new Set(emails)];
}

async function confirm(prompt: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = (await rl.question(prompt)).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes";
}

async function main() {
  const args = parseArgs();

  if (!args.recipe) fail("--recipe=<slug> required");
  if (!args.blog) fail("--blog=<slug> required");
  if (!args.tip) fail("--tip=\"<text>\" required");

  if (!process.env.RESEND_API_KEY) fail("RESEND_API_KEY not set");
  if (!process.env.NEWSLETTER_UNSUBSCRIBE_SECRET)
    fail("NEWSLETTER_UNSUBSCRIBE_SECRET not set — needed for unsubscribe links");

  // Resolve recipe metadata for the email subject line.
  const recipe = toneRecipes.find((r) => r.slug === args.recipe);
  if (!recipe) fail(`Recipe not found: ${args.recipe}`);
  const song = songs.find((s) => s.slug === recipe.song_slug);
  const recipeName = song ? song.title : recipe.title;
  const recipeDescription =
    recipe.description ??
    `Signal chain, exact settings, and a preset you can load — ${recipeName}.`;

  // Resolve blog post for the body section.
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === args.blog);
  if (!post) fail(`Blog post not found: ${args.blog}`);

  // Build the recipient list.
  let recipients: string[];
  if (args.test) {
    recipients = [args.test.trim().toLowerCase()];
    console.log(`Test mode: sending only to ${recipients[0]}`);
  } else {
    recipients = await loadSubscribers();
  }

  // Plan summary.
  console.log("");
  console.log("Tone of the Week — plan");
  console.log("───────────────────────");
  console.log(`Recipe:       ${recipeName}  (/recipe/${recipe.slug})`);
  console.log(`Blog post:    ${post.title}  (/blog/${post.slug})`);
  console.log(`Quick tip:    ${args.tip}`);
  console.log(`Recipients:   ${recipients.length}`);
  console.log("");

  if (args.dryRun) {
    console.log("Dry run — no email sent.");
    return;
  }

  if (recipients.length === 0) {
    console.log("No recipients — nothing to do.");
    return;
  }

  if (!args.yes) {
    const ok = await confirm(`Send to ${recipients.length} recipient(s)? [y/N] `);
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }

  const result = await sendToneOfTheWeek({
    to: recipients,
    recipeName,
    recipeSlug: recipe.slug,
    recipeDescription,
    blogPostTitle: post.title,
    blogPostSlug: post.slug,
    quickTip: args.tip,
  });

  if (result.success) {
    console.log(`✓ Sent to ${result.sent} recipient(s).`);
  } else {
    fail(`Send failed: ${(result.error as Error | undefined)?.message ?? "unknown"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
