# Audio Preview System Research

Research for implementing in-browser audio previews of guitar presets on faderandknob.com.

Date: 2026-04-06

---

## 1. How Competitors Do It

### TONE3000 (formerly ToneHunt)

TONE3000 is the gold standard for in-browser guitar tone previews. They compile the Neural Amp Modeler C++ DSP engine into WebAssembly (via Emscripten) and run it inside an AudioWorklet through the Web Audio API. Every tone on the site has a play button that lets you hear the tone instantly. Users can plug in a guitar and play through 275K+ tones directly in the browser. They also let users pick different DI inputs and cabinet IRs for amp-head-only models.

They open-sourced their WebAssembly player as `neural-amp-modeler-wasm` on GitHub (github.com/tone-3000/neural-amp-modeler-wasm) and npm.

Key takeaway: Real-time neural inference in the browser is production-ready but CPU-intensive, requiring modern processors (Apple Silicon, recent Intel/AMD).

### Neural DSP / Cortex Cloud

Neural DSP's Cortex Cloud hosts user-shared captures and presets for the Quad Cortex. They provide demo recordings attached to captures, but there is no real-time in-browser processing. Users on their forum have requested an "instant preview mode" for browsing captures, suggesting the current experience requires extra steps to hear tones. Their plugin products (Archetype series) have no web-based preview -- you download a trial.

Key takeaway: Even a well-funded competitor relies on pre-recorded demos, not real-time processing.

### Kemper Rig Exchange

Kemper's Rig Exchange has 20,000+ free profiles. Audio preview happens only through the Rig Manager desktop application -- click a rig and it loads to your connected Profiler hardware for auditioning. There is no in-browser audio preview on the web. The mobile apps are intentionally limited compared to the desktop Rig Manager.

Key takeaway: Kemper has zero web audio preview. This is a gap in their UX.

### Line 6 CustomTone

CustomTone (line6.com/customtone) is a free preset exchange for Line 6 products. It has no audio preview at all. You browse by name, tags, and pickup type (single coil / humbucker icons), then download the preset file and load it onto your hardware. Third-party sites like FluidSolo (fluidsolo.com) offer Helix presets with user-uploaded SoundCloud or YouTube embeds as audio demos, but this is community-contributed and inconsistent.

Key takeaway: The official Helix preset ecosystem has NO audio preview. This is the exact gap faderandknob.com can fill.

### Splice

Splice is the gold standard for sample/sound preview UX. Every sample has an inline waveform player with instant playback on click. They serve previews through their CDN with dynamics processing to normalize volume across samples (though they recently removed this to give more faithful representations). Their Bridge feature lets you preview sounds in your DAW's key and tempo. The web player uses standard Web Audio API with custom waveform rendering.

Key takeaway: Splice proves that fast, inline audio preview is essential for conversion. Their UX pattern (click waveform to play, scrub to seek) is the model to follow.

### ChopTones / Sadites / Premium Preset Sellers

Third-party Helix preset sellers like ChopTones and Jason Sadites typically embed YouTube videos or SoundCloud players on their product pages. This is the most common approach in the paid preset market. It works but is heavy, slow to load, and requires third-party dependencies.

---

## 2. Audio Formats for Web

### Format Comparison

| Format | Quality at Low Bitrate | File Size (30s clip) | Browser Support | Licensing |
|--------|----------------------|---------------------|-----------------|-----------|
| MP3 (128kbps) | Good | ~480 KB | Universal | Patent-free since 2017 |
| MP3 (192kbps) | Very good | ~720 KB | Universal | Patent-free |
| AAC (128kbps) | Better than MP3 128 | ~480 KB | All modern browsers | Royalty-free for web |
| OGG Vorbis (128kbps) | Better than MP3 128 | ~480 KB | All except old Safari | Fully open source |
| WAV (16-bit/44.1kHz) | Lossless | ~5.3 MB | Universal | No compression |
| Opus (96kbps) | Excellent | ~360 KB | All modern browsers | Open source, best quality/size |

### Recommendation for Guitar Tone Demos

**Primary: MP3 at 192kbps.** This is the pragmatic choice:
- Universal browser support including all mobile devices
- At 192kbps, guitar tone differences are clearly audible (distortion textures, reverb tails, pick dynamics)
- A 30-second clip is ~720 KB, a 15-second clip is ~360 KB
- Familiar format, easy tooling, no edge cases

**Alternative: AAC at 128kbps** offers equivalent quality to MP3 192 in a smaller file, but MP3's universality makes it simpler.

**For 50 presets with 2 clips each (30s clean + 30s dirty):**
- MP3 192kbps: ~72 MB total
- MP3 128kbps: ~48 MB total

These are small enough that CDN costs are negligible.

### Optimal Clip Length

For guitar tone demos, 15-30 seconds per clip is the sweet spot. Long enough to hear dynamics and tone character, short enough for fast loading and quick comparison browsing.

---

## 3. Recording Approach

### Option A: DI + Reamp (RECOMMENDED)

Record a single high-quality DI (direct input) guitar signal and reamp it through every preset on the Helix LT.

**Why this is the best approach:**
- Perfect consistency -- same performance, same timing, same dynamics across all 50 presets
- A/B comparison is meaningful because the only variable is the preset
- Can re-record all demos by simply reamping again if presets change
- Industry-standard method used by amp modeler reviewers

**Best practices for the DI recording:**
- Use a quality DI box (even the Helix LT's own DI output works)
- Record at 24-bit/48kHz WAV
- Capture the DI before any processing in the signal chain
- Keep dynamics natural -- don't compress the DI
- Record multiple performances for different contexts (see demo format below)

**Equipment needed:**
- Helix LT (already owned)
- Audio interface (for recording the Helix output back into the DAW)
- DAW (any -- Logic, Reaper, Ableton)

**Process:**
1. Record 3-4 DI performances (clean riff, dirty riff, chords, lead lick)
2. For each of the 50 presets: load preset on Helix LT, play back DI through the input, record the processed output
3. Trim, normalize, export as MP3
4. Batch process with a script to keep naming/levels consistent

### Option B: Live Recording Through Each Preset

Play guitar live through each preset and record the output. Simpler but less consistent -- performance varies between takes, making A/B comparison unreliable. Only consider this if you want to showcase playability (how the preset responds to dynamics).

### Option C: AI-Generated Audio

Current state (2025-2026): AI audio generation (Google MusicLM, Suno, Udio) can generate guitar-like audio from text prompts, but it cannot accurately represent specific Helix preset settings. The output would be generic "guitar tone" rather than an accurate representation of a particular amp model + cab + effects chain. Neural amp modeling (NAM, AIDA-X) is different -- it faithfully recreates specific amp circuits via deep learning, but requires training on the actual hardware.

**Verdict: Not viable for accurate preset demos.** The whole point is to hear what THIS specific preset sounds like. AI generation would be misleading.

### Standard Demo Format

Based on how professional preset sellers and amp demo channels present tones:

1. **Clean chords** (5-8 seconds) -- open chords or arpeggios to showcase clean headroom, reverb, and clarity
2. **Dirty/crunch rhythm** (8-10 seconds) -- power chords and palm mutes to showcase gain character and tightness
3. **Lead lick** (5-8 seconds) -- single-note lines to showcase sustain, harmonics, and gain saturation
4. **Cleanup test** (optional, 5 seconds) -- rolling back guitar volume to show how the preset cleans up

For faderandknob.com, recording 2 clips per preset is practical:
- **Clip A: "Clean/Rhythm"** -- 15-20 seconds covering clean chords into light rhythm
- **Clip B: "Drive/Lead"** -- 15-20 seconds covering heavier rhythm into a lead phrase

---

## 4. Web Audio API and Player Libraries

### Library Comparison

#### Howler.js
- **Size:** ~7 KB minified
- **Best for:** Simple play/pause/stop audio playback
- **Strengths:** Dead simple API, cross-browser (falls back to HTML5 Audio), sprites for multiple clips in one file, auto-caching
- **Weaknesses:** No waveform visualization, no Web Audio effects
- **GitHub stars:** ~22K, weekly downloads: ~287K
- **Verdict:** Best for MVP. Just play/pause buttons with no waveform.

#### Wavesurfer.js
- **Size:** ~50 KB minified
- **Best for:** SoundCloud-style waveform players
- **Strengths:** Beautiful waveform visualization, seeking by clicking waveform, official React component (`@wavesurfer/react`), plugin system (regions, timeline, minimap)
- **Weaknesses:** Larger bundle, more complex to set up, needs to decode entire audio to render waveform
- **GitHub stars:** ~8K+
- **Verdict:** Best for v2. Gives the polished, professional look.

#### Tone.js
- **Size:** ~150 KB minified
- **Best for:** Music synthesis, sequencing, and effects
- **Strengths:** Full synth engine, scheduling, effects chain
- **Weaknesses:** Way overkill for playback. Designed for creating music, not playing back audio files.
- **Verdict:** Not needed. Ignore for this use case.

#### Native HTML5 Audio Element
- **Size:** 0 KB (built into the browser)
- **Best for:** Absolute minimum viable implementation
- **Strengths:** Zero dependencies, works everywhere, accessible by default
- **Weaknesses:** No waveform, limited styling control, browser-dependent UI
- **Verdict:** Could work for a quick prototype. Style it with CSS.

### Recommendation

**MVP:** Howler.js or even a custom hook wrapping the native HTML5 Audio API. Keep it simple -- play button, progress bar, time display.

**V2:** Wavesurfer.js with `@wavesurfer/react` for waveform visualization. This gives the Splice/SoundCloud feel.

---

## 5. Hosting and CDN

### Storage Cost Comparison (for 50-500 audio clips)

Assuming 100 clips at ~500 KB each = 50 MB total storage. Even at 500 clips = 250 MB.

| Service | Storage Cost | Egress Cost | Free Tier | Notes |
|---------|-------------|-------------|-----------|-------|
| **Cloudflare R2** | $0.015/GB/mo | **$0 (free forever)** | 10 GB storage, 10M reads/mo | Best value. Zero egress is huge. |
| **Vercel Blob** | $0.023/GB/mo | $0.05/GB | 1 GB storage, 10 GB transfer (Pro) | Convenient if already on Vercel |
| **AWS S3** | $0.023/GB/mo | $0.09/GB | 5 GB for 12 months | Industry standard but egress costs add up |
| **Supabase Storage** | $0.021/GB/mo | Included in bandwidth | 1 GB (free), 100 GB (Pro) | Good if already using Supabase |

### Recommendation

**Cloudflare R2 is the clear winner** for audio file hosting:
- Zero egress fees means streaming audio to users costs nothing
- 10 GB free tier covers hundreds of audio clips easily
- S3-compatible API (easy migration path)
- Global CDN built in via Cloudflare's network
- 50 MB of audio files would cost literally $0/month on the free tier

For a Next.js site on Vercel, the workflow would be:
1. Upload audio files to Cloudflare R2
2. Serve them via a custom domain or R2 public URL
3. Reference the URLs in your recipe data

**Vercel Blob** is a reasonable alternative if you want everything in one ecosystem, but you pay for egress and the free tier is smaller.

---

## 6. UX Patterns

### Inline Play Button on Recipe Cards

The most impactful pattern. Each recipe card gets a small play/pause button (triangle icon). Clicking plays a 15-30 second audio clip. Only one clip plays at a time (clicking another pauses the current one). This is how Splice, Beatport, and music libraries work.

Implementation: A shared audio context/state at the app level. Each card dispatches "play this URL" and the global player handles playback and exclusive access.

### Waveform Visualization

A mini waveform bar inside or below each card. Shows playback progress visually. Users can click/scrub to seek. Wavesurfer.js handles this well. Consider pre-generating waveform data server-side to avoid client-side decoding lag.

### A/B Comparison (Clean vs. Dirty)

Two small buttons or a toggle: "Clean" | "Drive". Each loads a different audio clip for the same preset. This is extremely valuable for tone evaluation and is rare in the preset market -- it would be a differentiator.

### Auto-play on Hover vs. Click-to-Play

**Click-to-play is strongly recommended.** Auto-play on hover is annoying, causes accidental playback on mobile, uses bandwidth unexpectedly, and violates browser autoplay policies (most browsers block audio without user gesture). Splice uses click-to-play. Follow their lead.

### Mobile Considerations

- Touch targets must be at least 44x44px for play buttons
- Waveforms should be simplified on mobile (fewer bars)
- Consider a sticky bottom player bar on mobile for currently playing clip
- iOS Safari requires a user gesture to start audio context -- the first play button tap initializes it
- Preload metadata only (`preload="metadata"`) to save mobile bandwidth
- Test on low-end Android devices for Web Audio performance

### Global Player Pattern

Like SoundCloud's persistent bottom bar: a global audio player at the bottom of the viewport that persists across page navigation. Shows current track, progress, and controls. In Next.js, mount it in the root layout so it survives route changes.

---

## 7. The "DI + Reamp" Approach for Web

### Concept

Ship a standard DI recording (raw guitar signal) and let users hear it processed through different presets. Two possible implementations:

### Server-Side Reamp (Pre-rendered)

Record the DI once, reamp through all 50 presets on the Helix LT, and host the resulting audio files. This is the practical approach described in Section 3. The "reamp" happens at production time, not in the browser.

### Client-Side Processing (Experimental)

Use the Web Audio API's ConvolverNode to apply cabinet impulse responses (IRs) to a DI signal in real-time in the browser. This would let users hear the DI through different cabinets. However, Helix presets are more than just a cabinet -- they include amp models, effects, and complex signal chains that cannot be replicated with a simple convolver.

**What IS possible in-browser:**
- Apply cabinet IRs (impulse responses) using ConvolverNode -- lightweight, works well
- Apply basic effects (EQ, reverb, delay) using Web Audio nodes
- Apply NAM/AIDA-X captures using neural-amp-modeler-wasm (real-time neural inference)

**What is NOT possible in-browser:**
- Running a full Helix signal chain (the amp models are proprietary Line 6 DSP)
- Accurately recreating multi-block Helix presets with effects routing

### Verdict

Client-side processing cannot replicate Helix presets. The DI + physical reamp approach (record once, serve pre-rendered audio) is the only way to give an accurate representation.

---

## 8. NAM / AIDA-X in Browser

### Current State

TONE3000 has proven that Neural Amp Modeler runs in the browser via WebAssembly. Their open-source `neural-amp-modeler-wasm` npm package makes this available to any developer.

### Technical Requirements

- **WebAssembly + AudioWorklet**: The DSP runs in a separate audio thread
- **SharedArrayBuffer**: Required for the WASM + AudioWorklet stack
- **HTTP Headers**: Pages must serve `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`
- **CPU**: Modern processor required (Apple Silicon, recent Intel/AMD). Will struggle on older/low-end devices.

### What This Means for faderandknob.com

NAM/AIDA-X captures are NOT Helix presets. They are neural network models trained on specific real amp circuits. You cannot load a .hlx file into the NAM web player. They are fundamentally different technologies.

However, a creative approach could be:
1. Train NAM captures of the specific amp + cab combinations used in your Helix presets
2. Host those NAM models on your site
3. Let users play a DI through the NAM capture in the browser

**Problems with this approach:**
- Training NAM models requires the physical amps (you're using Helix models of amps, not real amps)
- You'd be capturing Helix's model of a Fender Deluxe, not a real Fender Deluxe
- Effects (delay, reverb, compression) are not captured by NAM -- only the amp tone
- Massive scope creep for questionable benefit
- CPU requirements exclude a large portion of mobile users

### Verdict

NAM-in-browser is impressive technology but not practical for faderandknob.com. It solves a different problem (auditioning NAM captures) than what we need (previewing complete Helix preset recipes). Pre-recorded audio clips are simpler, more reliable, work on all devices, and accurately represent the full signal chain.

---

## 9. Metadata and SEO

### Schema.org AudioObject Markup

Adding structured data for audio content can improve search visibility:

```json
{
  "@context": "https://schema.org",
  "@type": "AudioObject",
  "name": "Fender Deluxe Clean - Tone Recipe Demo",
  "description": "Audio demo of the Fender Deluxe Clean tone recipe for Line 6 Helix",
  "contentUrl": "https://cdn.faderandknob.com/audio/fender-deluxe-clean.mp3",
  "encodingFormat": "audio/mpeg",
  "duration": "PT30S",
  "uploadDate": "2026-04-06"
}
```

This can be nested inside the existing recipe page schema (e.g., as part of a `HowTo` or `Product` type).

### SEO Benefits

- **Rich results**: Google can show audio players in search results for some content types (primarily podcasts and music). Guitar tone demos are unlikely to trigger rich audio results today, but the schema still helps Google understand the content.
- **Discoverability**: Audio content with proper schema markup may appear in Google's audio-specific search features.
- **Engagement signals**: Pages with audio previews tend to have longer dwell time and lower bounce rates, which are positive ranking signals.
- **Accessibility**: Providing `transcript` or `description` fields helps screen readers and search engines understand audio content.

### Additional Markup

Consider also adding:
- `MusicRecording` schema if applicable
- `associatedMedia` linking audio to the recipe
- Open Graph `og:audio` tags for social sharing

### Practical SEO Impact

Adding audio previews will likely improve SEO indirectly through better engagement metrics (time on page, pages per session) more than through schema markup directly. The markup is still worth adding -- it is low effort and future-proofs for rich results.

---

## 10. MVP Approach

### MVP (Ship in 1 week)

**Goal:** Add a play button to each recipe card that plays a pre-recorded MP3.

**What to build:**
- Record DI guitar clips (2 performances: clean/rhythm and drive/lead)
- Reamp through all 50 presets on Helix LT, export as MP3 192kbps
- Upload 100 MP3 files (~70 MB total) to Cloudflare R2
- Build a simple `AudioPlayer` React component: play/pause button + progress bar
- Use Howler.js or native HTML5 Audio (whichever is faster to implement)
- Add a play button to each recipe card
- Global state to ensure only one clip plays at a time
- Add AudioObject schema markup to recipe pages

**What NOT to build (yet):**
- Waveform visualization
- A/B toggle (clean vs dirty)
- Global persistent player
- Any real-time processing

**Estimated effort:**
- Recording/reamping: 4-6 hours (biggest time investment)
- R2 setup + upload: 1 hour
- AudioPlayer component: 2-3 hours
- Integration into recipe cards: 1-2 hours
- Schema markup: 30 minutes
- Testing: 1-2 hours

### V2 (2-4 weeks after MVP)

**Additions:**
- Wavesurfer.js waveform visualization on recipe detail pages
- A/B toggle (Clean | Drive) with two clips per preset
- Pre-generated waveform data (server-side) for instant rendering
- Global bottom player bar that persists across navigation
- Volume control
- Keyboard shortcuts (space to play/pause)

### V3 (Future / Nice-to-Have)

**Additions:**
- Full-page comparison mode (play same riff through multiple presets side by side)
- User-uploaded DI clips that get reamped (would require actual Helix hardware integration or cloud processing)
- Looping playback for extended auditioning
- Download DI files so users can reamp themselves
- Social sharing of specific audio clips with timestamp links

---

## RECOMMENDED IMPLEMENTATION PLAN

### Phase 1: Recording (Days 1-2)

1. Record 2 DI guitar performances at 24-bit/48kHz:
   - Performance A: Clean arpeggios into open chords (15-20 seconds)
   - Performance B: Power chords with palm mutes into a lead lick (15-20 seconds)
2. Use the Helix LT as DI box, recording the unprocessed signal
3. Reamp both performances through all 50 presets, capturing the processed output
4. Normalize levels across all 100 clips (use a limiter at -1dB, target -14 LUFS)
5. Export as MP3 192kbps with consistent naming: `{recipe-slug}-clean.mp3`, `{recipe-slug}-drive.mp3`

### Phase 2: Infrastructure (Day 3)

1. Create a Cloudflare R2 bucket for audio files
2. Upload all MP3 files with proper cache headers (long TTL since files are immutable)
3. Set up a public access URL or custom subdomain (e.g., `audio.faderandknob.com`)
4. Add audio URLs to recipe data (add `audioCleanUrl` and `audioDriveUrl` fields)

### Phase 3: MVP Player Component (Days 4-5)

1. Build `AudioPreviewButton` component:
   - Simple play/pause icon button
   - Thin progress bar underneath
   - Time display (current / total)
   - Uses HTML5 Audio API or Howler.js
2. Create `AudioPlayerProvider` context:
   - Tracks currently playing clip
   - Ensures only one clip plays at a time
   - Handles audio cleanup on unmount
3. Add play button to recipe cards on the browse/grid page
4. Add larger player on individual recipe detail pages
5. Handle iOS Safari audio context initialization (require user gesture)

### Phase 4: Polish and SEO (Days 6-7)

1. Add AudioObject schema markup to each recipe page
2. Add loading states (spinner while audio loads)
3. Handle error states (failed to load audio)
4. Mobile testing -- ensure touch targets are large enough
5. Performance audit -- ensure audio files don't block initial page load (lazy load audio, preload only on interaction)
6. Add `og:audio` meta tags for social sharing

### Phase 5: V2 Enhancements (Weeks 2-4)

1. Replace simple progress bar with Wavesurfer.js waveform on detail pages
2. Add Clean/Drive toggle on recipe cards
3. Add persistent bottom player bar in root layout
4. Add keyboard shortcuts (space = play/pause, left/right = seek)
5. Pre-generate and cache waveform data server-side

### Phase 6: V3 Differentiation (Month 2+)

1. Side-by-side preset comparison mode
2. Downloadable DI files for user reamping
3. Community-uploaded audio demos
4. Filtering presets by tone characteristics heard in audio

---

## Key Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Audio format | MP3 192kbps | Universal support, good quality, small files |
| Recording method | DI + Reamp on Helix LT | Consistent, reproducible, enables A/B comparison |
| Storage | Cloudflare R2 | Free tier covers needs, zero egress fees |
| Player library (MVP) | HTML5 Audio / Howler.js | Minimal bundle size, ship fast |
| Player library (V2) | Wavesurfer.js | Waveform visualization, professional UX |
| Real-time processing | No | Helix presets cannot run in browser; pre-recorded is more reliable |
| Demo format | 2 clips per preset (clean + drive) | Covers the two main use cases for tone evaluation |

## Sources

- TONE3000 NAM Web Player: https://www.tone3000.com/blog/introducing-the-nam-web-player
- neural-amp-modeler-wasm: https://github.com/tone-3000/neural-amp-modeler-wasm
- Wavesurfer.js React: https://www.npmjs.com/package/@wavesurfer/react
- Howler.js: https://howlerjs.com/
- Cloudflare R2 Pricing: https://developers.cloudflare.com/r2/pricing/
- Vercel Blob Pricing: https://vercel.com/docs/vercel-blob/usage-and-pricing
- Schema.org AudioObject: https://schema.org/AudioObject
- Web Audio Cabinet Emulation: https://bobrov.dev/blog/web-audio-for-electric-guitar-cabinet-emulation/
- Splice Audio Quality: https://splice.com/blog/audio-quality-improvements/
- FluidSolo Helix Patches: https://www.fluidsolo.com/
- Line 6 CustomTone: https://line6.com/customtone/
