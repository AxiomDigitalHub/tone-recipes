export type VerificationLevel = "ai_generated" | "community_verified" | "editor_verified";

export interface VerificationInfo {
  level: VerificationLevel;
  label: string;
  description: string;
}

export function getVerificationLevel(recipe: {
  is_editorial?: boolean;
  rating_avg: number;
  rating_count: number;
}): VerificationLevel {
  if (recipe.is_editorial) return "editor_verified";
  if (recipe.rating_avg >= 4.0 && recipe.rating_count >= 5) return "community_verified";
  return "ai_generated";
}

const verificationData: Record<VerificationLevel, Omit<VerificationInfo, "level">> = {
  ai_generated: {
    label: "AI Generated",
    description: "This recipe was AI-generated and hasn't been widely verified yet",
  },
  community_verified: {
    label: "Community Verified",
    description: "Rated 4+ stars by 5+ community members",
  },
  editor_verified: {
    label: "Editor Verified",
    description: "Manually reviewed and verified by our editorial team",
  },
};

export function getVerificationInfo(level: VerificationLevel): VerificationInfo {
  return { level, ...verificationData[level] };
}
