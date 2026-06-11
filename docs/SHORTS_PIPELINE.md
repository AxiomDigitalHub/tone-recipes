# YouTube Shorts Pipeline — "60-Second Tone Recipe"

**Status:** Phase 0 (blocked on audio). The contractor program in `docs/AUDIO_PREVIEWS_CONTRACTOR_BRIEF.md` unblocks this — every delivered clip serves both the site preview AND a Short.

**Format (faceless, $0 marginal production):** vertical 1080×1920, 45–60s per recipe:
1. Hook frame (0–3s): album-art-style card + "How [song] actually sounds — exact settings" — text overlay
2. Signal chain animation (3–20s): blocks appear left-to-right (guitar → drive → amp → cab → delay → reverb) with the real model names from the recipe data
3. Settings reveal (20–40s): animated knob cards per block, values from `platform_translations.helix`
4. Audio proof (throughout): the contractor's wet clip plays under everything
5. CTA (final 5s): "Full recipe + 5 more platforms → faderandknob.com" + QR

**Why this works as AI, honestly:** the visuals, script, and assembly are 100% automatable from recipe data we already have. The ONE thing AI can't fake is the audio — synthetic guitar tone would destroy credibility with this audience instantly. So: contractor audio (real), everything else generated. No AI voiceover initially — text-on-screen + the riff is the native Shorts idiom for gear content and avoids the AI-voice tell.

**Build plan (once first audio batch lands):**
- Phase 1: Remotion (React video) project rendering the template from a recipe slug — recipe data in, MP4 out. ~2–3 sessions of work. All assets derive from existing data (LpArt-style cards, canonical knob order, real model names).
- Phase 2: batch render + YouTube Data API upload (needs a Google Cloud OAuth client — Daniel one-time setup, ~15 min), title/description/tags generated from recipe metadata, description links to the recipe page.
- Phase 3: fold into the daily recipe routine — every new recipe with audio ships a Short automatically. Also cross-post to Instagram Reels/TikTok manually-first.

**Cadence target:** 3–5 Shorts/week once flowing. Measure: subs, brand searches in GSC ("fader and knob"), referral sessions from youtube.com.

**Dependency chain:** contractor hired → first 5-clip test batch → QC loop proven → Remotion template built → first 5 Shorts manually reviewed by Daniel → automate.
