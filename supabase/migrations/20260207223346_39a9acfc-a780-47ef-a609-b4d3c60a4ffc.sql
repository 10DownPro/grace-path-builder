-- Add a new SELECT policy that allows viewing basic profile info for community features
-- This allows users to see names of people who post in the community feed
CREATE POLICY "Users can view profiles of community posters" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.community_feed_posts 
    WHERE community_feed_posts.user_id = profiles.user_id 
    AND community_feed_posts.is_deleted = false
    AND community_feed_posts.visibility = 'public'
  )
);