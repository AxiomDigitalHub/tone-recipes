"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { isSupabaseConfigured } from "@/lib/db/client";
import { addUserGear, deleteUserGear, getUserGear } from "@/lib/db/profile";
import { matchesUserGear } from "@/lib/gear-match";

/**
 * The viewer's rig (the "My rig" feature): Supabase `user_gear` when signed
 * in, the same localStorage list /dashboard/my-gear uses when not. One hook
 * so the recipe page's "I own this" and the rig page stay in step.
 */
const STORAGE_KEY = "tone-recipes-user-gear";

export interface RigItem {
  id: string;
  name: string;
  type: string;
}

function loadLocal(): RigItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as { id: string; name: string; type: string }[]) : [];
    return list.map((i) => ({ id: i.id, name: i.name, type: i.type }));
  } catch {
    return [];
  }
}
function saveLocal(items: RigItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map((i) => ({ ...i, notes: "" }))));
  } catch {
    // Storage blocked: the toggle still works for this visit.
  }
}

export function useRig() {
  const { user } = useAuth();
  const remote = isSupabaseConfigured() && !!user?.id;
  /** null while loading, so callers can avoid a flash of "you own 0". */
  const [items, setItems] = useState<RigItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (remote) {
        const rows = await getUserGear(user!.id);
        if (!cancelled) setItems(rows.map((r) => ({ id: r.id, name: r.gear_name, type: r.gear_type })));
      } else if (!cancelled) {
        setItems(loadLocal());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [remote, user]);

  /** The rig item that matches this gear name, if the viewer owns it. */
  const owned = useCallback(
    (gearName: string): RigItem | null => {
      if (!items || items.length === 0) return null;
      const hit = matchesUserGear(gearName, items.map((i) => i.name));
      return hit ? (items.find((i) => i.name === hit) ?? null) : null;
    },
    [items],
  );

  const toggle = useCallback(
    async (gearName: string, type: string) => {
      const current = items ?? [];
      const hit = matchesUserGear(gearName, current.map((i) => i.name));
      const existing = hit ? current.find((i) => i.name === hit) : undefined;
      if (existing) {
        const next = current.filter((i) => i.id !== existing.id);
        setItems(next);
        if (remote) await deleteUserGear(existing.id);
        else saveLocal(next);
        return;
      }
      if (remote) {
        const row = await addUserGear(user!.id, { gear_name: gearName, gear_type: type, notes: "" });
        if (row) setItems([...current, { id: row.id, name: row.gear_name, type: row.gear_type }]);
      } else {
        const next = [...current, { id: `local-${Date.now()}`, name: gearName, type }];
        setItems(next);
        saveLocal(next);
      }
    },
    [items, remote, user],
  );

  return { items, owned, toggle };
}
