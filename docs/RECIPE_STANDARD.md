# Recipe Quality Standard

> **The single source of truth for what a Fader & Knob recipe must
> contain.** This file is the spec. The audit script
> `scripts/audit-recipes.mts` grades every recipe against it. When the
> standard evolves, this file moves first — every commit that changes
> the bar updates this doc.

**Last revised:** 2026-05-06
**Recipe count at last revision:** 50
**Audit command:** `npx tsx scripts/audit-recipes.ts`

---

## Why this exists

Two problems this solves:

1. **Recipes drift.** Without a written bar, each new recipe gets
   built to whatever the latest mental model was. Old recipes don't
   get retrofitted. Six months in, the catalogue is uneven and the
   reader can tell.
2. **Standards drift.** Without a single doc to update, "the
   standard" lives in the head of whoever shipped the last recipe.
   New agents inherit folklore, not a spec.

Both problems get solved by a written, versioned, machine-checkable
spec — which is this file.

---

## How to use this

- **Writing a new recipe?** Read the rules below. Use them as the
  checklist before submitting.
- **Auditing the catalogue?** Run `npx tsx scripts/audit-recipes.mts`
  — outputs `docs/RECIPE_AUDIT_REPORT.md` with pass/fail per recipe
  and which rules failed.
- **Found a new standard worth adopting?** Update this file in the
  same commit that introduces the new rule. Add a corresponding
  check to the audit script.

---

## Rule format

Each rule has:
- A **slug** (matches the audit script's check name)
- A **severity**: `error` (blocks the recipe), `warn` (encouraged but
  not blocking), `info` (style note)
- A **description** of what passes
- The **why** — so readers can judge edge cases instead of mechanically
  applying

---

## A. Top-level recipe metadata

### A1 · `meta-required` · error
Every recipe object has: `id`, `slug`, `song_slug`, `title`,
`description`, `tone_context`, `guitar_specs`, `signal_chain`,
`original_gear`, `tags`, `platform_translations`.

**Why:** these fields are referenced by the page template, the JSON-LD
schema, and the audit. Missing fields silently break rendering.

### A1.5 · `meta-dates` · warn
Every recipe has `created_at: "YYYY-MM-DD"` (the date it was first
published). `updated_at` is optional, same format, never earlier than
`created_at`, and is stamped only on a **meaningful** edit (gear
correction, settings fix, new platform block) — not on formatting or
knob-order churn.

**Why:** these dates feed sitemap `lastmod` (added 2026-06-10 per
`docs/AI_SEARCH_PLAYBOOK.md`). Before them, every recipe page claimed a
fixed launch-date lastmod forever, so crawlers had no signal that 5 new
recipes land daily or that the weekly audit improves old ones. Existing
recipes were backfilled from git history via
`scripts/backfill-recipe-dates.ts`. The daily routine stamps
`created_at` on new recipes; the weekly audit stamps `updated_at` on
recipes it fixes.

### A2 · `description-substantive` · error
`description` is ≥ 120 characters and ≤ 600 characters.

**Why:** under 120 chars usually means the recipe is unfinished. Over
600 means it's hiding the engineer's note inside the description —
move the long-form context to the per-block `notes`.

### A3 · `description-no-count-flexing` · warn
`description` does not contain phrases like "X recipes," "X songs,"
"verified by N artists." Numbers are OK when they're functional (block
count, year, BPM).

**Why:** memory rule — Daniel's reaction to count-flexing was "Guitar
World doesn't do 'we've written 15,028 articles.'"

### A4 · `tags-min` · error
`tags.length >= 2`.

**Why:** tags drive related-recipe surfacing and the field-notes link
graph. One tag isn't enough to find sibling content.

### A5 · `sources-min` · warn
`sources.length >= 1`.

**Why:** recipes are claims about real recordings. A source URL —
artist gear page, an interview, a rig rundown — backs the claim.
Encouraged for every recipe; required (error) once the audit pipeline
has established a sources field for everything.

### A6 · `tone-context-valid` · error
`tone_context` is one of: `full_song`, `verse`, `chorus`, `solo`,
`bridge`, `intro`, `intro_riff`, `outro`, `riff`, `clean`, `lead`,
`rhythm`.

**Why:** drives filtering UX. Free-form values fragment the index.

---

## B. Guitar specs

### B1 · `guitar-specs-required` · error
`guitar_specs` has: `body_type`, `model_name`, `pickup_config`,
`pickup_position`, `string_count`, `scale_length`, `tuning`,
`string_gauge`.

**Why:** all eight fields render on the recipe page's GUITAR SPECS
section. Missing any of them creates a hole in the layout.

### B2 · `guitar-specs-notable-mods` · warn
`guitar_specs.notable_mods` is set when the original guitar has
a) heavier-than-stock strings, b) modified pickups, c) altered
electronics, or d) a notably-played-in neck. Not required for stock
guitars.

**Why:** the player's hardware is a meaningful slice of the tone.
Empty `notable_mods` on an SRV recipe (heavy strings + Eb tuning) is
under-documenting the signal chain.

---

## C. Original signal chain (the source-of-truth rig)

### C1 · `signal-chain-min-blocks` · error
`signal_chain.length >= 3` — at minimum: an effect (or stand-in like a
volume pedal), a preamp/amp, and a speaker/cab.

**Why:** under three blocks isn't a tone recipe — it's a guitar plus
amp.

### C2 · `signal-chain-has-amp` · error
At least one block has `category: "preamp"`.

**Why:** every realistic guitar tone passes through an amp. A
chain without one is malformed data.

### C3 · `signal-chain-has-cab-or-mic` · warn
At least one block is `category: "cabinet"` or `category: "microphone"`.

**Why:** the cab + mic stage is 25% of the tone. Recipes that skip it
miss the most-important downstream link.

**Direct-to-console (no cab/mic) exemptions:** a small set of recipes
were recorded DI — the guitar went straight into a console mic-preamp
(or an outboard saturation stage) and never saw an amp, cabinet, or
microphone. The distortion is preamp/console clipping, not a mic'd
speaker. Adding a cab or mic block to these would *misrepresent* the
tone, so they are exempt via `DIRECT_CONSOLE_NO_CAB_EXEMPT_SLUGS` in
`scripts/audit-recipes.ts`. Current exemptions:
- `page-black-dog-riff` — Jimmy Page recorded Black Dog's riff direct
  into a Helios desk's overdriven mic preamp, then through two UREI
  1176s in series. "We put my Les Paul through a direct box, and from
  there into a mic channel." No amp, no cab, no mic by design.

### C4 · `signal-chain-block-notes` · warn
Every signal-chain block has a non-empty `notes` field that explains
WHY a setting is what it is — not just describing the setting.

**Why:** "Volume: 8" without context is data; "Volume: 8 — cranked,
this amp is on the edge of breakup, the TS in front pushes it over"
is a recipe.

### C5 · `signal-chain-real-units` · warn
Block `settings` use real units when the platform supports them (dB,
Hz, ms) instead of normalized 0-10.

**Why:** an Ibanez Tube Screamer's actual knobs are 0-10 markings.
A Helix Scream 808 takes 0-1 normalized. Use what the actual unit
shows on its physical knobs for the SOURCE chain (`signal_chain`)
— platform translations get the platform's native units.

---

## D. Original gear summary

### D1 · `original-gear-required` · error
`original_gear` has: `guitar`, `amp`, `cabinet`, `microphone`.

**Why:** this section is the human-readable summary of the chain.
Missing fields mean the recipe page renders empty rows.

### D2 · `original-gear-effects` · warn
`original_gear.effects` is an array (can be empty). When the
`signal_chain` has effect blocks, `original_gear.effects` mentions
them.

**Why:** the bullet-summary should match the block-by-block
breakdown. Drift between the two is a smell.

---

## E. Platform translations — global rules

### E1 · `translations-required-platforms` · error
`platform_translations` has at minimum: `helix`, `quad_cortex`,
`katana`. Other platforms (`tonex`, `kemper`, `fractal`) are
encouraged but not required.

**Why:** Helix + QC + Katana cover the platforms we ship presets for
today. Recipes without these three translations have nothing to
download.

### E2 · `translations-each-has-blocks` · error
Each platform translation has `chain_blocks.length >= 3` —
**except TONEX**, which is legitimately a single ToneNET search-query
block by design (see Bible § 8: capture-driven, not model-driven).

### E3 · `translations-each-has-notes` · warn
Each platform translation has a non-empty top-level `notes` field
explaining the platform's flavor of the tone.

### E4 · `translations-block-notes` · warn
Every block in every translation has a non-empty `notes` field.

### E5 · `translations-canonical-knob-order` · warn
For every block in every translation, the keys present in `settings`
appear in canonical knob order — i.e. the same left-to-right order as
the device's physical front panel (Helix amp UI, Katana amp panel,
QC stomp tile, etc.). Canonical orders live in
[`src/lib/parameters/canonical.ts`](../src/lib/parameters/canonical.ts);
non-canonical keys can interleave freely. Only the relative order of
canonical keys is checked.

**Why:** the rendered preset card surfaces knob order to the reader —
if the recipe data has Volume in slot 6 instead of slot 2, the page
shows a Katana panel with knobs in the wrong place and players who
follow the recipe end up dialing the wrong knob. This rule catches
the kind of bug that's invisible in JSON review but obvious on the
rendered card. Caught in the 2026-05-06 Katana fix where 30/50
recipes had drifted to non-canonical orders.

### E6 · `translations-utility-mirror` · warn
If the Helix translation has a utility block (Compressor, Reverb,
Delay, EQ, Cab), the same category should appear in every other
modeller translation the recipe defines — with these design-correct
exemptions:

| Platform | Exempt categories | Why |
| --- | --- | --- |
| `katana` | Compressor, EQ, Cab | Comp is built into the amp section on Gen 1/2; EQ lives in the Pedal FX slot and isn't always called out as a discrete block; cab voicing is baked into the Amp Type. |
| `kemper` | Cab, EQ | The captured Profile bakes amp + cab + post-EQ together (see G3). |
| `tonex` | all five | Capture-driven by design (Bible § 8) — TONEX presets are a single ToneNET search, not a built chain. |

**Why:** every recipe in batch 1 had the same shape — Helix shipped a
reverb, a compressor, a delay; QC and Kemper translations didn't.
Readers who downloaded the QC preset got a meaningfully thinner
chain than readers who downloaded Helix. The rule turns "we noticed
this on review" into "the audit blocks it before merge."

---

## F. Helix translation — quality rules (the gold standard)

These rules raise Helix translations to the **Worship Tutorials
standard** documented in
[TONE_ENGINEERING_BIBLE.md § 3](TONE_ENGINEERING_BIBLE.md). The Helix
translation is the reference; other platforms aim for the closest
equivalent.

### F1 · `helix-block-count` · warn
Helix `chain_blocks.length >= 6` — at least: comp + amp + cab +
reverb + drive + one of (volume pedal | EQ | delay | wah).

**Why:** factory-quality Helix patches are 6-9 blocks. Below 6 means
the chain is missing standard utility blocks (no comp, no global EQ,
no reverb).

### F2 · `helix-comp-present` · warn
A Compressor block (typically `Deluxe Comp`) is present, and it sits
**before the Amp block** in the chain. A Volume Pedal or Noise Gate
ahead of it is fine — those clean up the input signal before
compression.

**Why:** professional patches always have a compressor — it tames
dynamic spikes before the amp and keeps the response even. The rule
used to require pos 1 or 2, but high-gain rigs correctly run Noise
Gate at pos 1-2 and Comp at pos 3 — that's not a bug. The real
constraint is "comp before amp."

**Compressor exemptions:** a small set of high-gain metal recipes run
*no* compressor by design and are listed in `HELIX_COMP_EXEMPT_SLUGS`
in `audit-recipes.ts`. In those tones the attack-tightening comes from
a drive/boost block (Tube Screamer-style), a noise gate, and the amp's
own saturation; a compressor in front of the amp would smear the
percussive pick attack the genre depends on. Add a slug here only when
the source rig genuinely had no comp — never to silence the warn on a
clean/blues/classic-rock tone. Current exemptions:
`dimebag-walk-groove-metal` (Vulgar-era Randall rig: gate + Scream 808
+ solid-state saturation, no comp).

### F3 · `helix-amp-internals` · warn
The amp block's `settings` object includes the internal-tube parameters:
`Bias`, `BiasX`, `Sag`, `Hum`, `Ripple` — in addition to the standard
`Drive / Bass / Mid / Treble / ChVol / Master`.

**Why:** real Helix amp models expose tube character knobs. Patches
that ignore them feel "stock" and generic. The internals are what
separate a "loaded the model" from "dialed the model."

### F4 · `helix-cab-full-params` · warn
The cab block's `settings` includes: `Mic`, `Position`, `Distance`,
`Angle`, `Pan`, `LowCut`, `HighCut`, `Level`, `Delay`.

**Why:** the cab is 20% of the tone. Skipping `LowCut` / `HighCut`
leaves mud (sub-100 Hz) and fizz (10k+) in the patch — sound that
gets EQ'd out anyway in real recordings.

### F5 · `helix-reverb-cuts` · warn
Reverb block `settings` include `LowCut` (between 80-300 Hz) and
`HighCut` (between 5000-9000 Hz).

**Why:** un-EQ'd reverb tail muddies the mix. Worship-Tutorials-grade
patches always cut reverb mud + fizz.

### F6 · `helix-default-on-multidrive` · info
When the recipe ships multiple drive blocks, exactly one is default-on
(`enabled: true`); alternates are default-off.

**Why:** lets the player choose between a TS808-flavored boost and a
Klon-flavored boost without stacking by accident.

### F7 · `helix-block-name-real` · warn
Each Helix `block_name` matches a real Helix model name (no generic
"Overdrive" / "Compressor"). Examples: `Scream 808`, `Deluxe Comp`,
`US Deluxe Vib`, `4x10 Tweed P10R`, `Tilt`.

**Why:** the .hlx file generator looks up real model names. Generic
names produce empty preset slots.

---

## G. Quad Cortex, Katana, Kemper, Fractal, TONEX

### G1 · `qc-amp-name-real` · warn
Quad Cortex `block_name` for the amp matches a real QC model name
(e.g., `Brit 2203`, `US Vibro`, `UK 30 TopBoost`) — not a generic
description.

### G2 · `katana-amp-character-set` · warn
Katana translations specify which of the five amp characters
(`Acoustic`, `Clean`, `Crunch`, `Lead`, `Brown`) is used, with a note
explaining why (gain structure of the original).

### G3 · `kemper-cab-not-separate` · warn
Kemper translations do not have a separate cab block — the profile
includes the cab. (Memory rule: Daniel called this out as the right
modeling choice for Kemper.)

### G4 · `tonex-tonenet-reference` · warn
TONEX translations reference a ToneNET search query for the captured
amp tone (e.g., `Search ToneNET for 'Vox AC30' or 'AC30 Top Boost'`)
since TONEX is capture-driven, not model-driven.

### G5 · `fractal-axe-fx-named` · warn
Fractal translations use real Axe-Fx / FM9 model names from the
Cygnus / 2.0 amp library.

### G6 · `katana-kemper-multidrive-default-off` · info
When the Helix translation ships a multi-drive stack (≥2 blocks in
the Distortion / Booster / Drive families, or a Kemper-style Stomp
slot loaded with a drive-flavored model), the corresponding Katana
Booster block and Kemper Stomp drive blocks ship with `enabled: false`
so the player can A/B between flavors instead of getting a
preset-stack of overlapping drives by default.

**Why:** F6 already enforces the alternates-default-off pattern on
Helix. The same logic applies on Katana and Kemper, where a single
booster slot doubles as the "you pick" alternate. Without this rule,
recipes silently ship hot Katana presets with a Tube Screamer always
on top of an already-cranked Brown amp — the opposite of what the
Helix translation does.

---

## H. Voice + content rules

These are softer rules but they're what make the recipes feel like
*Fader & Knob recipes* and not generic preset-share posts.

### H1 · `voice-no-display-period` · info
Display titles (titles rendered in the v3 display serif) don't end
with a period. Memory rule.

### H2 · `voice-italic-credits` · info
The recipe's credits + descriptions use italic display serif — this
is enforced at render time by `.recipe-credits`, but the prose itself
should sit in italic-friendly sentences (not monospaced spec-sheet
phrasing).

### H3 · `voice-explain-why` · warn
At least 75% of block `notes` explain *why* a setting is what it is,
not just *what* it is. Phrases like "do this because…" / "set this so
that…" / "this is what makes it…" pass.

**Why:** "Volume: 8" is data. "Volume: 8 — cranked, the amp is on the
edge of breakup" is a recipe. The why is what the user pays for.

---

## How to evolve this standard

1. Spot a gap (e.g., "every reverb block should also have a `Predelay`
   between 0.02 and 0.10").
2. Add a rule here, with a slug, severity, description, and why.
3. Add the corresponding check to `scripts/audit-recipes.mts`.
4. Run the audit, get the failure list, fix the offenders.
5. Commit standard + audit + fixes together so the standard never
   ships without enforcement.

If a rule keeps generating "warn" output that nobody plans to fix,
either downgrade it to `info` or upgrade it to `error` — but don't
let warnings accumulate. They become noise and get ignored.

---

## Appendix · Patterns surfaced during batch-1 rewrites (2026-05-06)

These are observations we noticed across the first 50 recipes that
aren't yet codified as rules. Each one is a candidate for promotion to
a `warn` rule once the pattern is sharp enough to encode without false
positives.

### Default-OFF boosters on FRFR rigs
On Katana (and Kemper, when the Stomp slot hosts a drive model), the
booster is a *flavor* rather than a baked-in amp character. Recipes
should default these blocks to `enabled: false` unless the original
gear actually had the booster always-on (e.g. SRV's TS9, Mark
Knopfler's MK4 — those ride at gain stage 1, not as A/B options).
**Status:** codified for the multi-drive case (G6). Open question:
should single-booster recipes also default off? Probably yes, but
needs a separate review.

### Subtle reverbs on tracking-room recipes
When the original recording was tracked in a treated room with close
mics (most studio rock — Beatles, Dire Straits, Aja-era Steely Dan),
the recipe's reverb should be small / short / quiet (Mix < 0.20,
Decay < 0.40 s, Predelay < 30 ms) — *or omitted entirely* if the
record's ambience came from the tracking room itself, not a plate.
Big halls and long plates belong on stadium-rock and shoegaze
recipes, not jazz-club records. **Status:** judgment call per recipe;
not yet a rule because the threshold depends on production style.

### Kemper REV/DLY slots use `Reverb` / `Delay`, not `Effect` (2026-06-07)
The Kemper has dedicated REV and DLY slots; a reverb or delay block in
those slots must carry `block_category: "Reverb"` or `"Delay"` — *not*
the generic `"Effect"`. The `translations-utility-mirror` check matches
on category, so a Kemper plate reverb mislabeled `"Effect"` reads as
"kemper missing Reverb" even though the block is right there. This was
the single most common cause of mirror warns in the weekly audits — the
2026-06-07 run alone re-tagged 11 Kemper blocks across 6 recipes
(santana, bb-king, satriani, gilmour ×2, lifeson, brian-may, rhoads).
The block_name (`Plate Reverb`, `Single Delay`, `Hall Reverb`) and the
note (`REV slot.` / `DLY slot.`) already signal intent; only the
category was wrong. **Status:** mechanical, unambiguous, and safe to
bulk-fix — a good candidate for a dedicated fixer script
(`fix-kemper-fx-category.ts`) so it stops recurring as new recipes land.

### Noise gates on high-gain recipes
Any recipe whose amp Drive ≥ 8 (on a 0-10 scale) or whose tags
include `metal` / `high-gain` / `djent` / `thrash` should include a
noise-gate block before the amp. Without one, the rendered preset
self-oscillates the moment the player isn't fretting. The current 50
recipes don't all have this — Metallica / Pantera / Slipknot recipes
should be retrofitted before batch-2 rewrites.
**Status:** ready to codify as a `warn` rule next pass; left out of
this commit because the tag taxonomy needs a quick audit first
(some recipes are tagged `rock` not `high-gain` despite ≥ 8 drive).

### The unverified-range ledger grows with the catalog (2026-09-06)
`settings-outside-unverified-range` fires on **225/225** recipes and has
fired on every recipe for months. A rule that matches the entire catalog
carries no per-recipe signal, and it is easy to read the 100% as either
"everything is broken" or "this rule is noise." It is neither, and future
audits should not act on it as if it were a warn.

What it actually tracks is registry debt, not recipe defects:
`src/lib/parameters/registry.ts` was written Helix-first and never made
platform-aware, so a Katana `Gain: 90` is correct on hardware that runs
0–100 and only looks wrong against an entry declaring 0–10. The companion
error rule `settings-within-verified-range` covers the ranges someone has
actually checked, and that one is at **0 violations** — which is the number
that means "no recipe is wrong."

The measured consequence, now that the count is reproducible
(`npx tsx scripts/count-param-ranges.mts`, added this pass because the
ledger's original 2,666 was a one-time hand count):

| Date | Recipes | Unverified out-of-range | Verified out-of-range |
|---|---|---|---|
| 2026-08-05 | 205 | 2,666 | 0 |
| 2026-09-06 | 225 | 3,059 | 0 |

**+393 values in a month, purely from 20 new recipes inheriting the same
unverified ranges — no parameter graduated to `rangeVerified` in that
window.** So the ledger grows at roughly +20 values per recipe shipped and
will keep doing so indefinitely. `Mix` alone is 1,330 of the 3,059 (43%),
and it is a single unit convention (percent vs 0–1), not 1,330 judgment
calls.

**Status: deliberately NOT promoted to `warn`, and it should not be
promoted until the ranges are verified.** Promoting it now would turn the
audit permanently red on all 225 recipes and hide real regressions —
exactly the failure the `rangeVerified` split was introduced to prevent.
The work is in `docs/PARAM_RANGE_AUDIT.md` under "The order to fix them
in"; it needs hardware ground truth per platform, which is bench work, not
something a weekly audit run can resolve. **The rule against fixing this by
widening ranges to fit the data still stands.**
