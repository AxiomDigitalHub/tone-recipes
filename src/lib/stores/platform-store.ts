import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlatformPreferenceState {
  preferredPlatform: string | null;
  setPreferredPlatform: (platform: string | null) => void;
}

export const usePlatformStore = create<PlatformPreferenceState>()(
  persist(
    (set) => ({
      preferredPlatform: null,
      setPreferredPlatform: (platform) => set({ preferredPlatform: platform }),
    }),
    {
      name: 'tone-recipes-platform',
    }
  )
);
