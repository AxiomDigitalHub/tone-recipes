# v4 follow-ups — handoff for the next agent

**Last updated:** 2026-05-04 by Claude Opus 4.7 (1M context, session 3)
**Branch:** `main` — cutover live on faderandknob.com
**Current commit:** see `git log --oneline main`.

---

## Already shipped (session 3 — 2026-05-04)

- **Recipe quality system.** Three artifacts that solve the "where
  does the standard live and how do I check it" gap:
  - `docs/RECIPE_STANDARD.md` — single source of truth. Slug-tagged,
    severity-tagged rules with "why" lines.
  - `scripts/audit-recipes.ts` — programmatic grader. Run
    `npx tsx scripts/audit-recipes.ts`.
  - `docs/RECIPE_AUDIT_REPORT.md` — first run results: **5 clean,
    9 warn-only, 36 with errors out of 50.** Top offenders: 34/50
    have thin QC/Katana/Kemper/Fractal stubs (<3 blocks), 35/50 have
    no source URLs, 22/50 have Helix chains under the 6-block bar.
  - User-memory pin: `~/.claude/projects/.../memory/project_recipe_quality_system.md`
    so future sessions find this immediately.
- **Dev PDF preview** at `/dev/pdf/[slug]` — calls the same
  `/api/recipes/[slug]/download` endpoint as the recipe page but
  inlines the PDF in an iframe with a Reload button. Cuts PDF
  iteration loop from "click → download → open → close → click"
  to one button press. noindex.
- **Display font: Fraunces.** Replaced the never-rendering Space
  Grotesk + Georgia override. Real italic. Variable display serif
  designed for screens. Visible across every display headline on
  the site.
- **Header consistency: entity-detail h1s unified to .recipe-title.**
  /artist/[slug] and /news (index) had bespoke `.artist-title` /
  `.news-title` classes with subtly different sizes. Both removed,
  both pages now use `.recipe-title display` like everything else.
- **Page-top consistency (4 pages).** /pricing, /platforms (index),
  /blog (Field Notes), /request — all four had different head
  structures (different containers, missing display class on h1,
  bracketed-list eyebrows, missing breadcrumbs, etc.). Converged on
  the `.archive-masthead .archive-masthead-tight` pattern with
  `recipe-issue` eyebrow + `recipe-title display` + `recipe-summary`
  italic dek. /platforms also got a semantic fix: h2 → h1 + added
  breadcrumbs.
- **Nav active state.** The "amber rounded outline" Daniel was seeing
  was the global `:focus-visible` rule using the wrong amber
  (#f59e0b production, not #e4a235 v3) + border-radius:4px. Updated
  to v3 token, square corners. Then added explicit aria-current +
  `.is-active` styling: full-opacity ink underline + bold weight,
  driven by `usePathname` so `/recipe/<slug>` correctly highlights
  "Recipes" etc. Mobile drawer gets an ink left-border on the
  active row.
- **/dashboard/my-gear, /dashboard/my-recipes, /community,
  /community/forum re-skinned** — all four were still rendering
  production-tailwind chrome inside the v3 paper sidebar shell.
  Now use auth-form / dashboard-paper-card / dashboard-notif-row
  / forum-cat-card / community-card primitives (paper, hairline
  rules, mono caps, italic display dek, no rounded corners, no
  random palette).
- **Browse-from-interior fix.** Subnav "Archive" → "Recipes." New
  `.recipe-foot-browse` "Browse all recipes →" CTA at the bottom of
  recipe detail. Plus stripped the count-flexing meta on the
  More-like-this rail.
- **Audit cleanup.** § glyph dropped from blog post ToC. Count-flexing
  eyebrows on /platforms (index + slug) and /guides/artist-tone-recipes
  stripped. Unused `.page-title-lg` removed. Dead `DownloadRecipePDF.tsx`
  deleted (orphaned after RecipePdfButton replaced it).

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

### 0. Recipe rewrite — apply the spec to the catalogue

**This is the biggest open item.** The audit system is in place, the
manifest exists; the work is rewriting the 36 recipes that fail.

**Read first:** `docs/RECIPE_STANDARD.md` (the spec) +
`docs/RECIPE_AUDIT_REPORT.md` (the manifest). Re-run
`npx tsx scripts/audit-recipes.ts` whenever the data changes.

**Recommended order — tackle by rule slug, not by recipe, for
momentum:**

1. **`tone-context-valid` (9 errors).** The audit added "riff" and
   "intro_riff" as canonical values, so this set may now be 0 —
   re-run before starting. Anything left is a free-form value to
   normalize.
2. **`translations-each-has-blocks` (34 errors).** The big one.
   Recipes have stub translations — single-block QC, single-block
   Katana, etc. — that need to be expanded to ≥3 blocks. Drives,
   amp, cab at minimum. The Helix translation is the reference;
   port the gear choices to each platform's actual block names.
   Reference `docs/TONE_ENGINEERING_BIBLE.md` for the model name
   tables. TONEX is exempt by rule (single ToneNET reference is
   the design).
3. **`description-substantive` (1 error).** The Dimebag Walk
   description is 767 chars; trim to ≤600 by moving long-form
   context into per-block notes.
4. **`translations-required-platforms` (2 errors).** Two recipes
   are missing required helix/qc/katana translations. Find them
   in the audit report; build the missing platform translation.
5. **`sources-min` (35 warns).** 35 of 50 recipes have no source
   URLs. Add at least one source per recipe — equipboard.com,
   premier-guitar.com, an artist interview, a published rig
   rundown.
6. **`helix-block-count` (22 warns).** 22 Helix chains are under
   the 6-block bar (typically missing the comp, EQ, or reverb
   utility blocks). Add per the Worship Tutorials standard
   documented in the bible.
7. **`helix-comp-present` (4 warns).** Helix chains without a
   Compressor block in pos 1 or 2. Add `Deluxe Comp` per the
   bible spec.
8. **`helix-reverb-cuts` (3 warns).** Reverb blocks without
   `LowCut` (80-300 Hz) and `HighCut` (5-9 kHz). Update the
   settings.

**Discipline:**
- After each batch of fixes, run the audit. The report is the
  canonical "are we done?" check.
- Update `docs/RECIPE_STANDARD.md` if the work surfaces a rule that
  needs refining. Don't ship a rule change without updating the
  audit script in the same commit.
- Reasonable batch size: 5-10 recipes at a time, then run audit.
- Each rewrite is data-only (`src/lib/data/index.ts`); no UI changes.

Estimate: 8-15 hours total depending on how thorough the QC/Katana/
Kemper/Fractal stub-expansion is. Worth its own dedicated session(s).

---


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

### 2. Recipe-card PDF — visual redesign + bug fixes

**State:** PDF generator at `src/lib/pdf/generate-recipe-pdf.ts`
(jsPDF). Renders dynamically via `/api/recipes/[slug]/download`. The
`RecipePdfButton` component on the recipe page now wires the v3 site
to it. Critique done in chat 2026-05-04 against
`turner-do-i-wanna-know-fuzzy-riff-tone-recipe.pdf`.

**Issues:**
- Production amber `#f59e0b` + dark `#1a1a1a` + light-gray rounded
  panels. Reads as "marketing PDF," not editorial recipe card.
- Helvetica throughout — no display serif anywhere.
- **Rendering bugs (not just style):** category labels collide with
  block names — "Vox AC30**preamp**", "Vox 2x12 (Alnico Blue)**et**"
  (the "**cabinet**" gets cut), "Search ToneNET**pedal**", "Kemper
  Fuzz**: Slot A. Kemper for AC30!**" wrapping. Likely the category
  is drawn at the same baseline as the name without measuring text
  width before placing.
- Three amber genre pills (INDIE ROCK / ALTERNATIVE / GARAGE ROCK)
  read as marketing tags.
- Six identical amber-bar translation headers create table-fatigue.
- Settings line uses `|` separators; v3 uses ` · ` everywhere.

**Ordered change list (each is its own commit):**

1. **Color constants** at lines 25-31 → v3 tokens (paper, paper-2,
   paper-line, ink, ink-muted, ink-faint, amber-as-accent only).
2. **Page bg** = paper fill drawn first thing in `addPage`.
3. **Title + section heads** switch to `times` (jsPDF built-in).
   Title at ~32pt with -0.025em letter-spacing equivalent.
4. **Fix the signal-chain text-collision bug** — measure name width
   with `getTextWidth` before drawing the sibling category label,
   or move category onto its own line. Same root cause across the
   Helix / QC / TONEX / Katana / Kemper / Fractal sections.
5. **Replace the amber masthead band** with v3 recipe-issue line
   (italic mono "No. 042 · 2013 · Indie rock · 5 blocks") + display-
   serif title + italic credits. Wordmark moves to footer.
6. **Three amber genre pills → one mono-caps metadata line.**
7. **Section heads** → display-serif h2 + hairline ink rule extending
   right. Drop the amber square markers.
8. **Translation headers** — same hairline treatment as #7. Drops
   the six identical amber bars.
9. **Tables** → hairline-rule ledger rows on paper. No alternating
   fills, no rounded corners, no outer panel.
10. **Translation column headers** — paper bg, mono caps, ink rule
    above and below. Replace amber-fill / white-text headers.
11. **Amber numbered squares on signal-chain steps** → italic Times
    numerals (memory: never mono `01/02/03` chips).
12. **Settings-line separator** `|` → ` · ` (U+00B7).
13. **Description prose** rendered in Times italic at 13.5pt
    `INK_MUTED` — matches the engineer's-note voice on the site.
14. **Footer colophon**: mono caps wordmark + URL + issue at the
    foot, not the head, with a hairline rule above.
15. **Optional polish:** cropmarks at the four corners (~10 lines of
    jsPDF).

The bug fix in (4) and the color swap in (1) are the highest leverage
— each is small, each kills a category of pain. (3), (7), (10) ship
the new identity; the rest is rhythm cleanup.

Estimate: 2–3 hours. Pure layout work, no new wiring. Test against
`/api/recipes/srv-pride-and-joy-rhythm/download` (or any recipe with a
full chain).

---

### 3. Recipe browse affordance from interior pages

**Daniel's note:** "when I'm on an interior page, how do I browse the
recipes?"

**Audit:** the only path from any interior page (recipe / song / artist
/ platform detail / blog post / news) back to "browse all recipes" is
the **Archive** link in the global sub-nav (`SiteSubnav.tsx`,
`NAV_LINKS`). Two problems with that:

1. **Label doesn't match intent.** "Archive" reads as "back catalogue
   / old stuff," not "browse the recipes." Users looking for "browse"
   or "recipes" don't recognize it.
2. **No in-page affordance.** Recipe detail has a 3-card "More like
   this" rail (`src/app/recipe/[slug]/page.tsx:367-417`) and a Field
   Notes rail, but no "Browse all recipes →" CTA. Song / artist /
   platform pages only show recipes scoped to that entity. Blog posts
   have no link to the recipe catalogue at all.

**Proposed fixes (any subset works — start with #1, it's 5 min):**

1. **Rename `Archive` → `Browse` (or `Recipes`)** in
   `src/components/layout/SiteSubnav.tsx:22`. "Recipes" is most
   literal; "Browse" matches the route. Daniel picks. The site uses
   "Archive" elsewhere as branding (Field Notes archive, etc.) so
   maybe keep "Archive" as a sub-page concept but the top-nav label
   should say what it is.
2. **Add a "Browse all recipes →" CTA at the bottom of the recipe
   detail**, beneath the More-like-this rail. Same treatment as
   `dashboard-section-all` (mono caps, hairline-bordered, right-
   aligned).
3. **Recipe detail prev/next navigation.** Small chevron + song title
   pair at the bottom: `← Previous: Hendrix — Voodoo Child` /
   `Next: SRV — Pride and Joy →`. Cycles through the catalog (or by
   the active artist's other recipes). Adds context without forcing a
   trip back to /browse.
4. **On song / artist / platform pages**, add a "Back to all recipes"
   secondary chip near the top, beside the breadcrumbs. Cheap, makes
   the path obvious.

Estimate: #1 = 5 min, #2 = 15 min, #3 = 30 min, #4 = 15 min. Do at
least #1 + #2.

---

### 4. Smaller TODOs

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
- **Space Grotesk loads but never renders.** `src/app/layout.tsx:24`
  imports `Space_Grotesk` from next/font with `variable: "--font-display"`,
  but `src/app/v3.css:32` overrides `--font-display` to
  `Georgia, 'Times New Roman', serif` on `.fk-preview`. Result: the
  webfont downloads on every page load and is never used inside the
  v3 wrapper (i.e., everywhere). Two valid resolutions — Daniel
  picks:
  1. **Keep Georgia, drop the import.** Remove the Space_Grotesk
     import + className from layout.tsx. Saves ~30KB woff2 per page.
     Default if you like the Georgia editorial feel.
  2. **Adopt Space Grotesk.** Remove the `--font-display: Georgia`
     line from `.fk-preview` so the next/font variable wins. Shifts
     every display-font headline on the v3 site (recipe-title,
     archive-title, page-title, etc.) — a real visual change. Not a
     bad change, but should be reviewed visually first.
  3. **Swap to a different webfont** (Playfair Display, EB Garamond,
     Fraunces) — closer to the editorial direction Georgia points at,
     but with proper italic + display weight curated for screen.


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
