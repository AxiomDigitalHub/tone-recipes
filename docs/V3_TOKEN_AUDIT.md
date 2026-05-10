# V3 Token Leakage Audit

**Generated:** 2026-05-10
**Files scanned:** 245
**Files with leaky tokens:** 66
**Total occurrences:** 1238

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

## Priority — fix these (v3 cream surfaces) (27)

| File | Count |
|---|---|
| `src/app/guides/worship-guitar/page.tsx` | 39 |
| `src/app/guides/modeler-mastery/page.tsx` | 36 |
| `src/app/guides/bedroom-and-home-recording/page.tsx` | 34 |
| `src/app/guides/signal-chain-fundamentals/page.tsx` | 34 |
| `src/app/guides/tone-troubleshooting/page.tsx` | 34 |
| `src/app/guides/amp-settings-and-tone/page.tsx` | 33 |
| `src/app/guides/pedal-settings-guides/page.tsx` | 33 |
| `src/app/community/forum/[category]/page.tsx` | 30 |
| `src/app/profile/[username]/ProfileClient.tsx` | 26 |
| `src/app/community/forum/thread/[slug]/ThreadClient.tsx` | 25 |
| `src/app/invite/[code]/page.tsx` | 25 |
| `src/app/community/forum/new/page.tsx` | 24 |
| `src/app/gear/page.tsx` | 24 |
| `src/app/guides/artist-tone-recipes/page.tsx` | 24 |
| `src/app/how-we-work/page.tsx` | 21 |
| `src/components/community/ReportButton.tsx` | 19 |
| `src/components/auth/UpgradePromptModal.tsx` | 17 |
| `src/components/layout/PlatformPicker.tsx` | 17 |
| `src/app/guides/page.tsx` | 15 |
| `src/app/gear/[slug]/loading.tsx` | 14 |
| `src/app/profile/[username]/page.tsx` | 14 |
| `src/app/community/forum/thread/[slug]/page.tsx` | 11 |
| `src/components/community/FollowButton.tsx` | 8 |
| `src/app/browse/loading.tsx` | 6 |
| `src/components/community/NotificationBell.tsx` | 3 |
| `src/components/community/StarRating.tsx` | 3 |
| `src/app/community/forum/page.tsx` | 1 |

## Review — context unclear, eyeball each (28)

| File | Count |
|---|---|
| `src/components/browse/BrowseContent.tsx` | 45 |
| `src/components/ui/UpgradePrompt.tsx` | 20 |
| `src/components/home/PlatformOnboarding.tsx` | 19 |
| `src/components/signal-chain/PlatformView.tsx` | 17 |
| `src/app/artist/[slug]/loading.tsx` | 14 |
| `src/components/signal-chain/UnifiedChainView.tsx` | 13 |
| `src/components/blog/TableOfContents.tsx` | 12 |
| `src/app/dev/knobs/page.tsx` | 11 |
| `src/components/recipe/RecipeCard.tsx` | 10 |
| `src/components/signal-chain/ChainTooltip.tsx` | 10 |
| `src/components/home/HeroV2.tsx` | 9 |
| `src/components/ui/AffiliateGearLink.tsx` | 9 |
| `src/components/blog/BlogCard.tsx` | 8 |
| `src/components/ui/Toaster.tsx` | 8 |
| `src/app/not-found.tsx` | 7 |
| `src/components/home/SignalChainShowcase.tsx` | 7 |
| `src/components/checkout/CheckoutButton.tsx` | 6 |
| `src/components/home/HeroSignalChain.tsx` | 6 |
| `src/components/mdx/FAQ.tsx` | 6 |
| `src/components/ui/Badge.tsx` | 6 |
| `src/components/ui/FavoriteButton.tsx` | 6 |
| `src/components/home/HeroV3.tsx` | 4 |
| `src/components/recipe/DownloadCounter.tsx` | 4 |
| `src/components/signal-chain/SignalChainNode.tsx` | 4 |
| `src/app/layout.tsx` | 2 |
| `src/components/home/HeroV4.tsx` | 2 |
| `src/app/auth/callback/page.tsx` | 1 |
| `src/components/signal-chain/AnimatedSignalChain.tsx` | 1 |

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

