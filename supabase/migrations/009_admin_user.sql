-- Migration 009: Set admin rights for daniel.livengood@gmail.com
-- Updates the profile row to admin role with moderator privileges

UPDATE profiles
SET role = 'admin', is_moderator = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'daniel.livengood@gmail.com' LIMIT 1
);
