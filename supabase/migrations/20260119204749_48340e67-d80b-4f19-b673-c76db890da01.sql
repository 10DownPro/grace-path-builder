-- Drop the flawed policy
DROP POLICY IF EXISTS "Members can view squad members" ON public.squad_members;

-- Create corrected SELECT policy for squad_members
CREATE POLICY "Members can view squad members"
ON public.squad_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.squad_members sm
    WHERE sm.squad_id = squad_members.squad_id
      AND sm.user_id = auth.uid()
  )
);