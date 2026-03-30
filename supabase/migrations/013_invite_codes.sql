-- 013_invite_codes.sql
-- Invite code system for granting free tier upgrades (e.g., friends & beta testers)

CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  granted_role TEXT NOT NULL DEFAULT 'creator' CHECK (granted_role IN ('premium', 'creator')),
  label TEXT,                       -- internal note, e.g. "Friends & Family batch 1"
  max_uses INT,                     -- NULL = unlimited
  current_uses INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,           -- NULL = never expires
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track who redeemed which code
CREATE TABLE IF NOT EXISTS invite_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code_id UUID NOT NULL REFERENCES invite_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(invite_code_id, user_id)   -- one redemption per user per code
);

-- RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_redemptions ENABLE ROW LEVEL SECURITY;

-- Anyone can read invite codes (needed to validate on signup)
CREATE POLICY "Invite codes are readable" ON invite_codes FOR SELECT USING (true);

-- Only admins can insert/update invite codes
CREATE POLICY "Admins can manage invite codes" ON invite_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can view their own redemptions
CREATE POLICY "Users can view own redemptions" ON invite_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- Insert redemption is done via server function
CREATE POLICY "Users can redeem codes" ON invite_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to redeem an invite code (validates + upgrades role atomically)
CREATE OR REPLACE FUNCTION redeem_invite_code(invite_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_code_id UUID;
  v_role TEXT;
  v_max_uses INT;
  v_current_uses INT;
  v_expires_at TIMESTAMPTZ;
  v_user_id UUID := auth.uid();
  v_already_redeemed BOOLEAN;
BEGIN
  -- Must be logged in
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Find the code
  SELECT id, granted_role, max_uses, current_uses, expires_at
  INTO v_code_id, v_role, v_max_uses, v_current_uses, v_expires_at
  FROM invite_codes
  WHERE invite_codes.code = invite_code;

  IF v_code_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid invite code');
  END IF;

  -- Check expiry
  IF v_expires_at IS NOT NULL AND v_expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invite code has expired');
  END IF;

  -- Check max uses
  IF v_max_uses IS NOT NULL AND v_current_uses >= v_max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invite code has reached its maximum uses');
  END IF;

  -- Check if already redeemed by this user
  SELECT EXISTS(
    SELECT 1 FROM invite_redemptions WHERE invite_code_id = v_code_id AND user_id = v_user_id
  ) INTO v_already_redeemed;

  IF v_already_redeemed THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already redeemed this code');
  END IF;

  -- All good — redeem it
  INSERT INTO invite_redemptions (invite_code_id, user_id) VALUES (v_code_id, v_user_id);

  UPDATE invite_codes SET current_uses = current_uses + 1 WHERE id = v_code_id;

  -- Upgrade the user's role (only upgrade, never downgrade)
  UPDATE profiles
  SET role = v_role, updated_at = now()
  WHERE id = v_user_id
    AND (
      role = 'free'
      OR (role = 'premium' AND v_role = 'creator')
    );

  RETURN jsonb_build_object(
    'success', true,
    'granted_role', v_role,
    'message', 'Welcome! Your account has been upgraded to ' || v_role || '.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed: Friends & Family batch — 20 uses, never expires, grants creator
INSERT INTO invite_codes (code, granted_role, label, max_uses)
VALUES ('FRIENDS-OF-FADER', 'creator', 'Friends & Family — free Creator forever', 20);
