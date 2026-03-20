import { create } from 'zustand';

interface BrowseState {
  genreFilter: string | null;
  platformFilter: string | null;
  sortBy: 'popular' | 'newest' | 'artist-az';
  setGenreFilter: (genre: string | null) => void;
  setPlatformFilter: (platform: string | null) => void;
  setSortBy: (sort: 'popular' | 'newest' | 'artist-az') => void;
  clearFilters: () => void;
}

export const useBrowseStore = create<BrowseState>((set) => ({
  genreFilter: null,
  platformFilter: null,
  sortBy: 'popular',
  setGenreFilter: (genre) => set({ genreFilter: genre }),
  setPlatformFilter: (platform) =>
    set((state) => ({
      platformFilter: state.platformFilter === platform ? null : platform,
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  clearFilters: () => set({ genreFilter: null, platformFilter: null, sortBy: 'popular' }),
}));
