-- Create a security definer function to check squad membership
CREATE OR REPLACE FUNCTION public.is_squad_member(_user_id uuid, _squad_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.squad_members
    WHERE user_id = _user_id
      AND squad_id = _squad_id
  )
$$;

-- Drop the existing policy
DROP POLICY IF EXISTS "Members can view squad members" ON public.squad_members;

-- Create new SELECT policy using the security definer function
CREATE POLICY "Members can view squad members"
ON public.squad_members
FOR SELECT
USING (public.is_squad_member(auth.uid(), squad_id));