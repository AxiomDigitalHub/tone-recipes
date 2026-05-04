# v4 follow-ups — handoff for the next agent

**Last updated:** 2026-05-04 by Claude Opus 4.7 (1M context, session 2)
**Branch:** `main` — cutover live on faderandknob.com
**Current commit:** `git log --oneline main` — latest is the platform
preset-loading content commit.

This doc captures the open work after the second post-cutover session.
Daniel's three open questions from session 1 were answered (most-recent-5
blog auto-rotate; floating sticky download chip; PDF generator already
exists in `src/lib/pdf/generate-recipe-pdf.ts`), so the work below is
the leftover queue plus newly surfaced items.

---

## Already shipped (session 2)

- **Blog overview auto-rotate** — `FEATURED_SLUGS` editorial picks
  retired; hero now slices the most recent 5 posts (1 lead + 4
  sidebar) off `getAllPosts()`. Daily-content task feeds straight into
  the hero with no manual curation.
- **Heading consolidation** — added shared `.page-title` class with
  three sizes (lg/md/sm) in v3.css. Swept legacy production-tailwind
  h1s on `/set-packs`, `/set-packs/worship`, `/how-we-work`,
  `/gear` (index), and every dashboard inner page (settings,
  my-gear, my-recipes, my-recipes/new, notifications, admin,
  admin/recipes, admin/recipes/new, admin/moderation).
- **Recipe download CTAs** — added `RecipePdfButton` (in-page Settings
  PDF button next to the .hlx/.tsl download in the platform-switcher
  row) + `RecipeDownloadChip` (floating sticky chip that slides in
  when the platform-switcher scrolls offscreen — bottom-right desktop,
  full-width pinned bottom mobile). Hidden for platforms without a
  buildable preset.
- **Dashboard /settings re-skin** — full re-skin into v3 paper chrome
  using auth-* form classes + new `.dashboard-paper-card` primitive
  for the billing block. ManageBillingButton swapped to
  `hero-cta hero-cta-secondary`.
- **Dashboard /notifications re-skin** — paper ledger with hairline
  rules, italic 1/2/3 numerals (no mono `01/02/03` chips per memory),
  amber wash on unread rows, paper empty/error/skeleton states.
- **Platforms — preset-loading + methodology + gotchas** — added three
  optional fields on `PLATFORM_FAMILY` (`preset_load`, `methodology`,
  `gotchas`). Drafted prose for Helix and Katana: 6-step loading
  walkthrough, 3-paragraph methodology, 3 gotchas each. Daniel
  reviews and edits.

---

## Open work (in roughly the order I'd tackle it)

### 1. Dashboard inner pages — re-skin in v3 chrome (continued)

**Status:** `/settings` and `/notifications` shipped; `/saved` was
already in v3 chrome (handoff was outdated). Remaining:

- `src/app/dashboard/my-gear/page.tsx` (345 lines)
- `src/app/dashboard/my-recipes/page.tsx` (292 lines)
- `src/app/dashboard/my-recipes/new/page.tsx` (~600 lines, big form)
- `src/app/dashboard/admin/page.tsx` (admin overview, 238 lines)
- `src/app/dashboard/admin/recipes/page.tsx` (admin recipe list)
- `src/app/dashboard/admin/recipes/new/page.tsx` (admin recipe builder, ~1300 lines)
- `src/app/dashboard/admin/moderation/page.tsx` (moderation queues)

**Pattern (use settings + notifications as templates):**

```
<div>
  <h1 className="page-title page-title-sm">{Title}</h1>
  <p className="dashboard-inner-dek">{One-line description}</p>

  <section className="dashboard-section">
    <header className="dashboard-section-head">
      <div>
        <span className="dashboard-eyebrow">{Eyebrow}</span>
        <h2 className="display">{Section heading}</h2>
      </div>
    </header>
    {/* … content … */}
  </section>
</div>
```

- Forms → `auth-form` + `auth-field` + `auth-label` + `auth-input` +
  submit button as `hero-cta hero-cta-primary auth-submit`.
- Card-style surfaces → `dashboard-paper-card` (paper bg, hairline
  border, 20/22 padding).
- Lists / tables → hairline `border-bottom: 1px solid var(--paper-line)`
  rows on a paper ledger with no border-radius. See
  `.dashboard-notif-row` for the pattern.
- Buttons → reuse `hero-cta hero-cta-primary` (ink fill) /
  `hero-cta hero-cta-secondary` (paper, ink border).
- Lucide icons read fine in `var(--ink)` — no color override needed.

**Don't touch the data wiring** — `useAuth`, `getProfile`,
`getUserGear`, `getNotifications`, the Supabase calls, Stripe portal
roundtrip. Only swap JSX/classes.

Estimate: 30–45 min per page. Admin recipes/new is the heaviest at
~1300 lines and may need its own session.

---

### 2. Settings PDF — visual redesign of the generated PDF

**State:** PDF generator exists at
`src/lib/pdf/generate-recipe-pdf.ts` (uses jsPDF). It produces the
PDF dynamically from recipe data via the
`/api/recipes/[slug]/download` endpoint. The `RecipePdfButton`
component now wires the v3 site to it.

**Open scope:** the PDF itself still uses production colors — amber
`#f59e0b`, dark `#1a1a1a`, light gray `#e5e7eb`. To match the v3 paper
aesthetic the layout would change to:
- Paper-cream bg (`#f3efe8` or close).
- Ink (`#0a0908`) for body, hairline rules between sections.
- Display serif (Times-style) for the recipe title; mono for the
  block grid; italic dek for the engineer's note.
- Cropmarks at the four corners and a hairline column rule, mirroring
  `.recipe-head` / `.platform-switcher`.

**Approach when picked up:**
1. Read `generate-recipe-pdf.ts` — understand the existing builder
   helpers (`drawWrappedText`, `ensureSpace`, etc.).
2. Replace the color palette constants at the top.
3. Swap `helvetica` for a serif (jsPDF ships Times by default, no
   font embedding needed) for the title and engineer's note.
4. Test by hitting `/api/recipes/srv-pride-and-joy-rhythm/download`
   in a browser while signed in.

Estimate: 2–3 hours. Pure layout work, no new wiring.

---

### 3. Smaller TODOs

- **5 orphan daily-content posts** still missing hero images
  (`balanced-power-guitar-rigs-furman-equitech`,
  `first-time-floyd-rose-string-change`,
  `marshall-dsl20hr-vs-origin-20`, `mooer-pedal-catalog-roundup`,
  `quilter-toneblock-202-vs-powerstage-200`). Re-run image gen or
  hand-add JPGs to `public/images/blog/`.
- **News card images** — `getNewsImageSync` falls back to Unsplash
  URLs; check if any are 404'ing in Replicate logs.
- **Search palette (Cmd+K)** still production-styled (dark) over v3
  paper pages. Same family as the dashboard inner re-skin.
- **/profile/[username]** uses production-tailwind h1 — wasn't in the
  heading sweep because the rest of the page is also production
  tailwind; pick up when that surface gets a full re-skin.
- **/community** family (community/page.tsx, community/forum/*) is
  still entirely production-tailwind. Same situation as profile.
- **Dead CSS sweep** — `.archive-item-num`, `.archive-side-head` from
  earlier rounds. Plus the legacy production `DownloadRecipePDF.tsx`
  has no live render path now that the recipe page uses
  `RecipePdfButton`; can be deleted in a cleanup commit.

---

## Working with this codebase — quick reference

- **CSS:** `src/app/v3.css` (~7200 lines, organized by feature blocks
  with `═══` headers). New session 2 sections at the bottom:
  `.page-title*`, `.recipe-dl-chip*`, `.pdf-gate*`, `.dashboard-inner-*`,
  `.dashboard-paper-card*`, `.dashboard-notif-*`, `.platform-loading-*`,
  `.platform-methodology*`.
- **Components:** v3-shared at `src/components/v3/` (added
  `RecipePdfButton.tsx`, `RecipeDownloadChip.tsx`).
- **Data:** `src/lib/data/index.ts`, `src/lib/data/platforms.ts`,
  `src/lib/blog.ts`, `src/lib/news.ts`.
- **PDF generator:** `src/lib/pdf/generate-recipe-pdf.ts` (jsPDF).
- **JSON-LD helpers:** `src/lib/seo/jsonld.ts`.
- **MDX validation before pushing daily content:**
  `npx tsx scripts/validate-mdx.mts`.
- **TypeScript check:** `npx tsc --noEmit`. Always run before pushing.
- **Dev preview server:** broken in this CLI environment (helper
  binary missing). Verification happens on Vercel after push.
- **Vercel auto-deploys on push to `main`.** Build takes ~6 min.

## Memory + feedback

The user's memory has these durable preferences (`~/.claude/projects/-Users-daniellivengood-Documents-Claude/memory/`):

- **No count-flexing eyebrows** — don't show "X recipes" / "Y stories
  filed" / count meta. Numbers are OK when functional (price, BPM,
  block count, "X unread"); not OK when they signal scale.
- Display titles drop trailing periods (Daniel calls them "a
  millennial thing").
- Editorial italic 1/2/3 numerals on step cards, not mono `01/02/03`
  chips.
- No section marks (`§`/`¶`/`§02`) — Daniel called them "weird icons."
- Album cover stands alone on LP cards — no spinning vinyl disc
  overlay covering the cover.

Read the memory index at
`~/.claude/projects/-Users-daniellivengood-Documents-Claude/memory/MEMORY.md`
before iterating.
