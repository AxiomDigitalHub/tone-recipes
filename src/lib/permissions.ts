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
      "Unlimited preset downloads (.hlx, .tsl)",
      "Unlimited saved recipes",
      "Recipe PDFs",
      "Community forum & comments",
    ],
    limits: {
      savedRecipes: -1,
      platformTranslations: true,
      downloadPresets: true,
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: false,
      forumPost: true,
      comments: true,
    },
  },
  // `premium` and `creator` are retired subscription tiers from the
  // pre-2026-05 pricing model. Existing rows in the profiles table may
  // still have these values; we treat both as "free + Set Pack ownership"
  // going forward. No new subscriptions are sold. Set Pack access is
  // gated on the `set_pack_purchases` table, not on the role column.
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
  const order: UserRole[] = ["free", "premium", "creator", "admin"];
  return order.indexOf(role) >= order.indexOf(minimum);
}

/** @deprecated All platforms are now free — gating is on downloads only */
export const FREE_PLATFORM_LIMIT = Infinity;

/**
 * @deprecated Quota retired 2026-05-10 — preset downloads are now unlimited
 * for any signed-in user. The constant is kept so existing call sites
 * (downloads.ts canDownload, /api/recipes/[slug]/download legacy route)
 * still compile; effective value is Infinity.
 */
export const FREE_DOWNLOAD_LIMIT = Infinity;

export function getDownloadLimit(role: UserRole): number {
  return role === "free" ? FREE_DOWNLOAD_LIMIT : Infinity;
}
