-- Ensure public_profiles view has proper access for all authenticated users
-- First let's check if there's a policy issue

-- Add SELECT policy to allow authenticated users to view all public_profiles
CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Drop any restrictive policy that might be blocking
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;