import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

interface PlatformPreferenceState {
  preferredPlatform: string | null;
  setPreferredPlatform: (platform: string | null) => void;
  syncFromProfile: (userId: string) => Promise<void>;
}

/** Lightweight Supabase client for profile sync */
let _client: ReturnType<typeof createSupabaseClient> | null = null;
function getClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createSupabaseClient(url, key);
  return _client;
}

export const usePlatformStore = create<PlatformPreferenceState>()(
  persist(
    (set, get) => ({
      preferredPlatform: null,
      setPreferredPlatform: (platform) => {
        set({ preferredPlatform: platform });
        // Fire-and-forget sync to Supabase profile
        const client = getClient();
        if (client) {
          client.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (client.from("profiles") as any)
                .update({ primary_platform: platform })
                .eq("id", user.id)
                .then(() => {});
            }
          });
        }
      },
      syncFromProfile: async (userId: string) => {
        const client = getClient();
        if (!client) return;
        const { data } = await client
          .from("profiles")
          .select("primary_platform")
          .eq("id", userId)
          .single();
        const row = data as Record<string, unknown> | null;
        if (row?.primary_platform && !get().preferredPlatform) {
          set({ preferredPlatform: row.primary_platform as string });
        }
      },
    }),
    {
      name: 'tone-recipes-platform',
    }
  )
);
