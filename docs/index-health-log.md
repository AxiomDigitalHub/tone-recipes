# Index Health Log — faderandknob.com

Weekly autonomous SEO index-health pulse. Appended by the `faderandknob-index-health-pulse` scheduled task.
Cannot log into Google Search Console (needs local browser) — run the `/index-health` skill interactively for the full GSC audit.

Canonical finding: low Google index coverage on this site is an **AUTHORITY** problem (0 backlinks), NOT a content-volume problem. Never recommend "publish more pages" as the fix.

---

## 2026-07-06

- **Sitemap:** reachable, **769** `<loc>` URLs (baseline — first logged run, no prior delta)
- **HTTP status:** homepage `200`, worship URL (`/blog/lincoln-brewster-tone-helix`) `200`
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — indexed, many pages returned (news, blog, gear, homepage). Site is generally in Google.
  - `site:faderandknob.com lincoln brewster` — **no faderandknob.com URLs** in results (only external Lincoln Brewster pages)
  - `site:faderandknob.com hillsong` — faderandknob pages returned, but **no worship-post URL** (David Gilmour, homepage, pricing, etc.)
  - `site:faderandknob.com bethel` — faderandknob pages returned, but **no worship-post URL**
- **5 worship posts indexed?** None of the 5 target URLs appeared directly in `site:` link results:
  - lincoln-brewster-tone-helix — not visible
  - hillsong-guitar-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
  - (Submitted for indexing 2026-06-26 → ~10 days ago, under the 2-week threshold. Not yet an alert, but watch next week.)
- **Verdict:** Site up and broadly indexed; no hard alerts. Worship cluster not yet surfacing in `site:` results — expected given only ~10 days since submission. If still absent on the 2026-07-13 run (≥2 weeks), escalate to `/index-health`.

## 2026-07-13

- **Sitemap:** reachable, **781** `<loc>` URLs (**+12** vs 769 last week — healthy growth)
- **HTTP status:** homepage `200`, worship URL (`/blog/lincoln-brewster-tone-helix`) `200`. All 5 worship posts checked directly: hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — indexed, many pages returned (homepage, blog gear/technique posts). Site broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** in link results (only external Lincoln Brewster pages). Unchanged from last week.
  - `site:faderandknob.com hillsong` — faderandknob pages returned (David Gilmour, pricing, homepage, signal-chain, etc.) but **no worship-post URL** in link results.
  - `site:faderandknob.com bethel` — faderandknob pages returned (David Gilmour, cab-ir, FRFR, power-tubes, Mooer news, etc.) but **no worship-post URL** in link results.
  - Note: WebSearch prose *described* Hillsong/Bethel worship content as existing, but the actual returned link results contained none of the 5 target URLs — prose is model summary, link results are the indexing signal.
- **5 worship posts indexed?** None of the 5 target URLs appeared in `site:` link results:
  - lincoln-brewster-tone-helix — not visible
  - hillsong-guitar-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ ALERT:** Worship cluster still absent from `site:` results **17 days** after the 2026-06-26 indexing submission (≥2-week threshold crossed). Pages are technically fine (all `200`, all in sitemap) — this is an **indexing/authority lag, not a content or technical fault**. Consistent with the canonical finding: coverage is gated by **authority (0 backlinks)**, not page volume.
- **Verdict:** Site up, sitemap growing (+12), no HTTP faults — but the worship cluster has now missed the 2-week indexing window. Escalate to interactive `/index-health` for a full GSC index-coverage + sitemap-freshness audit and to request indexing on the 5 stuck URLs. Do **not** respond by publishing more pages — the fix is backlinks/authority.

## 2026-07-21

- **Sitemap:** reachable, **794** `<loc>` URLs (**+13** vs 781 last week — healthy growth, no drop)
- **HTTP status:** homepage `200`, worship URL (`/blog/lincoln-brewster-tone-helix`) `200`. All 5 worship posts confirmed present in sitemap. (Note: `/recipes/lincoln-brewster-tone-helix` 308-redirects to `/browse` — unrelated legacy redirect, not a fault; canonical worship URLs live at `/blog/`.)
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — indexed, homepage + many blog posts returned (level-match, signal-chain, cab-IR, Floyd Rose, etc.). Site broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** in link results (only external Lincoln Brewster pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ **worship-post URL now appears directly:** `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned in link results. **First time any of the 5 worship posts has surfaced in `site:` results.**
  - `site:faderandknob.com bethel` — **no faderandknob.com URLs** in link results (only external Bethel/Wikipedia pages).
- **5 worship posts indexed?** 1 of 5 now visible:
  - hillsong-guitar-tone-helix — ✅ **INDEXED (new this week)**
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent from `site:` results **25 days** after the 2026-06-26 submission (well past the 2-week threshold). But the Hillsong post breaking through is genuine progress — the cluster is beginning to get crawled/indexed, consistent with a slow authority-gated ramp rather than a technical block. Pages remain technically clean (all `200`, all in sitemap).
- **Verdict:** Site up, sitemap growing (+13), no HTTP faults, and the **first worship post is now indexed** (Hillsong). The remaining 4 are still stuck past the 2-week window. Escalate to interactive `/index-health` for a full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — the fix is backlinks/authority; the Hillsong breakthrough shows the existing pages index fine once crawled.

## 2026-07-28

- **Sitemap:** reachable (`200`), **816** `<loc>` URLs (**+22** vs 794 last week — healthy growth, no drop)
- **HTTP status:** homepage `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each).
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader" entries). Treated as a **search-backend quirk, not deindexing**: the bare-operator query has been unreliable, and a control query (`faderandknob.com helix presets blog`) returned 6 distinct faderandknob.com blog URLs (helix-vs-quad-cortex, helix-ir-shootout, hillsong-guitar-tone-helix, helix-vs-quad-cortex-vs-kemper, modeler-preset-sounds-different-live, level-match-modeler-presets). Site is broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned in link results. **Second consecutive week indexed.**
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `site:faderandknob.com elevation worship phil wickham guitar tone helix` — returned faderandknob URLs (hillsong-guitar-tone-helix, fender-deluxe-reverb-settings, best-frfr-speakers-for-modelers) but **neither elevation-worship nor phil-wickham**.
- **5 worship posts indexed?** 1 of 5 visible — no change vs last week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (2nd week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **32 days** after the 2026-06-26 submission — well past the 2-week threshold, and **no movement this week** (last week's Hillsong breakthrough did not pull the others in). Pages remain technically clean (all `200`, all in sitemap), so this is an indexing/authority lag, not a technical fault.
- **Verdict:** Site up, sitemap growing (+22), no HTTP faults, Hillsong holding its index position — but the remaining 4 worship posts are flat for a second week. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled.

## 2026-08-04

- **Sitemap:** reachable (`200`), **834** `<loc>` URLs (**+18** vs 816 last week — healthy growth, no drop)
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader" entries). Same **search-backend quirk as last week, not deindexing**: the control query (`faderandknob.com helix presets blog`) returned 6 distinct faderandknob.com blog URLs (helix-vs-quad-cortex, helix-ir-shootout, hillsong-guitar-tone-helix, helix-vs-quad-cortex-vs-kemper, modeler-preset-sounds-different-live, level-match-modeler-presets). Site is broadly in Google. The bare operator has now failed 2 weeks running — treat it as unreliable and always pair it with a control query.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster/Wikipedia pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned in link results. **Third consecutive week indexed**, with full title + description surfacing.
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `faderandknob elevation worship phil wickham guitar tone helix` — returned the Hillsong post plus many competitor URLs (Worship Tutorials, Sunday Shred, BenVesco, Komposition101), but **neither elevation-worship nor phil-wickham**. Worth noting the competitive set that *does* rank for these queries.
- **5 worship posts indexed?** 1 of 5 visible — no change for the third week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (3rd week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **39 days** after the 2026-06-26 submission — far past the 2-week threshold, and **flat for a third consecutive week**. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs), so this is an indexing/authority lag, not a technical fault.
- **Verdict:** Site up, sitemap growing (+18), no HTTP faults, Hillsong holding its index position — but the remaining 4 worship posts have not moved in three weeks. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled. The competitor set ranking for elevation/phil-wickham queries (Worship Tutorials et al.) all have backlink profiles this site does not.

## 2026-08-12

- **Sitemap:** reachable (`200`), **849** `<loc>` URLs (**+15** vs 834 last week — healthy growth, no drop). Note: the first fetch of the run returned an empty body (0 `<loc>`); three follow-up fetches all returned 849 consistently, so the zero was a **transient fetch blip, not a sitemap fault**. Always re-fetch before alerting on a sitemap-count drop.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader" entries). Same **search-backend quirk, not deindexing** — now failing **3 weeks running**. Control query (`faderandknob.com helix presets blog`) returned **8 distinct faderandknob.com blog URLs** (helix-vs-quad-cortex, helix-ir-shootout, hillsong-guitar-tone-helix, 4-wire-method-explained, helix-vs-quad-cortex-vs-kemper, modeler-preset-sounds-different-live, line-6-helix-family-compared, level-match-modeler-presets) — up from 6 the prior two weeks. Site is broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster/Wikipedia pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned with full title + description. **Fourth consecutive week indexed.**
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `faderandknob elevation worship phil wickham bethel guitar tone helix` — returned the Hillsong post plus the usual competitor set (GuitarforHISGLORY, Worship Tutorials, BenVesco, Worship Online, AxeDr), but **neither elevation-worship nor phil-wickham**.
- **5 worship posts indexed?** 1 of 5 visible — no change for the fourth week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (4th week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **47 days** after the 2026-06-26 submission — far past the 2-week threshold, and **flat for a fourth consecutive week**. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs), so this is an indexing/authority lag, not a technical fault.
- **Bing AI citation log:** ✅ **captured this week** — see `docs/BING_AI_CITATIONS.md` run log (2026-08-12). Cross-reads with the above: the 5 worship artist posts get **zero AI citations**, including the Hillsong post that *is* indexed in Google. Indexing is necessary but not sufficient for citation.
- **Run note:** filesystem access to `~/Documents` was revoked partway through this run (macOS TCC, `Operation not permitted` on every repo read) and the Claude-in-Chrome extension was disconnected at the same time. Both recovered on retry and the run completed in full; flagging in case it recurs, since it would silently kill an unattended run.
- **Verdict:** Site up, sitemap growing (+15), no HTTP faults, Hillsong holding its index position for a 4th week — but the remaining 4 worship posts have not moved in four weeks. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled.
