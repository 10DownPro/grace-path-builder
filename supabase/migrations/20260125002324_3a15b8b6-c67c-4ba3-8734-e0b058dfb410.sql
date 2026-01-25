-- Allow authenticated users to read user_progress for their friends
-- This enables the leaderboard and friend stats features

CREATE POLICY "Users can view friend progress" 
ON public.user_progress 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- User can always see their own progress
    auth.uid() = user_id
    OR
    -- User can see progress of accepted friends
    EXISTS (
      SELECT 1 FROM public.friendships f
      WHERE f.status = 'accepted'
        AND (
          (f.requester_id = auth.uid() AND f.addressee_id = user_progress.user_id)
          OR 
          (f.addressee_id = auth.uid() AND f.requester_id = user_progress.user_id)
        )
    )
  )
);

-- Drop the old self-only policy if it exists (we're replacing it with a more permissive one)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;