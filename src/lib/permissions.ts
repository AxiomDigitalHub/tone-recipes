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
    price: 4.99, // monthly equivalent; annual is $39 ($3.25/mo) — see /pricing
    features: [
      "Everything in Free",
      "Unlimited preset downloads",
      "Early access — new recipes 1 week before public",
      "Members-only deep-dive content (A/Bs, video breakdowns)",
      "30% off every Set Pack — forever",
      "Members Discord",
      "Tone Adapter (coming soon)",
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
  // No new accounts get these roles. Existing rows with role=premium or
  // role=creator are grandfathered via the `legacy_unlimited` flag on
  // profiles (migration 019), so the canDownload() check treats them as
  // unlimited regardless of what's in `features`/`limits` here. The
  // labels stay friendly so the dashboard doesn't show "Free Account"
  // to someone who paid us money in v1.
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
  // pass sits just above free; legacy premium/creator are treated as
  // pass-equivalent for ordering since their owners are grandfathered.
  const order: UserRole[] = ["free", "pass", "premium", "creator", "admin"];
  return order.indexOf(role) >= order.indexOf(minimum);
}

/** @deprecated All platforms are now free — gating is on downloads only */
export const FREE_PLATFORM_LIMIT = Infinity;

/**
 * Monthly preset-download quota for accounts on the free tier created
 * after the 2026-06-09 Pass relaunch. Accounts created before then are
 * grandfathered to unlimited via the `legacy_unlimited` flag on profiles
 * (migration 019), and Pass subscribers (`role = 'pass'`) are unlimited
 * by tier. canDownload() in src/lib/downloads.ts is the single
 * enforcement point; everywhere else just reads this constant.
 */
export const FREE_DOWNLOAD_LIMIT = 5;

export function getDownloadLimit(role: UserRole): number {
  return role === "free" ? FREE_DOWNLOAD_LIMIT : Infinity;
}
