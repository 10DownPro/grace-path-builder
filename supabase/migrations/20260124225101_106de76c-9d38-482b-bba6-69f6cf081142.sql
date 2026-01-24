-- ==========================================
-- POINT EARNING & FUNCTIONAL REWARDS SYSTEM
-- ==========================================

-- 1. Add columns to user_rewards for functional reward tracking
ALTER TABLE public.user_rewards 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS uses_remaining INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create a table to track streak protection (Streak Freeze usage)
CREATE TABLE IF NOT EXISTS public.streak_protection_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  protected_date DATE NOT NULL,
  user_reward_id UUID REFERENCES public.user_rewards(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, protected_date)
);

ALTER TABLE public.streak_protection_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their streak protections"
  ON public.streak_protection_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their streak protections"
  ON public.streak_protection_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Create a table for multi-level Bible content
CREATE TABLE IF NOT EXISTS public.bible_passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER DEFAULT 1,
  verse_end INTEGER DEFAULT NULL,
  passage_name TEXT NOT NULL,
  passage_theme TEXT,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(book, chapter, verse_start)
);

ALTER TABLE public.bible_passages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bible passages"
  ON public.bible_passages FOR SELECT
  USING (true);

-- 4. Create table for passage content at different reading levels
CREATE TABLE IF NOT EXISTS public.passage_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id UUID NOT NULL REFERENCES public.bible_passages(id) ON DELETE CASCADE,
  reading_level TEXT NOT NULL, -- picture, early_reader, intermediate, advanced, young_adult, adult, scholarly
  summary TEXT NOT NULL,
  key_verse TEXT,
  discussion_questions JSONB DEFAULT '[]'::jsonb,
  activity_suggestion TEXT,
  prayer_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(passage_id, reading_level)
);

ALTER TABLE public.passage_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read passage levels"
  ON public.passage_levels FOR SELECT
  USING (true);

-- 5. Create function to award points (called after session/prayer/verse)
CREATE OR REPLACE FUNCTION public.award_points(_user_id UUID, _points INTEGER, _reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_total INTEGER;
  _multiplier INTEGER := 1;
  _final_points INTEGER;
BEGIN
  -- Check for active Double XP reward
  IF EXISTS (
    SELECT 1 FROM user_rewards ur
    JOIN rewards r ON ur.reward_id = r.id
    WHERE ur.user_id = _user_id 
      AND r.reward_type = 'booster'
      AND r.name ILIKE '%double%xp%'
      AND ur.activated_at IS NOT NULL
      AND ur.expires_at > now()
  ) THEN
    _multiplier := 2;
  END IF;
  
  _final_points := _points * _multiplier;
  
  UPDATE user_progress 
  SET total_points = total_points + _final_points
  WHERE user_id = _user_id
  RETURNING total_points INTO _current_total;
  
  RETURN COALESCE(_current_total, 0);
END;
$$;

-- 6. Create function to activate a functional reward
CREATE OR REPLACE FUNCTION public.activate_reward(_user_reward_id UUID)
RETURNS TABLE(success BOOLEAN, message TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _reward RECORD;
  _user_reward RECORD;
  _duration_hours INTEGER;
  _new_expires TIMESTAMPTZ;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;
  
  -- Get user reward and linked reward
  SELECT ur.*, r.name, r.reward_type, r.reward_data
  INTO _user_reward
  FROM user_rewards ur
  JOIN rewards r ON ur.reward_id = r.id
  WHERE ur.id = _user_reward_id AND ur.user_id = _user_id;
  
  IF _user_reward IS NULL THEN
    RETURN QUERY SELECT false, 'Reward not found'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;
  
  -- Check if already active and not expired
  IF _user_reward.activated_at IS NOT NULL AND _user_reward.expires_at > now() THEN
    RETURN QUERY SELECT false, 'Reward is already active'::TEXT, _user_reward.expires_at;
    RETURN;
  END IF;
  
  -- Check if uses remaining (for consumables like Streak Freeze)
  IF _user_reward.uses_remaining IS NOT NULL AND _user_reward.uses_remaining <= 0 THEN
    RETURN QUERY SELECT false, 'No uses remaining'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;
  
  -- Calculate duration based on reward type
  _duration_hours := COALESCE((_user_reward.reward_data->>'duration_hours')::INTEGER, 24);
  _new_expires := now() + (_duration_hours || ' hours')::INTERVAL;
  
  -- Activate the reward
  UPDATE user_rewards
  SET activated_at = now(),
      expires_at = _new_expires
  WHERE id = _user_reward_id;
  
  RETURN QUERY SELECT true, format('%s activated!', _user_reward.name)::TEXT, _new_expires;
END;
$$;

-- 7. Create function to use Streak Freeze
CREATE OR REPLACE FUNCTION public.use_streak_freeze(_user_id UUID, _date DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _freeze_reward_id UUID;
BEGIN
  -- Find an active streak freeze with uses remaining
  SELECT ur.id INTO _freeze_reward_id
  FROM user_rewards ur
  JOIN rewards r ON ur.reward_id = r.id
  WHERE ur.user_id = _user_id
    AND r.reward_type = 'consumable'
    AND r.name ILIKE '%streak%freeze%'
    AND (ur.uses_remaining IS NULL OR ur.uses_remaining > 0)
  LIMIT 1;
  
  IF _freeze_reward_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Record the protection
  INSERT INTO streak_protection_log (user_id, protected_date, user_reward_id)
  VALUES (_user_id, _date, _freeze_reward_id)
  ON CONFLICT (user_id, protected_date) DO NOTHING;
  
  -- Decrement uses if applicable
  UPDATE user_rewards
  SET uses_remaining = GREATEST(0, COALESCE(uses_remaining, 1) - 1)
  WHERE id = _freeze_reward_id AND uses_remaining IS NOT NULL;
  
  RETURN true;
END;
$$;

-- 8. Update rewards table with functional reward data
UPDATE rewards SET reward_data = jsonb_build_object(
  'uses', 1,
  'effect', 'streak_protection'
) WHERE name ILIKE '%streak%freeze%';

UPDATE rewards SET reward_data = jsonb_build_object(
  'duration_hours', 24,
  'effect', 'double_xp'
) WHERE name ILIKE '%double%xp%';

-- 9. Insert pre-loaded Bible passages (20+ popular passages)
INSERT INTO bible_passages (book, chapter, verse_start, verse_end, passage_name, passage_theme, is_popular, display_order)
VALUES
  ('Psalm', 23, 1, 6, 'The Lord is My Shepherd', 'Trust & Comfort', true, 1),
  ('John', 3, 16, 17, 'For God So Loved the World', 'Salvation & Love', true, 2),
  ('Philippians', 4, 13, 13, 'I Can Do All Things', 'Strength & Faith', true, 3),
  ('Romans', 8, 28, 28, 'All Things Work Together', 'Purpose & Hope', true, 4),
  ('Proverbs', 3, 5, 6, 'Trust in the Lord', 'Wisdom & Guidance', true, 5),
  ('Isaiah', 40, 31, 31, 'They Shall Mount Up With Wings', 'Endurance & Renewal', true, 6),
  ('Jeremiah', 29, 11, 11, 'Plans to Prosper You', 'Hope & Future', true, 7),
  ('Matthew', 6, 33, 34, 'Seek First the Kingdom', 'Priorities & Trust', true, 8),
  ('Joshua', 1, 9, 9, 'Be Strong and Courageous', 'Courage & Presence', true, 9),
  ('Psalm', 46, 10, 10, 'Be Still and Know', 'Peace & Sovereignty', true, 10),
  ('1 Corinthians', 13, 4, 7, 'Love is Patient', 'Love & Character', true, 11),
  ('Ephesians', 2, 8, 9, 'Saved by Grace', 'Grace & Salvation', true, 12),
  ('Matthew', 5, 3, 12, 'The Beatitudes', 'Blessing & Character', true, 13),
  ('Romans', 12, 1, 2, 'Living Sacrifice', 'Worship & Transformation', true, 14),
  ('Galatians', 5, 22, 23, 'Fruit of the Spirit', 'Character & Growth', true, 15),
  ('Psalm', 119, 105, 105, 'Lamp to My Feet', 'Scripture & Guidance', true, 16),
  ('Matthew', 28, 18, 20, 'The Great Commission', 'Mission & Presence', true, 17),
  ('Hebrews', 11, 1, 1, 'Faith is the Substance', 'Faith & Belief', true, 18),
  ('James', 1, 2, 4, 'Consider It Joy', 'Trials & Perseverance', true, 19),
  ('2 Timothy', 1, 7, 7, 'Spirit of Power', 'Courage & Boldness', true, 20),
  ('Psalm', 139, 13, 16, 'Fearfully and Wonderfully Made', 'Identity & Purpose', true, 21),
  ('Isaiah', 41, 10, 10, 'Fear Not', 'Fear & Strength', true, 22),
  ('Colossians', 3, 23, 24, 'Work as Unto the Lord', 'Work & Service', true, 23),
  ('1 Peter', 5, 7, 7, 'Cast Your Cares', 'Anxiety & Trust', true, 24)
ON CONFLICT (book, chapter, verse_start) DO NOTHING;

-- 10. Insert passage content for each reading level (sample for first few)
-- Psalm 23 - all 7 levels
INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'picture',
  '🐑 God is like a kind shepherd who takes care of us! Just like a shepherd feeds his sheep and keeps them safe, God gives us everything we need. He loves us so much!',
  'The Lord is my shepherd.',
  '["What does a shepherd do for his sheep?", "How does God take care of you?"]'::jsonb,
  'Draw a picture of a shepherd with his sheep in a green field.',
  'Thank you God for taking care of me like a shepherd!'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'early_reader',
  '📖 David wrote this song about God. He says God is like a shepherd - someone who takes care of sheep. Shepherds make sure sheep have food, water, and safety. God does the same for us! Even when scary things happen, we don''t need to be afraid because God is with us.',
  'The Lord is my shepherd; I shall not want.',
  '["Why did David compare God to a shepherd?", "What are some ways God takes care of you?", "What scary things can you trust God with?"]'::jsonb,
  'Make a list of 5 things God has given you that you''re thankful for.',
  'Dear God, thank You for being my shepherd and taking care of me every day.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'intermediate',
  '📖 Psalm 23 is one of the most loved passages in the Bible. King David, who was a shepherd before becoming king, uses the image of a shepherd caring for sheep to describe how God cares for His people. The psalm covers provision ("green pastures"), guidance ("he leads me"), protection ("valley of the shadow of death"), and abundance ("my cup overflows"). It''s a declaration of trust in God''s goodness.',
  'He restores my soul; He leads me in paths of righteousness for His name''s sake.',
  '["What did David know about shepherds from personal experience?", "What does ''the valley of the shadow of death'' represent?", "Why does David say his cup ''overflows''?", "How can you apply this psalm when you''re afraid?"]'::jsonb,
  'Memorize Psalm 23 this week. Write it out and post it where you''ll see it daily.',
  'Lord, thank You for being my shepherd. Help me trust You in every situation, especially when I''m afraid.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'advanced',
  '📖 Psalm 23, attributed to David, is a masterful piece of Hebrew poetry using the extended metaphor of shepherd and sheep. The psalm moves through three sections: provision (vv.1-3), protection (v.4), and abundance (vv.5-6). Note the shift from third person ("He leads") to second person ("You are with me") at the psalm''s center - the deepest moment of trial becomes the most intimate. The "anointing with oil" and "overflowing cup" reference hospitality customs, suggesting God treats us as honored guests. The conclusion expresses confident hope in God''s eternal faithfulness.',
  'Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me.',
  '["Why does the pronoun shift from ''He'' to ''You'' in verse 4?", "How does understanding ancient Near Eastern shepherd practices enhance this psalm?", "What is the significance of ''dwelling in the house of the Lord forever''?", "How does this psalm connect to Jesus as the Good Shepherd in John 10?"]'::jsonb,
  'Study this psalm in its original Hebrew structure. Compare multiple translations and note the differences.',
  'Father, as David trusted You through his trials, help me find my identity as one of Your sheep, led and protected by the Good Shepherd.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'young_adult',
  '📖 Psalm 23 is more than a comforting poem - it''s a radical declaration of trust. Written by David, who knew both shepherding and kingship, it speaks to every stage of life. In a world where we chase security through wealth, relationships, or achievements, David says simply: "The Lord is my shepherd; I shall not want." This isn''t passive contentment - it''s active trust that God''s provision is enough. The "valley of the shadow of death" isn''t avoided; it''s walked through with confidence because God is present. As you navigate major life decisions, let this psalm remind you: you''re not managing your life alone.',
  'Surely goodness and mercy shall follow me all the days of my life.',
  '["How does ''I shall not want'' challenge our consumer culture?", "What ''valleys'' are you currently walking through?", "How can you practice the presence of God in daily life?", "What would it look like to truly believe God''s goodness ''follows'' you?"]'::jsonb,
  'Journal about a current anxiety. Then write how Psalm 23 speaks to that specific situation.',
  'God, I confess I often live as if I''m my own shepherd. Teach me to trust Your leading, even when the path is unclear.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'adult',
  '📖 Psalm 23 stands as one of Scripture''s most treasured texts, offering profound theological truths through simple imagery. David''s shepherd metaphor draws from his formative years tending flocks in the Judean wilderness (1 Sam. 16:11). The psalm''s structure moves from external provision (vv.1-3), through crisis (v.4), to celebratory abundance (vv.5-6). The Hebrew word for "restores" (שׁוב, shub) carries connotations of repentance and return - suggesting spiritual renewal, not merely physical rest. The "table in the presence of enemies" evokes God''s vindication while the "overflowing cup" (כּוֹסִי רְוָיָה) indicates not mere sufficiency but superabundance. For mature believers, this psalm invites regular meditation on God''s faithful care across life''s seasons.',
  'He leads me in paths of righteousness for His name''s sake.',
  '["How has your understanding of this psalm deepened through life experience?", "What does ''for His name''s sake'' reveal about God''s motivations?", "How does this psalm shape a theology of suffering?", "In what ways have you experienced God as shepherd?", "How might you teach this psalm to the next generation?"]'::jsonb,
  'Use this psalm as a framework for intercessory prayer. Apply each verse to specific people or situations.',
  'Faithful Shepherd, as I reflect on decades of Your leading, I acknowledge that even my wandering has been met with Your patient guidance. Continue to lead me home.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'scholarly',
  '📖 Psalm 23 represents a masterwork of Hebrew poetry combining individual trust (psalm of confidence) with wisdom themes. The YHWH-as-shepherd motif connects to ancient Near Eastern royal imagery where kings often portrayed themselves as shepherds (cf. Ezekiel 34). The chiastic structure centers on verse 4, where the shift to second person marks the theological climax. The Hebrew nepesh (soul/life) in v.3 encompasses the whole person, not merely an immaterial component. Form-critically, the psalm blends elements of the individual song of trust with a thanksgiving song. Intertextually, it anticipates the Johannine Good Shepherd discourse (John 10) and the shepherding motif in Ezekiel 34 and 1 Peter 2:25. The eschatological horizon ("dwell in the house of the Lord forever") sparked rich interpretive traditions regarding the afterlife in both Jewish and Christian communities.',
  'יְהוָה רֹעִי לֹא אֶחְסָר (YHWH ro''i lo echsar)',
  '["How does form criticism illuminate the psalm''s genre and Sitz im Leben?", "What is the relationship between this psalm and Ezekiel 34''s shepherd discourse?", "How did Second Temple Judaism interpret the eschatological dimensions?", "What Christological readings emerge in patristic interpretation?", "How does the LXX translation shape New Testament appropriation?"]'::jsonb,
  'Compare commentaries from different eras (Rashi, Calvin, Spurgeon, Brueggemann) on this psalm.',
  'YHWH Ro''i, You have shepherded Your people through millennia. Grant me wisdom to rightly handle this sacred text and to shepherd others in its truth.'
FROM bible_passages p WHERE p.book = 'Psalm' AND p.chapter = 23
ON CONFLICT (passage_id, reading_level) DO NOTHING;

-- John 3:16-17 - all levels
INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'picture',
  '❤️ God loves the whole world SO MUCH that He sent His Son Jesus! Jesus came to help everyone. God wants us to be His friends forever!',
  'God so loved the world.',
  '["Who did God send to help us?", "How much does God love you?"]'::jsonb,
  'Draw a big heart and write ''God loves me!'' inside.',
  'Thank you God for loving me so much!'
FROM bible_passages p WHERE p.book = 'John' AND p.chapter = 3
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'early_reader',
  '📖 This is one of the most famous verses in the Bible! It tells us that God loves everyone in the whole world. He loved us so much that He sent Jesus, His only Son. When we believe in Jesus, we can live with God forever! God didn''t send Jesus to punish us - He sent Jesus to save us.',
  'For God so loved the world that He gave His only Son.',
  '["What did God give because He loves us?", "What happens when we believe in Jesus?", "Why did God send Jesus?"]'::jsonb,
  'Memorize John 3:16 this week. Say it to a family member or friend.',
  'Dear God, thank You for sending Jesus because You love me. Help me believe in Him.'
FROM bible_passages p WHERE p.book = 'John' AND p.chapter = 3
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'intermediate',
  '📖 John 3:16-17 is often called the "Gospel in a nutshell" because it summarizes the entire message of Christianity. Jesus spoke these words to Nicodemus, a religious leader who came to Him at night. Three key truths: (1) God''s motivation is love, (2) His action was sending His Son, (3) His purpose is salvation, not condemnation. The word "perish" doesn''t just mean dying physically - it means being separated from God forever. "Eternal life" isn''t just living forever - it''s knowing God and being in relationship with Him.',
  'For God did not send His Son into the world to condemn the world, but to save the world through Him.',
  '["Why do you think Nicodemus came to Jesus at night?", "What does ''eternal life'' mean to you?", "How does verse 17 change how you see God?", "Who can you share this verse with this week?"]'::jsonb,
  'Write John 3:16-17 in your own words. What would you want a friend to understand from it?',
  'Lord, thank You that Your heart is not to condemn me but to save me. Help me share this good news with others.'
FROM bible_passages p WHERE p.book = 'John' AND p.chapter = 3
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT 
  p.id,
  'adult',
  '📖 John 3:16-17 stands at the heart of Christian theology, encapsulating the Gospel message. The context is crucial: Jesus speaks to Nicodemus, a Pharisee who should have understood messianic hope but couldn''t grasp spiritual rebirth. The Greek "monogenēs" (only begotten/unique) emphasizes Christ''s singular relationship to the Father. The word "kosmos" (world) includes all humanity - a radical claim in a Jewish context that often emphasized Israel''s election. Verse 17 is equally vital: God''s posture toward humanity is salvific, not punitive. This challenges both those who view God primarily as judge and those who minimize human need for salvation. For mature faith, these verses invite both grateful worship and missional urgency.',
  'For God so loved the world, that He gave His only begotten Son.',
  '["How does this passage shape your understanding of God''s character?", "What implications does ''the world'' have for Christian mission?", "How do you hold together God''s love and human accountability?", "In what ways have you experienced this love personally?", "How should this truth shape our witness?"]'::jsonb,
  'Study the conversation with Nicodemus (John 3:1-21). How does context enrich your understanding?',
  'Father, the depth of Your love staggers me. That You would give Your Son for the world - including me - calls forth my deepest gratitude and surrender.'
FROM bible_passages p WHERE p.book = 'John' AND p.chapter = 3
ON CONFLICT (passage_id, reading_level) DO NOTHING;

-- Add a few more passages with at least 3 levels each (for family groups to have variety)
-- Philippians 4:13
INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT p.id, 'picture',
  '💪 Jesus helps us do hard things! When something feels too hard, Jesus gives us strength. We are never alone!',
  'I can do all things through Christ.',
  '["What hard thing can Jesus help you with?", "Who gives us strength?"]'::jsonb,
  'Draw yourself doing something hard, with Jesus helping you.',
  'Jesus, help me be strong today!'
FROM bible_passages p WHERE p.book = 'Philippians' AND p.chapter = 4 AND p.verse_start = 13
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT p.id, 'early_reader',
  '📖 Paul wrote this letter from prison! Even in a hard place, he knew Jesus gave him strength. This verse doesn''t mean we can do anything we want - it means with Jesus'' help, we can handle whatever life brings. Jesus gives us power to face hard times.',
  'I can do all things through Christ who strengthens me.',
  '["Where was Paul when he wrote this?", "What hard things can Jesus help you with?", "Does this mean we can fly or do magic?"]'::jsonb,
  'Write about a time Jesus helped you do something hard.',
  'Dear Jesus, thank You for making me strong when things are hard.'
FROM bible_passages p WHERE p.book = 'Philippians' AND p.chapter = 4 AND p.verse_start = 13
ON CONFLICT (passage_id, reading_level) DO NOTHING;

INSERT INTO passage_levels (passage_id, reading_level, summary, key_verse, discussion_questions, activity_suggestion, prayer_prompt)
SELECT p.id, 'adult',
  '📖 This verse is often misquoted as a promise of unlimited human capability. In context (Phil. 4:10-13), Paul discusses contentment in all circumstances - abundance and need. The "all things" refers to enduring any situation through Christ''s strength, not accomplishing any personal ambition. The Greek "endunamoō" (strengthens) indicates an ongoing empowerment. Paul, writing from prison, models contentment not through circumstances but through relationship with Christ. This challenges prosperity gospel readings while offering genuine hope in trials.',
  'I can do all things through Christ who strengthens me.',
  '["How does the context of this verse change popular interpretations?", "What does contentment look like in your life?", "How have you experienced Christ''s strength in difficulty?", "What is the difference between ambition and trust?"]'::jsonb,
  'Read Philippians 4:10-13 in context. Journal about where you need Christ''s strength for contentment.',
  'Lord, forgive me for sometimes treating this verse as a magic formula. Teach me true contentment through Your sufficient strength.'
FROM bible_passages p WHERE p.book = 'Philippians' AND p.chapter = 4 AND p.verse_start = 13
ON CONFLICT (passage_id, reading_level) DO NOTHING;