-- Pass subscription relaunch (2026-06-09).
--
-- Reintroduces a paid tier (Pass, $39/yr) after the 2026-05 retirement of
-- Tone Pass and Pro. Differences from the previous attempt:
--
--   1. ONE tier (Pass), not two. The old Tone Pass / Pro split gave the
--      cheaper tier nothing the free tier didn't already have, and nobody
--      bought it. Pass collapses both into a single subscription with
--      real differentiation (see src/lib/permissions.ts).
--
--   2. Free tier becomes QUOTA'd at 5 preset downloads / calendar month.
--      Previously the "free" tier was unlimited; that left no reason to
--      upgrade. ToneAdapt validated that guitarists will pay for a tone
--      tool at this price point, so we're aligning incentives.
--
--   3. EVERY existing account is grandfathered to unlimited via the new
--      `legacy_unlimited` flag. The quota only applies to accounts
--      created after this migration runs. This avoids burning the
--      audience that built our growth (143 WAU as of launch).
--
-- New role 'pass' joins the existing free/premium/creator/admin set.
-- premium and creator are kept in the constraint for legacy rows; the
-- application layer aliases them to free + legacy_unlimited semantics
-- via the grandfather flag.

-- ---------------------------------------------------------------------------
-- 1. Extend role CHECK constraint to include 'pass'
-- ---------------------------------------------------------------------------

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('free', 'pass', 'premium', 'creator', 'admin', 'super_admin'));

-- ---------------------------------------------------------------------------
-- 2. legacy_unlimited flag — grandfather everyone existing
-- ---------------------------------------------------------------------------
--
-- Default FALSE for new rows (today onwards). The backfill below sets
-- TRUE for every account that already exists, so they keep the unlimited
-- downloads they signed up for.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS legacy_unlimited BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill: every account that exists right now is grandfathered.
-- Using `WHERE TRUE` rather than a date filter so this is idempotent
-- and survives accidental re-runs without skipping anyone.
UPDATE profiles SET legacy_unlimited = TRUE;

-- Index supports the canDownload() check at request time.
CREATE INDEX IF NOT EXISTS profiles_legacy_unlimited_idx
  ON profiles (id) WHERE legacy_unlimited = TRUE;

-- ---------------------------------------------------------------------------
-- 3. Monthly-quota query index
-- ---------------------------------------------------------------------------
--
-- canDownload() counts preset downloads for the current calendar month
-- per user. The 014 migration indexed (user_id) alone; we want a tighter
-- index that lets the planner range-scan by month efficiently.

CREATE INDEX IF NOT EXISTS recipe_downloads_user_month_idx
  ON recipe_downloads (user_id, created_at DESC)
  WHERE download_type = 'preset';
