# Tone Demo Audio Pipeline

The single highest-leverage SEO/E-E-A-T move on the site: a self-produced
audio demo on every recipe. No direct competitor ships one. The clip is also
your *proof* — it's what turns an asserted recipe into a verified one, and its
render date is the honest trust signal that replaced the seeded reviews.

## The honest constraint

Presets are `.hlx` (Line 6 Helix). Helix's amp/cab/effect models are
**proprietary DSP** — there is no open-source / pure-Python way to render a
`.hlx` tone. The *only* step that needs the plugin is getting a DI through each
preset into a raw WAV. Everything after that is automated.

So this is **mostly** automated, not fully. The split:

| Step | Who does it | Cost |
|------|-------------|------|
| Record DI source (clean/crunch/lead phrases) | you, once ever | one short session |
| DI → tone (load `.hlx`, render) | Helix Native ($99) or hardware | manual-ish, scriptable |
| Normalize → MP3 → waveform video → schema | `render-recipe-audio.mjs` | one command |

## One-time setup

1. `brew install ffmpeg` (gives `ffmpeg` + `ffprobe`).
2. Record (or license) **DI** guitar passes — clean strum, crunch riff, lead
   lick. Re-use these forever; you never perform per-recipe.
3. Buy **Helix Native** (loads the same `.hlx` files in `presets/`).

## Producing the raw renders (the plugin step)

For each preset, get a `audio/raw/<slug>.wav` (slug = preset filename without
`.hlx`, so the manifest matches the recipe). Pick the workflow that fits:

- **Manual (simplest):** In any DAW, put the DI on a track, load Helix Native,
  import `presets/<slug>.hlx`, bounce to `audio/raw/<slug>.wav`. ~2 min each.
- **Scripted batch (Reaper):** Reaper hosts Helix Native as VST3 and renders
  from the command line (`reaper -renderproject project.rpp`). Build one
  template project with the DI + Helix Native, then script per-preset: swap the
  `.hlx`, set the render path, invoke the CLI. This makes even the plugin step
  hands-off after setup. (Helix Native preset import is the one fiddly bit —
  Reaper's FX chain `.RfxChain` can wrap the plugin state per preset.)
- **Hardware reamp:** DI out → Helix/HX Stomp → interface in. Most authentic,
  fully manual.

## Generate web assets + schema

```bash
node scripts/render-recipe-audio.mjs                 # process every audio/raw/*.wav
node scripts/render-recipe-audio.mjs --slug=cobain-teen-spirit-grunge
node scripts/render-recipe-audio.mjs --no-video      # MP3 only, skip waveform video
node scripts/render-recipe-audio.mjs --caption="Strat DI — clean verse into the chorus hook"
```

It writes `public/audio/<slug>.{mp3,mp4}` and upserts
`src/data/audio-demos.json`. The recipe page reads that manifest and
automatically renders the player + emits `AudioObject`/`VideoObject` JSON-LD —
no per-recipe code changes.

After running: review each `caption` (and add a `source_note` like
`"Strat DI → Helix Native 3.8"`) in the manifest, then commit `public/audio/`
+ `src/data/audio-demos.json`.

## Suggested rollout

Backfill the top ~25 recipes by traffic first (per the content-authority
strategy), then make a rendered demo part of the definition-of-done for every
new recipe.
