-- Add RLS policy for user_progress so friends can see each other's progress
CREATE POLICY "Friends can view each other progress"
ON public.user_progress
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
    AND (
      (requester_id = auth.uid() AND addressee_id = user_progress.user_id)
      OR (addressee_id = auth.uid() AND requester_id = user_progress.user_id)
    )
  )
);

-- Drop old restrictive policy first if it exists
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;