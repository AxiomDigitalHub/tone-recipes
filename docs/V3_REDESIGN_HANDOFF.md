# /preview v3 Redesign — Handoff Document

**Last updated:** 2026-05-02 by Claude Opus 4.7 (1M context)
**Branch:** `preview-redesign-v3` (latest commit: `77d85a2`)
**Live preview:** `https://tone-recipes-git-preview-fa282a-daniellivengood-2046s-projects.vercel.app`
**Status:** Design is locked-in directionally. v3.8 feature-parity sprint complete — most production pages now have v3 versions. Cutover blockers narrowed to JSON-LD/SEO + 301s + URL strategy.

---

## What this is

A full editorial redesign of `faderandknob.com` — paper / ink / amber magazine aesthetic with rotating LP album art, big serif display type, mono-cap utility chrome. Lives entirely under `/preview/*` so it doesn't touch production. When direction locks, the v3 surfaces migrate to the main routes and `/preview/*` retires.

Driver: Daniel wants the site to feel "like the best damn guitar tone website the world has ever seen" and act as both a tone library AND an educational hub for modeler players.

---

## How to read this doc as a fresh-context agent

1. Skim the **Design system** section first — the visual vocabulary is consistent across every page
2. Read **What's done** to understand the surface area
3. Read **Cutover blockers** before doing anything that affects shipping
4. Read **Conventions & gotchas** before editing CSS or pages
5. The **Open work** list is what to pick from

---

## Repository facts

- Next.js 16.1.6 (Turbopack), React 19, TypeScript strict
- All v3 work is scoped under `src/app/preview/*` and styles under `.fk-preview` in `src/app/preview/preview.css`
- **Nothing in `src/app/preview/` should leak to production routes.** All metadata uses `robots: { index: false, follow: false }`.
- Local dev: `npm run dev` — already running on `:3000` for the active session
- Vercel auto-deploys every push to `preview-redesign-v3`. Branch alias auto-flips: `tone-recipes-git-preview-fa282a-daniellivengood-2046s-projects.vercel.app`
- Builds are slow (~6 min) because there are 799 static pages — TypeScript runs after compile, prerender takes most of the time

---

## Design system

### Colors (CSS custom properties on `.fk-preview`)
```
--paper:        #EDEAE4   /* primary background */
--paper-2:      #E2DED6   /* hover / inset */
--paper-line:   rgba(10, 9, 8, 0.12)   /* hairlines */
--ink:          #0A0908   /* text + borders */
--ink-2:        #1C1A17   /* body text */
--ink-muted:    #5F5A52
--ink-faint:    #8F897E
--panel:        #0A0908   /* dark sections */
--tape:         #D8342B   /* red accent */
--amber:        #E4A235   /* primary CTA, accent */
```

### Type
- `--font-display`: Georgia (serif) — display titles
- `--font-body`: ui-sans-serif — body
- `--font-cond`: Oswald (condensed sans) — UI labels, CTAs
- `--font-mono`: ui-monospace — eyebrows, meta, captions

### Conventions
- **No periods on display titles.** "The opening shelf" / "Three steps from your favorite song to your rig" / "The Helix archive" — Daniel calls periods "a millennial thing"
- **Song · Artist (italic) · Album · Year** order on every detail head
- **No section marks** (§/§02/§03/¶) — Daniel called them "weird icon" and "weird symbol"
- **Editorial italic 1 / 2 / 3** numerals on step cards (NOT mono `01 / 02 / 03` chips)
- **Album cover stands alone** on LP cards — no spinning vinyl disc overlay (it covered the cover)
- **Cropmark detail** (4 amber `::before/::after` corners, 14px) on hero panels and the newsletter

### Components (`src/app/preview/_components/`)
| Component | Purpose |
|---|---|
| `LpArt.tsx` | Album cover tile — `cover`, `monogram` (hidden by default), `meta` (block-count chip), `hue` (1–6 fallback), `shape: square \| banner`. `showRecord=false` by default — keeps album cover unobstructed. |
| `PreviewSchematicChain.tsx` | Icon-only signal chain. `interactive=false` for the home hero. |
| `PreviewBlocks.tsx` | Pedal chassis renderers (used inside per-block grid on recipe page). |
| `PreviewKnob.tsx` / `PreviewRecipeClient.tsx` | Per-block settings UI on recipe page. |
| `BlockIcon.tsx` | Icon picker by gear name. |
| `recipe-to-blocks.ts` | Maps a recipe + platform → renderable block list. |
| `FieldNotesRail.tsx` | Cross-link rail of related blog posts (recipe / platform / artist). |
| `findRelatedPosts.ts` | Scoring helper for the rail (tags 3pt, categories 5pt, keywords 2pt). |

---

## What's done (file map)

### Routes shipped in v3

| Route | File | Notes |
|---|---|---|
| `/preview` | `page.tsx` | Hero (96px headline→CTAs gap), schematic featured chain, "Three steps" feature, "The opening shelf" 8 LP cards, "Friday Send" newsletter |
| `/preview/recipe/[slug]` | `recipe/[slug]/page.tsx` | Song-first head, real album cover via LpArt, Listen on YouTube + Tab on Songsterr + Spotify embed CTAs, platform switcher, schematic chain, per-block grid (open by default), Field Notes rail, "More like this" related cards |
| `/preview/platforms` | `platforms/page.tsx` | 6 platform cards, color-stripe per platform |
| `/preview/platforms/[slug]` | `platforms/[slug]/page.tsx` | Photo placeholder, "About the {Platform} family" section (per-platform copy in `PLATFORM_FAMILY` const), why-section, recipe rack, Field Notes rail, jumper to other modelers |
| `/preview/browse` | `browse/page.tsx` | Sticky LEFT sidebar with Era / Platform / Genre filter groups, Sort row, 3-wide grid. URL-driven via searchParams. |
| `/preview/song/[slug]` | `song/[slug]/page.tsx` | **Redirects** to recipe when song has 1 recipe (most common). Variants chooser kept for 2+ recipe case (Comfortably Numb has rhythm + solo). |
| `/preview/artist/[slug]` | `artist/[slug]/page.tsx` | Editorial profile, portrait, bio, genre chips, catalogue grid, queue list, Field Notes rail |
| `/preview/blog` | `blog/page.tsx` | "Field Notes" h1 only (no kicker/lede), one hero feature + 3 sidebar items, Departments rail, Archive ledger by quarter, Colophon |
| `/preview/blog/[slug]` | `blog/[slug]/page.tsx` | Magazine-cover hero, AEO Key Takeaways, sticky LEFT TOC + 80ch prose body (full-container width), tone-block remap, FAQ |
| `/preview/how-it-works` | `how-it-works/page.tsx` | Editorial methodology — 3 steps + 4 promise cards + closing CTA |
| `/preview/pricing` | `pricing/page.tsx` | 3-tier (Free / Tone Pass / Pro). Highlight card ink-filled with amber checks. FAQ. |
| `/preview/about` | `about/page.tsx` | Mission lede + 4 stat tiles + 4 principle cards + writers grid (`getAllWriters()`) |
| `/preview/compare` | `compare/page.tsx` | URL-driven `?a=&b=&platform=`. Two columns, picker when empty, schematic chain when filled. Platform switcher applies to both columns. |
| `/preview/gear/[slug]` | `gear/[slug]/page.tsx` | Modeler-equivalents table + recipes-using-this-gear grid + Field Notes rail. **TODO**: chain blocks on recipe page should link here. |
| `/preview/login` | `(auth)/login/page.tsx` | Form posts to `/api/auth/login`. Cropmark card. |
| `/preview/signup` | `(auth)/signup/page.tsx` | Same chrome as login. Posts to `/api/auth/signup`. |
| `/preview/privacy` `/terms` `/affiliate-disclosure` | `{path}/page.tsx` | Three legal pages on a shared `<LegalShell>` component. Placeholder copy with "preview" caveat box. |

### Layout

`layout.tsx` — Preview banner (red, top), Masthead bar ("Vol. 04 · Issue 14 · APR 2026 · Live Archive" / "Stop tweaking. Start playing."), Sub-nav (Fader & Knob / Archive · Platforms · Field Notes), then the page content.

The production header + footer ALSO render because `/preview/*` inherits the root `app/layout.tsx`. We've left that — production chrome carries the auth + cmd-K + footer newsletter and removing it before cutover would break those affordances.

### Stylesheet

`src/app/preview/preview.css` — single file, ~4350 lines. Organized by feature with `═══` block headers (v3.0 / v3.1 / v3.2 / v3.3 / v3.4 / v3.5 / v3.6 / v3.7). Append new rules at the bottom under a new `═══ vN.M ═══` header. **Specificity gotcha: `.fk-preview .hero h1 { margin: 0 }` (line 1592) wins over `.hero-title` because tag-in-class beats single class. Use `.fk-preview .hero h1.hero-title` to override.**

---

## Cutover blockers

Before promoting `/preview/*` → `/`, we need:

1. ~~**Wire the EXPORT PRESET button**~~ ✅ Done in v3.8.
2. ~~**Login / auth state in the v3 sub-nav.**~~ ✅ Login + Sign up affordances added in v3.8 (links to `/preview/login` + `/preview/signup`). Logged-in state (avatar / Saved / Dashboard) still TODO once auth state is wired.
3. **SEO / JSON-LD parity.** Every preview page has `noindex`. Production pages have full Recipe / WebPage / Article / FAQPage / BreadcrumbList JSON-LD. Port these and flip `robots: { index: true, follow: true }` on the v3 versions.
4. **301 redirects** from `/preview/*` → `/*` (set in `next.config.ts`).
5. **URL strategy decision** — swap-in-place (rename `/preview/recipe` → `/recipe`, delete old) vs side-by-side (keep `/preview` for QA).
6. **Logged-in chrome.** When a user is signed in, the v3 sub-nav should swap "Log in / Sign up" for an avatar + dropdown (Saved / Dashboard / Log out). Needs to read auth state — production probably uses a context or middleware. Audit before wiring.

---

## Pages production has, v3 doesn't

After v3.8 the gap narrowed sharply. Remaining production-only routes:

| Route | What it does | Notes |
|---|---|---|
| `/saved` | User's saved recipes library | Needs auth state wiring first |
| `/request` | Request a tone form | Easy port, ~30 min |
| `/news` | Industry news feed | Similar to /blog — port the same chrome |
| `/community` | Community hub | Open question — keep on production for now? |
| `/dashboard` | Logged-in user dashboard | Needs auth state wiring first |

**Built in v3.8:** `/compare`, `/gear/[slug]`, `/pricing`, `/how-it-works`, `/about`, `/privacy`, `/terms`, `/affiliate-disclosure`, `/login`, `/signup`.

---

## Open work (in rough priority order)

### High-value, ~1-2 hours each

- [ ] `/preview/how-it-works` — editorial deep-dive on the methodology. Reuse the home page "Three steps" section as starting structure, expand each step.
- [ ] `/preview/pricing` — 3 cards (Free / Tone Pass / Pro). Pricing data lives in `src/app/pricing/page.tsx`. Recommend: amber card for the highlighted "Tone Pass" tier per existing convention.
- [ ] `/preview/about` — mission, the team (writers data in `src/lib/writers.ts`), how-we-work
- [ ] `/preview/compare` — pick 2 recipes side-by-side. Production has the data flow worked out (`src/app/compare/page.tsx`). v3 treatment should show two `LpArt` covers + two schematic chains stacked or side-by-side.
- [ ] **Wire the EXPORT PRESET button** — small, blocks cutover. Replace the `<button>` in `recipe/[slug]/page.tsx` with `<a href="/presets/{recipe.slug}.hlx" download>` styled the same.

### Medium-value, half-day each

- [ ] `/preview/gear/[slug]` — gear database deep-link page. Each chain block on the recipe page should link to it. Big unlock for site stickiness.
- [ ] **Cmd-K global search** — production has it. Reskin to v3 paper/ink, add to v3 sub-nav.
- [ ] `/preview/saved` + `/preview/dashboard` — depend on auth state.
- [ ] **Equipboard-style artist treatment** — Daniel mentioned `equipboard.com` as a reference. Worth studying their layout and proposing a v2 of `/preview/artist/[slug]`.

### Content polish (write, don't build)

- [ ] **Per-platform editorial copy** — the `PLATFORM_FAMILY` dict in `platforms/[slug]/page.tsx` has placeholder text. Daniel will edit before launch.
- [ ] **Platform photos** — placeholder `<div>` on platform detail head. Sized 4:3 ≤380px. Drop in real product photography when available.
- [ ] **Field Notes index hero image** — was a black box in earlier screenshots; verify post.image paths resolve.
- [ ] **Three-step copy on home** — currently editor-voice; might be tightened.

### Cutover prep (do last)

- [ ] Add JSON-LD to all v3 pages (Recipe / WebPage / Article / FAQPage / BreadcrumbList — match production's shapes)
- [ ] Drop `noindex` from v3 pages we promote
- [ ] Add 301 redirects in `next.config.ts` from `/preview/*` → `/*`
- [ ] Add proper `<Metadata>` titles + descriptions (currently most v3 pages use the placeholder "Preview · X — Fader & Knob")
- [ ] Open Graph images per route

---

## Conventions & gotchas

### CSS specificity
- `.fk-preview` is the root scope class — every rule starts with it
- The older code uses `.fk-preview .hero h1` style selectors which beat single-class `.hero-title`. When overriding old rules, MATCH the specificity by using `.fk-preview .hero h1.hero-title { … }`
- Append new rules at the bottom of `preview.css` under a new `═══ vN.M ═══` block header

### Build behavior
- `npm run dev` is more permissive than the prod build. **Always run `npx tsc --noEmit` before committing** — Vercel's TypeScript step has caught two bugs that the dev server tolerated.
- Builds take ~6 min. Mostly prerendering 799 static pages. Don't push speculatively; verify locally first.

### Component cross-cutting
- `<LpArt>` defaults to `showMonogram=false` and `showRecord=false`. Opt in only when you really want them.
- `<PreviewSchematicChain>` defaults to interactive — pass `interactive={false}` for the home hero
- `<FieldNotesRail>` returns `null` when no posts match. Safe to render unconditionally.

### Data
- `src/lib/data/index.ts` — recipes, songs, artists, gear. Big file (~14k lines).
- `src/lib/data/platforms.ts` — `getAllPlatforms()`, `getPlatformInfo(slug)`, `getRecipesForPlatform(slug)`
- `src/lib/blog.ts` — `getAllPosts()`, `getPostBySlug()`, `BLOG_CATEGORIES`
- `src/lib/writers.ts` — `getAllWriters()`
- `next.config.ts` whitelists `is1-ssl.mzstatic.com` and `images.unsplash.com` for next/image. Add new domains there.

### Git workflow
- Commit messages use the v{n}.{n}: prefix style (e.g. "v3.7: Field Notes cross-linking")
- Co-Authored-By footer with model + version
- Never `git add -A` — stage `src/app/preview` only to keep dailyContent / research commits separate
- TypeScript check before EVERY push: `npx tsc --noEmit`

### Vercel auth-bypass
- Preview deployments are auth-protected. Use the Vercel MCP `get_access_to_vercel_url` to generate a `?_vercel_share=…` token. Token works across all paths on a single deployment, expires in 23h.
- Branch alias (`tone-recipes-git-preview-fa282a-daniellivengood-2046s-projects.vercel.app`) auto-flips to the latest READY deploy on the branch.

---

## Decision log (key choices made — don't reverse without asking)

1. **Editorial / paper-and-ink direction over dark v1.** Daniel approved the "best damn guitar tone website" brief and chose this aesthetic.
2. **Album covers > generated LP visuals.** First pass had a black record disc with hue-shifted center label overlaying the cover. Daniel said "that record is covering up the most important part of the album." Disc dropped.
3. **No section marks (§/§02/¶).** Felt like "weird icons." Plain section heads with rule + meta only.
4. **No periods on display titles.** Gen-Z styling cue from Daniel.
5. **Song > Artist (italic) > Album > Year order.** "That's how people know these things."
6. **Big italic serif numerals on step cards** (1 / 2 / 3) — not the mono `01 / 02 / 03` chips.
7. **Hero CTAs decrowded** — 96px gap between headline and buttons; hero feels ~half the viewport.
8. **Browse filters in a LEFT sticky sidebar** (not horizontal pills on top).
9. **Song page redirects to recipe** when there's 1 recipe (the common case). Listen / Tab / Spotify CTAs moved to recipe head.
10. **Field Notes are cross-linked into recipe / platform / artist pages** — the blog stops being a silo.
11. **Per-platform editorial expansion** — "About the X family" section on each `/preview/platforms/[slug]` with model lineup + patch conventions. Foundation for the deeper educational hub Daniel wants.
12. **Phased cutover, not full** — promote complete v3 routes first; leave dark-theme long-tail for follow-up rounds.

---

## Round-by-round summary

| Round | Commit | Highlights |
|---|---|---|
| v3.0 | 63a44fb | Original /preview redesign — LP rack, three steps, paper grain, drop cap |
| v3.1 | 54f03d8 + c75bd26 | Full site coverage — platforms / browse / song / artist + LpArt with real album art |
| v3.2 | 69ea0df | First feedback round — copy, hierarchy, density (drop v3 badge, masthead rewrite, headline orphan fix, drop section marks, etc.) |
| v3.3 | 75244df | Hero CTAs + big editorial step numerals + featured chain cropmark + newsletter horizontal + drop LP disc overlay |
| v3.4 | a4114d1 | Platform educational ("About the family"), archive decade pills, song→recipe redirect, recipe Spotify embed |
| v3.5 | 7f2fcd0 | Hero breathing + real multi-filter Browse + blog TOC on left + tone block CSS-var remap |
| v3.6 | f34e715 + a1163c6 + ec3d8a6 | Hero spacing fix (specificity collision), Browse left sidebar, "Browse Tones" rename, Field Notes head trim |
| v3.7 | a278ca1 | Field Notes cross-linking — `findRelatedPosts` + `FieldNotesRail` on recipe / platform / artist |
| v3.8 | 77d85a2 | Feature parity sprint — `/how-it-works`, `/pricing`, `/about`, `/compare`, `/gear/[slug]`, `/login`, `/signup`, `/privacy`, `/terms`, `/affiliate-disclosure`, sub-nav auth affordance, EXPORT PRESET wired to `/presets/{slug}.{hlx,tsl}` |

---

## When you pick this back up

1. Read this whole doc top-to-bottom (it's 10 minutes)
2. Pull `preview-redesign-v3` and `npm run dev`
3. Visit `http://localhost:3000/preview` to confirm the design system is loading
4. Pick from **Open work** — the high-value items are the missing pages (`/how-it-works`, `/pricing`, `/about`, `/compare`) plus the EXPORT PRESET wiring
5. If Daniel sends new feedback, treat it as authoritative — he's been iterating with high signal-to-noise. Cement his preferences in the **Decision log** above so they don't drift.

The goal is to keep the editorial direction consistent across every page, then do a phased cutover when the missing pages are filled in. Don't rush the cutover — Daniel said "It's not ready for live yet, but it's ready to keep moving forward."
