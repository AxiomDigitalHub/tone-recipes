/**
 * IndexNow submission.
 *
 * Pushes every URL in the production sitemap to the IndexNow API in one
 * request. IndexNow is a shared endpoint: a single submission notifies
 * Bing, DuckDuckGo, Yahoo, Yandex, and Seznam at once. Google does NOT
 * participate (use Search Console + the sitemap for Google).
 *
 * Why this matters for F&K specifically: per GA4 (Mar–Jun 2026) our top
 * three organic sources — DuckDuckGo, Bing, Yahoo — are ALL Bing-family,
 * and together they out-deliver Google ~3:1 on a young domain Google
 * hasn't fully crawled yet. IndexNow is the fastest way to keep that
 * already-working channel fed: instead of waiting for Bing to re-crawl,
 * we tell it the moment content ships.
 *
 * Setup (one-time): the key file public/<KEY>.txt must be live at the
 * domain root so IndexNow can verify ownership. It is committed alongside
 * this script, so it deploys automatically with the site.
 *
 * Usage:
 *
 *   npx tsx scripts/indexnow-submit.ts            # submit the full sitemap
 *   npx tsx scripts/indexnow-submit.ts --dry-run  # parse + print, don't POST
 *   npx tsx scripts/indexnow-submit.ts <url> ...   # submit only specific URLs
 *
 * Safe to run as often as a deploy happens. Run it in the daily/weekly
 * content routines right after publishing so new posts get picked up fast.
 */

const KEY = "605edcb76678f4c3701342d58a18d405";
const HOST = "faderandknob.com";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "faderandknob-indexnow/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    throw new Error("No <loc> entries found in sitemap — aborting.");
  }
  return urls;
}

async function submit(urls: string[]): Promise<void> {
  // IndexNow accepts up to 10,000 URLs per request; we're well under that,
  // but chunk anyway so this keeps working as the catalog grows.
  const CHUNK = 10000;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const urlList = urls.slice(i, i + CHUNK);
    const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, key validation
    // pending). 403 = key file not reachable; 422 = URLs/host mismatch.
    const note =
      res.status === 200 || res.status === 202
        ? "accepted"
        : res.status === 403
          ? "KEY FILE NOT REACHABLE — is the key .txt deployed at the domain root?"
          : res.status === 422
            ? "UNPROCESSABLE — URL/host mismatch or invalid key"
            : "unexpected";
    console.log(
      `IndexNow ${res.status} (${note}) for ${urlList.length} URLs [batch ${i / CHUNK + 1}]`,
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const explicitUrls = args.filter((a) => a.startsWith("http"));

  const urls = explicitUrls.length > 0 ? explicitUrls : await getSitemapUrls();
  console.log(`${urls.length} URL(s) to submit (key location: ${KEY_LOCATION})`);

  if (dryRun) {
    for (const u of urls.slice(0, 20)) console.log("  " + u);
    if (urls.length > 20) console.log(`  …and ${urls.length - 20} more`);
    console.log("\nDry run — nothing submitted.");
    return;
  }

  await submit(urls);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
