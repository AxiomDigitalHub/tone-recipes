# ToneTrace — Product Roadmap

**Last updated:** April 9, 2026
**Status:** Not started. Blocked by core service operational state + reference audio dataset.
**Scope:** AI-powered tone analysis tool embedded in faderandknob.com. Upload audio, get a matched signal chain and downloadable preset.

ToneTrace is a **separate product line** from the core faderandknob service. The core service (`ROADMAP.md`) must be operational before ToneTrace development begins.

---

## Vision (from the project brief)

A guitarist uploads a short audio clip of a tone they want to replicate. ToneTrace analyzes it and returns a complete signal chain recommendation with specific settings, formatted as a downloadable preset file for their device.

The output is actionable, not suggestive: specific pedal, specific drive level, specific amp model, specific EQ settings — ready to load tonight.

**The database is the moat. ToneTrace is the product that sits on top of it.**

---

## Two Customer Profiles

### ICP 1: The Classic Rock Tone Chaser
Hobbyist/semi-serious guitarist, 30-55. Owns a modeler. Knows what tone they want. Can't figure out why their version sounds wrong. Currently solving this with conflicting YouTube videos and old forum posts.

**Value prop:** Upload the studio recording. Get exact settings for your Helix. Download the preset. Done.

### ICP 2: The Worship Guitarist
Performing guitarist at a church, 22-45. Plays weekly with a hard Sunday deadline. Owns Helix/QC/Fractal. Runs direct to a quiet stage with in-ears. Needs reproducible tone with snapshots across a full setlist.

**Value prop:** Upload a clip from a live worship video. Get a preset with snapshots already configured for the full set. Download Monday. Rehearse Tuesday. Play Sunday.

---

## The Problem ToneTrace Solves

Reverse-engineering a tone from a recording is a professional skill that takes years. The variables are complex: guitar, pickups, pedal chain order, amp model, amp settings, cabinet, mic placement, room acoustics, player's touch.

Most guitarists can identify a tone's quality. Very few can diagnose what's producing it. Current options (forums, YouTube, stock presets) all fall short because none of them translate *what you hear* into *what you set*.

---

## 6-Layer Architecture

### Layer 1: Audio Analysis Engine
Extract tonal + amp characteristics from uploaded audio.

**Tonal features:** frequency spectrum, harmonic content classification, compression signature, reverb/delay/modulation presence, dynamic range, pickup type inference.

**Amp signature features (the hard part):** even vs odd harmonic ratio, midrange resonance frequency, transient clipping behavior, low-end rolloff curve.

**Libraries:** librosa (spectrum, onset detection), essentia (timbral descriptors), openl3 / CLAP (audio embeddings).

**I/O:** audio file in (MP3/WAV/M4A, 5-30s). Two JSON vectors out (tone vector + amp vector, stored and weighted separately).

### Layer 2: Recipe Database with Audio References
**Critical dependency for everything else.** Every recipe needs reference audio recorded to a consistent standard: same guitar, documented pickup, DI-only, 10-15 seconds of sustained chords + single notes.

**One recording session, two outputs:** builds the retrieval DB AND trains the amp classifier. Cutting corners compounds as the database grows.

**Schema additions:**
- `audio_reference_url`
- `tone_vector` (frequency + effects characteristics)
- `amp_vector` (harmonic ratios, resonance, clipping)
- `signal_chain` (guitar, amp family, amp settings, pedals with types + settings)

### Layer 3: Retrieval-Based Matching (MVP — Ship First)
Given an uploaded clip, find the closest matching recipe and return its signal chain. Requires audio analysis working + reference clips attached to all recipes + similarity search.

**How it works:** Upload → Layer 1 produces vectors → cosine similarity against recipe vectors → amp vector narrows field → tone vector ranks within → top 3-5 matches with confidence scores.

**Vector DB:** Start with Chroma (local, no infra cost). Migrate to Pinecone past 1,000 recipes.

**User output:** Top match, full signal chain, amp family confidence breakdown, one-click preset download, PDF, feedback widget.

### Layer 4: Amp Classifier (Phase 2)
Train a dedicated classification model to identify amp family from audio, independent of recipe retrieval.

**Three approaches in priority:**
- **A. Harmonic fingerprinting (build first):** extract even/odd harmonic ratios, add as dimensions to amp vector. No trained model required. Buildable in Phase 1.
- **B. Amp family classifier (Phase 2):** train on 200+ labeled dry recordings through known Helix/Fractal amp models. Output: probability distribution across amp families.
- **C. IR matching (Phase 3, worship clean tones only):** deconvolve reverb/room from a clip and compare residual to known amp IRs.

**Practical shortcut:** optional amp family selector in upload UI (Fender/Vox/Marshall/Mesa/High Gain/Skip). One human input dramatically narrows the search without any ML.

### Layer 5: Generative Parameter Prediction (Phase 3, 12+ months)
Instead of returning an existing recipe, generate a novel signal chain with specific parameter values based on audio features.

Requires a trained regression model that maps audio vectors directly to signal chain parameters. Minimum viable training data: 200-500 labeled recipes with dry reference audio. At 50 today, this is a 6-12 month data collection project running in parallel with retrieval.

**Framework:** PyTorch or scikit-learn. Staged prediction: amp family first, then per-parameter values given that family. Mirrors how a professional ear diagnoses tone.

### Layer 6: Feedback Loop
Capture user corrections to improve model accuracy. **Must be built into Phase 1** — every interaction is training data.

**Collect:** thumbs up/down rating, parameter corrections, platform, context (worship/studio/live/practice).

---

## Build Phases

### Phase 0: Prerequisites (Blocked By Core Service)
Before any ToneTrace work begins:
- Core service (`ROADMAP.md`) must be operational
- Stripe working end-to-end
- At least 100 recipes in the catalog

### Phase 1: Retrieval Engine MVP
**Goal:** A working upload-and-match tool using existing recipes. Ship something a real user can download a preset from.

**Critical path: reference audio recording.** Until all recipes have clips, nothing else works.

**Steps:**
1. Define and document the recording standard
2. Record reference clips for all existing recipes
3. Run Layer 1 analysis on each clip → store tone + amp vectors
4. Build similarity search with Chroma (weighted matching: amp vector narrows, tone vector ranks)
5. Upload UI: drag-and-drop, analyze, return top 3 matches with confidence + signal chain details
6. Wire to existing Helix preset export
7. Add optional amp family selector
8. Build feedback widget

**Definition of done:** A user uploads a clip, gets 3 closest matches with signal chains and a download button, and can rate + submit corrections.

### Phase 2: Database Expansion + Amp Classifier
**Goal:** Grow catalog to 200+ entries. Add harmonic fingerprinting. Expand platform exports.

**Priority content:**
- Worship (Hillsong, Bethel, Elevation, Maverick City, Jesus Culture, Lincoln Brewster)
- Classic rock with well-documented gear (SRV, Gilmour, Clapton, Mayer, The Edge)
- Artist-specific tones where the signal chain is publicly known

**Steps:**
1. Harmonic fingerprinting added to analysis pipeline for all recipes
2. Fractal + Quad Cortex export support
3. Begin collecting labeled dry recordings through Helix/Fractal amp models
4. Launch worship setlist builder: group recipes into a set, configure snapshot assignments, export full set as a package

### Phase 3: Generative Matching
**Goal:** Generate novel recommendations rather than returning existing recipes. Start when the database has 200+ labeled recipes with dry reference audio.

**Steps:**
1. Export all recipe tone vectors + amp vectors + signal chain parameters as training dataset
2. Train staged regression model (amp family → per-parameter values)
3. Evaluate against held-out recipes (target: within 10-15% of labeled values)
4. Replace or augment retrieval engine with generative output when quality clears threshold

### Phase 4: Monetization Layer
**Free tier:** browse database, view signal chain breakdowns, download PDFs, see top match result.

**Paid tier ($9-15/month):**
- One-click preset export to device (Helix, QC, Fractal, Katana)
- Full AI tone matching with parameter-level detail
- Worship setlist builder with snapshot configuration
- Save and compare rigs
- Early access to new recipes

---

## Success Metrics

| Metric | Phase 1 Target | Phase 2 Target |
|--------|---------------|----------------|
| Recipes with audio reference | 50 (all existing) | 200+ |
| Platforms supported for export | 2 (Helix + Fractal) | 4+ |
| Match accuracy (user rating 4+/5) | 60% | 80% |
| Weekly active users (ToneTrace) | 100 | 1,000 |
| Paid conversion rate | N/A | 8-12% |
| Worship recipes in DB | 20+ | 100+ |

---

## The Scenario (What Success Looks Like)

A worship guitarist watches a live worship video Sunday night. Monday morning they open faderandknob.com, upload a 15-second clip from their phone, and receive:

- 87% match to a specific song in the database
- Full signal chain breakdown with amp identified as Fender Blackface-style
- One-click download of the Helix preset with snapshots already configured
- PDF with full set breakdown

They load it Tuesday at rehearsal. It works. They play it Sunday.

That is the product. Everything in this roadmap exists to make that moment possible.

---

## What This Roadmap Does NOT Include

- Core service infrastructure (see `ROADMAP.md`)
- Blog content, SEO, email marketing, community features — those belong to the core service
- Mobile app
- Anything that doesn't directly serve the upload-to-preset workflow

---

## Key Dependencies & Risks

### Blocked By
1. Core service operational state (Stripe working, 100+ recipes)
2. Reference audio recording standard + actual recordings
3. Python audio analysis stack set up (librosa + essentia + Chroma)

### Risks
1. **Audio recording is the critical path** — if we can't produce consistent dry DI recordings, nothing works
2. **Two different signal chains can produce similar spectra** — a clean Fender Twin and a Vox AC30 with treble rolled back look almost identical in a spectrum plot. The amp vector has to do heavy lifting.
3. **Python stack is a new dependency** — the core service is Next.js/TypeScript. ToneTrace needs a separate Python service (FastAPI?) or a worker queue. Decide the deployment architecture before Phase 1.
4. **Training data quality** — 200+ dry recordings for the amp classifier is a significant recording effort. Can it be parallelized with the reference audio work?

---

*ToneTrace is the 10x product. The core service is what makes it possible.*
