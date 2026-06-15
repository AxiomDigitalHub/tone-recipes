# Google Indexing Priority — Manual Request List

**Created:** 2026-06-14
**Why this exists:** GA4 (Mar 16 – Jun 13 2026) shows Google organic at **90 active users — third behind DuckDuckGo (149) and Bing (116)**, both Bing-powered. Bing-family is out-delivering Google ~3:1. That is the signature of a young domain Google hasn't ramped trust on (compounded by the Vercel firewall that blocked all crawlers until 2026-06-11), **not** an algorithmic penalty. The fix is to feed Google discovery signals fast.

This is the manual-submission companion to:
- **IndexNow** (`scripts/indexnow-submit.ts`) — covers Bing/DuckDuckGo/Yahoo/Yandex automatically.
- **Sitemap** (`/sitemap.xml`, 642 URLs) — already submitted in Search Console.

Google has no IndexNow; the only manual lever is **URL Inspection → Request Indexing** in Search Console. The daily quota is small (~10–15 useful/day), so spend it on the pages below in order. Don't waste it on the 600-page tail — the sitemap handles those.

---

## Do this first (Search Console, ~10 min)
1. **Settings → Crawl stats** — confirm crawl requests spike after 2026-06-11. If flat, recovery isn't reaching Google; that's the emergency.
2. **Sitemaps** — re-submit `https://faderandknob.com/sitemap.xml` to force re-discovery now that fetches return 200.
3. **Pages (Indexing) report** — expect a large "Discovered/Crawled – not indexed" bucket. Normal for your situation. Work the list below to pull the best pages out of it.

---

## Tier 1 — request today (proven performers + pillar hubs)
These already earn traffic or anchor the internal-link graph. Highest priority.

| URL | Why |
|---|---|
| `/` | Home — entity anchor |
| `/blog/best-frfr-speakers-guitar-modelers-2026` | **#1 content page, 91 active users.** Buying intent. |
| `/blog/fender-deluxe-reverb-settings` | 63 active users. "Settings" intent — your sweet spot. |
| `/blog/cab-ir-library-roundup` *(verify slug)* | 27 users. Comparison intent. |
| `/guides` | Pillar hub — internal-linking backbone |
| `/guides/amp-settings-and-tone` | Pillar — maps to your best-ranking topic (amp settings) |
| `/guides/pedal-settings-guides` | Pillar — second-strongest topic cluster |
| `/guides/modeler-mastery` | Pillar — modeler comparisons rank well |
| `/browse` | Primary catalog entry point |
| `/gear` | Catalog hub for gear pages |

## Tier 2 — request over the next 2–3 days (strong second tier)
| URL | Active users |
|---|---|
| `/blog/the-edge-delay-settings` *(verify slug)* | 20 |
| `/blog/helix-floor-lt-stomp-stadium-compared` | 13 |
| `/blog/metallica-rhythm-tone-settings` | 12 |
| `/blog/marshall-silver-jubilee-vs-jcm800` | 11 |
| `/blog/silent-recording-tube-amp-captor-x` | 11 |
| `/blog/marshall-st20h-vs-sc20c` | 11 |
| `/blog/delay-types-compared` | 10 |
| `/blog/andy-timmons-lead-tone` | 10 |
| `/blog/balanced-power-guitar-rigs` | 9 |
| `/blog/peavey-5150-6505-settings` | 8 |
| `/blog/prs-silver-sky-vs-strat-mayer` | 8 |
| Remaining 4 guide pillars | strategic |

> Slugs marked *(verify slug)* — confirm the exact path from the URL bar before submitting; titles above are from the GA report, not the route.

## Tier 3 — let the machines handle it
The other ~600 URLs: **do not** hand-request. They're covered by the sitemap (Google) and IndexNow (Bing-family). Manually requesting the long tail burns quota and signals nothing useful.

---

## Standing habit
After each publish (daily/weekly content routine):
1. `npx tsx scripts/indexnow-submit.ts <new-url>` — instant Bing-family push.
2. URL-Inspect → Request Indexing the new URL in GSC **only if** it's a Tier-1/2-class page (a pillar or a comparison/settings post likely to rank). Skip routine recipe additions.

## What success looks like (re-pull GA4 in ~4 weeks)
- Google organic share climbing toward parity with Bing-family, then past it.
- "Indexed" count in GSC Pages report rising toward the 642 sitemap total.
- Crawl-stats requests/day elevated and stable.
