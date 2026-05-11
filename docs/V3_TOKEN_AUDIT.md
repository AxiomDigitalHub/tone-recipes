# V3 Token Leakage Audit

**Generated:** 2026-05-11
**Files scanned:** 245
**Files with leaky tokens:** 16
**Total occurrences:** 428

## Background

These Tailwind tokens resolve to the **dark global palette** unless they're inside `.fk-preview .post-body`:

- `bg-surface`
- `bg-surface-hover`
- `bg-background`
- `text-foreground`
- `text-muted`
- `border-border`
- `bg-accent`
- `bg-accent-hover`
- `text-accent`

On v3 cream pages (which is most of the site) they render as dark navy / white-on-dark, clashing with the editorial palette. Convert to raw CSS vars instead: `var(--paper-2)`, `var(--ink)`, `var(--ink-muted)`, `var(--amber)`, etc.

## Priority — fix these (v3 cream surfaces) (0)

_clean_

## Review — context unclear, eyeball each (5)

| File | Count |
|---|---|
| `src/app/dev/knobs/page.tsx` | 11 |
| `src/app/not-found.tsx` | 7 |
| `src/components/mdx/FAQ.tsx` | 6 |
| `src/app/layout.tsx` | 2 |
| `src/app/auth/callback/page.tsx` | 1 |

## Likely OK — legacy dark dashboard / version previews (11)

| File | Count |
|---|---|
| `src/app/dashboard/admin/moderation/page.tsx` | 91 |
| `src/app/dashboard/admin/recipes/new/page.tsx` | 76 |
| `src/app/dashboard/my-recipes/new/page.tsx` | 59 |
| `src/app/dashboard/admin/page.tsx` | 37 |
| `src/app/v2/page.tsx` | 25 |
| `src/app/v3/page.tsx` | 25 |
| `src/app/v4/page.tsx` | 24 |
| `src/app/v3.css` | 20 |
| `src/app/dashboard/admin/recipes/page.tsx` | 19 |
| `src/components/dashboard/RecipeRail.tsx` | 16 |
| `src/components/dashboard/ContinueHero.tsx` | 9 |

