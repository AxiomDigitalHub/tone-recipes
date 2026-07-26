# Preset Backfill: the 145-file gap is a naming bug, not a build problem

**Date:** 2026-07-25
**Method:** `npx tsx scripts/ship-all-presets.ts --dry-run` + cross-reference of every unresolved block name against `data/helix-inventory.json` (439 harvested models, 334 corpus-verified).

## The headline

**All 195 recipes already generate a valid .hlx. Zero fail.** The dry run writes 195 presets with 0 skipped recipes. Only 50 files are actually shipped in `presets/`, so **145 presets are one command away** — except that shipping them blind would ship *degraded* presets.

**54 of 195 recipes (28%) silently drop at least one block** during generation, because the block name in the recipe's Helix translation doesn't resolve to a model ID. 42 distinct names cause 62 total block-drops. Some drops are catastrophic: `3's & 7's` loses its amp *and* cab (`US Double Brt`, `4x12 Mash V30`), which means the shipped preset would not sound like the recipe at all.

This is the difference between "we have a content backlog" and "we have a 90-minute data fix." It's the latter.

## Root causes (only three, and none are hard)

| Cause | Distinct names | Fix |
|---|---|---|
| **Naming variant / near-miss** — recipe uses a slightly different string than the Helix model | 38 | Alias table (below) |
| **Map gap** — model exists in inventory, `model-map.ts` has no entry | 4 | Add 4 entries |
| **Real-world gear name leaked into a Helix translation** — a subset of the above, but conceptually distinct: the recipe names the *original pedal*, not the Helix model | ~8 | Alias + an audit rule so it can't recur |

The third cause is the important one editorially. `RECIPE_STANDARD.md` §F7 requires real Helix model names in Helix translations; these recipes name the source gear instead (`Big Muff`, `Cry Baby`, `Matchless DC30`, `Clean Boost`). Line 6 renames everything for trademark reasons — Matchless becomes **Matchstick**, the Big Muff becomes **Triangle Fuzz**, the Octavia becomes **Tycoctavia Fuzz**. A recipe that says "Big Muff" in a Helix chain is, strictly, wrong.

## Proposed alias table

High confidence — apply directly:

| Recipe says | Helix model | Note |
|---|---|---|
| Octave Fuzz ×7 | **Tycoctavia Fuzz** | Line 6's Octavia. Most frequent single offender. |
| Big Muff | **Triangle Fuzz** | Triangle-era Big Muff |
| Matchless DC30 | **Matchstick Ch1 / Ch2** | Line 6 renames Matchless → Matchstick |
| U-Vibe | **Ubiquitous Vibe** | |
| Wah 846 | **UK Wah 846** | Missing prefix |
| Teemah | **Teemah!** | Missing `!` |
| Brit J-45 | **Brit J45 Nrm** | Hyphen + channel |
| 10-Band Graphic EQ | **10 Band Graphic** | |
| Dynamic Flanger | **Dynamix Flanger** | |
| Voice Box | **FM4Voice Box** | |
| Vol/Pan | **Vol** | |
| Tilt EQ | **Tilt** | |
| Brit Plexi, Brit Plexi 100 | **Brit Plexi Nrm** (or Brt) | Pick per recipe's brightness note |
| Brit 2204 Brt / Nrm | **Brit 2204** | No channel variants in inventory |
| Brit Trem | **Brit Trem Nrm** | |
| Das Benzin Lo | **Das Benzin Lead** | No "Lo" variant; Lead/Mega only |
| 8x10 Bass | **8x10 SVT AV** | |
| 4x12 1960A T75, 4x12 1960 V30 | **4x12 1960 T75** | Only 1960 variant harvested |
| 4x12 Mandarin | **4x12 Mandarin EM** | |
| 2x12 Mandarin | **2x12 Mandarin 30** | |
| 2x12 Mail | **2x12 Mail C12Q** | |
| Pitch Wham / POG | **Pitch Wham** | Recipe crams two pedals in one name — split into two blocks |

Map gaps — model already in inventory, just add to `model-map.ts`: **German Ubersonic**, **1x12 Open Cream**, **Chamber**, **Harmonic Tremolo**.

Needs human verification (not in the harvested inventory; likely real models from the official list, since 105 inventory entries are official-list-only and the harvest came from a finite preset corpus): **Hiway 100** / **4x12 Hiway 4x12** (Hiwatt DR103 — believed real), **Brit Studio**, **Tube Echo** (legacy delay — believed real), **4x12 Mars G12-65**, **4x12 Mash V30**, **US Double Brt**, **1x12 Tweed** / **1x12 US Small Tweed**, **Cry Baby** / **Cry Baby Wah** (Helix's Dunlop-style wah — candidates: UK Wah 846, Vetta Wah), **Clean Boost** (candidates: Kinky Boost, Vital Boost), **Rotary** (candidates: 145 Rotary, Vibe Rotary).

## Recommended sequence

1. **Add the alias table** to `src/lib/helix/model-map.ts` (an `ALIASES` record consulted before failing), plus the 4 map-gap entries.
2. **Make silent drops loud.** `generateHelixPreset` currently logs skipped blocks to stdout and ships the preset anyway. Change it to *fail* on a dropped **amp or cab** block, and warn on effects. A preset missing its amp is not a preset.
3. **Add an audit rule** — `helix-blocks-resolvable` (error): every Helix `chain_blocks` entry must resolve to a known model ID. This makes the bug impossible to reintroduce and belongs in `RECIPE_STANDARD.md` §F alongside F7. (Standard and audit ship in the same commit, per existing discipline.)
4. **Verify the ~11 uncertain names** against the official Line 6 model list (line6.com/helix-models) and extend the inventory harvest to cover official-list-only entries.
5. **Then** run `npx tsx scripts/ship-all-presets.ts` for real and ship 195 presets.
6. **Spot-check** a random 10 in HX Edit before announcing — generated ≠ correct.

## Why this is the highest-leverage hour on the board

Every downstream product assumes preset files exist: fit reports need block data that matches reality, the Set Builder compiles from Helix translations, audio previews need something to reamp, and "a recipe without a file is commodity content" is the corpus's biggest competitive weakness. Fixing 42 strings unblocks all of it — and turns 145 recipes from settings tables into downloads.

One caution: shipping 195 files at once is a visible change. Do it *after* step 2, so a preset that would have quietly lost its amp fails loudly instead of reaching a player's board.
