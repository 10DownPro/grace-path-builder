-- Fix: Create index only if not exists for user_saved_verses
CREATE INDEX IF NOT EXISTS idx_user_saved_verses_user ON public.user_saved_verses(user_id);

-- Ensure RLS policies exist for user_saved_verses
DROP POLICY IF EXISTS "Users can view own saved verses" ON public.user_saved_verses;
DROP POLICY IF EXISTS "Users can save verses" ON public.user_saved_verses;
DROP POLICY IF EXISTS "Users can delete own saved verses" ON public.user_saved_verses;

CREATE POLICY "Users can view own saved verses" 
ON public.user_saved_verses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save verses" 
ON public.user_saved_verses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved verses" 
ON public.user_saved_verses FOR DELETE 
USING (auth.uid() = user_id);

-- Add community settings to profiles if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS community_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_sensitive_topics BOOLEAN DEFAULT true;

-- Enable realtime for comments (ignore if already added)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'community_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'comment_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.comment_reactions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;