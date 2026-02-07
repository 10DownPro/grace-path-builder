-- FIX CRITICAL SECURITY: Restrict publicly readable tables to authenticated users only

-- 1. feed_comments: Replace "Anyone can view" with authenticated-only policy
DROP POLICY IF EXISTS "Anyone can view comments" ON public.feed_comments;
CREATE POLICY "Authenticated users can view comments" 
  ON public.feed_comments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 2. feed_reactions: Add authentication requirement
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.feed_reactions;
CREATE POLICY "Authenticated users can view reactions" 
  ON public.feed_reactions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 3. poll_votes: Replace "Users can view poll votes" (which allows anyone)
DROP POLICY IF EXISTS "Users can view poll votes" ON public.poll_votes;
CREATE POLICY "Authenticated users can view poll votes" 
  ON public.poll_votes 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 4. prayer_reactions: Fix public policy
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.prayer_reactions;
DROP POLICY IF EXISTS "Users can view reactions" ON public.prayer_reactions;
CREATE POLICY "Authenticated users can view prayer reactions" 
  ON public.prayer_reactions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 5. prayer_comments: Add authentication requirement
DROP POLICY IF EXISTS "Anyone can view comments" ON public.prayer_comments;
DROP POLICY IF EXISTS "Users can view shared prayer comments" ON public.prayer_comments;
CREATE POLICY "Authenticated users can view prayer comments" 
  ON public.prayer_comments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 6. prayer_interactions: Fix public policy
DROP POLICY IF EXISTS "Users can view prayer interactions" ON public.prayer_interactions;
CREATE POLICY "Authenticated users can view prayer interactions" 
  ON public.prayer_interactions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 7. post_media: Fix public access
DROP POLICY IF EXISTS "Anyone can view post media" ON public.post_media;
CREATE POLICY "Authenticated users can view post media" 
  ON public.post_media 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 8. testimony_reactions: Add authentication
DROP POLICY IF EXISTS "Anyone can view testimony reactions" ON public.testimony_reactions;
CREATE POLICY "Authenticated users can view testimony reactions" 
  ON public.testimony_reactions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 9. testimony_comments: Add authentication
DROP POLICY IF EXISTS "Anyone can view testimony comments" ON public.testimony_comments;
CREATE POLICY "Authenticated users can view testimony comments" 
  ON public.testimony_comments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);