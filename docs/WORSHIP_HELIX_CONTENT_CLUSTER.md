# Worship + Helix Content Cluster — Build Spec

**Created:** 2026-06-15
**Parent strategy:** `docs/TARGET_SEGMENT_AND_SEO_STRATEGY.md`
**Persona:** Nathan Cross owns this cluster (worship). Velocity cap still applies (3/persona/week) — see `scripts/persona-velocity.ts`. Route overflow to fk-staff.
**Standard:** every post follows `docs/RECIPE_STANDARD.md` + AEO rules (answer-first, question H2s, settings table, 3–5 Q FAQ with FAQ JSON-LD, exact Helix model names, preset CTA, one first-hand worship claim for E-E-A-T).

## Why this cluster, in one line
The CCLI Top 30 songs ≈ 80% of what worship teams play any given Sunday. We have near-zero coverage of them on Helix. Low competition, high commercial intent, direct feeder to the Worship Set Pack. This is the highest-ROI content we can produce.

## Shared tone vocabulary (use exact Helix model names)
- **Base amps:** Essex A30 TB (Vox AC30 Top Boost — *the* worship amp), Essex A15, Matchless DC30 ("Matchstick"), Fender Deluxe Reverb ("US Deluxe", warmer alt). Rock-worship: Plexi/Brit variants.
- **Always-on drive:** Minotaur (Klon) low gain; stack a Tube Screamer for DRIVE+.
- **Time/space:** Transistor Tape (1/4 note), Vintage Digital (dotted 1/8), Plate + Glitz/Searchlights for swells/shimmer.
- **Delay math:** dotted-eighth ms = (60000 / BPM) × 0.75. 120 BPM ≈ 375 ms.
- **8-snapshot layout (the standard):** Clean · Drive · Drive+ · Lead · Clean Ambi · Ambi Drive · Rock Rhythm · Swells.
- **The non-negotiable:** dynamics — every preset must clean up when guitar volume rolls back.

## Tier 1 — Artist "how to sound like" hubs (build first; each anchors a song sub-cluster)
| Title | Target keyword | Tone anchor |
|---|---|---|
| How to Get the Hillsong Worship Guitar Tone on Helix (Nigel Hendroff) | "hillsong guitar tone helix" | AC30 + Minotaur + dotted-1/8 + huge plate/shimmer |
| How to Get the Elevation Worship Guitar Tone on Helix | "elevation worship guitar tone" | AC30 edge-of-breakup, layered ambient |
| How to Get the Bethel Music Guitar Tone on Helix | "bethel guitar tone helix" | ambient swells, pad-forward |
| How to Get the Phil Wickham Guitar Tone on Helix | "phil wickham guitar tone" | bright clean + anthemic lead |
| How to Get Lincoln Brewster's Lead Tone on Helix | "lincoln brewster tone helix" | **Plexi Variac** model, single-coil voiced, mid-boost lead, controlled (not ambient) delay — rock-worship. We have a full research doc: `docs/research/LINCOLN_BREWSTER_DEEP_DIVE.md`. **Brewster = 0 posts today; clearest open lane.** |

## Tier 2 — CCLI Top 25 song tone recipes ("[Song] Guitar Tone on Helix")
Build in CCLI rank order. Each: target "[song] guitar tone" / "[song] helix patch". Map to the artist hub above + the relevant Set Pack.

1. Holy Forever — Chris Tomlin
2. Goodness of God — Bethel
3. Praise — Elevation Worship
4. Gratitude — Brandon Lake
5. Trust in God — Elevation Worship
6. Firm Foundation (He Won't) — Cody Carnes
7. Great Are You Lord — All Sons & Daughters
8. Build My Life — Pat Barrett / Housefires
9. Way Maker — Leeland / Sinach
10. What a Beautiful Name — Hillsong Worship
11. Blessed Be Your Name — Matt Redman
12. How Great Is Our God — Chris Tomlin
13. 10,000 Reasons — Matt Redman
14. King of Kings — Hillsong Worship
15. Reckless Love — Cory Asbury
16. Living Hope — Phil Wickham
17. Great Things — Phil Wickham
18. Who You Say I Am — Hillsong Worship
19. O Come to the Altar — Elevation Worship
20. Battle Belongs — Phil Wickham
21. This Is Amazing Grace — Phil Wickham
22. Oceans — Hillsong UNITED
23. Evidence — Josh Baldwin
24. Thank You Jesus for the Blood — Charity Gayle
25. Worthy of It All — David Brymer

> Content note: these are tone/gear/technique breakdowns (signal chain, settings, Helix blocks) — **not** lyric or chord/tab reproductions. Keep it about the sound, link to licensed chord sources (CCLI/PraiseCharts) rather than reproducing protected material.

## Tier 3 — Workflow/technique posts (high utility, snippet bait)
- 5 Snapshots That Cover Every Sunday Morning Sound (Helix) — "helix worship snapshots" (flagged highest-utility in the cluster)
- HX Stomp vs Helix LT for Worship: Which Should You Buy? — "hx stomp vs helix lt worship" (buying intent; we have a draft slug `hx-stomp-vs-helix-lt-worship` — verify/optimize)
- Worship Pedalboard / Signal Chain on Helix (live stereo routing) — "worship pedalboard helix"
- How to Calculate Delay Time by BPM (dotted-eighth) — snippet target
- Volume Swell Technique: Fixing the Attack Timing — "guitar volume swell technique"

## Pillars to ship alongside (head terms)
- **The Complete Guide to Line 6 Helix Tone (2026)** — 8–15K/mo cluster anchor; internally links the whole worship cluster + the FRFR/Deluxe authority pages.
- **Worship Guitar Tone Guide (Helix/HX Stomp)** — hub that ItemLists the song + artist posts. (We have the `/guides/worship-guitar` pillar page — wire every new post into it.)

## Sequencing
1. **Now:** 5 Tier-1 artist hubs (esp. Lincoln Brewster — zero coverage, has research) + the two pillars.
2. **Weeks 2–6 (pre-Easter window is the seasonal peak):** CCLI songs 1–12.
3. **Ongoing:** remaining CCLI songs + Tier-3 workflow posts, 2–3/week through Nathan Cross.
4. As each ships: `npx tsx scripts/indexnow-submit.ts <url>` + GSC Request Indexing (these are new pages — discovery crawl is only 3%, so manual nudges matter here).

## Competitive note
Worship Tutorials (the incumbent) is Helix-strong but worship-only, platform-locked, and teaches no "how to build this tone." Our wedge: cross-platform recipes + the recipe/education format + Set Pack + (later) Planning Center setlist integration. Don't out-volume them; out-*teach* them and out-*breadth* them.
