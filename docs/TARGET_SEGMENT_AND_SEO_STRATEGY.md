# Target Segment & SEO Strategy — Who We Should Actually Rank For

**Created:** 2026-06-15
**Inputs:** GSC Performance + Crawl Stats (to 2026-06-15), GA4 (Mar–Jun 2026), and our own research corpus (`docs/research/WORSHIP_MARKET_DEEP_DIVE.md`, `SET_PATCH_STRATEGY.md`, `WORSHIP_GUITARIST_RIGS.md`, `LINCOLN_BREWSTER_DEEP_DIVE.md`, `COMPETITIVE_TEARDOWN.md`, `SEO_CONTENT_GAPS.md`).

## The problem this fixes
Our current Google traction is **accidental, and in the wrong audience.** Top query: *"best frfr for quad cortex."* Top page: the FRFR buying guide. Quad Cortex is a premium/pro modeler — **10–15% of the worship market and not our target.** If we optimize toward what's currently ranking, we optimize ourselves into an audience that doesn't convert to our product (worship Set Packs, Helix presets). This doc resets targeting to who we should *own*.

## Who we should be shooting for (the ICP)

**Primary: the worship rhythm/lead guitarist on a Line 6 Helix or HX Stomp.**
Grounded in our own research, not a guess:
- **Market size:** ~1M musicians play weekly at church; ~$600M/yr worship gear spend; one-third of all instruments sold go to worship. Largest single addressable segment for preset products (~$7.7M addressable).
- **Platform fit:** the Line 6 ecosystem (Helix Floor/LT + HX Stomp + POD Go) is **55–65% of the worship modeler market.** This is squarely our platform (every recipe already ships a Helix preset).
- **Purchase trigger:** the weekly setlist. Guitarist gets the songs Tuesday, needs tones by Sunday. High-intent, recurring, seasonal (Easter #1, Christmas #2, September new-volunteer wave).
- **Product fit:** the Worship Set Pack (8-snapshot preset + Setlist Mapper) is built for exactly this person.

**Secondary: the Boss Katana intermediate player.**
A best-selling modeling amp with *no* premium content ecosystem — Worship Tutorials and Tone Junkie both ignore it. "Boss katana settings" is 10–18K/mo. Underserved, winnable, distinct from the worship play. Note: Katana has no true snapshot system, so Set-Pack content needs a different structure (tone-setting banks).

**Explicitly NOT a priority: Quad Cortex.** Premium, niche in worship, already saturated by Tone Junkie/QC Cloud. We will keep QC *translations* on cross-platform recipes (cheap, completes the "every platform" promise) but spend **zero** net-new SEO/content effort chasing QC head terms. Several older docs (`SEO_CONTENT_GAPS.md`, the content calendar) still treat QC as Tier-1 — **those predate this decision and are superseded by this file.**

## The gap: where we rank vs. where we should

| | Currently ranking (Google) | Where we *should* rank |
|---|---|---|
| Audience | QC/metal/classic-rock gearheads | Worship guitarists on Helix/HX Stomp |
| Top page | FRFR buying guide (QC-flavored) | "[Worship song] on Helix", "Helix worship presets" |
| Winning queries | "best frfr for quad cortex", "silver jubilee vs jcm800" | "worship guitar tone helix", "hillsong/elevation tone", "[CCLI song] helix patch" |
| Coverage | Lincoln Brewster: **0 posts**. Phil Wickham: **0**. Chris Tomlin: **0**. CCLI Top 25: barely touched | The Top 30 worship songs = ~80% of what teams play |

We have ~321 posts and only a handful are worship-*targeted*; QC appears in 8 post titles vs. Helix in 15 — QC is *over*-represented relative to its strategic value. The strategic cluster (worship songs/artists on Helix) is the thing that's missing.

## What this means for the accidental winners
Don't kill them — **redirect their authority.** The FRFR and Fender Deluxe Reverb pages have real Google trust (thousands of impressions, position ~9–12). They're top-of-funnel for *all* modeler players, including worship. Action (done 2026-06-15): added contextual internal links from both into the worship cluster so their authority flows to the pages we actually want to rank. Keep them; just point them home.

## The strategy (priority order)

1. **Build the worship-song cluster on Helix.** The CCLI Top 25 → one "[Song] guitar tone on Helix" recipe each, plus "how to sound like [worship artist] on Helix" (Hillsong/Nigel Hendroff, Elevation, Bethel, Phil Wickham, Lincoln Brewster for rock-worship). Low competition, high commercial intent, feeds Set Packs directly. **Full spec: `docs/WORSHIP_HELIX_CONTENT_CLUSTER.md`.**
2. **Ship the two missing head-term pillars:** "The Complete Guide to Line 6 Helix Tone" (8–15K/mo cluster) and a strong "Worship Guitar Tone Guide (Helix/HX Stomp)" hub that links the song cluster together.
3. **Own Boss Katana (secondary).** "Boss Katana Settings Guide" + genre tone banks. No competitor holds this.
4. **Fix on-page craft on the worship cluster:** keyword-modifier titles ("best/complete/guide"), FAQ schema, first-hand worship claims (E-E-A-T: "tested at Sunday service"), preset CTA on every post (only 3 of 12 audited posts had one).
5. **Tie content to the product:** every worship recipe links to the relevant Set Pack; lean into the setlist trigger and seasonal peaks (Easter sprint = 6 weeks out).

## What NOT to do (from our own AEO rules + this analysis)
- No more net-new QC-targeted content.
- No "Best X of 2026" listicles, history-first posts, or single-platform-only thin pages.
- Don't chase the FRFR/metal/classic-rock queries with new content just because they rank — they're off-ICP.

## Done in this pass (2026-06-15)
- **Killed keyword cannibalization:** two duplicate "Modern Worship Guitar Tone on Helix" posts were competing for the same query (likely why neither ranked). Consolidated to the stronger one (`/blog/worship-guitar-tone-helix`, exact Helix model names); 301-redirected the duplicate; repointed all inbound links.
- **Authority trust-transfer:** linked the FRFR and Deluxe Reverb winners into the worship cluster.
- Produced the worship cluster build spec (next doc).

## Measure (re-pull GSC in ~4 weeks)
- Impressions/clicks growing on *worship* + *helix* queries (not just FRFR).
- The worship cluster pages entering the top-20-by-impressions list.
- Average position on "worship guitar tone helix" and CCLI-song queries improving toward top 5.
