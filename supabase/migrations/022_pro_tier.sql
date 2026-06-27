-- 022_pro_tier.sql
--
-- Add the `pro` tier (decision 2026-06-15, docs/PRICING_MODEL.md → "Build
-- order" step 2). The 2026-06-09 relaunch (migration 019) collapsed to a
-- single paid tier (`pass`); the locked pricing model reintroduces a second
-- paid tier (`pro`, $7.99/mo · $79/yr) whose differentiator is "all Set Packs
-- included" + commercial-use license + ToneTrace priority (entitlements live
-- in the application layer, src/lib/permissions.ts).
--
-- `team` is deliberately NOT added here — Team ships later (its seat/team_id
-- columns land in a separate migration when it does). This migration only
-- widens the role CHECK so `checkout.session.completed` can set role='pro'.

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('free', 'pass', 'pro', 'premium', 'creator', 'admin', 'super_admin'));
