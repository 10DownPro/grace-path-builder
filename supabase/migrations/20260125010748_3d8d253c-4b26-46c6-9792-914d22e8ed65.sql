-- ================================================================
-- PRAYER SOCIAL FEATURES
-- ================================================================

-- Add shared field to prayers table
ALTER TABLE public.prayers 
ADD COLUMN IF NOT EXISTS shared_to_squad boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS shared_at timestamp with time zone;

-- Prayer supporters - people who are praying for someone's prayer
CREATE TABLE public.prayer_supporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  added_to_my_list boolean DEFAULT true,
  prayed_today boolean DEFAULT false,
  last_prayed_at timestamp with time zone,
  total_times_prayed integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(prayer_id, user_id)
);

-- Prayer reactions
CREATE TABLE public.prayer_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('praying', 'amen', 'heart', 'strong')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(prayer_id, user_id, reaction_type)
);

-- Prayer comments
CREATE TABLE public.prayer_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  comment_text text NOT NULL CHECK (char_length(comment_text) <= 280),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prayer_supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_comments ENABLE ROW LEVEL SECURITY;

-- Prayer supporters policies
CREATE POLICY "Users can view supporters for shared prayers"
  ON public.prayer_supporters FOR SELECT
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.prayers p 
      WHERE p.id = prayer_id AND (p.user_id = auth.uid() OR p.shared_to_squad = true)
    )
  );

CREATE POLICY "Users can add support to shared prayers"
  ON public.prayer_supporters FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.prayers p 
      WHERE p.id = prayer_id AND p.shared_to_squad = true
    )
  );

CREATE POLICY "Users can update their own support"
  ON public.prayer_supporters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their support"
  ON public.prayer_supporters FOR DELETE
  USING (auth.uid() = user_id);

-- Prayer reactions policies
CREATE POLICY "Anyone can view reactions"
  ON public.prayer_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can add reactions"
  ON public.prayer_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON public.prayer_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Prayer comments policies
CREATE POLICY "Anyone can view comments on shared prayers"
  ON public.prayer_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prayers p 
      WHERE p.id = prayer_id AND (p.user_id = auth.uid() OR p.shared_to_squad = true)
    )
  );

CREATE POLICY "Users can add comments to shared prayers"
  ON public.prayer_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.prayers p 
      WHERE p.id = prayer_id AND p.shared_to_squad = true
    )
  );

CREATE POLICY "Users can delete own comments"
  ON public.prayer_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================================
-- TESTIMONY FEATURE
-- ================================================================

-- Testimonies table
CREATE TABLE public.testimonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  testimony_type text NOT NULL CHECK (testimony_type IN ('answered_prayer', 'life_change', 'breakthrough', 'salvation', 'healing', 'provision', 'deliverance')),
  title text NOT NULL CHECK (char_length(title) <= 100),
  testimony_text text NOT NULL CHECK (char_length(testimony_text) <= 2000),
  related_prayer_id uuid REFERENCES public.prayers(id) ON DELETE SET NULL,
  related_verse_reference text,
  related_verse_text text,
  media_urls jsonb DEFAULT '[]'::jsonb,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'squad', 'private')),
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Testimony reactions
CREATE TABLE public.testimony_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimony_id uuid NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('amen', 'fire', 'praying', 'glory', 'heart')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(testimony_id, user_id, reaction_type)
);

-- Testimony comments
CREATE TABLE public.testimony_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimony_id uuid NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  comment_text text NOT NULL CHECK (char_length(comment_text) <= 280),
  created_at timestamp with time zone DEFAULT now()
);

-- Testimony shares
CREATE TABLE public.testimony_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimony_id uuid NOT NULL REFERENCES public.testimonies(id) ON DELETE CASCADE,
  shared_by_user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimony_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimony_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimony_shares ENABLE ROW LEVEL SECURITY;

-- Testimonies policies
CREATE POLICY "Users can view public testimonies"
  ON public.testimonies FOR SELECT
  USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR (visibility = 'squad' AND EXISTS (
      SELECT 1 FROM public.squad_members sm1
      JOIN public.squad_members sm2 ON sm1.squad_id = sm2.squad_id
      WHERE sm1.user_id = auth.uid() AND sm2.user_id = testimonies.user_id
    ))
  );

CREATE POLICY "Users can create their own testimonies"
  ON public.testimonies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonies"
  ON public.testimonies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own testimonies"
  ON public.testimonies FOR DELETE
  USING (auth.uid() = user_id);

-- Testimony reactions policies
CREATE POLICY "Anyone can view testimony reactions"
  ON public.testimony_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can add testimony reactions"
  ON public.testimony_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own testimony reactions"
  ON public.testimony_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Testimony comments policies
CREATE POLICY "Anyone can view testimony comments"
  ON public.testimony_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can add testimony comments"
  ON public.testimony_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own testimony comments"
  ON public.testimony_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Testimony shares policies
CREATE POLICY "Users can view their shares"
  ON public.testimony_shares FOR SELECT
  USING (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can share testimonies"
  ON public.testimony_shares FOR INSERT
  WITH CHECK (auth.uid() = shared_by_user_id);

-- Add indexes for performance
CREATE INDEX idx_prayer_supporters_prayer_id ON public.prayer_supporters(prayer_id);
CREATE INDEX idx_prayer_supporters_user_id ON public.prayer_supporters(user_id);
CREATE INDEX idx_prayer_reactions_prayer_id ON public.prayer_reactions(prayer_id);
CREATE INDEX idx_prayer_comments_prayer_id ON public.prayer_comments(prayer_id);
CREATE INDEX idx_testimonies_user_id ON public.testimonies(user_id);
CREATE INDEX idx_testimonies_visibility ON public.testimonies(visibility);
CREATE INDEX idx_testimonies_featured ON public.testimonies(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimony_reactions_testimony_id ON public.testimony_reactions(testimony_id);
CREATE INDEX idx_testimony_comments_testimony_id ON public.testimony_comments(testimony_id);

-- Update timestamp trigger for testimonies
CREATE TRIGGER update_testimonies_updated_at
  BEFORE UPDATE ON public.testimonies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();