import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

/**
 * GET /api/admin/metrics
 *
 * Returns live metrics for the admin dashboard. Combines:
 * - Supabase queries (users, roles, recent sign-ups)
 * - Filesystem counts (blog posts, news articles, presets)
 * - Static data counts (recipes, artists, songs, gear)
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY for the profiles query.
 * Gracefully degrades: if Supabase isn't configured, user metrics
 * return null and everything else still works.
 */
export async function GET() {
  // Static data counts (always available)
  const { toneRecipes, artists, songs, gearItems } = await import("@/lib/data");
  const catalog = {
    recipes: toneRecipes.length,
    artists: artists.length,
    songs: songs.length,
    gear: gearItems.length,
  };

  // Filesystem counts
  const blogDir = path.join(process.cwd(), "content", "blog");
  const newsDir = path.join(process.cwd(), "content", "news");
  const presetsDir = path.join(process.cwd(), "public", "presets");

  const blogPosts = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx")).length
    : 0;
  const newsArticles = fs.existsSync(newsDir)
    ? fs.readdirSync(newsDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx")).length
    : 0;
  const presetFiles = fs.existsSync(presetsDir)
    ? fs.readdirSync(presetsDir).filter((f) => f.endsWith(".hlx") || f.endsWith(".tsl")).length
    : 0;

  const content = { blogPosts, newsArticles, presetFiles };

  // Supabase user metrics (may be unavailable)
  let users = null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceKey && supabaseUrl) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);

      // Total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Users by role
      const { data: roleData } = await supabase
        .from("profiles")
        .select("role");

      const roleCounts: Record<string, number> = {};
      if (roleData) {
        for (const row of roleData) {
          const role = (row as { role: string }).role || "free";
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        }
      }

      // New users this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: newThisWeek } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo);

      // Recent sign-ups (last 10)
      const { data: recentData } = await supabase
        .from("profiles")
        .select("id, display_name, username, role, created_at, primary_platform")
        .order("created_at", { ascending: false })
        .limit(10);

      users = {
        total: totalUsers ?? 0,
        byRole: roleCounts,
        newThisWeek: newThisWeek ?? 0,
        recent: (recentData ?? []).map((u) => ({
          displayName: (u as Record<string, unknown>).display_name || (u as Record<string, unknown>).username || "Anonymous",
          role: (u as Record<string, unknown>).role || "free",
          platform: (u as Record<string, unknown>).primary_platform || null,
          createdAt: (u as Record<string, unknown>).created_at,
        })),
      };
    } catch (err) {
      console.error("Admin metrics: Supabase query failed:", err);
      // users stays null — dashboard shows "Connect Supabase" message
    }
  }

  return NextResponse.json({ catalog, content, users });
}
