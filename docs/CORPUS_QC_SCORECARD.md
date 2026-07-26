# Corpus QC Scorecard — measured, not estimated

**Date:** 2026-07-25
**Method:** direct queries against `src/lib/data/index.ts`, `data/helix-inventory.json`, `presets/`, and the running generator. Every number below was computed, not inferred from prose. Where an earlier research pass reported a different figure, the measured number here supersedes it.

## The scorecard

| Dimension | Measured | Verdict |
|---|---|---|
| Recipes | 195 | — |
| Recipes that generate a valid .hlx | **195 / 195** | ✅ generator works |
| Recipes with a shipped preset file | **50 / 195** | ❌ 145 unshipped ([why](PRESET_BACKFILL_BLOCKERS.md)) |
| Recipes that silently drop ≥1 block when generated | **54 (28%)** | ❌ 62 drops, 42 distinct unresolved names |
| Recipes citing ≥1 primary gear-journalism source | **138 (71%)** | ✅ better than expected |
| Recipes citing only aggregators / tabs / video / wiki | **57 (29%)** | ⚠️ soft underbelly |
| Recipes with an empty sources array | **0** | ✅ |
| Worship/CCM songs | **5 (2.6%)** | ❌ vs a worship-first strategy |
| Songs from the 2020s | **1** | ❌ |
| Distinct tuning strings | **31** (≈12 real tunings) | ⚠️ filtering impossible |
| `Mix:` values in integer style vs decimal style | **1,013 vs 585** | ⚠️ same block written both ways |
| In-recipe honesty annotations | **11** (CORRECTION 6, unverified 4, tribute-tier 1) | ⚠️ see note |
| Honesty annotations in blog content | **130** | ✅ but wrong surface |
| AI-referrer classification in codebase | **none** | ❌ AI-surface investment unmeasured |

## Genre and era distribution (195 songs)

Hard-rock 67 · metal 52 · alternative-metal 49 · rock 34 · nu-metal 30 · classic-rock 29 · blues-rock 24 · heavy-metal 22 · alternative 19 · alt-rock 14 · stoner-rock 12 · post-grunge 11 · prog-metal 10 · blues 8.

By decade: 1950s 2 · 1960s 5 · 1970s 33 · 1980s 31 · 1990s 44 · 2000s 61 · 2010s 18 · **2020s 1**.

The five worship songs are *What a Beautiful Name*, *Goodness of God*, *Living Hope*, *Way Maker*, *Great Are You Lord* — a well-chosen five, and the entirety of the coverage.

## Findings that change prior conclusions

**1. The honesty asset is real but on the wrong surface.** An earlier pass reported ~156 correction/caveat annotations as the corpus's most defensible editorial asset. Measured: **11 in the recipes, 130 in blog posts.** The correction discipline is genuine, but it lives where buyers aren't looking. Corrections should be surfaced *on recipe pages*, where a skeptical player is deciding whether to trust the chain.

**2. Attribution may over-claim on the songs that matter most.** Our corpus attributes *Goodness of God* to David Hislop. Bethel's *Victory* credits electric guitar as an unordered pool (Ed Cash, Scott Cash, Hislop, Jonathan Lee, Michael Pope); no per-song attribution is published. Hislop is plausibly the player — he is a credited *Victory* electric guitarist and the best-documented Bethel rig in existence — but "plausible from the pool" is not "documented," and the corpus elsewhere is scrupulous about exactly this distinction (it debunks the Strokes' "Crate VC30" myth by name).

Recommended: an `attribution_confidence` field — `documented` (named in credits or an interview) / `pool` (credited on the album, specific part unattributed) / `tribute` (reconstruction) — applied first to the five worship recipes, then corpus-wide. This is a natural sibling to the existing tribute-tier convention and it *strengthens* the differentiator rather than diluting it.

Also worth correcting proactively: *Reckless Love* is frequently assumed to be a Bethel-band record; it was cut in Franklin, TN with Nashville session players (Dwayne Larring, Gabe Scott). If we ever build it, build it right.

**3. Source quality is good but has a measurable tail.** 138 recipes cite Premier Guitar / Guitar World / MusicRadar / Sound on Sound / Mix / Vintage Guitar / Guitar Player. The other 57 rest on Equipboard (crowdsourced), Wikipedia, Songsterr tabs, or YouTube. Equipboard in particular should not be a sole source for a gear claim.

Recommended: `source-tier` audit rule (warn) — every recipe should cite ≥1 primary source; the 57 become a backlog.

**4. Tone-request fulfillment is manual, not broken.** Intake is live (`/request`, `/api/tone-requests`, quotas: free 2 / pass 10 / pro 20). There is no fulfillment cron — only `email-sequence` and `sunday-setlist`. Fulfillment happens by hand through the admin moderation dashboard, which has a Tone Requests tab and a "your tone request is ready" notification. The pricing page does **not** advertise tone requests, so nothing is being oversold. The automated pipeline is genuinely unbuilt, and that's the bottleneck — not a broken promise.

## Proposed audit rules (spec + audit ship together, per existing discipline)

| Rule | Severity | Checks |
|---|---|---|
| `helix-blocks-resolvable` | error | Every Helix `chain_blocks` entry resolves to a known model ID |
| `helix-amp-cab-present-after-generation` | error | Generated preset retains an amp and a cab block |
| `source-tier` | warn | ≥1 primary gear-journalism source |
| `attribution-confidence-declared` | warn → error | Specific-player claims carry a confidence level |
| `tuning-canonical` | warn | `tuning` matches the enum; caveats move to `tuning_note` |
| `mix-units-normalized` | warn | `Mix` uses one convention corpus-wide |

## Suggested order

1. Alias table + make dropped amp/cab a hard failure → then ship all 195 presets.
2. `attribution_confidence` on the five worship recipes (do this before building 50 more — set the convention first).
3. Tuning enum + Mix normalization (mechanical, scriptable).
4. Surface corrections on recipe pages.
5. Source-tier backlog: upgrade the 57.

Nothing here requires new research. It's all mechanical work against data we already have, and it makes every downstream product — fit reports, Set Builder, audio previews — rest on ground that holds.

---

## Addendum — chain-length distribution (measured after fit reports landed)

Helix chain lengths across the 195 recipes: **avg 6.8 blocks, median 7, max 10.**
Distribution: 6 blocks ×94 · 7 ×66 · 8 ×21 · 9 ×10 · 10 ×4. Essential (non-optional)
blocks average 6.2; exactly **one** recipe exceeds 8 essential blocks.

This is why the computed fit report says every recipe runs on an HX Stomp. That
headline is true, but the reason matters: **our chains are lean**, not that the
Stomp is roomier than players find it. A pro worship rig (comp → drive → drive →
amp → cab → delay → delay → reverb → reverb) reaches 9–10 blocks routinely and is
exactly the case players hit the wall on.

Two implications:

1. **Frame the flagship comparison page honestly.** "Every Fader & Knob recipe
   fits an HX Stomp" invites the reply "then your recipes are simpler than my
   rig." Better: publish the block count per recipe and let the player compare it
   to what they're already running. The number is the proof; the claim is the risk.
2. **Worth a human ear:** 48% of recipes landing at exactly 6 blocks is a tight
   cluster. It's partly genre-honest (a lean rock chain really is comp → amp →
   cab → delay → reverb), and heavy-metal recipes never sit at 6 — so this is not
   obviously a template floor. But someone should A/B a few 6-block chains against
   the records to confirm we're not systematically under-building. If the corpus
   is leaving tone on the table, that is invisible to every audit we run, because
   every rule we have checks structure rather than sound.
