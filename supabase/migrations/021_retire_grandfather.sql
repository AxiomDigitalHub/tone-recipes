-- 021_retire_grandfather.sql
--
-- Retire grandfathering (decision 2026-06-15, docs/PRICING_MODEL.md).
--
-- The 2026-06-09 relaunch (migration 019) backfilled legacy_unlimited = TRUE
-- for every existing account, granting unlimited preset downloads forever.
-- Under the new 3-tier pricing model that perk is retired: the free-tier
-- monthly download quota (5/mo) now applies to ALL free accounts. Confirmed
-- safe — there are no paying subscribers yet, so no one loses a paid benefit.
--
-- Application code no longer reads legacy_unlimited (canDownload, the download
-- route, DownloadCounter, and auth-context were all updated 2026-06-15). We
-- set the flag FALSE here rather than dropping the column so any
-- still-deployed code that SELECTs it during rollout reads a safe value.
-- The column + its partial index (profiles_legacy_unlimited_idx, migration
-- 019) can be dropped in a later migration once confirmed unused.

UPDATE profiles
  SET legacy_unlimited = FALSE
  WHERE legacy_unlimited = TRUE;
