-- Fix Security Definer View issue
-- Recreate public_profiles view with SECURITY INVOKER (default, safer)

DROP VIEW IF EXISTS public.public_profiles;

-- Create secure view with INVOKER security (uses querying user's permissions)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  CASE 
    WHEN length(name) > 0 THEN LEFT(name, 1) || '***'
    ELSE 'User'
  END as display_name,
  commitment,
  created_at
FROM profiles;