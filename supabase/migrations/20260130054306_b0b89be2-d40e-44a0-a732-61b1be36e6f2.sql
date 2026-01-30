-- Poll votes table for tracking poll votes
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  option_index INTEGER NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view poll votes" ON public.poll_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own votes" ON public.poll_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.poll_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Prayer interactions table for tracking "I Prayed" interactions
CREATE TABLE IF NOT EXISTS public.prayer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  prayed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.prayer_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view prayer interactions" ON public.prayer_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own interactions" ON public.prayer_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" ON public.prayer_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Add new fields to community_feed_posts for enhanced prayer requests and polls
ALTER TABLE public.community_feed_posts 
  ADD COLUMN IF NOT EXISTS prayer_urgency TEXT DEFAULT 'routine',
  ADD COLUMN IF NOT EXISTS is_answered BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS answered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS answered_testimony TEXT,
  ADD COLUMN IF NOT EXISTS prayer_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS poll_data JSONB,
  ADD COLUMN IF NOT EXISTS poll_expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mentioned_users UUID[] DEFAULT '{}';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_poll_votes_post ON public.poll_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_prayer_interactions_post ON public.prayer_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON public.community_feed_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_feed_posts(created_at DESC);

-- Function to increment prayer count
CREATE OR REPLACE FUNCTION public.increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_feed_posts 
  SET prayer_count = prayer_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update prayer count on new prayer interaction
DROP TRIGGER IF EXISTS on_prayer_interaction_insert ON public.prayer_interactions;
CREATE TRIGGER on_prayer_interaction_insert
  AFTER INSERT ON public.prayer_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_prayer_count();

-- Function to decrement prayer count
CREATE OR REPLACE FUNCTION public.decrement_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_feed_posts 
  SET prayer_count = GREATEST(0, prayer_count - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update prayer count on prayer interaction delete
DROP TRIGGER IF EXISTS on_prayer_interaction_delete ON public.prayer_interactions;
CREATE TRIGGER on_prayer_interaction_delete
  AFTER DELETE ON public.prayer_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_prayer_count();

-- Add realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_interactions;