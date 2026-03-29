import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/db/client";

/**
 * Untyped browser client for profile/gear tables that aren't in the
 * generated Database schema yet.
 */
let _client: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

/* -------------------------------------------------------------------------- */
/*  Profile                                                                   */
/* -------------------------------------------------------------------------- */

export interface Profile {
  display_name: string;
  primary_platform: string;
  bio: string;
}

export async function getProfile(
  userId: string,
): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, primary_platform, bio")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  data: { display_name?: string; primary_platform?: string },
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .upsert({ id: userId, ...data }, { onConflict: "id" });

  return !error;
}

/* -------------------------------------------------------------------------- */
/*  User Gear                                                                 */
/* -------------------------------------------------------------------------- */

export interface UserGearItem {
  id: string;
  gear_name: string;
  gear_type: string;
  notes: string;
}

export async function getUserGear(
  userId: string,
): Promise<UserGearItem[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getClient();
  const { data, error } = await supabase
    .from("user_gear")
    .select("id, gear_name, gear_type, notes")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as UserGearItem[];
}

export async function addUserGear(
  userId: string,
  item: { gear_name: string; gear_type: string; notes: string },
): Promise<UserGearItem | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("user_gear") as any)
    .insert({
      user_id: userId,
      gear_name: item.gear_name,
      gear_type: item.gear_type,
      notes: item.notes,
    })
    .select("id, gear_name, gear_type, notes")
    .single();

  if (error || !data) return null;
  return data as UserGearItem;
}

export async function deleteUserGear(gearId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("user_gear") as any)
    .delete()
    .eq("id", gearId);

  return !error;
}
