-- Fix the squads SELECT policy which also has the same flaw
DROP POLICY IF EXISTS "Anyone can view squads they're part of" ON public.squads;

-- Create corrected SELECT policy for squads using the security definer function
CREATE POLICY "Users can view squads they're part of"
ON public.squads
FOR SELECT
USING (
  public.is_squad_member(auth.uid(), id) 
  OR created_by = auth.uid()
);