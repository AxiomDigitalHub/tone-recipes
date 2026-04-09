# Fader & Knob — Product Roadmap

**Last updated:** April 9, 2026
**Source of truth for all work across the product.**

---

## Vision

Fader & Knob is the world's first AI-powered tone lab for guitarists. We teach guitarists how to build tones (not just sell preset files), translate signal chains across every major modeler, and — with ToneTrace — let anyone upload audio and get an exact preset for their device.

**The database is the moat. ToneTrace is the product that sits on top of it.**

---

## Current State (April 2026)

### What's Live
- 50 tone recipes with full signal chains across Physical, Helix, Boss Katana
- 60+ blog posts with 5 AI editorial voices
- Helix .hlx preset generation (reverse-engineered, tested on real Helix LT)
- Worship Set Pack with 8 snapshots + Setlist Mapper (30 songs)
- Google OAuth + Supabase auth + user dashboard
- Stripe checkout wired up (test mode, $7/$12 tiers)
- Pricing page: Free / Tone Pass ($7) / Pro ($12)
- AI Transparency page (/how-we-work)
- Security hardening: webhook verification, rate limiting, admin auth, security headers
- Signal chain visualization: Pretext-style animated nodes with SVG cable
- Hero: cable draws from "you love." through signal chain
- 13 business research docs + 7 worship guitar research docs in docs/research/
- Platform display limited to Physical/Helix/Katana (all 7 platforms in DB)

### What's Configured But Not Tested End-to-End
- Stripe checkout flow (keys set, webhook registered, needs live test)
- Supabase migration 015 (Stripe columns — needs to be run)

### What's Not Started
- ToneTrace (the 10x product)
- Audio previews on recipe pages
- Email marketing (no ESP connected)
- Blog hero images (54 posts need images, Replicate token needs regeneration)
- YouTube channel
- Affiliate links
- PWA / mobile experience

---

## Phase 1: Foundation (Now → Week 4)
*Ship the basics that generate revenue and build the moat.*

### 1.1 Revenue Activation (Week 1)
- [ ] Run Supabase migration 015 (Stripe columns on profiles)
- [ ] Test Stripe checkout end-to-end in test mode
- [ ] Switch to live Stripe keys when checkout verified
- [ ] Regenerate Replicate API token, generate 54 blog hero images ($1.35)

### 1.2 Content Velocity (Weeks 1-4, ongoing)
- [ ] 5 new blog posts per week (automated)
- [ ] 10 new worship recipes (Elevation, Hillsong, Bethel, Maverick City, Phil Wickham)
- [ ] 5 new classic rock recipes (to balance catalog)
- [ ] Pillar page: "Complete Guide to Helix Tone" (15-25K/mo searches)
- [ ] Pillar page: "Boss Katana Settings Guide" (10-18K/mo searches)
- [ ] "Helix vs Quad Cortex" comparison page (4-8K/mo searches)

### 1.3 Set Pack Expansion (Weeks 2-4)
- [ ] Classic Rock Set Pack (JCM800, 8 snapshots, 40 songs mapped)
- [ ] Lincoln Brewster-style Rock Worship Set Pack (Plexi Variac, different school)
- [ ] Set Pack download gating (free for first pack, Pro tier for additional)

### 1.4 Email Launch (Week 2)
- [ ] Set up Buttondown ($9/mo)
- [ ] Build 5-email welcome sequence
- [ ] Launch "Sunday Setlist" weekly email concept (send Wednesdays)
- [ ] Connect newsletter signup forms to Buttondown API

### 1.5 Affiliate Setup (Week 2)
- [ ] Apply to Sweetwater, zZounds, Plugin Boutique, Amazon Associates
- [ ] Add affiliate links to gear database pages
- [ ] Write first "Best X for Y" roundup post

---

## Phase 2: Audio & ToneTrace Foundation (Weeks 4-8)
*Record the reference audio that unlocks audio previews AND ToneTrace.*

### 2.1 Reference Audio Recording (CRITICAL PATH)
- [ ] Define recording standard (same guitar, DI, documented chain, 10-15 seconds)
- [ ] Record reference audio for 10 worship recipes first (highest-value ICP)
- [ ] Record reference audio for remaining 40 recipes
- [ ] Store audio clips on Cloudflare R2 (free tier)
- [ ] **One recording session serves THREE purposes**: audio previews, ToneTrace retrieval DB, amp classifier training data

### 2.2 Audio Preview MVP (Week 5)
- [ ] Build Howler.js play button component
- [ ] Embed audio previews on recipe pages with reference clips
- [ ] Add AudioObject schema markup for SEO

### 2.3 ToneTrace Phase 1: Audio Analysis (Weeks 5-8)
- [ ] Set up Python audio analysis pipeline (librosa + essentia)
- [ ] Extract tone vectors (frequency spectrum, harmonic content, compression, reverb/delay presence)
- [ ] Extract amp vectors (even/odd harmonic ratio, midrange resonance, clipping behavior)
- [ ] Store vectors in recipe database
- [ ] Build upload UI: drag-and-drop audio file
- [ ] Implement retrieval matching (cosine similarity via Chroma)
- [ ] Add optional amp family selector (Fender/Vox/Marshall/Mesa/High Gain/Skip)
- [ ] Build feedback widget (thumbs up/down + parameter corrections)
- [ ] Wire output to Helix preset export

### 2.4 Platform Export Expansion
- [ ] Boss Katana .tsl export (complement Helix)
- [ ] Research Fractal Axe-FX format (.syx)
- [ ] Research Quad Cortex format (.ngp / Cortex Cloud)

---

## Phase 3: Growth Engine (Weeks 8-16)
*Scale content, community, and distribution.*

### 3.1 YouTube Launch
- [ ] Record first 10 "60-Second Tone Recipe" Shorts (screen capture HX Edit + Helix USB audio)
- [ ] Use animated signal chain as signature visual format
- [ ] Faceless + voiceover approach (AI or human)
- [ ] Cross-promote: embed on recipe pages, link recipes in descriptions

### 3.2 Community Activation
- [ ] Launch "Tone Challenge" (weekly challenge, community voting, standardized DI tracks)
- [ ] Enable user preset uploads with moderation queue
- [ ] Discord server for real-time community (campfire), site for evergreen content (library)
- [ ] Onboarding flow: platform selection → genre → first free preset → guided tour

### 3.3 PWA / Mobile
- [ ] Add PWA manifest + service worker to Next.js (2-week effort)
- [ ] "Gig Mode" — dark, stage-optimized setlist view with per-song snapshot references
- [ ] Offline access to saved recipes

### 3.4 Database Growth → 200 Recipes
- [ ] Worship: 50 additional recipes (top CCLI songs, Maverick City, Latin worship)
- [ ] Classic Rock: 30 additional recipes
- [ ] Blues: 20 additional recipes
- [ ] 90s/Alternative: 20 additional recipes
- [ ] Country: 10 additional recipes
- [ ] Metal: 10 additional recipes
- [ ] All with reference audio clips recorded to standard

### 3.5 Planning Center Integration (Worship Killer Feature)
- [ ] Research Planning Center REST API (OAuth 2.0 — confirmed available)
- [ ] Build: "Connect your Planning Center → see your setlist → get matching presets"
- [ ] Nobody has done this. This is the single biggest worship differentiator.

---

## Phase 4: ToneTrace Full Product (Weeks 16-24)
*Ship the 10x product.*

### 4.1 ToneTrace Phase 2: Amp Classifier
- [ ] Collect 200+ labeled dry recordings through known Helix/Fractal amp models
- [ ] Add harmonic fingerprinting to analysis pipeline
- [ ] Train amp family classifier (Fender Blackface, Vox Class A, Marshall Plexi, Marshall JCM, Mesa Rectifier, High Gain)
- [ ] Improve matching accuracy target: 80% (user rating 4+/5)

### 4.2 ToneTrace Phase 3: Generative Matching (Month 6+)
- [ ] Export all recipe vectors + signal chain params as training dataset
- [ ] Train staged regression model: predict amp family → per-parameter values
- [ ] Generate novel signal chains (not just return existing recipes)
- [ ] Target: predicted parameters within 10-15% of labeled values

### 4.3 Monetization Gate
- [ ] Free: browse recipes, view signal chains, download PDFs, see top ToneTrace match
- [ ] Tone Pass ($7): preset export, unlimited ToneTrace matches, audio previews
- [ ] Pro ($12): Set Packs, worship setlist builder, priority matching, generative presets

---

## Phase 5: Scale (Month 6+)
*Platform dominance.*

### 5.1 Multi-Platform Export
- [ ] Fractal Axe-FX export
- [ ] Quad Cortex export
- [ ] Kemper export
- [ ] Re-enable hidden platforms on frontend as exports ship

### 5.2 Worship Setlist Builder
- [ ] Planning Center integration live
- [ ] "Build Your Set" tool: select songs → auto-configure snapshot assignments → export package
- [ ] "Sunday Setlist" email auto-generates from CCLI trending data

### 5.3 ToneTrace Pro Features
- [ ] Real-time analysis (plug guitar into browser via WebAudio)
- [ ] Side-by-side comparison (your tone vs target)
- [ ] "Tone DNA" profile: analyze a guitarist's signature across multiple recordings

### 5.4 Revenue Targets
| Timeframe | MRR Target | Primary Drivers |
|-----------|-----------|----------------|
| Month 3 | $200-500 | Affiliate + first paid subscribers |
| Month 6 | $800-1,500 | Tone Pass + Set Packs + affiliates |
| Month 12 | $2,000-4,000 | ToneTrace launch + worship vertical + 10K email list |
| Month 18 | $5,000-10,000 | ToneTrace paid tier + 200+ recipes + YouTube revenue |

---

## Research Library (docs/research/)

### Business Strategy (13 docs)
| Doc | Key Finding |
|-----|------------|
| Competitive Teardown | Nobody teaches HOW to build a tone — our core moat |
| SEO Content Gaps | "Helix presets" = 15-25K/mo searches; 20 opportunities ranked |
| Monetization | $7/$12 tiers, realistic 12-month MRR $1.2-3.3K |
| Blog Images | Replicate Flux Dev, $1.35 for 54 posts |
| Set Patch Strategy | Worship #1 market, Set Pack + Setlist Mapper product |
| AI Transparency | "Human-Verified, AI-Powered" — lead with real hardware testing |
| Worship Market Deep Dive | $1.6-7.7M addressable market, Planning Center API available |
| Audio Preview System | DI + reamp, Cloudflare R2 free, MVP in 1 week |
| Email Marketing | Buttondown, "Sunday Setlist" is the killer concept |
| YouTube Strategy | Faceless + animated signal chain = unique format |
| Affiliate Guide | zZounds 6%, Plugin Boutique 15-20%, Sweetwater 3-8% |
| Community/Retention | "Discord is campfire, website is library", tone challenges |
| Mobile App | PWA first, "Gig Mode" is the killer feature |

### Worship Guitar Research (7 docs)
| Doc | Key Finding |
|-----|------------|
| History 70s-90s | Phil Keaggy pioneered delay looping. Stu G's Mexican Tele = 90s worship guitar. |
| History 00s-20s | BigSky (2013) created the ambient era. New "pad" guitar role. |
| Guitarist Rigs | Tele + Gretsch dominate. AC30 is #1 amp. Edge's exact delay settings. |
| Lincoln Brewster | Plexi Variac foundation, not AC30. The "shredder who serves" school. |
| Production Notes | "What A Beautiful Name" = 6 guitar tracks. SM57 + R-121 standard. |
| Cultural History | 60-year battle. Calvin called organs "the devil's bagpipes." 3.5kHz resonance = worship chime. |
| Lesser-Known Scenes | Core customer: volunteer, $500-700 budget, setlist Tuesday, play Sunday. Latin worship = untapped. |

### Product Vision
| Doc | Purpose |
|-----|---------|
| ToneTrace Project Brief | 6-layer architecture, 2 ICPs, the 10x product |

---

## Principles

1. **The database is the moat.** Every recipe with reference audio is training data for ToneTrace.
2. **One recording session, three outputs.** Audio preview + retrieval DB + classifier training data.
3. **Worship first.** 1/3 of all instruments sold go to worship. $1.6-7.7M addressable market.
4. **The volunteer guitarist is our customer.** $500-700 budget, gets setlist Tuesday, plays Sunday. They want results, not tweaking.
5. **Recipe, not preset.** We teach WHY, not just WHAT. That's what nobody else does.
6. **Human-verified, AI-powered.** Every preset tested on real hardware. Transparent about AI use.
7. **Ship, then improve.** Phase 1 retrieval matching ships before Phase 3 generative. The feedback loop makes everything better over time.

---

*This document is the source of truth. Update it as phases complete and priorities shift.*
