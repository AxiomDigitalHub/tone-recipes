# Parameter range audit — what the registry declares vs what the corpus holds

**Generated:** 2026-08-05 · **Last measured:** 2026-09-06
**Rule:** `settings-outside-unverified-range` in `scripts/audit-recipes.ts`
**Re-measure with:** `npx tsx scripts/count-param-ranges.mts`
**Companion:** `docs/COMP_TIME_UNIT_MIGRATION.md` (the first of these resolved)

> **Measurement log** (added 2026-09-06 by the weekly audit, which found the
> original 2,666 was a one-time hand count with no way to reproduce it):
>
> | Date | Recipes | Out-of-range, unverified | Out-of-range, verified |
> |---|---|---|---|
> | 2026-08-05 | 205 | 2,666 | 0 |
> | 2026-09-06 | 225 | **3,059** | 0 |
>
> **The ledger grew by 393 values (+15%) in a month.** That is not new bad
> data and not a regression in the audit — it is 20 new recipes inheriting the
> same unverified ranges, while **zero additional parameters were marked
> `rangeVerified` in that month** (still 8 in the registry). The debt scales
> with the corpus by construction, so it will keep growing at roughly
> 20 values per new recipe until the ranges below are actually verified.
>
> The verified-range count is **0**, which is the number that matters for
> correctness: no recipe violates a range anyone has checked. The table below
> is a work queue, not a defect list.

`src/lib/parameters/registry.ts` is the single source of truth for how a
setting renders — knob vs fader, its range, its unit, its neutral marker. It
was written Helix-first and never made platform-aware. The consequence, first
measured on 2026-08-05: **2,666 corpus values sit outside the range their own
registry entry declares.**

Almost none of them are bad data. Most are the registry describing a scale the
platform doesn't use — a Katana Gain of 90 is correct on a unit that runs
0–100, and only looks wrong against a registry entry that says 0–10.

That distinction is why `ParamMeta` now carries `rangeVerified`. The audit
raises an **error** only for ranges checked against ground truth
(`data/helix-corpus/models.json`, official docs, or a completed migration);
everything below is reported as **info** — a ledger of ranges to verify, not a
pile of defects. As each range is confirmed it graduates to the error rule, and
a genuine regression can no longer hide inside the noise.

## Why this matters beyond tidiness

`/about` promises: *"Every knob value reads in the actual unit your modeler
expects. dB. Hz. ms."* Every row below is a place that promise is not currently
kept. The `Attack`/`Release` row used to be here too — it rendered "Attack 60s"
for a 60 ms setting **and** shipped the preset with the compressor pinned to
maximum attack, because the generator clamped anything over 10 to 1.0. That one
is fixed; the rest are unaudited, not innocent.

## The ledger

| Parameter | Declared | Observed | Values | Platforms | Likely cause |
|---|---|---|---|---|---|
| `Mix` | 0–1 | 3–100 | 1148 | fractal, helix, kemper, quad_cortex | written as percent (0–100) in most recipes, 0–1 in the rest |
| `Feedback` | 0–1 | 2–45 | 268 | fractal, helix, katana, kemper, quad_cortex | written as percent (0–100) in most recipes, 0–1 in the rest |
| `Threshold` | -60–0 dB | -64–56 | 144 | fractal, helix, katana, kemper, quad_cortex | needs checking |
| `EffectLevel` | 0–10 | 11–45 | 143 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Tilt` | 0–1 | 4.4–5.8 | 124 | helix, quad_cortex | needs checking |
| `Tone` | 0–10 | 40–65 | 106 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Level` | 0–10 | 15–100 | 74 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Gain` | 0–10 | 20–90 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Volume` | 0–10 | 45–70 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Bass` | 0–10 | 40–95 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Middle` | 0–10 | 20–95 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Treble` | 0–10 | 50–80 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Presence` | 0–10 | 50–70 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Master` | 0–10 | 50–65 | 69 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Drive` | 0–10 | 15–90 | 43 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Bottom` | 0–10 | 30–60 | 35 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Depth` | 0–1 | 2–80 | 30 | katana, kemper | needs checking |
| `Depth` | 0–10 | 22–70 | 30 | fractal, helix, kemper, quad_cortex | needs checking |
| `Decay` | 0–10 s | 12–40 | 26 | helix, kemper, quad_cortex | needs checking |
| `Rate` | 0–10 Hz | 25–35 | 8 | katana | Katana runs 0–100 (Boss Tone Studio scale) |
| `Mid` | 0–10 | -3–-2 | 3 | kemper | needs checking |
| `Peak Reduction` | 0–10 | 25–25 | 1 | fractal | needs checking |

**Total: 2,666 values across 22 parameter/range pairs.**

## Reading the groups

**Katana (≈600 values, 11 parameters).** The Boss Katana and Boss Tone Studio
run every control 0–100. The registry says 0–10. This is a display bug on every
Katana tab and the cheapest group to fix — it needs platform-scoped ranges, not
data edits. Nothing about the `.tsl` output is affected; `parseParamToTSL`
handles the native scale.

**`Mix` and `Feedback` (1,416 values).** Genuinely written two ways — the QC
scorecard measured 1,013 integer-style against 585 decimal-style `Mix` values.
The generator copes (`PERCENT_SCALE_PARAMS` divides anything over 1 by 100), so
the emitted presets are right, but the page renders "Mix 20" against a 0–1
knob. This one needs a data migration on the model of
`scripts/migrate-comp-time-units.ts`, standardising on percent.

**`Threshold` (144 values).** Two different problems wearing one name: a
handful of Helix/QC values at −62 to −64 dB just overflow a −60 floor that is
probably too tight, while the Katana entries run 0–100 because a Katana noise
gate threshold is not measured in dB at all.

**Everything else** — `Tilt`, `Depth`, `Decay`, `Rate`, `Mid`,
`Peak Reduction` — is small, mixed, and needs a look at the hardware before
anyone edits either side.

## The order to fix them in

1. **Katana platform ranges** — biggest visible win, no data migration, one
   scoped override block.
2. **`Mix` / `Feedback` to percent** — largest count; reuse the compressor
   migration's AST approach.
3. **`Threshold`** — split the dB case from the Katana case.
4. **The tail** — verify against hardware one at a time, marking
   `rangeVerified: true` as each is confirmed.

Nothing here should be "fixed" by widening a range until the value fits. A
range that is wrong should be corrected to what the hardware does, and a value
that is wrong should be migrated. Widening to silence the audit would put the
site back where it started: a number on the page that nothing checks.
