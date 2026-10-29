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

## 2026-08-19

- **Sitemap:** reachable (`200`), **870** `<loc>` URLs (**+21** vs 849 last week — healthy growth, no drop). Note: the very first fetch of the run returned **868**, then three consecutive re-fetches all returned **870**. Consistent with a page publishing mid-run / ISR revalidation rather than a fault. Per last week's lesson, re-fetched before recording — 870 is the settled count.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader" entries). Same **search-backend quirk, not deindexing** — now failing **4 weeks running**. Control query (`faderandknob.com helix presets blog`) returned **6 distinct faderandknob.com blog URLs** (helix-vs-quad-cortex, helix-ir-shootout, hillsong-guitar-tone-helix, helix-vs-quad-cortex-vs-kemper, modeler-preset-sounds-different-live, level-match-modeler-presets) — back to 6 after last week's 8, but the control query result set is not a coverage measure, so read no signal into the count. Site is broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster/Wikipedia pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned with full title + description. **Fifth consecutive week indexed.**
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `faderandknob elevation worship phil wickham bethel lincoln brewster guitar tone helix` — returned **no faderandknob.com URLs at all** this week (not even Hillsong), just the usual competitor set (GuitarforHISGLORY, Worship Online, AxeDr, Reverb, Equipboard, Skool). Notably GuitarforHISGLORY sells a "Line 6 Helix Worship Essentials" pack covering Bethel/Elevation/Hillsong — direct competitive overlap with the 4 stuck posts.
- **5 worship posts indexed?** 1 of 5 visible — no change for the fifth week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (5th week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **54 days** after the 2026-06-26 submission — far past the 2-week threshold, and **flat for a fifth consecutive week**. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs), so this is an indexing/authority lag, not a technical fault.
- **⚠️ Bing AI citation log: BLOCKED — not captured this week.** New blocker shape, *not* a sign-in wall: the Claude-in-Chrome layer reported **two connected Chrome browsers with none selected for the session** (Browser 1 `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`, Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`) and requires an interactive pick before any browser action. An unattended run cannot choose. The dashboard was never reached, so no statement can be made about the Microsoft session. **Fix is a one-time browser selection, not a re-login** — worth pinning the correct browser for this task so future unattended runs don't stall here.
- **Verdict:** Site up, sitemap growing (+21), no HTTP faults, Hillsong holding its index position for a 5th week — but the remaining 4 worship posts have not moved in five weeks. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled, and the competitors that do rank for these queries carry backlink profiles this site does not.

## 2026-08-24

- **Sitemap:** reachable (`200`), **887** `<loc>` URLs (**+17** vs 870 last week — healthy growth, no drop). Per the standing lesson, re-fetched before recording: first fetch returned **886**, three consecutive re-fetches all returned **887**. Same publish-mid-run / ISR-revalidation pattern as last week; 887 is the settled count.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader" entries). Same **search-backend quirk, not deindexing** — now failing **5 weeks running**. Control query (`faderandknob.com helix presets blog`) returned **8 distinct faderandknob.com blog URLs** (helix-vs-quad-cortex, helix-ir-shootout, hillsong-guitar-tone-helix, 4-wire-method-explained, helix-vs-quad-cortex-vs-kemper, modeler-preset-sounds-different-live, line-6-helix-family-compared, level-match-modeler-presets). Site is broadly in Google.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster/Wikipedia/Last.fm pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned with full title + description. **Sixth consecutive week indexed.**
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `faderandknob elevation worship phil wickham bethel lincoln brewster guitar tone helix` — **no faderandknob.com URLs at all** for a second week running, just the competitor set (Reverb, GuitarforHISGLORY, Worship Tutorials, Joey Cobra, Worship Online, AxeDr). GuitarforHISGLORY's "Line 6 Helix Worship Essentials" pack again surfaces, explicitly bundling Bethel/Elevation/Hillsong patches — direct competitive overlap with the 4 stuck posts.
- **5 worship posts indexed?** 1 of 5 visible — no change for the sixth week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (6th week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **59 days** after the 2026-06-26 submission — far past the 2-week threshold, and **flat for a sixth consecutive week**. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs), so this is an indexing/authority lag, not a technical fault.
- **⚠️ Bing AI citation log: BLOCKED — second consecutive week, identical cause.** Two connected Chrome browsers with none selected; the tool layer requires an interactive pick an unattended run cannot make. Not a sign-in wall. See `docs/BING_AI_CITATIONS.md` run log (2026-08-24). Two missed weeks now sit in the series — the repeat proves this is a standing machine condition, not a glitch, and it will recur every week until a browser is disconnected or pinned.
- **Verdict:** Site up, sitemap growing (+17), no HTTP faults, Hillsong holding its index position for a 6th week — but the remaining 4 worship posts have not moved in six weeks. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled, and every competitor ranking for these queries carries a backlink profile this site does not. Note the compounding evidence: the site added **+53 URLs over three weeks** while worship coverage stayed at 1/5, which is volume failing to move coverage — exactly the pattern that says the constraint is links, not pages.

## 2026-09-05

- **Sitemap:** reachable (`200`), **907** `<loc>` URLs (**+20** vs 887 last week — healthy growth, no drop). Per the standing lesson, re-fetched before recording: first fetch returned **905**, three consecutive re-fetches all returned **907**. Same publish-mid-run / ISR-revalidation pattern as the last two weeks; 907 is the settled count. This is now a reliable signature of the run, not a fault — the first fetch of a run runs 1–2 URLs behind the settled value.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — **returned zero faderandknob.com URLs** (only Wikipedia "Fader"/"Fade" entries). Same **search-backend quirk, not deindexing** — now failing **6 weeks running**. Control query (`faderandknob.com helix presets blog`) returned **7 distinct faderandknob.com blog URLs** (helix-ir-shootout, hillsong-guitar-tone-helix, helix-vs-quad-cortex, 4-wire-method-explained, **helix-cab-ir-pairings**, modeler-preset-sounds-different-live, level-match-modeler-presets). Site is broadly in Google. Note `helix-cab-ir-pairings` is a **URL not seen in any prior week's control set** — a genuinely new page surfacing, though the control query is not a coverage measure so read no rate signal into it.
  - `site:faderandknob.com lincoln brewster` — **zero faderandknob.com URLs** (only external Brewster/Wikipedia/Last.fm pages). Unchanged.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` returned with full title + description. **Seventh consecutive week indexed.**
  - `site:faderandknob.com bethel` — **zero faderandknob.com URLs** (only external Bethel/Wikipedia pages).
  - Extra check `faderandknob elevation worship phil wickham bethel lincoln brewster guitar tone helix` — **no faderandknob.com URLs at all** for a third week running, just the competitor set (Reverb, SoundShop, Worship Tutorials, Worship Online, GuitarforHISGLORY, Sweetwater). Both GuitarforHISGLORY's "Line 6 Helix Worship Essentials" and Worship Tutorials' "Bethel Artist Series Line 6 Helix Patch" surface again — direct competitive overlap with the 4 stuck posts, from domains carrying backlink profiles this site does not have.
- **5 worship posts indexed?** 1 of 5 visible — no change for the seventh week:
  - hillsong-guitar-tone-helix — ✅ INDEXED (7th week confirmed)
  - lincoln-brewster-tone-helix — not visible
  - elevation-worship-guitar-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 4 of 5 worship posts still absent **71 days** after the 2026-06-26 submission — far past the 2-week threshold, and **flat for a seventh consecutive week**. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs), so this is an indexing/authority lag, not a technical fault.
- **⚠️ Bing AI citation log: BLOCKED — third consecutive week, but a NEW cause.** The two-browser selection blocker of 08-19 and 08-24 has **cleared** — only one Chrome browser is connected now (`b89db820-…`), it selected cleanly, and the dashboard was actually reached for the first time in three weeks. It then **redirected to the signed-out Bing Webmaster marketing page** (`/webmasters/about?...&from=aiperformance`): **the Microsoft session has expired.** This is the sign-in-wall shape the task anticipates; no sign-in attempted. See `docs/BING_AI_CITATIONS.md` run log (2026-09-05). Three missed weeks now sit in the series.
- **Verdict:** Site up, sitemap growing (+20), no HTTP faults, Hillsong holding its index position for a 7th week — but the remaining 4 worship posts have not moved in seven weeks. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the 4 stuck URLs (lincoln-brewster, elevation-worship, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**; Hillsong proves the pages index fine once crawled, and every competitor ranking for these queries carries a backlink profile this site does not. The compounding evidence keeps strengthening: **+73 URLs over four weeks** while worship coverage stayed pinned at 1/5. That is volume failing to move coverage, four weeks running — the constraint is links, not pages.

## 2026-09-27

- **Cadence note:** previous entry was **2026-09-05** — this run lands **22 days later**, not 7. All deltas below span that 22-day window, so do not read them as weekly rates.
- **Sitemap:** reachable (`200`), **951** `<loc>` URLs (**+44** vs 907 on 09-05 — growth, no drop; ~+14/wk equivalent). Per the standing lesson, re-fetched before recording — and this week the lesson **earned its keep**: the first fetch returned **922**, then **six consecutive re-fetches** (two batches, one spaced 2s apart) all returned **951**. That is a **29-URL** first-fetch gap, an order of magnitude wider than the usual 1–2. Recording **951** as settled. Flagging the widened gap: the "first fetch runs 1–2 behind" signature noted on 09-05 no longer describes the behaviour, so keep re-fetching rather than trusting a single read.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **🟢 The 6-week `site:` operator quirk has CLEARED.** For the first time since 07-22, `site:` queries return faderandknob.com URLs directly instead of Wikipedia-only result sets. `site:faderandknob.com lincoln brewster` returned **5 faderandknob.com URLs**, `site:...hillsong` returned **2**, `site:...bethel` returned **4**, `site:...elevation worship phil wickham` returned **4**. The prior six weeks of zero-result `site:` reads are now **confirmed as a search-backend artifact, not deindexing** — exactly as called at the time. The bare `site:faderandknob.com` query still returns Wikipedia-only, so the operator is partially, not fully, recovered; the qualified forms work.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com lincoln brewster` — faderandknob URLs returned (kemper-profiles-vs-helix-models, cavity-shielding-test, series-vs-parallel-effects-loop, buffer-myth-buffered-bypass, eq-pedal-placement) but **not** lincoln-brewster-tone-helix.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` with full title + description. **Eighth consecutive week indexed.**
  - `site:faderandknob.com bethel` — faderandknob URLs returned, including **`/artist/david-hislop`** (Bethel Music's touring guitarist, with accurate rig detail) — but **not** bethel-music-guitar-tone-helix. Bethel *content* is in the index; the target post is not.
  - `site:faderandknob.com elevation worship phil wickham` — ✅ **`https://faderandknob.com/blog/elevation-worship-guitar-tone-helix`** returned with full title. Also surfaced **`/blog/hx-stomp-vs-helix-lt-worship`**, a worship post not seen in any prior week. No phil-wickham post.
  - Targeted `faderandknob bethel music guitar tone helix` — no bethel-music post; returned david-hislop + elevation + hillsong instead, alongside the competitor set (Worship Tutorials' Bethel Artist Series, Alex Strabala, Tone Factor).
  - Targeted `faderandknob phil wickham guitar tone helix` — **only the homepage** surfaced from faderandknob; everything else was competitors (Worship Tutorials x3, Joey Cobra's "Phil Wickham Ultimate Helix Patch Bundle", Equipboard).
  - Control query (`faderandknob.com helix presets blog`) returned **9 distinct** faderandknob blog URLs (up from 7), now **including elevation-worship-guitar-tone-helix** — corroborating the site: read from a second query shape.
- **5 worship posts indexed? 2 of 5 — FIRST MOVEMENT IN EIGHT WEEKS.**
  - hillsong-guitar-tone-helix — ✅ INDEXED (8th week confirmed)
  - **elevation-worship-guitar-tone-helix — ✅ NEWLY INDEXED** (confirmed by two independent query shapes)
  - lincoln-brewster-tone-helix — not visible
  - bethel-music-guitar-tone-helix — not visible
  - phil-wickham-guitar-tone-helix — not visible
- **⚠️ PARTIAL ALERT:** 3 of 5 worship posts still absent **93 days** after the 2026-06-26 submission. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs) — indexing/authority lag, not a technical fault. Downgraded from 4/5 stuck, but three posts are now over three months out.
- **⚠️ Bing AI citation log: BLOCKED — fourth consecutive miss. The browser-selection blocker has REGRESSED.** Last week's entry recorded this condition as *resolved* (a single extension connected, selecting cleanly). It is **back**: two Chrome extensions are connected with none selected — **Browser 1 `fe28ff9d-d492-48d5-b5be-06bb72bcb745`** (a **new** device id, not the `c0f2daee-…` seen on 08-19/08-24) and **Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`** (the one that worked on 09-05). The tool layer mandates an interactive pick before any browser action, which an unattended run cannot make and must not make unilaterally. Dashboard never reached, so **nothing can be said about the Microsoft session this week** — though 09-05 established it was expired, so a browser pick alone likely will not be enough. See `docs/BING_AI_CITATIONS.md` run log (2026-09-27). **Four missed weeks now sit in the series.**
- **Verdict:** The best Google-side week since this log began. Site up, sitemap +44, no HTTP faults, the `site:` operator artifact resolved after six weeks, Hillsong holding an 8th week, and **Elevation Worship newly indexed** — the first coverage movement since 06-26. Still escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the **3** remaining stuck URLs (lincoln-brewster, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**. The evidence is now sharper than a volume argument: **+81 URLs since 08-19** moved worship coverage by exactly one post, and the one that moved is Elevation — the query where competitors' grip is thinnest. Meanwhile phil-wickham faces Worship Tutorials, Joey Cobra and Equipboard all ranking song-level Phil Wickham patches, and bethel-music faces four competing Bethel Helix products; those two are the most link-contested of the five and remain the most stuck. Coverage is tracking competitive link strength, post by post. Build links to the three stuck URLs; do not publish a fourth worship post.

---

## 2026-10-10

- **Cadence note:** previous entry was **2026-09-27** — this run lands **13 days** later, not 7. Deltas below span that 13-day window, so do not read them as weekly rates.
- **Sitemap:** reachable (`200`), **989** `<loc>` URLs (**+38** vs 951 on 09-27 — growth, no drop; ~+20/wk equivalent). Per the standing lesson, re-fetched before recording: first fetch returned **970**, then **five consecutive re-fetches** (2s apart) all returned **989**. A **19-URL** first-fetch gap — in line with the widened gap flagged on 09-27 (29 URLs) and nothing like the 1–2 of 08-24/09-05. The "first fetch runs 1–2 behind" signature is now firmly dead; treat a single sitemap read as unreliable and keep re-fetching. Recording **989** as settled. Milestone note: the site crosses **~1,000 URLs** within the next run or two.
- **HTTP status:** homepage `200`, sitemap `200`. All 5 worship posts checked directly — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in sitemap (1 `<loc>` each). No non-200 anywhere.
- **🟡 `site:` operator: partially recovered, and the recovery is query-dependent and unstable.** 09-27 recorded the 6-week quirk as cleared on qualified queries while the bare form stayed Wikipedia-only. This week the pattern **inverted in part**: the bare `site:faderandknob.com` **now returns faderandknob URLs** (two `/browse` facet pages) for the first time since 07-22, but `site:faderandknob.com lincoln brewster` — which returned **5** faderandknob URLs on 09-27 — returned **zero** this week. Same site, same operator, opposite directions in two weeks. Read `site:` results as noisy evidence only, and always corroborate with a second query shape (as done below).
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — ✅ returns faderandknob URLs for the first time in 11 weeks: `/browse?era=2000&genre=blues-rock&platform=quad_cortex` and `/browse?genre=blues-rock&platform=quad_cortex`. Both are **facet/browse pages, not blog posts** — worth noting that the bare operator surfaces parameterised browse URLs ahead of content.
  - `site:faderandknob.com lincoln brewster` — **zero** faderandknob URLs (regression from 5 last run). Only external Lincoln/Brewster/Wikipedia noise.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` with full title + description. **Ninth consecutive week indexed.**
  - `site:faderandknob.com bethel` — faderandknob URLs returned (**`/artist/david-hislop`** and **`/news/strymon-timeline-mx-dual-engine-delay`**) but **not** bethel-music-guitar-tone-helix. Identical to 09-27: Bethel *content* is indexed, the target post is not.
  - `site:faderandknob.com elevation worship phil wickham` — ✅ **`https://faderandknob.com/blog/elevation-worship-guitar-tone-helix`** with full title. Also surfaced `/blog/hx-stomp-vs-helix-lt-worship` (again) and `/blog/boss-katana-settings-guide-every-genre` (new). **No phil-wickham post.**
  - Targeted `faderandknob lincoln brewster guitar tone helix` — **zero** faderandknob URLs. Entire result set is competitors selling Brewster Helix patches: Worship Tutorials ("Linc Brew (Plexi)" Artist Series), **Joey Cobra ×2** ("The Gold Strat Guy", "Ultimate Helix Patch Bundle // 7 Patches"), The Patch District, Equipboard, Line 6 CustomTone ("Brewsters Toybox"). Corroborates non-indexing from a second query shape.
  - Targeted `faderandknob phil wickham bethel music guitar tone helix` — only `/artist/david-hislop` from faderandknob. Competitors hold the rest: Worship Tutorials ×5 (House of the Lord, Great Things, This Is Amazing Grace, Bethel Artist Series, Egypt), Alex Strabala's "Helix Bethel 3.0". Corroborates both remaining stuck posts.
  - Control query (`faderandknob.com helix presets blog`) returned **9 distinct** faderandknob blog URLs, **including both hillsong-guitar-tone-helix and elevation-worship-guitar-tone-helix** — same count as 09-27 and the same two worship posts. Second-shape confirmation of the 2/5 read.
- **5 worship posts indexed? 2 of 5 — holding, no new movement.**
  - hillsong-guitar-tone-helix — ✅ INDEXED (9th week confirmed)
  - elevation-worship-guitar-tone-helix — ✅ INDEXED (**2nd week confirmed**, via two independent query shapes — last run's first sighting was not a fluke)
  - lincoln-brewster-tone-helix — not visible (two query shapes)
  - bethel-music-guitar-tone-helix — not visible (two query shapes)
  - phil-wickham-guitar-tone-helix — not visible (two query shapes)
- **⚠️ PARTIAL ALERT:** 3 of 5 worship posts still absent **106 days** after the 2026-06-26 submission. Pages remain technically clean (all `200`, all in sitemap, canonical `/blog/` URLs) — indexing/authority lag, not a technical fault. All three are now over three months out.
- **⚠️ Bing AI citation log: BLOCKED — fifth consecutive miss. Browser-selection blocker persists, and the device set shifted again.** Two Chrome extensions connected with none selected: **Browser 1 `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`** and **Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`**. Note Browser 1 has **reverted to the `c0f2daee-…` id** seen on 08-19/08-24 — last run it was `fe28ff9d-…`. The id churn across runs suggests extension re-registration, not a stable two-device setup. The tool layer mandates an interactive pick before any browser action, which an unattended run cannot make and must not make unilaterally. Dashboard never reached, so nothing can be said about the Microsoft session this week — though 09-05 established it was expired, so a browser pick alone likely will not suffice. See `docs/BING_AI_CITATIONS.md` run log (2026-10-10). **Five missed weeks now sit in the series — the citation log has not been fed since 08-12.**
- **Verdict:** Google side is healthy and quiet. Site up, sitemap +38 (989, nearing 1,000), no HTTP faults, Hillsong at 9 weeks, Elevation confirmed at 2 weeks — the 09-27 movement held. No new coverage movement, and the three stuck posts are unchanged at 106 days. Escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and to request indexing on the **3** remaining stuck URLs (lincoln-brewster, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**. This week sharpened the link argument rather than merely repeating it: the targeted queries for all three stuck posts returned **page-one result sets composed almost entirely of competitors selling the exact same artist patches** — Joey Cobra and Worship Tutorials hold Brewster, Worship Tutorials and Alex Strabala hold Bethel, Worship Tutorials holds three separate Phil Wickham song patches. Meanwhile **+119 URLs since 08-19** has moved coverage by exactly one post. Volume is not the variable; competitive link strength is, post by post. Build links to the three stuck URLs; do not publish a fourth worship post.

---

## 2026-10-11

- **Cadence note:** previous entry was **2026-10-10**, committed `e92da05` at **15:36 PDT yesterday** — this run lands roughly **13 hours** later, not 7 days. Every delta below spans that overnight window and carries **no weekly signal whatsoever**; the Google-side reads are expected to be near-identical to yesterday's and are recorded for continuity, not as a week-over-week measurement. The scheduled cadence has now fired at 22 days, 13 days, and 13 hours — **the schedule itself is drifting and worth a look.**
- **Sitemap:** reachable (`200`), **994** `<loc>` URLs (**+5** vs 989 yesterday — growth, no drop). Per the standing lesson, re-fetched before recording: first fetch returned **992**, then **nine** subsequent fetches (two batches, 2–3s apart) all returned **994**. A **2-URL** first-fetch gap — back to the narrow 1–2 signature of 08-24/09-05, after the 29-URL (09-27) and 19-URL (10-10) excursions. So the gap is **variable, not monotonically widening**; the operative lesson is unchanged either way — never trust a single sitemap read. Recording **994**. The site is now **6 URLs from 1,000**.
- **🔴 TRANSIENT SITE-WIDE 404 BURST — new, and the most important finding in this run.** Mid-run, immediately after seven rapid sitemap fetches, **`/sitemap.xml` and all five worship posts simultaneously returned `404`** while the homepage held `200`. This was **not** a false reading and not rate limiting:
  - Verified with full response headers: `HTTP/2 404`, `content-type: text/html`, **`x-nextjs-cache: HIT`**, **`x-nextjs-prerender: 1`**, `via: 1.1 Caddy`, `server: cloudflare`, `cf-cache-status: DYNAMIC`.
  - **No `429`, no `Retry-After`, no Cloudflare challenge page** — the origin was serving a genuine *prerendered Next.js 404* for routes that had returned `200` minutes earlier.
  - Blast radius checked across 10 routes during the window; it **resolved on its own within ~60 seconds** with no intervention. Re-checks: `/` `200`, `/blog` `200`, `/sitemap.xml` `200`, `/robots.txt` `200`, `/blog/hillsong-guitar-tone-helix` `200`, `/artist/david-hislop` `200`, `/news/strymon-timeline-mx-dual-engine-delay` `200`, `/browse` `200`, `/recipes` `308` (expected redirect), `/experiment` `200`.
  - **CAUSE RESOLVED — it was NOT a deploy.** The deploy hypothesis recorded here initially is **disproven**; the real cause is concurrent ops work on the droplet. Evidence gathered immediately after:
    - **No build was running.** The previous `Build & deploy image` run finished **2026-10-10T23:41:24Z — 29 hours before** the burst; the next started **04:37:19Z, 3m34s after** it (and was this run's own docs push). GitHub Actions had **zero** activity at 04:33:45Z.
    - **No OOM.** Zero `Out of memory` / `Killed process` entries in the kernel log since 10-11, despite the box being tight (961 MB RAM, 426 MB swap in use).
    - **Not load-related.** Deliberately re-ran the exact trigger — 8 back-to-back sitemap fetches with no delay — and got **8/8 `200`**, with the sitemap, two blog posts and the homepage all `200` straight after. Rate limiting is ruled out.
    - **🎯 An SSH session landed at `04:33:40Z` — five seconds before the 404s**, from `75.253.148.180` (Daniel's own IP, not a GitHub runner). It sits inside a sustained cluster of root SSH sessions: **04:19:58 → 04:24:56**, then **04:33:40, 04:34:12, 04:34:15**, continuing past the burst.
    - **Corroborating filesystem trace:** `/opt` mtime **04:34:49**, and two new scripts — `/opt/enable-offsite.sh` and `/opt/push-offsite.sh` — written at **04:38:19** and **04:38:21**. That is off-site-backup work, matching the "An off-box copy is still missing" TODO in `/opt/persona-panel/backup.sh`.
    - **Conclusion:** a **concurrent local session was doing ops work on the droplet** and touched the faderandknob stack at 04:33:40, briefly knocking out route resolution while the already-cached homepage kept serving. The exact command is not recoverable (`/root/.bash_history` is empty), so the *mechanism* stays inferred — but the *trigger* is established by a 5-second correlation plus the filesystem trail.
  - **Standing lesson:** this log's own probes are **not** isolated from other automation. Same hazard class as the weekly-audit concurrent-commit problem — a second agent working the same infrastructure can make the site look broken to this task. **Before recording a site fault, check `journalctl -u ssh` and GitHub Actions for concurrent activity.** This run would have filed a false "site-wide 404 outage" without that check.
  - **Why it matters:** if Googlebot or Bingbot crawls during one of these windows it sees `404` on the sitemap and on blog posts, which is exactly the wrong signal for three posts already stuck on authority. This is **not** currently an alertable outage — it self-healed and the site is fully `200` — but it is the first time this log has caught the site serving 404s on live content, and a recurring version of it would be a genuine indexing hazard. **Worth confirming against the deploy log** whether a build ran at ~04:30 UTC 2026-10-12.
- **HTTP status (settled, post-burst):** homepage `200`, sitemap `200`. All 5 worship posts re-checked individually with 2s spacing — lincoln-brewster `200`, hillsong `200`, elevation-worship `200`, bethel-music `200`, phil-wickham `200`. All 5 present in the sitemap (exactly 1 `<loc>` each, 5,967-line sitemap). No non-200 anywhere in the settled state.
- **🟡 `site:` operator: stable vs yesterday — the inversion held.** Yesterday recorded the bare form newly working while `lincoln brewster` regressed to zero. Both reproduced identically today, which (over a 13-hour interval) tells us the 10-10 reads were **not** single-sample noise, though it says nothing about week-scale stability.
- **`site:` spot-checks (WebSearch):**
  - `site:faderandknob.com` — ✅ the same **two `/browse` facet pages** (`?era=2000&genre=blues-rock&platform=quad_cortex`, `?genre=blues-rock&platform=quad_cortex`). Byte-identical to yesterday. The bare operator still surfaces parameterised browse URLs ahead of all content.
  - `site:faderandknob.com lincoln brewster` — **zero** faderandknob URLs. Reproduces yesterday's regression from 5 (09-27) → 0.
  - `site:faderandknob.com hillsong` — ✅ `https://faderandknob.com/blog/hillsong-guitar-tone-helix` with full title + description. **Tenth consecutive confirmation.**
  - `site:faderandknob.com bethel` — `/artist/david-hislop` and `/news/strymon-timeline-mx-dual-engine-delay` returned, **not** bethel-music-guitar-tone-helix. Third run identical: Bethel *content* is indexed, the target post is not.
  - `site:faderandknob.com elevation worship phil wickham` — ✅ `https://faderandknob.com/blog/elevation-worship-guitar-tone-helix` with full title. Also `/blog/hx-stomp-vs-helix-lt-worship` (3rd run running) and **`/blog/worship-guitar-tone-boss-katana` — new to this log**, a worship-specific post (yesterday's new arrival was the genre-wide `boss-katana-settings-guide-every-genre`). **No phil-wickham post.**
  - Targeted `faderandknob lincoln brewster bethel music phil wickham guitar tone helix` — **only** `/blog/elevation-worship-guitar-tone-helix` from faderandknob. The rest is the familiar competitor wall: Worship Tutorials ("Linc Brew (Plexi)" Artist Series, "This Is Amazing Grace" Phil Wickham Helix/Fractal presets), **Joey Cobra** ("The Gold Strat Guy" Helix patch), Equipboard, Sweetwater, The Tone Rooms. Second-shape corroboration that all **three** stuck posts remain unindexed.
  - Control query (`faderandknob.com helix presets blog`) returned **9 distinct** faderandknob blog URLs including **both** hillsong and elevation-worship — same count and same two worship posts as 09-27 and 10-10. Third consecutive run at 9/9.
- **5 worship posts indexed? 2 of 5 — holding, no movement (expected over 13 hours).**
  - hillsong-guitar-tone-helix — ✅ INDEXED (**10th** confirmation)
  - elevation-worship-guitar-tone-helix — ✅ INDEXED (**3rd** confirmation, two independent query shapes)
  - lincoln-brewster-tone-helix — not visible (two query shapes)
  - bethel-music-guitar-tone-helix — not visible (two query shapes)
  - phil-wickham-guitar-tone-helix — not visible (two query shapes)
- **⚠️ PARTIAL ALERT:** 3 of 5 worship posts still absent **107 days** after the 2026-06-26 submission. Pages are technically clean in the settled state (all `200`, all in sitemap, canonical `/blog/` URLs) — indexing/authority lag, not a technical fault. See the 404-burst note above for the one technical caveat now on the board.
- **⚠️ Bing AI citation log: BLOCKED — sixth consecutive miss. Browser-selection blocker, identical device pair to yesterday.** Two Chrome extensions connected with none selected: **Browser 1 `c0f2daee-8c65-4ddb-b9ef-ca4354dfd446`** and **Browser 2 `b89db820-bd49-45cb-b08c-b65da091b763`** — the **same pair, same slots** as 10-10, so no id churn across this short interval. The tool layer mandates an interactive pick before any browser action, which an unattended run cannot make and must not make unilaterally. Dashboard never reached; nothing can be said about the Microsoft session, though 09-05 established it was expired. See `docs/BING_AI_CITATIONS.md` run log (2026-10-11). **Six missed weeks now sit in the series — the citation log has not been fed since 08-12, and the last captured data window ended 2026-08-10, 62 days ago.**
- **Verdict:** Google side healthy in the settled state — sitemap 994 (+5, 6 short of 1,000), no non-200 at rest, Hillsong at 10 confirmations, Elevation at 3. **But this run surfaced something no prior run has: a real, header-verified, self-healing site-wide 404 burst** covering the sitemap and all five worship posts while the homepage stayed up. It resolved in under a minute and is almost certainly a mid-run deploy, so it is not an outage to page anyone about — it is a **crawl hazard to confirm and, if it recurs, to fix**, because a bot sampling that window reads `404` on the sitemap and on the exact posts already struggling to index. **Resolved same-session: it was not a deploy** — no build was running, no OOM, not reproducible under load; an SSH session landed 5 seconds prior and a concurrent agent was installing off-site backup scripts on the box. No site fix is warranted. The real lesson is procedural: **check for concurrent SSH/Actions activity before filing a site fault**, because this task's probes share infrastructure with other automation. On coverage: escalate to interactive `/index-health` for the full GSC index-coverage + sitemap-freshness audit and request indexing on the **3** stuck URLs (lincoln-brewster, bethel-music, phil-wickham). Do **not** respond by publishing more pages — coverage here is gated by **authority (0 backlinks)**, and this run adds one more brick: **+124 URLs since 08-19** has moved worship coverage by exactly one post, while the targeted query for all three stuck posts returned a page-one set composed almost entirely of competitors selling the identical artist patches (Worship Tutorials and Joey Cobra on Brewster, Worship Tutorials on Phil Wickham, Worship Tutorials and Alex Strabala on Bethel). Build links to the three stuck URLs; do not publish a fourth worship post. **Finally: this run should not have fired 13 hours after the last one — check the task schedule.**

---

## 2026-10-12

- **Cadence note:** previous entry was 2026-10-11, about a day ago. Sitemap and HTTP deltas cover one day and carry no weekly signal.
- **Sitemap:** reachable (`200`), **994** `<loc>` URLs (**±0** vs 994 yesterday). No drop. All 5 worship posts are present in the sitemap.
- **HTTP:** homepage `200`, `/blog/lincoln-brewster-tone-helix` `200`. No non-200s, and no repeat of yesterday's 404 burst.
- **`site:` spot-checks: INCONCLUSIVE because the search backend failed the control.** Every query returned **zero** faderandknob URLs, including:
  - the bare `site:faderandknob.com`, which returned fader-knob retailers;
  - `hillsong`, which had 10 consecutive confirmations;
  - `elevation worship phil wickham`;
  - the control query `faderandknob.com helix presets blog`, which returned 9/9 F&K URLs on each of the last 3 runs.

  The control failing tells me this run's WebSearch backend was not honouring the domain at all. It is **not** evidence of de-indexing. A site-wide drop from 9/9 to 0/9 in one day, with sitemap and HTTP clean, isn't plausible. **Carry forward the last good read:**
  - hillsong-guitar-tone-helix: ✅ indexed (10 confirmations through 10-11)
  - elevation-worship-guitar-tone-helix: ✅ indexed (3 confirmations through 10-11)
  - lincoln-brewster, bethel-music, phil-wickham: not visible as of 10-11
- **⚠️ PARTIAL ALERT (carried):** 3 of 5 worship posts are unindexed as of the last valid read, **108 days** after the 2026-06-26 submission.
- **Bing AI citation log: ✅ CAPTURED.** This is the first successful read since 08-12; the dashboard loaded with a live Microsoft session. Window 07-23 → 10-10: **36.4K** citations, **361** distinct pages, citations about **2.8×** since early August. Details are in `docs/BING_AI_CITATIONS.md` (run log, 2026-10-12).
- **Verdict:** site healthy: sitemap steady at 994, no non-200s. Google coverage could not be re-measured this run because the search tool failed its own control. Don't read the zeros as de-indexing. If the next run's control query also returns 0, check in GSC directly via interactive `/index-health`. Coverage remedy is unchanged: request indexing on the 3 stuck URLs and build links to them. Coverage is gated by **authority (0 backlinks)**, not page count, so don't publish more pages.

---

## 2026-10-19

- **Sitemap:** reachable (`200`), **1,011** `<loc>` URLs, **+17** vs 994 on 10-12. This is the first reading over 1,000. No drop. All 5 worship posts are in the sitemap.
- **HTTP:** homepage `200`, `/blog/lincoln-brewster-tone-helix` `200`. No non-200s.
- **`site:` spot-checks: the standard WebSearch backend failed the control for the 2nd run in a row.** The bare `site:faderandknob.com` returned only fader-knob retailers (Canford, Behringer and others). `lincoln brewster`, `hillsong` and `bethel` returned zero F&K URLs. The control query `faderandknob.com helix presets blog` also returned 0, where it had been 9/9 through 10-11. **Re-ran in `extended` mode, which honoured the domain**. These are the valid reads:
  - `site:faderandknob.com hillsong guitar tone helix`: ✅ `/blog/hillsong-guitar-tone-helix`, plus what-a-beautiful-name, way-maker and the homepage.
  - `site:faderandknob.com elevation worship phil wickham guitar tone helix`: ✅ `/blog/elevation-worship-guitar-tone-helix`, plus hillsong and worship-guitar-tone-boss-katana. **No phil-wickham post.**
  - `site:faderandknob.com bethel music guitar tone helix`: `/artist/david-hislop`, the strymon-timeline-mx news post, elevation and hillsong. **Not bethel-music-guitar-tone-helix**, which is the 4th identical read.
  - `site:faderandknob.com lincoln brewster tone helix`: worship and browse pages, **no lincoln-brewster post**.
- **5 worship posts indexed? 2 of 5, unchanged.**
  - hillsong-guitar-tone-helix: ✅ indexed (11th confirmation)
  - elevation-worship-guitar-tone-helix: ✅ indexed (4th confirmation)
  - lincoln-brewster-tone-helix, bethel-music-guitar-tone-helix, phil-wickham-guitar-tone-helix: not visible
- **⚠️ PARTIAL ALERT:** 3 of 5 worship posts are still absent **115 days** after the 2026-06-26 submission.
- **Method note:** for `site:` checks, use `extended` mode from the start. `standard` mode has now ignored the domain operator on two consecutive runs, so its zeros carry no signal.
- **Bing AI citation log: ✅ captured** on cadence, the second read in a row. Window 07-23 → 10-17: 41.6K citations, 390 pages, +27% week over week. Worship pages are cited (10 pages, 414 citations), but of the 5 artist posts only Elevation appears (7). Details are in `docs/BING_AI_CITATIONS.md` (2026-10-19).
- **Verdict:** site healthy: sitemap 1,011 (+17), all `200`. Worship coverage is stuck at 2/5 for a third straight valid read. Escalate to interactive `/index-health` and request indexing on lincoln-brewster, bethel-music and phil-wickham. Coverage is gated by **authority (0 backlinks)**, not page count, so don't publish more pages. The 3 stuck URLs need links.

---

## 2026-10-29

- **Cadence note:** no 10-26 entry exists. This read is 10 days after 10-19, so the deltas cover about 1.5 weeks.
- **Sitemap:** reachable (`200`), **1,023** `<loc>` URLs, **+12** vs 1,011 on 10-19. No drop. All 5 worship posts are in the sitemap.
- **HTTP:** homepage `200`, `/blog/lincoln-brewster-tone-helix` `200`. No non-200s.
- **`site:` spot-checks** were run in `extended` mode from the start, per the 10-19 method note. The domain operator was honoured: every targeted query returned F&K URLs. The bare `site:faderandknob.com` still comes back mostly as fader-themed Wikipedia noise, with only 2 F&K URLs.
  - `lincoln brewster tone helix`: way-maker, hillsong, the complete Helix guide and browse pages. **No lincoln-brewster post.**
  - `hillsong guitar tone helix`: ✅ `/blog/hillsong-guitar-tone-helix` was the #1 result (12th confirmation).
  - `bethel music guitar tone helix`: `/artist/david-hislop`, elevation, the strymon-timeline-mx news post, and helix-worship-snapshots. **Not bethel-music-guitar-tone-helix** (5th identical read).
  - `elevation worship phil wickham guitar tone helix`: ✅ `/blog/elevation-worship-guitar-tone-helix` was #1 (5th confirmation). **No phil-wickham post.**
- **5 worship posts indexed? 2 of 5, unchanged** for a 4th straight valid read.
  - Indexed: hillsong and elevation.
  - Not indexed: lincoln-brewster, bethel-music and phil-wickham.
- **⚠️ PARTIAL ALERT:** 3 of 5 worship posts are still absent **125 days** after the 2026-06-26 submission.
- **Bing AI citation log: ⚠️ BLOCKED.** Chrome had no Microsoft session, and the dashboard redirected to the signed-out `/webmasters/about` landing page. The week was not captured. The last read was 10-19.
- **Verdict:** the site is healthy: sitemap at 1,023 (+12) and every check returned `200`. Worship coverage is flat at 2/5. The 3 stuck URLs have been missing for 4 reads, so a passive weekly check won't move them. Run interactive `/index-health`, then request indexing in GSC for lincoln-brewster, bethel-music and phil-wickham. Coverage is gated by **authority (0 backlinks)**, not page count, so don't publish more pages. The 3 stuck URLs need inbound links.
