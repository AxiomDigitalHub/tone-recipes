# Routing & Mix — proposed additions to RECIPE_STANDARD.md

> A proposal, not yet the spec. Everything here is written in the
> format `RECIPE_STANDARD.md` uses (slug · severity · description ·
> why · how the auditor checks it) so it can be lifted across in one
> commit once the migration below is done.
>
> Companion reference: [ROUTING_AND_MIX_ARCHITECTURE.md](ROUTING_AND_MIX_ARCHITECTURE.md)
> — the numbers, tables, and platform behaviour these rules encode.

**Drafted:** 2026-07-25
**Recipe count at drafting:** 195
**Audit script:** `scripts/audit-recipes.ts`

---

## Why these four rules

The routing research turned up two correctness problems and two
documentation gaps in the catalogue as it stands:

1. **`Mix` is not one unit.** 1,696 `Mix:` values live in
   `src/lib/data/index.ts`. 1,100 are written 0–100; 596 are written
   0–1. 192 of 195 recipes contain both conventions, and 54 platform
   blocks contain both conventions *inside a single platform's chain*.
   The renderer prints whatever is there, so a reader sees `Mix: 0.5`
   on the Fractal card and `Mix: 50` on the Helix card of the same
   recipe — and at least one value (`gilmour-comfortably-numb-solo`,
   Fractal Plate `Mix: 3.0` where every sibling platform says `25`) is
   a decimal slip that shipped.
2. **The same number does not mean the same thing across platforms.**
   Kemper and Fractal delay hold the dry at unity until Mix 50%;
   Fractal reverb attenuates dry from 0%. So even after unit
   normalisation, "Mix 30" is not a translation — it's a coincidence.
   The recipe format has no way to say what the *intent* was.
3. **Mono-sum survival is undeclared.** ~8 recipes ship a block whose
   whole point is stereo (rotary/Leslie ×4, stereo chorus ×4, one
   stereo delay), and nothing in the data warns the player that the
   part collapses when FOH sums to mono. Worship players are the
   segment most likely to hit this and the least likely to have a way
   to diagnose it.

   The good news, and the reason this rule is cheap: **253 of 253 Helix
   cab blocks already have `Delay: 0` and `Pan: 0.5`.** The catalogue
   has no Haas offsets and no hard pans, so R2's mechanical
   cross-checks pass today and the rule's job is to keep it that way
   while ~8 recipes get a hand-written `mono_note`.
4. **33 recipes describe a blend in prose and a single serial chain in
   data.** Adam Jones' three-amp wall, SRV's two-amp rig, Josh Homme's
   bass-amp blend, Slipknot's two-amp stereo pair — the `notes` say
   "blended with," the `chain_blocks` say one amp. The format cannot
   express a split, so the recipe silently flattens.

   **Caveat that has to travel with this rule:** per
   [ROUTING_AND_MIX_ARCHITECTURE.md § 9.5](ROUTING_AND_MIX_ARCHITECTURE.md#95-the-dual-amp-records--whats-actually-documented),
   most of those 33 are *not* documented parallel blends. Mike
   McCready's own quote about *Black* describes a JCM800 for leads and
   a Bassman for clean parts — two amps doing two jobs, not two amps
   summed. Eric Johnson and Nirvana's *Nevermind* are amp-selection and
   overdub stories respectively. Adding `routing` to a recipe on
   historical grounds requires a source that says **simultaneous**.
   Several recipes need their prose corrected *before* they get a
   routing field, not after.

---

## Proposed rules

### R1 · `mix-units-normalized` · error

Every `settings.Mix` (and `settings["Effect Level"]`, `settings.Blend`,
`settings["Dry Level"]`, `settings["Direct Level"]`) in every platform
translation is an **integer 0–100**. No 0–1 decimals. No values above
100. No values that could be read either way (`1`, `3`, `5` are only
legal if the *sibling platforms* agree they mean single-digit
percent).

**Why:** the number is rendered verbatim on the preset card. A player
reading `Mix: 0.5` on a Quad Cortex — whose UI shows Mix as a
percentage — will type `0.5` and get a half-percent of reverb. Every
platform we translate to displays Mix as a percentage or as a 0–100
level on its own screen (Helix `%`, Fractal `%`, Kemper 0–100, QC `%`,
Boss `E.Level 0–120 / Direct 0–100`). 0–1 is a Helix *file-format*
convention (`.hlx` stores flat floats — Bible § 12) that leaked into
the human-facing data. Keep the file-format normalisation in the
`.hlx` writer where it belongs.

**Auditor check:**

```ts
{
  slug: "mix-units-normalized",
  severity: "error",
  description: "Every Mix/blend value is an integer 0–100 (no 0–1 decimals)",
  check: (r) => {
    const BLEND_KEYS = /^(mix|blend|effect level|e\.level|dry level|direct level|dry\/wet)$/i;
    const bad: string[] = [];
    for (const [plat, t] of Object.entries(r.platform_translations)) {
      for (const b of t?.chain_blocks ?? []) {
        for (const [k, v] of Object.entries(b.settings ?? {})) {
          if (!BLEND_KEYS.test(k)) continue;
          if (typeof v !== "number") continue;
          if (!Number.isInteger(v) || v < 0 || v > 120) {
            bad.push(`${plat}/${b.block_name}: ${k}=${v}`);
          }
        }
      }
    }
    return bad.length ? `non-percent blend values: ${bad.join("; ")}` : null;
  },
}
```

**Severity rationale:** `error`, not `warn` — a mis-scaled Mix is not
a stylistic drift, it's a wrong instruction. It ships a preset that
sounds nothing like the recipe. Start it as `warn` for exactly one
audit cycle to shake out the false positives on Boss `E.Level` (range
0–120), then promote.

---

### R2 · `mono-safe-declared` · warn

Every recipe carries a top-level `mono_safe` field:

```ts
mono_safe: true | false | "conditional"
```

- `true` — nothing in any translation cancels, thins, or loses its
  identity when L+R are summed. The default for the large majority of
  the catalogue.
- `false` — the tone *depends* on stereo. Summed to mono it is a
  different part (rotary, ping-pong, hard-panned dual cab, any
  polarity-inverted widener). `mono_safe: false` **requires** a
  `mono_note` string of ≥ 40 characters saying what breaks and what to
  do instead.
- `"conditional"` — mono-safe as shipped, but one commonly-tweaked
  parameter takes it over the line (e.g. a chorus whose Stereo/Width
  control cancels past a threshold). Also requires `mono_note`.

**Why:** the ICP is a worship guitarist. Most church PAs sum the
guitar to mono, or the congregation stands on one side of the room and
only hears one leg. A recipe that says "Rotary Speaker, Mix 100" and
doesn't say "this becomes a tremolo in mono" is a recipe that fails on
Sunday and the player has no idea why. Kemper documents this behaviour
in its own manual — `Master Left` "will sound similar to `Master Mono`
but often less dense, depending what stereo effects are used" — so the
risk is real and manufacturer-acknowledged, not folklore.

Cheap to backfill: ~8 recipes need a real answer, the rest are `true`.

**Auditor check:**

```ts
{
  slug: "mono-safe-declared",
  severity: "warn",
  description: "mono_safe declared; false/conditional carry a mono_note",
  check: (r) => {
    if (r.mono_safe === undefined) return "missing mono_safe";
    if (r.mono_safe === true) {
      // cross-check 1: a `true` that contradicts a stereo-identity block
      const RISK = /rotary|leslie|ping.?pong|stereo (chorus|widener|delay|spread)|dimension d|haas/i;
      const blocks = Object.values(r.platform_translations)
        .flatMap((t) => t?.chain_blocks ?? []);
      const hit = blocks.find((b) => RISK.test(b.block_name));
      if (hit) return `mono_safe: true but chain has "${hit.block_name}" — verify or downgrade`;

      // cross-check 2: the mechanical mono killers, per
      // ROUTING_AND_MIX_ARCHITECTURE.md §8.4. These are always wrong on a
      // mono_safe: true recipe, regardless of block name.
      for (const b of blocks) {
        const s = b.settings ?? {};
        if (typeof s.Delay === "number" && s.Delay > 0 && /cab|ir/i.test(b.block_category))
          return `${b.block_name}: cab/IR Delay=${s.Delay} is a Haas widener — combs in mono`;
        if (typeof s.Polarity === "string" && /invert/i.test(s.Polarity))
          return `${b.block_name}: Polarity=${s.Polarity} nulls when summed`;
        if (typeof s.Pan === "number" && (s.Pan <= 0.15 || s.Pan >= 0.85))
          return `${b.block_name}: Pan=${s.Pan} is near-hard — loses 6 dB in mono`;
      }
      return null;
    }
    return (r.mono_note?.length ?? 0) >= 40
      ? null
      : `mono_safe: ${r.mono_safe} requires a mono_note (≥40 chars)`;
  },
}
```

The `true`-with-a-risky-block cross-check is the part that earns its
keep. A blanket `mono_safe: true` backfill would otherwise be
worthless.

---

### R3 · `parallel-path-level-compensated` · warn

Any translation that declares a `routing` block (see below) states a
`merge` level for each path, and the merge levels are not both `0`
unless the recipe explains why in `routing.notes`.

**Why:** splitting and re-merging is not level-neutral. Line 6's own
measurement thread has a −6 dBFS sine measuring −9 dBFS on each leg of
an even A/B split and −3 dBFS after the merge — a **net +3 dB** on an
otherwise-identical patch, confirmed by Line 6 staff. HX Stomp ships
the Merge Mixer at **+3.0 dB** where Helix Floor/LT/Native ship it at
**0.0 dB**, so the same recipe is 3 dB hotter on a Stomp. A recipe
that says "split here" without saying "and pull the merge back 3 dB"
ships a patch that jumps in volume the moment the player engages it.

**Auditor check:**

```ts
{
  slug: "parallel-path-level-compensated",
  severity: "warn",
  description: "Declared parallel routing states merge levels (or explains 0/0)",
  check: (r) => {
    const bad: string[] = [];
    for (const [plat, t] of Object.entries(r.platform_translations)) {
      const rt = t?.routing;
      if (!rt) continue;
      const a = rt.merge?.a_level_db, b = rt.merge?.b_level_db;
      if (a === undefined || b === undefined) { bad.push(`${plat}: merge levels missing`); continue; }
      if (a === 0 && b === 0 && (rt.notes?.length ?? 0) < 40)
        bad.push(`${plat}: merge 0/0 with no justification in routing.notes`);
    }
    return bad.length ? bad.join("; ") : null;
  },
}
```

---

### R4 · `output-calibration-note` · info

Every recipe's Helix translation `notes` (and Fractal/QC/Kemper where
present) says what the preset is calibrated for: `FRFR`, `stage cab`,
`4CM`, or `studio/DI`. One phrase is enough — the audit only checks
that one of the four tokens appears.

**Why:** every number downstream of the amp block means something
different depending on the destination. A cab block is required for
FRFR and actively wrong into a real guitar cab. A Global EQ high cut
that saves an FRFR patch from fizz makes a stage-cab patch sound like
a blanket, because the physical speaker already rolls off around
5 kHz. The recipes currently assume FRFR without saying so, which is
fine right up until a player runs one into the return of a Katana and
concludes our numbers are wrong.

**Auditor check:**

```ts
{
  slug: "output-calibration-note",
  severity: "info",
  description: "Translation notes state the monitoring target (FRFR / stage cab / 4CM / studio)",
  check: (r) => {
    const TARGET = /\b(FRFR|stage cab|guitar cab(inet)?|4CM|four.cable|studio|DI|direct)\b/i;
    const missing = (["helix", "fractal", "quad_cortex", "kemper"] as const)
      .filter((p) => r.platform_translations[p] && !TARGET.test(r.platform_translations[p]!.notes ?? ""));
    return missing.length ? `no monitoring target stated for: ${missing.join(", ")}` : null;
  },
}
```

`info`, not `warn` — it's a documentation improvement, and forcing it
to `warn` on 195 recipes at once would drown the report. Promote to
`warn` once the backfill is past ~80%.

---

## Proposed `routing` field

Lives on `PlatformTranslation`, optional, present only when the tone
genuinely needs a split. Most recipes will never have it.

```ts
export interface RoutingPath {
  /** "A" (upper) or "B" (lower) — matches the device's own labelling. */
  id: "A" | "B";
  /** Block positions (from chain_blocks) that live on this path. */
  block_positions: number[];
  /** What this path is FOR. One phrase: "clean blend", "cab for FOH", "octave under dry". */
  role: string;
}

export interface RoutingMerge {
  /** Merge/mixer level for path A, in dB. Helix Merge > Mixer "A Level". */
  a_level_db: number;
  /** Merge/mixer level for path B, in dB. */
  b_level_db: number;
  /** Optional master level on the merge block, in dB. */
  master_level_db?: number;
  /** Pan positions, -100 (hard L) to +100 (hard R). Omit for centred. */
  a_pan?: number;
  b_pan?: number;
  /**
   * Polarity invert on path B. Helix "B Polarity", QC Mixer "PHASE".
   * MUST be false unless the recipe is deliberately building a
   * widener AND declares mono_safe: false. This is the single most
   * common way to build a patch that vanishes at FOH.
   */
  b_polarity_invert?: boolean;
}

export interface RecipeRouting {
  /**
   * Where the signal splits. Either a chain_blocks position (split
   * happens immediately BEFORE that position) or a named stage.
   */
  split_after: number | "input" | "pre-amp" | "post-amp" | "pre-cab";
  /** Split behaviour. Matches what the platforms actually offer. */
  split_type: "y" | "a_b" | "crossover" | "dynamic";
  /** For crossover splits only — the split frequency in Hz. */
  crossover_hz?: number;
  paths: RoutingPath[];
  /** Omitted when the paths go to separate outputs and never re-merge. */
  merge?: RoutingMerge;
  /**
   * Set when the paths are NOT re-merged internally — e.g. cab'd path
   * to FOH, cab-less path to a stage amp. Values are the platform's
   * own output names.
   */
  path_outputs?: { A: string; B: string };
  /** Why the split earns its DSP. Required — see R3. */
  notes: string;
}
```

and on the translation:

```ts
export interface PlatformTranslation {
  chain_blocks: PlatformBlock[];
  notes: string;
  routing?: RecipeRouting;   // NEW — only when a split is real
}
```

and on the recipe:

```ts
export interface ToneRecipe {
  // ...
  /** Does this tone survive FOH summing L+R? See ROUTING_AND_MIX_ARCHITECTURE.md. */
  mono_safe?: boolean | "conditional";
  /** Required when mono_safe is false or "conditional". What breaks, and the swap. */
  mono_note?: string;
}
```

### Worked example A — a documented simultaneous blend

Adam Jones' rig is one of the few that passes the "simultaneous" test:
a Marshall Super Bass and a Diezel VH4 running at once, with a third
amp rotating (sources disagree between a Bogner Überschall and a Mesa —
the recipe should say so).

```ts
helix: {
  chain_blocks: [ /* … 0: gate, 1: comp, 2: drive, 3: Brit Plexi Brt,
                        4: 2x15 Brute, 5: Das Benzin Mega, 6: 4x12 Uber V30,
                        7: delay … */ ],
  routing: {
    split_after: 3,
    split_type: "y",
    paths: [
      { id: "A", block_positions: [3, 4], role: "Super Bass — low-end weight" },
      { id: "B", block_positions: [5, 6], role: "VH4 — gain and cut" },
    ],
    merge: {
      a_level_db: -3.0,
      b_level_db: -3.0,
      a_pan: -25,
      b_pan: 25,
      b_polarity_invert: false,
    },
    notes:
      "Two amps, not one amp twice — the split earns its DSP because the " +
      "voicings barely overlap (see ROUTING_AND_MIX_ARCHITECTURE.md §2.2 Q2, " +
      "the 3 dB test). Merge levels sit at -3.0 dB each because an even Helix " +
      "split-and-merge nets +3 dB on correlated content; pulling both legs " +
      "back 3 dB restores unity so bypassing the split doesn't jump. Pans " +
      "stay inside ±25 so the blend survives a mono FOH. Calibrated on a " +
      "Helix LT — an HX Stomp ships its Merge Mixer at +3.0 dB, so zero it " +
      "first.",
  },
  notes: "… FRFR-calibrated …",
},
```

`mono_safe: true` here — ±25 pan is a level trim in mono, not a
cancellation. Hard-panning the same two cabs would make it
`"conditional"`.

### Worked example B — a recipe that should NOT get a `routing` field

`mccready-black-solo` currently reads as a two-amp blend in prose. The
only primary quote available describes **two amps for two different
parts**: a JCM800 with a 4×12 for the lead, a Fender Bassman for the
clean sections. That is a snapshot/scene story, not a parallel split.

The correct fix is to leave `routing` undefined, correct the prose, and
express the two amps as two **snapshots** or a default-off alternate
amp block — which the current format already supports. A `routing`
field added here would encode a claim the source doesn't make.

This is the case R3's `routing.notes` requirement is designed to catch:
if you can't write a sentence saying why the split exists, the split
shouldn't exist.

---

## Migration: the `Mix: 50` vs `Mix: 0.5` split

### Scope (measured 2026-07-25 against `src/lib/data/index.ts`)

| | count |
| --- | --- |
| Recipes in `toneRecipes` | 195 |
| Total `Mix:` parameters | 1,696 |
| Written 0–100 (percent form) | 1,100 |
| Written 0–1 (normalised form) | 596 |
| Recipes containing **both** forms somewhere | 192 |
| Platform blocks containing both forms **inside one platform** | 54 |

Per platform:

| Platform | 0–1 form | 0–100 form | recipes w/ 0–1 | recipes w/ 0–100 | mixed inside one platform |
| --- | ---: | ---: | ---: | ---: | ---: |
| `helix` | 5 | 482 | 5 | 195 | 5 |
| `quad_cortex` | 45 | 420 | 30 | 183 | 18 |
| `fractal` | 426 | 57 | 192 | 33 | 30 |
| `kemper` | 120 | 130 | 90 | 98 | 1 |
| `tonex` | 0 | 11 | 0 | 8 | 0 |
| `katana` | 0 | 0 | 0 | 0 | 0 |
| **Total** | **596** | **1,100** | | | **54** |

Helix has effectively already standardised on percent (482 : 5).
Fractal went the other way (426 : 57). Kemper is a coin flip
(120 : 130). QC leans percent (420 : 45). **Percent wins** — it's
what four of the five devices show on screen, it matches the majority
of the data, and it's the form the prose already uses ("Mix at 50%
keeps the natural attack present").

### The ambiguous band

14 values sit in 1.0–5.0, where the reader cannot tell which
convention was intended:

| Recipe | Platform | Block | Value | Verdict |
| --- | --- | --- | --- | --- |
| `gilmour-comfortably-numb-solo` | fractal | Plate | `3.0` | **Bug.** Helix/QC/Kemper siblings all say `25`. Decimal slip. |
| `korn-blind-intro` | helix, quad_cortex | (reverb) | `5` | Percent — both platforms agree, plausible as 5%. |
| `evh-panama-brown-sound` | fractal | Script (phaser) | `1.0` | 100% wet. |
| `page-black-dog-riff` ×4 | quad_cortex, fractal | — | `1.0` | 100% wet. |
| `mccready-even-flow-solo` | fractal | — | `1.0` | 100% wet. |
| `gibbons-sharp-dressed-man-eliminator` | fractal | Studio Comp | `1.0` | 100% wet (series comp). |
| `moore-living-hope` | fractal | Studio Comp | `1.0` | 100% wet (series comp). |
| `donegan-down-with-the-sickness-riff` | fractal | Pitch Block | `1.0` | 100% wet — the note literally says "100% wet". |
| `kk-downing-hell-bent-for-leather-riff` | kemper, fractal | Wah | `1.0` | 100% wet. |

Every `1.0` means 100%. This is the reason the migration cannot be a
blind `value <= 1 ? value * 100 : value` — `1.0` and `1` would both
land on `1%`.

### Migration procedure

1. **Freeze the ambiguous band first.** Hand-fix the 14 values above
   (13 become `100`, one becomes `25`, two stay `5`) in their own
   commit, before any bulk pass. This is the only step that requires
   judgement.
2. **Bulk convert.** For every remaining `Mix` value `v` where
   `v < 1.0`: `v → Math.round(v * 100)`. 583 values. Write
   `scripts/normalize-mix-units.ts` in the same shape as the existing
   `scripts/migrate-helix-amp-scale.ts` and
   `scripts/fix-knob-order.ts`.
3. **Fix the prose too.** 30+ block `notes` say "Mix at 0.5 keeps the
   natural attack present" where the sibling platform's note says
   "Mix at 50%". Same regex pass: `/Mix (?:at|of) (0\.\d+)/` →
   percent. Leaving the prose behind re-introduces the ambiguity in
   the one place the reader is most likely to trust it.
4. **Do NOT convert the `.hlx` writer.** The Helix file format stores
   flat floats 0–1 (Bible § 12, "Params are flat floats"). Divide by
   100 in the emitter, not in the data.
5. **Cross-platform sanity pass.** After normalisation, flag any
   recipe where the same conceptual block differs by more than 15
   points across platforms. That's the check that would have caught
   the Gilmour `3.0` before it shipped, and it will surface the
   *second* class of bug — the one unit normalisation does **not**
   fix, where "30" on a Fractal delay and "30" on a Helix delay are
   genuinely different amounts of reverb (see
   ROUTING_AND_MIX_ARCHITECTURE.md § 1). That pass is a separate
   project; land the units first.
6. **Then** turn on `mix-units-normalized` as `warn`, run one weekly
   audit, promote to `error`.

### Ordering note

Run this migration **before** adding `routing`. The `routing` merge
levels are in dB and the Mix values are in percent; introducing both
units in the same commit is how the next inconsistency starts.

Per memory rule (weekly-audit concurrent commit), commit the migrated
recipe files with `git commit -m msg -- <paths>` rather than a bare
`git commit`, since the weekly audit races content tasks that stage
blog files mid-run.

---

## Rules considered and rejected

- **`mix-law-annotated`** — a field recording which mix law each block
  assumes. Correct in principle, unusable in practice: it would need a
  per-platform-per-block-type lookup table maintained against firmware
  changes, and Line 6 and Neural DSP don't publish theirs. The
  conversion table in ROUTING_AND_MIX_ARCHITECTURE.md § 1 does the same
  job as documentation without pretending to machine-checkable
  precision.
- **`no-hard-pan`** — banning ±100 pans outright. Too blunt. Hard
  panning is correct for a studio-accurate double-track recipe and
  wrong for a live worship patch; that's what `mono_safe` is for.
- **`global-eq-declared`** — putting Global EQ values in the recipe.
  Global EQ is global: it applies to every preset on the device, so it
  belongs in the reference doc and the platform guide, not in
  per-recipe data where 195 copies of the same number would drift.
