-- 004_security_fixes.sql
-- Fix Supabase security linter warnings

-- Fix 1: Set search_path on functions to prevent search path injection
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;

-- Fix 2: Restrict community_submissions INSERT to authenticated users
DROP POLICY IF EXISTS "Public insert" ON public.community_submissions;
CREATE POLICY "Authenticated insert" ON public.community_submissions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix 3: Restrict submission_votes INSERT to authenticated users
DROP POLICY IF EXISTS "Public insert votes" ON public.submission_votes;
CREATE POLICY "Authenticated insert votes" ON public.submission_votes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
