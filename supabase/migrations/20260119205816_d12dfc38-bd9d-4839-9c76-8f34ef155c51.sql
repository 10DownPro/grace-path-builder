-- Create a security definer function for safe friend code lookups
-- This returns only the user_id (minimal data) and doesn't expose other profile fields
CREATE OR REPLACE FUNCTION public.lookup_friend_by_code(_friend_code text)
RETURNS TABLE(user_id uuid, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    CASE 
      WHEN length(p.name) > 0 THEN LEFT(p.name, 1) || '***'
      ELSE 'User'
    END as display_name
  FROM public.profiles p
  WHERE UPPER(p.friend_code) = UPPER(_friend_code)
  LIMIT 1
$$;