# Music App UX Inspiration for Fader & Knob Dashboard

Research compiled 2026-04-10. Focused on the logged-in dashboard experience: layout, visual language, information density, interaction patterns, navigation, and personalization. Synthesizes Spotify, Apple Music, Bandcamp, SoundCloud, Tidal, YouTube Music, and modern music UI concepts from Dribbble and Muzli, mapped onto the Fader & Knob context (dark theme, orange accent #f59e0b, Space Grotesk display, signal-chain visual identity, "Tone recipes from the songs you love").

Note on sourcing: Direct WebFetch was unavailable for Dribbble/Figma references during this research session. Findings below synthesize WebSearch results, established music-app UX knowledge, and lessons from Spotify/Apple Music/Tidal/Bandcamp/SoundCloud/YouTube Music design coverage and case studies.

---

## 1. Dashboard Layout Patterns

### Pattern 1.1 — Personalized-first vertical stack
Spotify's home is engineered to flow from "most personalized" (recently played, frequent rotations) at the top down to "discovery" at the bottom. The layout adapts to time of day and behavior — a morning dashboard can look different from an evening one.

- **Does it well:** Spotify Home, YouTube Music Home
- **F&K application:** The current dashboard leads with generic stats cards (Plan, Saved Recipes, My Gear, Platform). Those are chrome, not content. Replace the top 60% of viewport with a personalized feed:
  1. "Pick up where you left off" (last viewed recipe)
  2. "Your saved recipes" horizontal rail (album-art style cards)
  3. "Matches your rig" rail (recipes compatible with the user's gear)
  4. "New this week" rail
  5. Stats move to a secondary strip or sidebar widget.
- **Effort:** Larger redesign. Quick-win version: add one "Continue where you left off" hero card above the stats row.

### Pattern 1.2 — Hero section with context
Modern music dashboards use a hero block at the top that establishes identity and promotes the single most relevant action. Tidal's home opens with a large editorial hero (featured artist, album, or mood). Spotify uses a time-aware greeting ("Good evening") with a 2-column compact grid of recent listens.

- **Does it well:** Tidal (editorial), Spotify (time-of-day greeting + recents grid)
- **F&K application:** Replace the plain "Welcome back" header with a contextual hero:
  - Greeting adapts to time of day
  - Subhead names a specific recipe: *"Pick up where you left off: U2 — Where The Streets Have No Name"*
  - A 2-column compact grid below the greeting showing the 6 most-recently-viewed recipes as small pill-style cards (album art + song title + artist)
- **Effort:** Quick win (1 day). High visual impact.

### Pattern 1.3 — Horizontal rails (carousels) as the default grouping unit
All major music apps use horizontal rails with partial-visibility edges (the next card peeks off-screen) to signal "there's more." YouTube Music is moving away from "More >" buttons toward this partial-visibility affordance.

- **Does it well:** Spotify, Apple Music, YouTube Music
- **F&K application:** Every logical grouping of recipes on the dashboard should be a horizontal rail, not a 3x3 grid that fills the viewport. Rails feel curated; grids feel like inventory.
- **Effort:** Medium. Requires a reusable rail component.

### Pattern 1.4 — Single-screen first impression
The best dashboards limit the first-screen content to 5–6 distinct modules. Scanability beats density.

- **F&K application:** Audit the dashboard with a ruler: everything above the fold should be either (a) identity/context (greeting + hero), (b) one rail of the user's own content, or (c) the single most valuable CTA. Upgrade CTAs, notifications, and quick actions go below.

---

## 2. Visual Language

### 2.1 Typography hierarchy
Spotify, Tidal, and Apple Music all use a strong display/body split:
- Display: bold geometric or grotesque sans-serif for section headers, recipe titles, and greetings (Spotify's Circular, Tidal's custom grotesque).
- Body/labels: neutral neutral-weight sans, usually smaller and more muted.
- Section labels are often **ALL CAPS, small, tracked** with an orange/accent color used sparingly.

- **F&K application:** Space Grotesk is already the right choice for the display role. What's likely missing: consistent "eyebrow labels" above sections ("CONTINUE", "MATCHES YOUR RIG", "NEW THIS WEEK") in an amber small-caps tracked style. This is cheap, instantly premium, and signals sections without heavy dividers.
- **Effort:** Quick win.

### 2.2 Dark theme depth and layering
Dark UI best practices: never pure #000 except for OLED bezels; use at least 3 elevation levels (base, surface, raised); accent color should be restricted and meaningful. Tidal specifically leans on near-black as a frame and lets album art be the color.

- **F&K application:**
  - Ensure 3 tiers of surface: base (page), card (raised), active (hover/selected).
  - Orange #f59e0b should be reserved for the user's *own* signal — favorites, active nav item, the "play" of the dashboard (e.g., the primary CTA on the hero). If orange appears on 6 different things per screen, it stops being a signal.
- **Effort:** Medium (audit + token cleanup).

### 2.3 The "album art" equivalent
Spotify, Bandcamp, and Apple Music all anchor their visual language in square album art that dominates cards. It's the most recognizable visual asset for users. F&K doesn't have album art per recipe by default, but has two candidates:
- The **signal-chain visualization** (your signature element)
- The **song artwork** (the song the recipe is based on)

- **F&K application:** Every recipe card on the dashboard should lead with a visual — either the signal chain rendered as a horizontal "bar code" on top, or a gradient generated from the song's mood/genre, or the song's album art if available via metadata. Cards without a visual look like spreadsheet rows.
- **Effort:** Medium to larger. High payoff. Consider a simple procedural gradient (per-recipe deterministic hash → 2-color gradient) as a v1 if album art is legally tricky.

### 2.4 Cards: radius, shadow, hover
Modern music apps use:
- Medium-to-large radius (12–16px) on cards
- Subtle lift on hover (translate-y-1, slight shadow, border highlight in the accent color)
- A hover-reveal play/action button in the top-right of the card

- **F&K application:** On hover of a recipe card, reveal a "Load preset" or "Open" button in the top-right. This is the "play button hover" of the music world and is the single most-expected micro-interaction.
- **Effort:** Quick win.

---

## 3. Information Density

### 3.1 Rails with 5–7 visible items
Spotify/Apple Music dashboards show roughly 5–7 items per rail at desktop width, with the 6th/7th peeking. This is the sweet spot — enough to feel abundant without becoming a grid.

### 3.2 List view vs grid view vs compact view
Spotify's library offers three view densities (list, compact, grid) and remembers the user's choice. Bandcamp's collection has been criticized for only offering a 3-column grid.

- **F&K application:** On the "Saved Recipes" and "My Recipes" pages (not the dashboard home), offer a view-density toggle. Save preference. Grid is best for discovery; list/compact is best for power users managing many items.
- **Effort:** Medium.

### 3.3 Empty states
The biggest miss on most dashboards is empty states. A new user who just signed up has no saved recipes, no gear, no history. Generic "You have 0 saved recipes" is a failure.

- **F&K application:** First-run dashboard should show an opinionated "starter experience":
  - "Based on popular picks, here are 6 recipes to try first" (editorial rail)
  - "Add your rig to see matching recipes" — an inviting gear-setup card
  - "Try a recipe → save → unlock your personalized dashboard" as a 3-step activation bar
- **Effort:** Medium. Critical for activation (ties into Hooked / improve-retention frameworks).

---

## 4. Interaction Patterns

### 4.1 Hover reveals contextual actions
The "play button appears on hover" pattern is universal. For F&K the equivalents are: *View*, *Save*, *Download preset*, *Copy signal chain*.

### 4.2 Save / favorite mechanics
Spotify's heart, Apple Music's plus, Bandcamp's wishlist. All use:
- A single-tap save with instant visual confirmation (filled icon, subtle bounce animation)
- Global save state (filter library by "liked songs")
- No modal, no confirmation dialog, no friction

- **F&K application:** A single heart/bookmark icon on every recipe card, with optimistic UI update and a subtle toast. If F&K has that, audit it — if it requires two taps, modals, or page refreshes, fix it.
- **Effort:** Quick win if underlying store already supports it.

### 4.3 Recently used, pinned, and filters
Spotify lets users **pin** up to 4 playlists to the top of the library and exposes **filter chips** (Playlists / Artists / Albums / Podcasts) above the list.

- **F&K application:**
  - Pin favorite recipes to the top of the dashboard (up to 4). Pinned items appear as larger cards above the auto-populated rails.
  - Filter chips on the Saved Recipes page: "All / By Platform / By Genre / By Artist / Recently Added"
- **Effort:** Medium.

### 4.4 Long-press / three-dot menus
Apple Music and YouTube Music expose a meatball/three-dot menu on every item card with secondary actions (Add to playlist, Share, Start radio, Go to artist).

- **F&K application:** Every recipe card should have a three-dot menu: *Add to set pack, Share, Copy signal chain, Download preset, Report issue*.

---

## 5. Navigation Patterns

### 5.1 Sidebar vs top nav vs bottom nav
- **Sidebar (desktop):** Spotify, Tidal, YouTube Music — best for library-heavy apps where users expect to jump between many collections.
- **Bottom nav (mobile):** SoundCloud, Apple Music — best for 4–5 core destinations on mobile.
- **Top nav (marketing sites):** Bandcamp — best for content discovery rather than library management.

F&K already uses a sidebar on `/dashboard`. This is the right choice given the library-management goal.

### 5.2 Sidebar composition best practices (from Spotify's 2023 library refactor)
Spotify's current sidebar includes:
- Fixed nav items at top (Home, Search, Your Library)
- A "Your Library" section that's expandable, with filter chips, pin slots, view toggles, and the scrollable list
- A "Create playlist" quick action at the bottom

- **F&K application:** The current sidebar has Overview / Saved Recipes / My Gear / My Recipes / Notifications / Settings. This is fine structurally but could learn two things from Spotify:
  1. **Inline preview in sidebar:** the "Saved Recipes" item could show the 3 most recent pinned recipes as mini-rows below it, collapsible. This turns the sidebar into a library, not just a menu.
  2. **Quick-create at bottom:** a persistent "+ New recipe" or "+ Create set pack" button pinned at the bottom of the sidebar.
- **Effort:** Medium.

### 5.3 Search as a first-class citizen
Every major music app puts search in the top of the screen or nav, not buried. Spotify's search bar is one of three primary nav items.

- **F&K application:** Is there a dashboard-level search that searches the user's library + global recipes? If not, add one. Put it at the top of the main content area, not only in the global site header.
- **Effort:** Medium.

---

## 6. Data Visualization

### 6.1 Stats cards — the F&K current approach
The existing 4 stats cards (Plan, Saved Recipes, My Gear, Platform) are the most generic part of the current dashboard. Music apps rarely lead with pure numerical stats — Spotify's analog is Spotify Wrapped, which is a once-a-year editorial event, not a daily dashboard feature.

- **Recommendation:** Demote the 4 stats cards. Options:
  - Compress them into a single horizontal strip under the hero (thin, one-line, icon + label + value)
  - Or move them to the sidebar as a small "Your profile at a glance" block
  - Or remove them from the dashboard entirely and surface them in Settings
- **Effort:** Quick win.

### 6.2 The "Wrapped" moment
Spotify Wrapped, Apple Music Replay, and even Bandcamp's year-in-review are huge engagement moments. They're personalized data stories.

- **F&K application:** An annual (or quarterly) "Your Tone Year in Review": top genres explored, total presets downloaded, the signal-chain element used most (overdrive? reverb?), a "tone personality" label (e.g., "Edgy worship player", "Ambient shoegazer"). Shareable social cards. This is a future/Q4 initiative but worth planning for.
- **Effort:** Larger.

### 6.3 Activity feeds
SoundCloud's stream is a literal activity feed ("Artist X posted a new track"). It's social.

- **F&K application:** A subtle activity rail on the dashboard: "3 new recipes matching your rig this week", "Worship pack v2 released", "Your recipe for 'Oceans' got 12 new saves" (if F&K ever adds social). Good engagement hook.
- **Effort:** Medium.

---

## 7. "Made for You" Personalization

### 7.1 Spotify's approach
Spotify's personalization is built on machine learning but *presented* as editorial. Playlists are named like magazines ("Discover Weekly", "Daily Mix", "Release Radar"). The UI frames algorithmic recommendations as gifts ("Made for you, Dan"), not as search results.

### 7.2 The feeling of a personalized space
Personalization on a dashboard creates the feeling of ownership when:
- It uses the user's name prominently
- It changes based on time / behavior (not static)
- It shows the user their own content first, discovery second
- Recommendations have a clear *reason* attached ("Because you saved Lincoln Brewster", "Because you play a Strat + Helix")

### 7.3 F&K personalization roadmap
- **Near-term (quick wins):**
  - Time-of-day greeting
  - "Continue" card pulling last viewed recipe from localStorage / profile
  - "Matches your rig" rail filtering recipes by the user's selected platform + guitar
  - "Because you saved X" recommendation tag on discovery cards
- **Mid-term:**
  - Playlist-style curated lists: "Made for Worship Players", "Made for Ambient Explorers", "Made for Classic Rock Hunters"
  - Auto-detect the user's "tone personality" from saves and surface it as a label/chip
- **Larger:**
  - ML-driven "Daily Tone Mix" — 6 recipes hand-picked daily based on the user's behavior
  - Editorial "Fader & Knob Weekly" updated every Monday

---

## 8. Answers to the Specific Questions

### Q1. How can saved recipes feel like a personal tone library?
**Answer:** Borrow Spotify's three library tricks simultaneously:
1. **Pinning** — let users pin up to 4 favorite recipes that render as oversized cards above everything else.
2. **Filter chips** — "All / Electric / Acoustic / Worship / Ambient / My platform only".
3. **View density toggle** — grid vs list vs compact, with preference persisted.
The feeling of ownership comes from the user being able to *arrange* and *filter* their collection, not just see it.

### Q2. "Recently played" equivalent?
**Answer:** Track *Recently viewed recipes* (what the user clicked into) and *Recently downloaded presets* (what they actually used). These answer different questions: "viewed" is curiosity, "downloaded" is commitment. Show "Continue where you left off" as the single most recent view, then a rail labeled "Recently explored" of the next 5–10. "Downloaded" lives on the My Recipes / My Presets page.

### Q3. The guitarist's "vibe" — personalized dashboard by player type?
**Answer:** Yes, and this is a distinctive differentiator vs Spotify. A "tone personality" label can be derived from 3–5 saves. Examples: "Worship driver", "Ambient shoegazer", "Blues purist", "Metal architect", "Indie jangler". The dashboard header greeting can read: *"Good evening, Dan — your Worship Driver dashboard"*. Editorial rails can then be tuned to the personality: a Worship Driver sees Lincoln Brewster, Chris Quilala, Hillsong at the top. This is high-impact personalization that feels handcrafted.

### Q4. Set packs vs single recipes — how should they feel different?
**Answer:** Spotify makes playlists feel different from individual songs through:
- A cover image (4-square mosaic of the contents, or custom editorial art)
- A title + curator/creator byline
- A count ("24 songs · 1 hr 32 min")
- A play-all action
Set packs on F&K should adopt the same language:
- A mosaic cover (4 signal-chain thumbnails, or a branded pack art)
- Title + "Curated by Fader & Knob" or user's name
- A count ("12 recipes · Worship Set · Updated weekly")
- A "Load entire pack to [Platform]" primary action — the "play all" of tone
On the dashboard, set packs should appear in their own dedicated rail labeled "Your set packs" above individual recipes.

### Q5. How should new recipes be presented to logged-in users?
**Answer:** Multiple rails with clear "reason" framing:
- **"New this week"** — editorial freshness signal
- **"Matches your rig"** — tied to gear
- **"Because you saved [X]"** — algorithmic with human reasoning
- **"Trending in [your genre]"** — social proof
Don't show just "New recipes" as an undifferentiated list. Every recommendation needs a *why*.

---

## 9. Quick Observations on Current F&K Dashboard (from code review)

Based on `src/app/dashboard/page.tsx`:
- Four stats cards are the default hero. These are chrome, not content.
- Stats are read from profile + localStorage with fallback — good engineering, but the data model could power much more than "count of saved recipes".
- No sign of a "recently viewed" or "continue" surface in the hero.
- Sidebar structure is menu-based, not library-preview-based.
- No hero, no horizontal rails, no personalization hooks.

This is a classic "admin dashboard" pattern applied to a music-adjacent product. The opportunity is huge: shifting from admin-style to music-library-style will make F&K feel 10x more like the products your users already love.

---

## 10. TOP 10 DASHBOARD ENHANCEMENTS (ranked by impact ÷ effort)

### Rank 1 — Add a "Continue where you left off" hero card
- **What:** Above the stats, a single oversized card showing the last recipe the user viewed, with artist, song, platform-compatible badge, and a big "Open" button.
- **Why:** Highest impact-to-effort ratio. Directly borrows Spotify's most-used surface. Instantly makes the dashboard feel personal.
- **Effort:** Quick win (half day). Store last-viewed recipe ID in localStorage + profile.

### Rank 2 — Demote the 4 stats cards into a thin strip
- **What:** Collapse the 4 big stats cards into a single horizontal bar (1 line, icon + label + value) below the new hero.
- **Why:** Frees up the most valuable screen real estate for actual content.
- **Effort:** Quick win (half day).

### Rank 3 — Add a "Your saved recipes" horizontal rail
- **What:** A scrollable rail of the user's 10 most-recently-saved recipes, with hover-reveal "Open" buttons.
- **Why:** Turns the dashboard from an admin view into a library view. The most expected music-app pattern.
- **Effort:** Medium (1–2 days) — needs a reusable RecipeRail component.

### Rank 4 — Add a "Matches your rig" rail
- **What:** A rail filtered by the user's selected platform + guitar, showing 8–10 compatible recipes.
- **Why:** Unlocks the unique value prop: "recipes that work with *your* gear". This is the feature Spotify can't replicate. Should be the second rail below saves.
- **Effort:** Medium (2 days) — depends on recipe metadata having platform + gear tags.

### Rank 5 — Time-aware, personalized greeting with "tone personality" label
- **What:** Greeting morphs by time of day ("Good morning, Dan"). Sub-greeting includes a derived tone personality label ("Worship Driver") once the user has 3+ saves.
- **Why:** Cheap, emotional, instantly signals "this product knows me."
- **Effort:** Quick win (1 day) — tone personality can be a simple rules-based classifier on saves.

### Rank 6 — Card visual identity (per-recipe deterministic gradient + signal-chain bar)
- **What:** Every recipe card gets a top strip that's either a procedurally generated gradient or a mini signal-chain visualization. Replace text-only cards.
- **Why:** Album art is the single most important visual asset in music apps. F&K needs an equivalent. The signal chain is also your brand's signature visual element — lean into it.
- **Effort:** Medium (2–3 days for the gradient hash + component; longer if doing real signal-chain minis).

### Rank 7 — Hover states + three-dot menus on cards
- **What:** On hover, cards lift, show an "Open" primary button and a three-dot secondary menu (Save, Copy signal chain, Share, Add to set pack).
- **Why:** The most-expected music-app microinteraction. Without it, the dashboard feels static.
- **Effort:** Quick win to medium (1–2 days). High polish payoff.

### Rank 8 — Empty state: opinionated starter experience for new users
- **What:** When a user has 0 saves and 0 gear, replace empty rails with: (a) "Start with these 6 popular recipes" editorial rail, (b) a 3-step "activate your dashboard" progress bar (Add gear → Save first recipe → Download first preset).
- **Why:** Activation is the biggest lever for retention. The current dashboard probably shows zeros to new users — a retention killer.
- **Effort:** Medium (2 days). Pair with improve-retention / Hooked framework.

### Rank 9 — Sidebar becomes a mini-library, not just a menu
- **What:** Under the "Saved Recipes" sidebar item, show the 3 most recent or pinned recipes as small inline rows. Add a persistent "+ New recipe" or "+ Create set pack" button at the bottom of the sidebar.
- **Why:** Matches the Spotify 2023 library sidebar pattern. Keeps the user's library one click away from any page.
- **Effort:** Medium (2 days).

### Rank 10 — Set packs as a distinct, above-the-fold surface
- **What:** A dedicated "Your set packs" rail (or pinned block) that renders set packs differently from individual recipes: mosaic cover, title, count, "Load pack" CTA. Never mix set packs into the individual recipe rails.
- **Why:** Set packs are a premium/differentiated product. They need visual parity with Spotify playlists to feel valuable. This also reinforces the pricing logic.
- **Effort:** Medium (2–3 days). Depends on set-pack data model.

---

## Appendix: Stretch / Larger Redesigns (post-top-10)

- **A. Tone personality engine** — rules-based or lightweight ML classification of the user's taste → drives editorial rails, greetings, and email.
- **B. Filter chips + view density toggle** on Saved Recipes page (not dashboard home).
- **C. Pinned recipes** — 4 pin slots above the saved-recipes rail.
- **D. "Tone Wrapped" / Year in Review** — annual/quarterly shareable data story.
- **E. Activity rail** — "what's new in your world" feed (new recipes, pack updates, trending in your genre).
- **F. Search at the top of the dashboard** — cross-library + global recipe search as a persistent bar.
- **G. Spatial / ambient hero** — inspired by the Dribbble Spatial Spotify concept, explore a future dashboard that uses depth, parallax, and ambient motion to make the dashboard feel physical/tactile. Long-term brand moment.
- **H. "Simple vs Advanced" view toggle** — dashboard has a simple mode (hero + 3 rails) and an advanced mode (stats dense, multiple filters, power-user density). Inspired by the Dribbble Simple vs Advanced reference; aligns with Nielsen-Norman modes guidance — must use instant, high-contrast state changes and remember the user's preference.

---

## Sources

Primary research drawn from these references (via WebSearch — WebFetch was blocked in this session):

- [How Spotify Uses Design To Make Personalization Features Delightful — Spotify Newsroom](https://newsroom.spotify.com/2023-10-18/how-spotify-uses-design-to-make-personalization-features-delightful/)
- [For Your Ears Only: Personalizing Spotify Home with Machine Learning — Spotify Engineering](https://engineering.atspotify.com/2020/1/for-your-ears-only-personalizing-spotify-home-with-machine-learning)
- [Reimagining Design Systems at Spotify — Spotify Design](https://spotify.design/article/reimagining-design-systems-at-spotify)
- [Spotify Updates Your Library With Pinned Playlists And Smarter Search — SlashGear](https://www.slashgear.com/spotify-updates-your-library-with-pinned-playlists-and-smarter-search-29670970/)
- [How to Sort Your Favorite Songs With Spotify's New Genre and Mood Filters — Spotify Newsroom](https://newsroom.spotify.com/2021-02-25/how-to-sort-your-favorite-songs-with-spotifys-new-genre-and-mood-filters/)
- [UI/UX Audit: Spotify vs Apple Music — Snappymob](https://blog.snappymob.com/ui-ux-audit-spotify-vs-apple-music)
- [Apple Music: A UX/UI Holistic Case Study — Muzli](https://medium.muz.li/apple-music-a-ux-ui-holistic-case-study-90579b294120)
- [Apple Music Player — Library Screen — Medium](https://medium.com/@xsokev/apple-music-player-library-screen-cab5661bb859)
- [Tidal's App Highlights The Brand's Dedication To Quality Music — DesignRush](https://www.designrush.com/best-designs/apps/tidal-user-friendly-app)
- [TIDAL Design Guidelines — TIDAL Developer Portal](https://developer.tidal.com/documentation/guidelines/guidelines-design-guidelines)
- [UX Case Study: SoundCloud's Mobile App — Usability Geek](https://usabilitygeek.com/ux-case-study-soundcloud-mobile-app/)
- [Activity Feed Design: The Ultimate Guide — Stream](https://getstream.io/blog/activity-feed-design/)
- [The Discovery Dilemma: A UX Case Study on YouTube Music — Medium](https://medium.com/@muthonikinyanjui/the-discovery-dilemma-a-ux-case-study-on-youtube-music-b0f971c07152)
- [UI Challenge — Redesign of the Bandcamp App — Medium](https://medium.com/@alice_moore/ui-challenge-redesign-of-an-app-e0c2637b5b77)
- [Bandcamp: ideas for the future of Collections — Medium](https://medium.com/@asip/bandcamp-ideas-for-the-future-of-collections-and-the-relationship-between-artists-and-labels-99e30a147d8d)
- [Modes in User Interfaces: When They Help and When They Hurt Users — Nielsen Norman Group](https://www.nngroup.com/articles/modes/)
- [Dark UI Design: 11 Tips for Dark Mode Design — Halo Lab](https://www.halo-lab.com/blog/dark-ui-design-11-tips-for-dark-mode-design)
- [In the Spotlight – The Principles of Dark UI Design — Toptal](https://www.toptal.com/designers/ui/dark-ui-design)
- [20 Dashboard UI/UX Design Principles for 2025 — Medium](https://medium.com/@allclonescript/20-best-dashboard-ui-ux-design-principles-you-need-in-2025-30b661f2f795)
- [BIAS X — Positive Grid](https://www.positivegrid.com/pages/bias-x) (guitar tone app with AI preset building)
- [Tonebridge Guitar Effects — App Store](https://apps.apple.com/us/app/tonebridge-guitar-effects/id1117291846) (9000+ song presets, closest analog product)
