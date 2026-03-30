-- Migration 012: Ensure admin rights for daniel.livengood@gmail.com
-- Handles case where profile may or may not exist yet

-- First, ensure profile row exists (upsert)
INSERT INTO profiles (id, display_name, role, is_moderator)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'Daniel'),
  'admin',
  true
FROM auth.users au
WHERE au.email = 'daniel.livengood@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_moderator = true;
