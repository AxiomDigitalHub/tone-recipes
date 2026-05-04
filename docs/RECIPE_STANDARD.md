# Recipe Quality Standard

> **The single source of truth for what a Fader & Knob recipe must
> contain.** This file is the spec. The audit script
> `scripts/audit-recipes.mts` grades every recipe against it. When the
> standard evolves, this file moves first — every commit that changes
> the bar updates this doc.

**Last revised:** 2026-05-04
**Recipe count at last revision:** 50
**Audit command:** `npx tsx scripts/audit-recipes.mts`

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
A Compressor block (typically `Deluxe Comp`) is present, in position 1
or 2.

**Why:** professional patches always have a compressor — it tames
dynamic spikes before the amp and keeps the response even.

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
