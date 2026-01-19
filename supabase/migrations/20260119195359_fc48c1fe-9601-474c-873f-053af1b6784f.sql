-- Add new milestones (scripture, worship, battles, time, community, comeback, saved_verses)
INSERT INTO public.milestones (milestone_type, name, description, icon_emoji, requirement_type, requirement_value, reward_message, scripture_reference, scripture_text, tier, display_order) VALUES
-- SCRIPTURE MILESTONES
('scripture', 'WORD WARRIOR', 'Read 365 verses', '⚔️', 'verses_read', 365, 'A verse a day for a year. You''re armed with truth.', 'Ephesians 6:17', 'And take the helmet of salvation, and the sword of the Spirit, which is the word of God.', 'gold', 22),
('scripture', 'SCRIPTURE MASTER', 'Read 1000 verses', '👑', 'verses_read', 1000, '1000 verses. You know the Book. The Book knows you.', 'Joshua 1:8', 'This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night.', 'platinum', 23),
-- SAVED VERSES MILESTONES
('saved_verses', 'VERSE COLLECTOR', 'Saved 10 battle verses', '💪', 'saved_verses', 10, 'Building your arsenal. These verses are your weapons.', 'Hebrews 4:12', 'For the word of God is quick, and powerful, and sharper than any twoedged sword.', 'bronze', 24),
('saved_verses', 'ARMORY BUILT', 'Saved 50 battle verses', '🗡️', 'saved_verses', 50, '50 battle verses ready. You''re prepared for war.', 'Psalm 119:11', 'Thy word have I hid in mine heart, that I might not sin against thee.', 'silver', 25),
-- WORSHIP MILESTONES
('worship', 'FIRST WORSHIP', 'Completed first worship session', '🎵', 'worship_sessions', 1, 'You entered His presence. That''s sacred.', 'Psalm 100:4', 'Enter into his gates with thanksgiving, and into his courts with praise.', 'bronze', 30),
('worship', 'WORSHIPPER', 'Completed 30 worship sessions', '🙌', 'worship_sessions', 30, '30 times you''ve lifted your hands. Heaven is listening.', 'Psalm 150:6', 'Let every thing that hath breath praise the LORD. Praise ye the LORD.', 'silver', 31),
('worship', 'TRUE WORSHIPPER', 'Completed 100 worship sessions', '🔥', 'worship_sessions', 100, '100 worship sessions. You''re a true worshipper.', 'John 4:24', 'God is a Spirit: and they that worship him must worship him in spirit and in truth.', 'gold', 32),
-- BATTLE MILESTONES
('battles', 'BATTLE ENGAGED', 'Used "Find By Feeling" 5 times', '⚔️', 'feeling_searches', 5, 'You''re not hiding from your struggles. You''re fighting them.', 'Ephesians 6:12', 'For we wrestle not against flesh and blood, but against principalities, against powers.', 'bronze', 40),
('battles', 'WARRIOR MINDSET', 'Used "Find By Feeling" 20 times', '🛡️', 'feeling_searches', 20, '20 battles faced with God''s Word. That''s warrior mentality.', '2 Corinthians 10:4', 'For the weapons of our warfare are not carnal, but mighty through God.', 'silver', 41),
('battles', 'BATTLE HARDENED', 'Used "Find By Feeling" 50 times', '💪', 'feeling_searches', 50, '50 battles. Every scar is a testimony. You''re battle-hardened.', '1 John 5:4', 'For whatsoever is born of God overcometh the world.', 'gold', 42),
-- TIME INVESTMENT MILESTONES
('time', 'INVESTED HOUR', 'Spent 60 total minutes training', '⏱️', 'total_minutes', 60, 'One hour invested in your faith. Worth more than gold.', 'Psalm 90:12', 'So teach us to number our days, that we may apply our hearts unto wisdom.', 'bronze', 60),
('time', 'COMMITTED 10 HOURS', 'Spent 600 total minutes training', '⌛', 'total_minutes', 600, '10 hours with God. That kind of time changes you.', 'Matthew 6:33', 'But seek ye first the kingdom of God, and his righteousness.', 'silver', 61),
('time', 'DEDICATED 50 HOURS', 'Spent 3000 total minutes training', '🕐', 'total_minutes', 3000, '50 hours. You''re serious about this. It shows.', 'Psalm 27:4', 'One thing have I desired of the LORD, that will I seek after.', 'gold', 62),
-- COMEBACK MILESTONES
('comeback', 'COMEBACK KING', 'Returned after 7+ day break', '👑', 'comeback_after_break', 7, 'You fell off. You came back. That''s real strength.', 'Proverbs 24:16', 'For a just man falleth seven times, and riseth up again.', 'bronze', 70),
('comeback', 'RESILIENT', 'Maintained streak after grace day', '💪', 'grace_day_used', 1, 'You used grace. That''s not weakness. That''s wisdom.', 'Lamentations 3:22-23', 'It is of the LORD''s mercies that we are not consumed, because his compassions fail not.', 'bronze', 71),
-- COMMUNITY MILESTONES
('community', 'IRON SHARPENS IRON', 'Added first training partner', '🤝', 'friends_added', 1, 'You''re not training alone anymore. That''s smart.', 'Proverbs 27:17', 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.', 'bronze', 80),
('community', 'SQUAD LEADER', 'Have 5 active training partners', '👥', 'friends_added', 5, '5 training partners. You''re building a squad.', 'Ecclesiastes 4:12', 'A threefold cord is not quickly broken.', 'silver', 81),
('community', 'ENCOURAGER', 'Sent 20 encouragements to friends', '💬', 'encouragements_sent', 20, 'You''re lifting others up. That''s leadership.', '1 Thessalonians 5:11', 'Wherefore comfort yourselves together, and edify one another.', 'silver', 82),
-- GROWTH/REFLECTION MILESTONES
('growth', 'CHANGED LIFE', 'Completed 10 post-session reflections', '📝', 'reflections_completed', 10, 'You''re not just training. You''re transforming.', 'Romans 12:2', 'Be ye transformed by the renewing of your mind.', 'bronze', 50),
('growth', 'TESTIMONY BUILT', 'Completed 50 post-session reflections', '📖', 'reflections_completed', 50, '50 reflections. You''re watching God work in real time.', '2 Corinthians 3:18', 'We are changed into the same image from glory to glory.', 'silver', 51);

-- Create encouragements table
CREATE TABLE public.encouragements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  message TEXT NOT NULL,
  encouragement_type TEXT DEFAULT 'custom',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on encouragements
ALTER TABLE public.encouragements ENABLE ROW LEVEL SECURITY;

-- Users can send encouragements
CREATE POLICY "Users can send encouragements"
ON public.encouragements
FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

-- Users can view encouragements they sent or received
CREATE POLICY "Users can view their encouragements"
ON public.encouragements
FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Users can update (mark as read) encouragements they received
CREATE POLICY "Users can update received encouragements"
ON public.encouragements
FOR UPDATE
USING (auth.uid() = to_user_id);

-- Create squads table
CREATE TABLE public.squads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT DEFAULT '⚔️',
  created_by UUID NOT NULL,
  max_members INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- Create squad_members table
CREATE TABLE public.squad_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(squad_id, user_id)
);

ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- Squad policies
CREATE POLICY "Anyone can view squads they're part of"
ON public.squads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.squad_members
    WHERE squad_id = id AND user_id = auth.uid()
  )
  OR created_by = auth.uid()
);

CREATE POLICY "Users can create squads"
ON public.squads
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Squad creators can update their squads"
ON public.squads
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Squad creators can delete their squads"
ON public.squads
FOR DELETE
USING (auth.uid() = created_by);

-- Squad member policies
CREATE POLICY "Members can view squad members"
ON public.squad_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.squad_members sm
    WHERE sm.squad_id = squad_id AND sm.user_id = auth.uid()
  )
);

CREATE POLICY "Squad admins can add members"
ON public.squad_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.squads
    WHERE id = squad_id AND created_by = auth.uid()
  )
  OR auth.uid() = user_id
);

CREATE POLICY "Squad admins can remove members"
ON public.squad_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.squads
    WHERE id = squad_id AND created_by = auth.uid()
  )
  OR auth.uid() = user_id
);

-- Create squad_activities table for the feed
CREATE TABLE public.squad_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.squad_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Squad members can view activities"
ON public.squad_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.squad_members
    WHERE squad_id = squad_activities.squad_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own activities"
ON public.squad_activities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create personal challenges table (separate from friend challenges)
CREATE TABLE public.personal_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_type TEXT NOT NULL,
  challenge_name TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT DEFAULT '🎯',
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  duration_days INTEGER NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  scripture_motivation TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.personal_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
ON public.personal_challenges
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges"
ON public.personal_challenges
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON public.personal_challenges
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for squads updated_at
CREATE TRIGGER update_squads_updated_at
BEFORE UPDATE ON public.squads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();