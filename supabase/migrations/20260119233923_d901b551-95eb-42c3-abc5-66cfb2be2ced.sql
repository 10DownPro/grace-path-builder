-- Ensure RLS is enabled and forced on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Create a public_profiles view that excludes sensitive fields
-- This view can be used for any public-facing profile display (leaderboards, friend lists, etc.)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  name,
  commitment,
  preferred_time,
  focus_areas,
  weekly_goal,
  created_at,
  updated_at
FROM public.profiles;
-- Excludes: is_premium, premium_source, premium_activated_at, book_code_used, has_book, hide_book_promos, friend_code

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add a comment explaining the view's purpose
COMMENT ON VIEW public.public_profiles IS 'Public-safe profile view excluding premium status, friend codes, and book-related fields. Use this for leaderboards, friend displays, and any non-owner profile access.';