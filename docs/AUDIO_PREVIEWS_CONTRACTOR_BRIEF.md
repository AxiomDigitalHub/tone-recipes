# Audio Previews — Contractor Brief & SOP

**Goal:** every recipe page gets a 15–25 second audio preview of the actual tone, recorded through the recipe's Helix preset. The same clips feed the YouTube Shorts pipeline, so each delivery is used twice.

**Daniel's total time commitment:** ~30 minutes to hire + ~10 minutes/week reviewing batches. Everything else is the contractor and Claude.

---

## 1. Who to hire

**The role:** a session guitarist who owns a Line 6 Helix-family device (Helix Floor/LT/Rack, HX Stomp, or Helix Native + audio interface) and can record clean DI + processed audio at home.

**Where to post (in order of fit):**
1. **SoundBetter** — search "session guitarist", filter by home studio; message 5 with Helix in their gear list
2. **Fiverr Pro** — search "guitar tracks Helix" or "session guitar recording"
3. **r/WeAreTheMusicMakers or r/Line6Helix** — a "paid gig" post finds Helix owners directly
4. **Worship guitarist Facebook groups** — ideal overlap: they own HX gear and know half the reference songs already

**Budget:** $8–15 per clip is fair market for this scope (one riff, two takes max, home studio). Batch of 20 = $160–300. Start with a paid test batch of 5 clips before committing to the full catalog. Full catalog (100 recipes, growing ~30/month) at $10 avg ≈ $1,000 backfill + ~$300/month ongoing.

**The job post (copy/paste):**

> **Session guitarist with Line 6 Helix — recurring weekly gig, recorded at home**
>
> I run faderandknob.com, a guitar tone-recipe site. I need short demo clips (15–25 sec) recorded through Helix presets I provide. Each clip: load my preset, play the reference riff from a classic song (I provide song + section + tab link), deliver the processed stereo WAV + the dry DI. No editing, no mixing — raw captures.
>
> Batches of 5–20 clips weekly. $X per clip. You need: any HX device (or Helix Native), an interface, and tight rhythm playing across rock/blues/metal styles. Reply with one clip of you playing through any Helix preset.

## 2. What we send the contractor per batch

Claude generates this automatically per batch (a folder + manifest):
- `presets/<recipe-slug>.hlx` — the preset file built from the recipe's Helix translation
- `manifest.csv` — one row per clip: recipe slug, song, artist, section to play (e.g. "main riff, 4 bars, ~95 BPM"), reference recording timestamp, tuning, pickup position
- Guitar guidance: humbucker vs single-coil per recipe (from `guitar_specs.pickup_config`) — contractor needs at minimum one HH and one SSS guitar; ask in hiring

## 3. Deliverable spec (goes in the contract)

- **Two files per recipe:** `<slug>__wet.wav` (stereo, through the preset) and `<slug>__di.wav` (dry DI, mono)
- 48 kHz / 24-bit WAV, peaks ≤ −6 dBFS, no clipping, no edits/fades, room noise trimmed at head/tail only
- 15–25 seconds: the recognizable section from the manifest, played to a click or the original recording
- Correct tuning per manifest (Eb standard, drop D, etc. — listed per recipe)
- Delivery: shared Dropbox/Drive folder, flat structure, exact filenames from the manifest
- Revisions: one re-take per clip if flagged (wrong section, sloppy timing, wrong pickup)

## 4. QC + publish loop (Claude does this)

1. Contractor uploads batch → Daniel drags folder into the repo's `audio-inbox/` (or shares the Drive link)
2. Claude QC pass: filename/spec check, loudness normalize to −14 LUFS, encode preview MP3/Opus, flag retakes
3. Upload to Cloudflare R2 (free tier, zero egress), add `audio_preview_url` to the recipe, ship
4. Same WAV feeds the Shorts pipeline (see `docs/SHORTS_PIPELINE.md`)

## 5. What Daniel actually has to do

1. Post the job (copy/paste above) and pick a contractor from replies — listen for timing, not tone (the preset IS the tone)
2. Approve the $ rate and pay per batch
3. Set up a Cloudflare R2 bucket once (~10 min; or hand Claude an API token and it's zero minutes)
4. Skim each batch's QC report (Claude flags anything off)

**Priority order for the first 20 clips:** the 10 most-trafficked recipe pages + the 10 most-recognizable riffs (Smoke on the Water, Back in Black, Enter Sandman tier) — recognizability is what makes previews convert.
