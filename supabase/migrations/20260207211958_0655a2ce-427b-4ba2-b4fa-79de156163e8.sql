-- Create battle_verses_daily table for daily featured battle verses
CREATE TABLE public.battle_verses_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_date DATE NOT NULL UNIQUE,
  verse_reference TEXT NOT NULL,
  verse_text_kjv TEXT NOT NULL,
  verse_text_niv TEXT,
  verse_text_esv TEXT,
  verse_text_nlt TEXT,
  theme TEXT NOT NULL DEFAULT 'general',
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.battle_verses_daily ENABLE ROW LEVEL SECURITY;

-- RLS policies for battle_verses_daily (public read)
CREATE POLICY "Anyone can read daily battle verses"
  ON public.battle_verses_daily
  FOR SELECT
  USING (true);

-- Insert battle verses for the next week
INSERT INTO public.battle_verses_daily (verse_date, verse_reference, verse_text_kjv, verse_text_niv, theme)
VALUES 
  (CURRENT_DATE, 'Matthew 11:28-30', 
   'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.',
   'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.',
   'rest'),
  (CURRENT_DATE + 1, 'Philippians 4:13',
   'I can do all things through Christ which strengtheneth me.',
   'I can do all this through him who gives me strength.',
   'strength'),
  (CURRENT_DATE + 2, 'Joshua 1:9',
   'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
   'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
   'courage'),
  (CURRENT_DATE + 3, 'Isaiah 41:10',
   'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
   'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
   'fear'),
  (CURRENT_DATE + 4, 'Romans 8:28',
   'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
   'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
   'trust'),
  (CURRENT_DATE + 5, 'Jeremiah 29:11',
   'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
   'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
   'hope'),
  (CURRENT_DATE + 6, 'Psalm 23:4',
   'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
   'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
   'comfort');