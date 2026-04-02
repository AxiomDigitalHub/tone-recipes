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
    label: "Free",
    price: null,
    features: [
      "Browse all tone recipes",
      "All platform translations (Helix, QC, TONEX, Fractal, Kemper, Katana)",
      "Download recipe PDFs (with email)",
      "10 free preset downloads (.hlx, .json, .tsl)",
      "Save up to 5 recipes",
      "Read blog & community forum",
      "Comment on recipes",
    ],
    limits: {
      savedRecipes: 5,
      platformTranslations: true,
      downloadPresets: false,
      submitRecipes: false,
      recipeAnalytics: false,
      adFree: false,
      forumPost: true,
      comments: true,
    },
  },
  premium: {
    label: "Premium",
    price: 9,
    features: [
      "Everything in Free",
      "Unlimited preset downloads (.hlx, .json, .tsl)",
      "Unlimited saved recipes",
      "Ad-free experience",
      "Priority community support",
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
    label: "Creator",
    price: 15,
    features: [
      "Everything in Premium",
      "Submit & publish tone recipes",
      "Analytics on your published recipes",
      "Creator badge on profile",
      "Early access to new features",
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

/** Number of free preset downloads before requiring premium */
export const FREE_DOWNLOAD_LIMIT = 10;

export function getDownloadLimit(role: UserRole): number {
  return role === "free" ? FREE_DOWNLOAD_LIMIT : Infinity;
}
