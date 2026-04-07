# Mobile App Opportunity: faderandknob.com

**Research Date:** April 6, 2026
**Status:** Research Complete

---

## 1. Competitor Mobile Apps

### Worship Online / Worship Tutorials
- **Has an app:** Yes. Worship Online has iOS and Android apps.
- **Ratings:** 4,800+ five-star reviews on iOS; 4.7 stars on Google Play with 5,000+ downloads.
- **Features:** Instrument-specific tutorials (electric guitar, acoustic, keys, drums, vocals), transposable chord charts, customizable audio mixer that lets you change key and adjust instrument levels, and setlist preparation tools.
- **Relevance:** This is the closest competitor in the worship guitar tone space. Their app focuses on learning songs, not on preset management or tone dialing. They sell a "Tone Pass 2026" for presets but the app itself is tutorial-focused.
- **Gap:** No recipe-style tone breakdown. No modeler preset downloads in the app.

### Line 6 HX Edit
- **Mobile version:** Does NOT exist. HX Edit is desktop-only (macOS/Windows). Users have been requesting an iPad/Android version since at least 2019. Line 6 has not announced any plans.
- **CustomTone:** Line 6's free preset sharing site (customtone.com) is web-only, no dedicated app.
- **Implication:** Helix users have no official way to browse or manage presets on mobile. This is a significant gap.

### Neural DSP Cortex Cloud App
- **Has an app:** Yes. Available on iOS and Android.
- **Features:** Browse and download presets and Neural Captures directly to Quad Cortex over WiFi. Follow users, share presets, manage profiles. Offline mode for device settings. Firmware updates over WiFi.
- **Key detail:** The Quad Cortex has built-in WiFi, enabling wireless preset transfer from phone to device. This is the gold standard for mobile modeler integration.
- **Limitation:** Only works with Neural DSP hardware (Quad Cortex, Nano Cortex).

### Boss Tone Studio (BTS)
- **Has an app:** Yes. Multiple model-specific versions on iOS and Android.
- **Features:** Program presets, configure device parameters, assemble Live Sets, librarian functions. Connects via Bluetooth (with BT-Dual adapter on some models) or USB.
- **Key detail:** Boss makes a separate app version for each product (Katana Gen 3, Katana Air, WAZA-AIR, etc.). Fragmented but functional.
- **Relevance:** Hardware-specific editor, not a community/recipe platform.

### IK Multimedia TONEX
- **Has an app:** Yes. TONEX iOS works standalone and as AUv3 plugin.
- **Features:** Full amp modeling on iPhone/iPad using AI Machine Modeling. Access to ToneNET with 40,000+ free tone models. TONEX Control app (iOS/Android) connects to TONEX Plug hardware via Bluetooth for wireless preset browsing and loading.
- **Key detail:** TONEX is both a tone engine AND a community marketplace. Users can play through tones directly on their phone.

### TONE3000 (formerly ToneHunt)
- **Has an app:** No dedicated mobile app. Web-only platform.
- **Features:** 275,000+ NAM (Neural Amp Modeler) profiles. Browser-based tone playback. Community sharing platform.
- **Mobile experience:** Responsive web, but no PWA or native app. No offline access.
- **Gap:** Large community, poor mobile experience.

### Other Notable Apps
- **Tonebridge** (by Ultimate Guitar / Muse Group): 9,000+ song presets, 1M+ downloads on Google Play, 4.0 stars (18.4K reviews). Turns your phone into a guitar amp. Requires audio interface adapter.
- **BIAS FX 2** (Positive Grid): Full amp sim on mobile, ToneCloud community for preset sharing.
- **Deplike:** 10,000+ community presets, artist-specific tone matching.
- **Positive Grid BIAS X:** AI-powered tone creation using conversational prompts.
- **Line 6 CustomTone:** Web-only preset sharing. No app, no mobile optimization.

### Competitor Summary Table

| App | Platform | Preset Downloads | Community | Offline | Device Control |
|-----|----------|-----------------|-----------|---------|----------------|
| Worship Online | iOS/Android | No (tutorials only) | No | Limited | No |
| HX Edit | Desktop only | Yes | No | Yes | Yes (USB) |
| Cortex Cloud | iOS/Android | Yes (WiFi) | Yes | Limited | Yes (WiFi) |
| Boss BTS | iOS/Android | Yes (BT/USB) | No | Yes | Yes |
| TONEX iOS | iOS | Yes | Yes (ToneNET) | Yes | Yes (BT) |
| TONE3000 | Web only | Yes (web) | Yes | No | No |
| Tonebridge | iOS/Android | N/A (amp sim) | Limited | No | No |
| CustomTone | Web only | Yes | Limited | No | No |

---

## 2. What a Guitar Tone App Would Do

### Core Use Cases for faderandknob.com

**At Rehearsal / Practice:**
- Pull up a recipe on your phone: "I need to nail the Hillsong United lead tone"
- See exact settings: amp model, gain, EQ, effects chain, snapshot assignments
- Download the .hlx preset file to transfer later via desktop HX Edit

**At a Gig:**
- Setlist view showing which preset/snapshot to use per song
- Large-text "gig mode" for reading settings on a dark stage
- Swipe between songs, see tone settings at a glance

**At Home / Dialing In:**
- Browse all 50+ recipes with audio previews
- Filter by genre, song, artist, or modeler platform
- Save favorites into personal collections
- Read the "why" behind each setting (the recipe explanation)

### Feature Breakdown

| Feature | Priority | PWA Feasible? | Native Required? |
|---------|----------|---------------|------------------|
| Browse recipes | Must-have | Yes | No |
| Search/filter recipes | Must-have | Yes | No |
| View settings & signal chain | Must-have | Yes | No |
| Audio previews | Must-have | Yes (Web Audio) | No |
| Download .hlx files | Must-have | Yes (limited on iOS) | Easier on native |
| Save favorites | Must-have | Yes (localStorage/IndexedDB) | No |
| Build setlists | High | Yes | No |
| Gig Mode (large text, dark) | High | Yes | No |
| Offline access to saved recipes | High | Yes (service worker) | No |
| Community (comments, ratings) | Medium | Yes | No |
| Push notifications (new recipes) | Medium | Partial (not iOS Safari) | Yes |
| Direct Helix USB transfer | Low | No | No (see Section 5) |

---

## 3. PWA vs Native App

### Option A: Progressive Web App (PWA)

**What it is:** Add a web app manifest, service worker, and install prompt to the existing Next.js site. Users "install" it from the browser and it appears as an app icon on their home screen.

**Pros:**
- Near-zero additional development cost (Next.js has official PWA guidance)
- Single codebase serves web and "app" users
- No app store approval process or review delays
- No Apple 30% cut on subscriptions
- Instant updates without app store release cycle
- Implementation options: Serwist package, next-pwa-pack, or plain TypeScript service worker
- Offline caching of viewed recipes via service worker
- Can score 100 on Lighthouse PWA audit

**Cons:**
- iOS Safari has limited push notification support (added in iOS 16.4 but still inconsistent)
- File downloads (.hlx) work but are less seamless than native, especially on iOS
- No app store presence means less discoverability
- Cannot access USB/Bluetooth hardware directly
- Some users perceive PWAs as "not a real app"

**Cost estimate:** 1-2 weeks of development effort, mostly service worker configuration and offline caching strategy.

### Option B: React Native / Expo

**Pros:**
- Full app store presence (discoverability, reviews, credibility)
- Native push notifications
- Better file handling for preset downloads
- Potential for hardware integration (Bluetooth MIDI)
- Cross-platform from single codebase

**Cons:**
- 2-4 months of development for MVP
- Ongoing maintenance (OS updates, app store policies)
- App store review process (1-7 days per submission)
- Separate codebase to maintain alongside the web app
- Apple's 30% cut on subscriptions (though as of May 2025, US apps can link to external web payments without Apple's commission)

**Cost estimate:** 2-4 months development, then ongoing maintenance.

### Option C: Hybrid (PWA Now, Native Later)

**The recommended path.** Ship the PWA immediately to validate mobile demand. If usage data shows strong mobile engagement (>30% of traffic), build native later with proven feature set.

---

## 4. The "Gig Mode" Concept

This is the potential killer feature that no competitor currently offers.

### What Existing Setlist Apps Do
- **Setlists App:** Song catalog with lyric prompting, dark set mode for stage use
- **GigNotes:** Setlists with chords/notes, full-screen performance mode, sheet music markup
- **GiggerLive:** Setlists with tempo/key/time signature, safety locks against accidental touches
- **Lyricals:** Gig mode with big navigation buttons, auto-scrolling lyrics
- **GigBag:** Setlist management, auto-scroll lyrics, foot pedal support

### What None of Them Do
None of these apps combine setlist management with modeler preset/tone settings. A guitarist currently needs:
1. One app for the setlist/lyrics (e.g., GigNotes)
2. A separate reference for which Helix preset to use per song
3. Memory or a printed sheet for snapshot assignments

### Gig Mode for faderandknob.com

**Core features:**
- Dark background, high-contrast large text (minimum 24pt)
- Minimal UI: just the essential info, no navigation chrome
- Setlist builder: add songs, reorder with drag-and-drop
- Per-song view: preset name, snapshot assignments, key settings (gain, delay tempo, reverb level)
- Swipe left/right to move between songs
- Screen stays awake (Wake Lock API, supported in PWA)
- Optional: tempo/BPM display per song

**Why this is a killer feature:**
- No competitor combines tone recipes with setlist management
- Solves a real pain point: "What preset do I use for this song?"
- Creates a reason to open the app every week (Sunday setlist prep)
- Drives recurring engagement and premium subscription value
- Could integrate with Worship Online or Planning Center setlists

---

## 5. Bluetooth / USB Connectivity

### Can a Phone App Communicate Directly With Modelers?

| Modeler | Connection | Phone App Control | Direct Preset Transfer |
|---------|-----------|-------------------|----------------------|
| **Helix/HX** | USB only | No official app. MIDI via USB-OTG possible on Android. No iOS support. | Not feasible from phone. Must use desktop HX Edit. |
| **Quad Cortex** | WiFi + USB | Yes. Cortex Cloud app controls device over WiFi. | Yes. Presets transfer wirelessly from phone to QC. |
| **Kemper Player** | WiFi + USB | Yes. Rig Manager app (iOS/Android) connects via WiFi. | Yes. Rigs can be sent wirelessly to device. |
| **Kemper Stage/Rack** | USB only | Rig Manager desktop only for Stage/Rack. | Not from phone for older Kemper units. |
| **Boss Katana Gen 3** | Bluetooth + USB | Yes. BTS app connects via Bluetooth. | Yes. Presets can be sent via Bluetooth. |
| **TONEX Pedal/Plug** | Bluetooth + USB | Yes. TONEX Control app connects via Bluetooth. | Yes. Tone models load wirelessly. |

### Implications for faderandknob.com
- **Do NOT build hardware connectivity.** This is the job of manufacturer apps (HX Edit, Cortex Cloud, Rig Manager).
- **Instead, optimize the handoff:** Make it trivially easy to download a .hlx file on your phone, then open it in HX Edit on desktop. Or for QC users, link to the Cortex Cloud version of the preset.
- **Long-term opportunity:** If Line 6 ever releases a mobile HX Edit with a URL scheme or share sheet integration, faderandknob could deep-link directly to it.

---

## 6. App Store Considerations

### Apple's 30% Commission (Updated May 2025)
- As of a May 2025 US court ruling, Apple can no longer charge commission on purchases made via external web links from iOS apps.
- Apps in the US can now include a button linking to their website for payment with zero Apple commission.
- Stripe charges only 2.9% + $0.30 per transaction vs Apple's former 30%.
- **Strategy:** If building a native app, use it as a companion and handle all payments on the web. The legal landscape now supports this in the US.

### App Store Optimization
- Keywords to target: "guitar preset," "guitar tone," "helix preset," "worship guitar tone," "guitar amp settings"
- Category: Music
- Competitor apps are sparse in the preset/recipe niche specifically
- A well-designed app with good screenshots could stand out

### Review Strategy
- Prompt for reviews after a user completes a positive action (saves a favorite, completes a setlist)
- Never prompt during frustrating moments (failed download, error)
- Respond to all reviews, especially negative ones
- Goal: maintain 4.5+ star rating

---

## 7. Market Validation

### Current App Store Landscape

**"Guitar preset" search results:**
- Tonebridge: 1M+ downloads, 4.0 stars (Android). Dominant but focused on amp simulation, not recipe/educational content.
- BIAS FX 2: Strong but requires Positive Grid hardware ecosystem.
- Deplike: 10,000+ presets, growing community.
- CustomTone (Line 6): Web-only. No app. Massive missed opportunity.

**"Helix preset" search results:**
- Almost nothing. No dedicated Helix preset browsing app exists.
- This is a wide-open niche.

**"Worship guitar tone" search results:**
- Worship Online: Tutorial-focused, not tone/preset focused.
- No app specifically for worship guitar presets.

### The Gap

There is no app that does all three of these things:
1. Explains HOW to build a tone (educational recipe content)
2. Provides downloadable presets for specific modelers
3. Organizes tones into setlists for live use

faderandknob.com already does #1 and #2 on the web. Adding #3 (setlists/gig mode) on mobile would create a product with no direct competitor.

### Download Potential
- Tonebridge proves there is demand for guitar tone apps at scale (1M+ downloads).
- The niche of "Helix/modeler preset recipes" is much smaller but deeply engaged. Realistic target: 5,000-20,000 installs in year one for a well-executed app.
- Worship guitar market is underserved on mobile. Churches with 50-200 person congregations have 1-2 electric guitarists each. There are roughly 300,000+ Protestant churches in the US alone.

---

## 8. The Practice Companion Angle

### Beyond Presets: Could the App Help Guitarists Practice?

| Feature | Value | Complexity | Recommendation |
|---------|-------|-----------|----------------|
| **Metronome** | Medium. Dozens of free metronome apps exist. | Low | Skip. Not differentiated. |
| **Backing tracks for recipe songs** | High. Play along with the song while seeing the tone settings. | Medium | Consider for V2. Licensing issues with copyrighted songs. |
| **Spotify integration** | High. Deep-link to the song on Spotify. Display recipe alongside playback. | Medium | Yes for V1. Use Spotify Web API to link to songs. Full playback requires Premium. |
| **Practice timer/streak** | Medium. Gamification helps retention. | Low | Consider for V2. Not core to the tone recipe value prop. |
| **Tuner** | Low. Every guitarist has a tuner. | Low | Skip. |
| **Song tempo/key reference** | High. BPM and key for each recipe's song. | Very low | Yes for V1. Already part of recipe metadata. |

### Spotify Integration Details
- Spotify Web API allows searching tracks, getting metadata (BPM, key), and controlling playback.
- Web Playback SDK can stream audio in-browser but requires Spotify Premium.
- Minimum viable integration: Link to the song on Spotify with a "Listen on Spotify" button. Zero cost, zero licensing issues.
- Enhanced integration: Embed a Spotify player widget showing the song while the user views the recipe. Requires Spotify Premium for full playback.

---

## MOBILE RECOMMENDATION

### Verdict: Start with PWA. Evaluate native in 6-12 months.

### Why PWA First

1. **The site already runs on Next.js.** Adding PWA support is a matter of days, not months. Next.js has official PWA documentation and multiple proven implementation paths.
2. **The core value is content, not hardware.** Recipes, settings, and signal chains are text and images. No native hardware access is needed.
3. **No app store friction.** Ship instantly, iterate daily, no review process.
4. **No revenue split.** Even with the May 2025 ruling improving things, avoiding the app store entirely is simpler.
5. **Validates demand.** If mobile PWA usage is strong, it proves the native app business case with real data.

### MVP Feature Set (PWA)

**Phase 1 (Week 1-2): Core PWA**
- Web app manifest with app icon, splash screen, theme color
- Service worker for offline caching of viewed recipes
- "Add to Home Screen" install prompt
- Responsive mobile-first recipe views (already exists, polish it)
- Basic offline fallback page

**Phase 2 (Week 3-4): Gig Mode**
- Setlist builder (add recipes to a setlist, reorder)
- Gig Mode view: dark, large text, swipe between songs
- Per-song display: preset name, key settings, snapshot map
- Wake Lock API to keep screen on
- Setlists saved to IndexedDB for offline access

**Phase 3 (Month 2): Engagement**
- Favorites / save for offline
- "Listen on Spotify" links per recipe
- Song tempo and key display
- Audio preview of presets (Web Audio API)
- Push notification opt-in for new recipes (where supported)

**Phase 4 (Month 3-4): Community**
- User comments on recipes
- Star ratings
- "Share to WhatsApp/iMessage" with deep link back to recipe
- User-submitted tone tips per recipe

### When to Build Native

Build a native app (React Native / Expo) IF:
- Mobile web traffic exceeds 40% of total traffic
- Users specifically request "a real app" in feedback
- You want to pursue app store discoverability as a growth channel
- A partnership with a hardware company (Line 6, Neural DSP) requires native integration
- Revenue from subscriptions justifies the 2-4 month development investment

### Timeline Summary

| Phase | Timeframe | Effort | Outcome |
|-------|-----------|--------|---------|
| PWA Core | Weeks 1-2 | ~20 hours | Installable app, offline support |
| Gig Mode | Weeks 3-4 | ~40 hours | Killer differentiating feature |
| Engagement | Month 2 | ~30 hours | Spotify links, audio previews, favorites |
| Community | Month 3-4 | ~40 hours | Comments, ratings, sharing |
| Native (if warranted) | Month 6-12 | 2-4 months | App store presence, push notifications, file handling |

### Priority: NOW for PWA, LATER for Native

The PWA with Gig Mode should be a top priority. It is low-cost, fast to ship, and creates a feature (setlist + tone recipe integration) that literally no competitor offers. The combination of "what preset do I use for this song" with "here are the exact settings" in a dark, stage-friendly mobile view is the kind of focused utility that builds a loyal user base.

The native app is a "nice to have" that becomes "need to have" only when the data proves mobile engagement justifies the investment.
