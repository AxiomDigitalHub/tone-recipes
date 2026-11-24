"use client";

import PresetDownloadButton from "@/components/recipe/PresetDownloadButton";
import RecipePdfButton from "@/components/v3/RecipePdfButton";
import RecipeDownloadChip from "@/components/v3/RecipeDownloadChip";
import { useRecipePlatform } from "./RecipePlatform";

const PRESET_LABEL = {
  helix: "Download Helix preset",
  quad_cortex: "Download Quad Cortex preset",
  katana: "Download Katana preset",
} as const;

/**
 * The button row under the recipe summary. Platforms with a preset file
 * get the download as the primary button; the rest lead with the settings
 * sheet. One primary button either way.
 */
export default function RecipeActions({
  slug,
  videoUrl,
  tabUrl,
}: {
  slug: string;
  videoUrl?: string;
  tabUrl?: string;
}) {
  const { platform } = useRecipePlatform();
  const hasPreset = platform === "helix" || platform === "quad_cortex" || platform === "katana";

  return (
    <div className="fk-recipe-actions" id="recipe-platform-switcher">
      {hasPreset ? (
        <>
          <PresetDownloadButton
            recipeSlug={slug}
            platform={platform}
            source="platform_switcher"
            className="fk-btn"
            label={PRESET_LABEL[platform]}
          />
          <RecipePdfButton slug={slug} className="fk-btn fk-btn-secondary" label="Settings PDF" />
        </>
      ) : (
        <RecipePdfButton slug={slug} className="fk-btn" label="Download settings sheet" />
      )}
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="fk-link fk-label fk-recipe-textlink">
          Listen on YouTube
        </a>
      )}
      {tabUrl && (
        <a href={tabUrl} target="_blank" rel="noopener noreferrer" className="fk-link fk-label fk-recipe-textlink">
          Tab on Songsterr
        </a>
      )}
      <RecipeDownloadChip slug={slug} platform={platform} />
    </div>
  );
}
