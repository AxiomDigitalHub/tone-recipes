export interface AffiliateLinks {
  sweetwater?: string;
  reverb?: string;
  amazon?: string;
  pluginBoutique?: string;
}

// Placeholder affiliate tag IDs — replace with real ones when approved
const AFFILIATE_TAGS = {
  sweetwater: "", // e.g., "tonerecipes"
  reverb: "",     // e.g., "tonerecipes"
  amazon: "",     // e.g., "tonerecipes-20"
};

// Generate search URLs for each affiliate partner
export function getAffiliateLinks(productName: string, manufacturer?: string): AffiliateLinks {
  const query = encodeURIComponent(`${manufacturer || ""} ${productName}`.trim());
  return {
    sweetwater: AFFILIATE_TAGS.sweetwater
      ? `https://www.sweetwater.com/store/detail/${query}?ref=${AFFILIATE_TAGS.sweetwater}`
      : `https://www.sweetwater.com/store/search?s=${query}`,
    reverb: `https://reverb.com/marketplace?query=${query}`,
    amazon: AFFILIATE_TAGS.amazon
      ? `https://www.amazon.com/s?k=${query}&tag=${AFFILIATE_TAGS.amazon}`
      : `https://www.amazon.com/s?k=${query}`,
  };
}

export function hasAffiliateProgram(): boolean {
  return Object.values(AFFILIATE_TAGS).some(tag => tag.length > 0);
}
