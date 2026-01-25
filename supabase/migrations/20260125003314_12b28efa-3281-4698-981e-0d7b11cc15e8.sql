-- ═══════════════════════════════════════════════════════════════════
-- PHASE 1: MICRO-ACTIONS & NOTIFICATION SETTINGS
-- ═══════════════════════════════════════════════════════════════════

-- Micro-actions catalog
CREATE TABLE public.micro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN ('quick_prayer', 'verse_snack', 'encourage_friend', 'gratitude_note', 'breath_prayer')),
  name TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 30,
  points_reward INTEGER NOT NULL DEFAULT 5,
  icon_emoji TEXT DEFAULT '🙏',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User completed micro-actions
CREATE TABLE public.user_micro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  micro_action_id UUID REFERENCES public.micro_actions(id),
  action_type TEXT NOT NULL,
  content_data JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT now(),
  session_date DATE DEFAULT CURRENT_DATE,
  points_earned INTEGER DEFAULT 0
);

-- Daily micro goals tracking
CREATE TABLE public.daily_micro_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal_date DATE DEFAULT CURRENT_DATE,
  quick_prayers_goal INTEGER DEFAULT 3,
  verse_snacks_goal INTEGER DEFAULT 5,
  encouragements_goal INTEGER DEFAULT 2,
  completed_prayers INTEGER DEFAULT 0,
  completed_verses INTEGER DEFAULT 0,
  completed_encouragements INTEGER DEFAULT 0,
  completed_gratitude INTEGER DEFAULT 0,
  completed_breath_prayers INTEGER DEFAULT 0,
  bonus_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, goal_date)
);

-- User notification settings (enhanced)
CREATE TABLE public.user_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  streak_reminders_enabled BOOLEAN DEFAULT true,
  reminder_time_1 TIME DEFAULT '20:00:00',
  reminder_time_2 TIME DEFAULT '22:00:00',
  final_warning_time TIME DEFAULT '23:00:00',
  aggressive_mode BOOLEAN DEFAULT true,
  micro_action_reminders BOOLEAN DEFAULT true,
  squad_activity_alerts BOOLEAN DEFAULT true,
  prayer_request_alerts BOOLEAN DEFAULT true,
  dm_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 2: MYSTERY REWARDS & LIVE ACTIVITY
-- ═══════════════════════════════════════════════════════════════════

-- Mystery rewards catalog
CREATE TABLE public.mystery_rewards_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_type TEXT NOT NULL CHECK (reward_type IN ('points', 'streak_freeze', 'badge', 'bonus_verse_pack', 'xp_boost', 'cosmetic')),
  reward_name TEXT NOT NULL,
  reward_value INTEGER DEFAULT 0,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  drop_rate_percentage DECIMAL(5,2) NOT NULL,
  icon_emoji TEXT DEFAULT '🎁',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User mystery rewards won
CREATE TABLE public.user_mystery_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID REFERENCES public.mystery_rewards_catalog(id),
  won_at TIMESTAMPTZ DEFAULT now(),
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ
);

-- Daily spin tracking
CREATE TABLE public.daily_spin_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  spin_date DATE DEFAULT CURRENT_DATE,
  has_spun_today BOOLEAN DEFAULT false,
  spin_result_reward_id UUID REFERENCES public.mystery_rewards_catalog(id),
  spun_at TIMESTAMPTZ,
  UNIQUE(user_id, spin_date)
);

-- Live squad activity (real-time)
CREATE TABLE public.live_squad_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('training_started', 'training_completed', 'praying', 'reading_scripture', 'prayer_answered', 'milestone', 'encouragement_sent')),
  activity_data JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Squad presence tracking
CREATE TABLE public.squad_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  current_activity TEXT DEFAULT 'idle' CHECK (current_activity IN ('worship', 'scripture', 'prayer', 'reflection', 'idle', 'offline')),
  last_active_at TIMESTAMPTZ DEFAULT now(),
  is_online BOOLEAN DEFAULT false,
  UNIQUE(user_id, squad_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- PHASE 3: COMMUNITY FEED
-- ═══════════════════════════════════════════════════════════════════

-- Community feed posts
CREATE TABLE public.community_feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('milestone', 'answered_prayer', 'testimony', 'streak', 'challenge_complete', 'micro_action_combo')),
  content_data JSONB NOT NULL DEFAULT '{}',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'squad_only', 'friends_only')),
  squad_id UUID REFERENCES public.squads(id) ON DELETE SET NULL,
  engagement_score INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feed reactions
CREATE TABLE public.feed_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('fire', 'praying', 'amen', 'strong', 'heart')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Feed comments
CREATE TABLE public.feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) <= 280),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feed shares
CREATE TABLE public.feed_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_feed_posts(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL,
  shared_to_squad_id UUID REFERENCES public.squads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User feed settings
CREATE TABLE public.user_feed_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  show_public_feed BOOLEAN DEFAULT true,
  show_squad_only BOOLEAN DEFAULT true,
  show_friends_only BOOLEAN DEFAULT true,
  muted_users JSONB DEFAULT '[]',
  feed_algorithm_preference TEXT DEFAULT 'algorithmic' CHECK (feed_algorithm_preference IN ('chronological', 'algorithmic', 'trending')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Onboarding tour tracking
CREATE TABLE public.user_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tour_completed BOOLEAN DEFAULT false,
  current_step INTEGER DEFAULT 0,
  steps_completed JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════════
-- ENABLE RLS
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_micro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mystery_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_spin_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_squad_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feed_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════

-- Micro-actions catalog (public read)
CREATE POLICY "Anyone can read micro-actions" ON public.micro_actions FOR SELECT USING (true);

-- User micro-actions
CREATE POLICY "Users can view own micro-actions" ON public.user_micro_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own micro-actions" ON public.user_micro_actions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily micro goals
CREATE POLICY "Users can view own micro goals" ON public.daily_micro_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own micro goals" ON public.daily_micro_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own micro goals" ON public.daily_micro_goals FOR UPDATE USING (auth.uid() = user_id);

-- Notification settings
CREATE POLICY "Users can view own notification settings" ON public.user_notification_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification settings" ON public.user_notification_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notification settings" ON public.user_notification_settings FOR UPDATE USING (auth.uid() = user_id);

-- Mystery rewards catalog (public read)
CREATE POLICY "Anyone can read mystery rewards" ON public.mystery_rewards_catalog FOR SELECT USING (is_active = true);

-- User mystery rewards
CREATE POLICY "Users can view own mystery rewards" ON public.user_mystery_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mystery rewards" ON public.user_mystery_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mystery rewards" ON public.user_mystery_rewards FOR UPDATE USING (auth.uid() = user_id);

-- Daily spin tracking
CREATE POLICY "Users can view own spins" ON public.daily_spin_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own spins" ON public.daily_spin_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own spins" ON public.daily_spin_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Live squad activity
CREATE POLICY "Squad members can view activity" ON public.live_squad_activity FOR SELECT USING (is_squad_member(auth.uid(), squad_id));
CREATE POLICY "Users can insert own activity" ON public.live_squad_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity" ON public.live_squad_activity FOR UPDATE USING (auth.uid() = user_id);

-- Squad presence
CREATE POLICY "Squad members can view presence" ON public.squad_presence FOR SELECT USING (is_squad_member(auth.uid(), squad_id));
CREATE POLICY "Users can insert own presence" ON public.squad_presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own presence" ON public.squad_presence FOR UPDATE USING (auth.uid() = user_id);

-- Community feed posts - visibility based
CREATE POLICY "Users can view public posts" ON public.community_feed_posts FOR SELECT USING (
  visibility = 'public' OR 
  user_id = auth.uid() OR
  (visibility = 'squad_only' AND squad_id IS NOT NULL AND is_squad_member(auth.uid(), squad_id)) OR
  (visibility = 'friends_only' AND EXISTS (
    SELECT 1 FROM friendships 
    WHERE status = 'accepted' 
    AND ((requester_id = auth.uid() AND addressee_id = community_feed_posts.user_id) 
      OR (addressee_id = auth.uid() AND requester_id = community_feed_posts.user_id))
  ))
);
CREATE POLICY "Users can insert own posts" ON public.community_feed_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_feed_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_feed_posts FOR DELETE USING (auth.uid() = user_id);

-- Feed reactions
CREATE POLICY "Anyone can view reactions" ON public.feed_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON public.feed_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.feed_reactions FOR DELETE USING (auth.uid() = user_id);

-- Feed comments
CREATE POLICY "Anyone can view comments" ON public.feed_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.feed_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.feed_comments FOR DELETE USING (auth.uid() = user_id);

-- Feed shares
CREATE POLICY "Users can view own shares" ON public.feed_shares FOR SELECT USING (auth.uid() = shared_by_user_id);
CREATE POLICY "Users can insert own shares" ON public.feed_shares FOR INSERT WITH CHECK (auth.uid() = shared_by_user_id);

-- User feed settings
CREATE POLICY "Users can view own feed settings" ON public.user_feed_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feed settings" ON public.user_feed_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own feed settings" ON public.user_feed_settings FOR UPDATE USING (auth.uid() = user_id);

-- Onboarding progress
CREATE POLICY "Users can view own onboarding" ON public.user_onboarding_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding" ON public.user_onboarding_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON public.user_onboarding_progress FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- ENABLE REALTIME FOR LIVE FEATURES
-- ═══════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.live_squad_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.squad_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_feed_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_comments;

-- ═══════════════════════════════════════════════════════════════════
-- SEED MICRO-ACTIONS DATA
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.micro_actions (action_type, name, description, duration_seconds, points_reward, icon_emoji) VALUES
('quick_prayer', 'Quick Prayer', 'A 30-second focused prayer moment', 30, 5, '🙏'),
('verse_snack', 'Verse Snack', 'Consume a quick encouraging scripture', 60, 3, '📖'),
('encourage_friend', 'Encourage Friend', 'Send a quick encouragement to a squad member', 10, 5, '💪'),
('gratitude_note', 'Gratitude Note', 'Record what you are grateful for right now', 20, 8, '✨'),
('breath_prayer', 'Breath Prayer', 'Guided breathing with prayer phrase', 15, 3, '🌬️');

-- ═══════════════════════════════════════════════════════════════════
-- SEED MYSTERY REWARDS DATA
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.mystery_rewards_catalog (reward_type, reward_name, reward_value, rarity, drop_rate_percentage, icon_emoji, description) VALUES
-- Common (60%)
('points', 'Small Point Boost', 10, 'common', 20, '⭐', 'A small boost of 10 points'),
('points', 'Point Boost', 15, 'common', 20, '⭐', '15 bonus points'),
('points', 'Nice Points', 25, 'common', 20, '⭐', '25 bonus points'),
-- Uncommon (25%)
('points', 'Big Point Boost', 50, 'uncommon', 10, '🌟', '50 bonus points'),
('points', 'Major Points', 75, 'uncommon', 10, '🌟', '75 bonus points'),
('streak_freeze', 'Streak Shield', 1, 'uncommon', 5, '🛡️', 'Protects your streak for 1 missed day'),
-- Rare (10%)
('points', 'Mega Points', 100, 'rare', 4, '💎', '100 bonus points'),
('points', 'Ultra Points', 150, 'rare', 4, '💎', '150 bonus points'),
('badge', 'Lucky Warrior Badge', 1, 'rare', 2, '🎖️', 'A rare badge for the fortunate'),
-- Epic (4%)
('points', 'Epic Point Haul', 250, 'epic', 1.5, '👑', '250 bonus points'),
('xp_boost', '2X Points 24hr', 24, 'epic', 1.5, '🔥', 'Double all points for 24 hours'),
('points', 'Massive Points', 500, 'epic', 1, '👑', '500 bonus points'),
-- Legendary (1%)
('points', 'Legendary Jackpot', 1000, 'legendary', 0.5, '🏆', '1000 bonus points - LEGENDARY!'),
('streak_freeze', 'Eternal Shield', 99, 'legendary', 0.3, '⚡', 'Lifetime streak protection'),
('cosmetic', 'Golden Warrior Frame', 1, 'legendary', 0.2, '✨', 'Exclusive golden profile frame');