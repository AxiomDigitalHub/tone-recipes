import type { UserRole } from "@/lib/auth/auth-context";

/* -------------------------------------------------------------------------- */
/*  Tier definitions                                                          */
/* -------------------------------------------------------------------------- */

export interface TierConfig {
  label: string;
  price: number | null; // monthly price in USD, null = free
  features: string[];
  limits: {
    savedRecipes: number;       // max saved recipes (-1 = unlimited)
    platformTranslations: boolean; // can view all platform translations
    downloadPresets: boolean;   // can download .hlx/.json/.tsl files
    submitRecipes: boolean;     // can submit user recipes
    recipeAnalytics: boolean;   // can see analytics on submitted recipes
    adFree: boolean;            // no ads
    forumPost: boolean;         // can post in forum
    comments: boolean;          // can comment on recipes
  };
}

export const TIERS: Record<UserRole, TierConfig> = {
  free: {
    label: "Free Account",
    price: null,
    features: [
      "Browse all tone recipes",
      "5 preset downloads / month (.hlx, .tsl)",
      "Unlimited saved recipes",
      "Recipe PDFs",
      "Community forum & comments",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true, // gated by monthly quota; see canDownload()
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: false,
      forumPost: true,
      comments: true,
    },
  },
  pass: {
    label: "Pass",
    price: 4.99, // monthly equivalent; annual is $49 ($4.08/mo) — see /pricing
    features: [
      "Everything in Free",
      "Unlimited preset downloads",
      "Unlimited recipe PDFs",
      "Early access — new recipes 1 week before public",
      "Members-only deep-dive content (A/Bs, video breakdowns)",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
  // `pro` — 2026-06-15 model (docs/PRICING_MODEL.md). Everything in Pass,
  // plus every Set Pack bundled while subscribed (the Pass→Pro upgrade
  // lever: one pack is $19, so anyone buying even one a year nets ahead),
  // ToneTrace priority access at launch, and a commercial-use license.
  // Set Pack entitlement is enforced via setPackAccess() below — the
  // download/checkout routes read it, not a `set_pack_purchases` row.
  pro: {
    label: "Pro",
    price: 7.99, // monthly equivalent; annual is $79 ($6.58/mo) — see /pricing
    features: [
      "Everything in Pass",
      "All Set Packs included while subscribed",
      "ToneTrace priority access (at launch)",
      "Commercial-use license",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
  // `premium` and `creator` are LEGACY tiers from the pre-2026-05 model.
  // No new accounts get these roles. canDownload() treats any non-free
  // role as unlimited, so the few legacy rows (if any) still download
  // freely. Grandfathering of *free* accounts was retired 2026-06-15
  // (see migration 021); the free monthly quota now applies to all free
  // accounts. The labels stay friendly so the dashboard doesn't show
  // "Free Account" to someone who paid us money in v1.
  premium: {
    label: "Free Account",
    price: null,
    features: [
      "Browse all tone recipes",
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
  creator: {
    label: "Free Account",
    price: null,
    features: [
      "Browse all tone recipes",
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: true,
      recipeAnalytics: true,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
  admin: {
    label: "Admin",
    price: null,
    features: ["Full access", "Moderation tools", "User management"],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: true,
      recipeAnalytics: true,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
  super_admin: {
    label: "Super Admin",
    price: null,
    features: ["Full access", "Moderation tools", "User management", "System configuration"],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: true,
      recipeAnalytics: true,
      adFree: true,
      forumPost: true,
      comments: true,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Permission checks                                                         */
/* -------------------------------------------------------------------------- */

export function canViewAllPlatforms(role: UserRole): boolean {
  return TIERS[role].limits.platformTranslations;
}

export function canDownloadPresets(role: UserRole): boolean {
  return TIERS[role].limits.downloadPresets;
}

export function canSubmitRecipes(role: UserRole): boolean {
  return TIERS[role].limits.submitRecipes;
}

export function canViewRecipeAnalytics(role: UserRole): boolean {
  return TIERS[role].limits.recipeAnalytics;
}

export function getSavedRecipeLimit(role: UserRole): number {
  return TIERS[role].limits.savedRecipes;
}

export function isAdFree(role: UserRole): boolean {
  return TIERS[role].limits.adFree;
}

export function canPostInForum(role: UserRole): boolean {
  return TIERS[role].limits.forumPost;
}

export function isAtLeast(role: UserRole, minimum: UserRole): boolean {
  // free < pass < pro < admin. Legacy premium/creator slot just above
  // pass (their owners are grandfathered to pass-equivalent access) but
  // below pro, which is a real paid tier with Set Packs bundled.
  const order: UserRole[] = ["free", "pass", "premium", "creator", "pro", "admin"];
  return order.indexOf(role) >= order.indexOf(minimum);
}

/**
 * Does this role get every Set Pack included (no per-pack purchase)?
 *
 * Pro bundles all Set Packs while subscribed — the Pass→Pro upgrade lever
 * (docs/PRICING_MODEL.md). Admins get everything. Everyone else (free,
 * pass, legacy) buys packs à la carte and is gated on a `set_pack_purchases`
 * row. This is the single source of truth: the Set Pack download route, its
 * checkout short-circuit, and the SetPackAccess client all read it.
 */
export function setPackAccess(role: UserRole): boolean {
  return role === "pro" || role === "admin" || role === "super_admin";
}

/** @deprecated All platforms are now free — gating is on downloads only */
export const FREE_PLATFORM_LIMIT = Infinity;

/**
 * Monthly preset-download quota for free-tier accounts. Applies to ALL
 * free accounts as of 2026-06-15 (grandfathering retired, migration 021).
 * Paid roles (pass, pro) are unlimited by tier. canDownload() in
 * src/lib/downloads.ts is the single enforcement point; everywhere else
 * just reads this constant.
 */
export const FREE_DOWNLOAD_LIMIT = 5;

export function getDownloadLimit(role: UserRole): number {
  return role === "free" ? FREE_DOWNLOAD_LIMIT : Infinity;
}

/**
 * Monthly tone-request quota per tier. Requests are a membership feature:
 * free gets a taste, Pass gets the headline "10 tone requests a month",
 * Pro gets double. The caps exist as much to make people think before
 * submitting as to bound fulfillment cost.
 *
 * Enforced in two places that MUST stay in sync:
 *   - /api/tone-requests (friendly 402 with remaining count)
 *   - enforce_tone_request_quota() DB trigger (migration 024 — backstop
 *     against direct Supabase inserts)
 */
export const TONE_REQUEST_LIMITS: Record<UserRole, number> = {
  free: 2,
  pass: 10,
  pro: 20,
  premium: 10, // legacy: pass-equivalent
  creator: 10, // legacy: pass-equivalent
  admin: Infinity,
  super_admin: Infinity,
};

export function getToneRequestLimit(role: UserRole): number {
  return TONE_REQUEST_LIMITS[role] ?? TONE_REQUEST_LIMITS.free;
}
