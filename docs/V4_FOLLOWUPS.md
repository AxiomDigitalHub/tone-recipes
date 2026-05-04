# v4 follow-ups — handoff for the next agent

**Last updated:** 2026-05-04 by Claude Opus 4.7 (1M context)
**Branch:** `main` — cutover live on faderandknob.com
**Current commit:** see `git log --oneline main` (latest is the `/platforms/<unknown>` graceful-fallback fix)

This doc captures the open work after the cutover overnight. Daniel
sent a punchlist; I shipped a few small fixes and ran out of context
before the larger items. Everything below is the open queue, with
investigation notes, design proposals, and open questions Daniel needs
to weigh in on before the next agent starts building.

---

## Already shipped (since cutover)

- v4.0–v4.2: cutover, JSON-LD parity, dashboard feature parity (commits `6fb045d` + earlier).
- v4.3: jsonld helper rename, dead `.preview-banner` CSS dropped, handoff doc updated.
- v4.4: auth-state aware sub-nav (initials avatar + Sign out when authed).
- v4.5: **OAuth regression fix** — restored "Continue with Google" on /login + /signup. Cutover had replaced the old prod login with an email-only v3 page.
- v4.6: mobile pass — phone breakpoints + 44px tap targets across `.dept-link`, `.request-sort-btn`, `.news-cat`, ledger rows.
- v4.7–v4.9: hamburger menu (3 iterations to fix a stacking-context bug; final is full-screen fixed overlay with internal close X).
- v4.8: Field Notes sidebar redesign — dropped the black "THIS ISSUE" bar and the call-number column, bumped thumbnails to 160px square.
- `/platforms/<unknown>` fallback — replaced bare 404 with a v3-themed "not supported yet" page that lists supported platforms + a Request CTA.

---

## Open work (in roughly the order I'd tackle it)

### 1. Dashboard inner pages — re-skin in v3 chrome

**Files:**
- `src/app/dashboard/saved/page.tsx`
- `src/app/dashboard/my-gear/page.tsx`
- `src/app/dashboard/my-recipes/page.tsx`
- `src/app/dashboard/notifications/page.tsx`
- `src/app/dashboard/settings/page.tsx`
- `src/app/dashboard/admin/page.tsx` (and `/dashboard/admin/recipes`, `/admin/moderation`)

**What's there now:** all use production tailwind (`text-2xl font-bold text-foreground`, `bg-surface`, `border-border`) inside the v3 sidebar shell from `DashboardShell.tsx`. The chrome is paper, the inner content is dark cards. Visual mismatch.

**Why I deferred:** each touches real account-data wiring (settings updates via Supabase, gear CRUD, notification reads, admin moderation queues). Wrong place for autonomous overnight edits.

**Approach when you pick this up:**
1. Read each page top-to-bottom — these are 200-400 line client components.
2. Don't touch the data wiring (`useAuth`, `getProfile`, `getUserGear`, the Supabase calls). Only swap the JSX tree + Tailwind classes for v3 classes.
3. Use the same patterns from `src/app/dashboard/page.tsx` (the overview already in v3 chrome) — `.dashboard-section`, `.dashboard-section-head`, `.dashboard-card`, `.dashboard-stats`.
4. Forms: lean on the auth-card + auth-input + auth-submit pattern. Tables: hairline-rule + paper-2 alternating rows.
5. Test each page signed in (you have admin role, so admin pages are reachable).

Estimate: 3–4 hours total, 30–45 min per page.

---

### 2. Recipe page download CTA + Settings PDF

**Daniel's note:** "the download button is actually pretty hard to find. as you scroll down, it's hard to get back to. solutions? Also, there should be a settings PDF for each recipe. 1. we need to make it clear you can download the settings pdf on page and 2, would it make sense to look at redesigning the pdfs to match the look/feel of the new site?"

**Current state** (`src/app/recipe/[slug]/page.tsx`):
- One "Download .hlx" button in the platform switcher row at the top.
- Loses visibility once user scrolls past the head.

**Proposed solution:**
1. **Sticky download chip** when user scrolls past the platform-switcher row. Floating bottom-right on desktop, full-width pinned bottom on mobile. Shows the current platform's download (`.hlx`, `.tsl`, etc.) and a "Settings PDF" sibling.
2. **In-page Settings PDF affordance**: add a second download button alongside the .hlx one, labeled "Settings PDF" with a small doc-icon glyph. Could also be a download row in the engineer's-note block.
3. **PDF redesign**: needs to be scoped first. Where are the PDFs generated? Look at `scripts/` for a generator. If hand-rolled, need to find the template. Then propose a v3-styled layout (paper/ink, big serif title, mono-cap settings table, cropmarks).

**Open questions for Daniel:**
- Float-bottom on desktop vs. sticky-on-scroll inline?
- PDF template — does one exist in code (scripts/) or hand-made elsewhere?
- One PDF format for all platforms, or platform-specific?

Estimate: sticky CTA + 2nd button = ~1 hour. PDF redesign is content + layout, depends on what exists.

---

### 3. Blog overview — featured selection + list/grid toggle

**Daniel's questions:**
- Are the 4 top blog posts the most recent ones?
- Cover art on archive — list view + grid view?
- Daily-content task ships 5 at a time — adjust hero from 1+3 to 1+4?

**Investigation answers:**

> **No, the top 4 are not the most recent.** They're hardcoded in `FEATURED_SLUGS` in `src/app/blog/page.tsx:30-35`:
> ```ts
> const FEATURED_SLUGS = [
>   "signal-chain-order-guide",
>   "helix-vs-quad-cortex-vs-kemper",
>   "overdrive-vs-distortion-vs-fuzz",
>   "tube-screamer-settings-guide",
> ];
> ```
> Editorial picks, manually curated. The daily-content task does NOT auto-rotate them.

**Proposed direction:**
- **Switch to most-recent-5 automatic.** Current editorial picks are stale; the daily-content task ships 5 posts/day so "most recent 5" is always fresh. Bump hero from 1+3 to **1+4** to match the daily cadence.
- OR: keep editorial picks + add an "auto-rotate from latest" toggle in `FEATURED_SLUGS` for posts older than X days.

**Archive (the flat ledger below the hero):**
- Currently shows: Dept | Title | By in 3 cols, no images.
- **Proposed:** add a "View" toggle (Ledger ↔ Grid). Ledger = current; Grid = 3-col cards with hero images at 16:9.

**Open question for Daniel:**
- Most-recent-5 OR keep editorial-curated? Lean recent for less editorial overhead.

Estimate: featured rotation = 30 min. List/grid toggle = 1 hour.

---

### 4. Heading consistency audit — proposed consolidation

**Audit (run `grep -rnE '<h1' src/app --include='*.tsx'` for the full list):**

**v3-styled (good):**
- `display hero-title` — home (1 use)
- `recipe-title display` — recipe / song / gear / platforms / artist (5 uses)
- `archive-title` (some with `display`, some without) — about, how-it-works, blog (3 uses)
- `post-title display` — blog detail (1 use)
- `display dashboard-name` — dashboard greeting (1 use)

**Production-tailwind (legacy, dark-themed) — these are visually inconsistent on the v3 site:**
- `text-3xl font-bold md:text-5xl` — set-packs, set-packs/worship, gear (index), how-we-work
- `text-2xl font-bold` / `text-3xl font-bold text-foreground` — every dashboard inner page (settings, my-gear, my-recipes, notifications, admin), profile, invite, my-recipes/new

**Proposed consolidation:**

Add ONE shared v3 page-title class, replace everything else.

```css
.fk-preview .page-title {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.95;
  color: var(--ink);
}
.fk-preview .page-title-lg { font-size: clamp(48px, 7vw, 104px); } /* hero */
.fk-preview .page-title-md { font-size: clamp(36px, 5vw, 72px); }  /* detail */
.fk-preview .page-title-sm { font-size: clamp(24px, 3vw, 36px); }  /* dashboard inner */
```

Then sweep replace:
- `display hero-title` → `page-title page-title-lg`
- `recipe-title display`, `archive-title display`, `post-title display` → `page-title page-title-md`
- Production tailwind h1s on dashboard inner / set-packs / how-we-work → `page-title page-title-sm` (and remove the tailwind `text-2xl font-bold` etc.)

Net effect: one class to maintain, three sizes, consistent rhythm across the site.

Estimate: 1.5–2 hours including the legacy-tailwind sweep.

---

### 5. Platform pages — preset loading instructions

**Daniel's note:** "we need preset loading instructions and specifics around how we make our patches specifically, start with Helix and Katana."

**This is content writing, not pure dev.** The `PLATFORM_FAMILY` const in `src/app/platforms/[slug]/page.tsx` has placeholder text already (`intro`, `models`, `conventions` per platform). What's missing:

1. **Preset loading walkthrough per platform.** Step-by-step:
   - Helix: download .hlx → connect via USB → HX Edit → File → Open → drag preset to a setlist slot → save. Plus a paragraph on `.hlx` vs `.hlb` (preset vs bundle).
   - Katana: download .tsl → connect via USB → Boss Tone Studio → File → Open → assign to a memory slot → write.
2. **How we make our patches** — editorial paragraph on the methodology (era-correct gear, real ranges not 0-10, hardware-tested, cab/mic conventions).

**Approach when you pick this up:**
1. Read the existing `PLATFORM_FAMILY` const for shape.
2. Add three new fields per platform: `preset_load_steps: string[]`, `methodology: string[]`, `gotchas: string[]`.
3. Render them as new sections on `/platforms/[slug]` between "About the family" and the recipe rack.
4. Daniel will edit the prose. Draft it tight: 4-6 numbered steps for loading, 2-3 paragraph methodology, 2-3 gotcha bullets.

Estimate: 2-3 hours including draft prose for Helix + Katana, plus the layout. Daniel reviews and edits.

---

### 6. Smaller TODOs

- **5 orphan daily-content posts** (`balanced-power-guitar-rigs-furman-equitech`, `first-time-floyd-rose-string-change`, `marshall-dsl20hr-vs-origin-20`, `mooer-pedal-catalog-roundup`, `quilter-toneblock-202-vs-powerstage-200`) currently have no hero images. Re-run the daily-content image-generation step OR add real hero JPGs to `public/images/blog/`.
- **News card images** — `getNewsImageSync` falls back to Unsplash URLs. If they fail to load, the paper-2 placeholder reads fine. Check if any are 404'ing in Replicate/Unsplash logs.
- **Search palette (Cmd+K)** still production-styled (dark) over v3 paper pages. Mismatch but functional. Same family as dashboard inner pages.
- **Dead CSS sweep**: `.archive-item-num`, `.archive-side-head` are unused after v4.8. Several other rules from earlier rounds may be dead too. Worth a 30-min audit + cleanup.

---

## Working with this codebase — quick reference

- **CSS:** `src/app/v3.css` (~7000 lines, organized by feature blocks with `═══` headers).
- **Components:** v3-shared at `src/components/v3/`, layout at `src/components/layout/`, dashboard-specific at `src/app/dashboard/`.
- **Data:** `src/lib/data/index.ts` (recipes, songs, artists, gear), `src/lib/data/platforms.ts` (platform meta + helpers), `src/lib/blog.ts`, `src/lib/news.ts`.
- **JSON-LD helpers:** `src/lib/seo/jsonld.ts`.
- **MDX validation before pushing daily content:** `npx tsx scripts/validate-mdx.mts`.
- **TypeScript check:** `npx tsc --noEmit`. Always run before pushing — dev tolerates types prod doesn't.
- **Vercel auto-deploys on push to `main`.** Build takes ~6 min.

## Memory + feedback

The user's memory has these durable preferences (`~/.claude/projects/-Users-daniellivengood-Documents-Claude/memory/`):
- **No count-flexing eyebrows** — don't show "X recipes" / "Y stories filed" / count meta. Numbers are OK when functional (price, BPM, block count); not OK when they signal scale.
- Display titles drop trailing periods (Daniel calls them "a millennial thing").
- Editorial italic 1/2/3 numerals on step cards, not mono `01/02/03` chips.
- No section marks (`§`/`¶`/`§02`) — Daniel called them "weird icons."
- Album cover stands alone on LP cards — no spinning vinyl disc overlay covering the cover.

Read the memory index at `~/.claude/projects/.../memory/MEMORY.md` before iterating.
