-- FEELING CATEGORIES TABLE
CREATE TABLE public.feeling_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  category_type TEXT,
  is_crisis BOOLEAN DEFAULT FALSE,
  sort_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRISIS RESOURCES TABLE
CREATE TABLE public.crisis_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES public.feeling_categories(id) ON DELETE CASCADE,
  resource_type TEXT,
  name TEXT,
  contact_info TEXT,
  description TEXT,
  country TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  display_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SUPPORT MESSAGES TABLE
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES public.feeling_categories(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  tone TEXT,
  times_shown INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- FEELING VERSES TABLE
CREATE TABLE public.feeling_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES public.feeling_categories(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  verse_start INT NOT NULL,
  verse_end INT,
  reference TEXT NOT NULL,
  text_kjv TEXT,
  text_niv TEXT,
  text_esv TEXT,
  text_nlt TEXT,
  relevance_score INT DEFAULT 5,
  context_note TEXT,
  times_shown INT DEFAULT 0,
  times_saved INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_power_verse BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- USER VERSE INTERACTIONS TABLE
CREATE TABLE public.user_verse_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verse_id UUID REFERENCES public.feeling_verses(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES public.feeling_categories(id) ON DELETE SET NULL,
  interaction_type TEXT,
  helped_rating INT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- USER SAVED VERSES TABLE
CREATE TABLE public.user_saved_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verse_id UUID REFERENCES public.feeling_verses(id) ON DELETE CASCADE,
  category_id TEXT,
  personal_note TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, verse_id)
);

-- INDEXES
CREATE INDEX idx_feeling_verses_category ON public.feeling_verses(category_id);
CREATE INDEX idx_feeling_verses_relevance ON public.feeling_verses(relevance_score);
CREATE INDEX idx_feeling_verses_shown ON public.feeling_verses(times_shown);
CREATE INDEX idx_user_verse_interactions_user ON public.user_verse_interactions(user_id);
CREATE INDEX idx_user_verse_interactions_verse ON public.user_verse_interactions(verse_id);
CREATE INDEX idx_user_saved_verses_user ON public.user_saved_verses(user_id);

-- TRIGGER FOR UPDATED_AT
CREATE TRIGGER update_feeling_verses_updated_at
  BEFORE UPDATE ON public.feeling_verses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ENABLE RLS
ALTER TABLE public.feeling_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeling_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verse_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_verses ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (categories, resources, messages, verses are public content)
CREATE POLICY "Anyone can read feeling categories" ON public.feeling_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read crisis resources" ON public.crisis_resources FOR SELECT USING (true);
CREATE POLICY "Anyone can read support messages" ON public.support_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can read feeling verses" ON public.feeling_verses FOR SELECT USING (true);

-- USER-SPECIFIC POLICIES
CREATE POLICY "Users can view their own interactions" ON public.user_verse_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interactions" ON public.user_verse_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interactions" ON public.user_verse_interactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved verses" ON public.user_saved_verses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved verses" ON public.user_saved_verses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved verses" ON public.user_saved_verses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved verses" ON public.user_saved_verses FOR UPDATE USING (auth.uid() = user_id);