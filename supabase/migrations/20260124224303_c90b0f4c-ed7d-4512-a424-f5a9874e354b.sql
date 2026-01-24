-- Add points column to user_progress table
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS total_points integer NOT NULL DEFAULT 0;

-- Create rewards catalog table
CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'cosmetic',
  point_cost integer NOT NULL,
  icon_emoji text DEFAULT '🎁',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  is_premium_only boolean NOT NULL DEFAULT false,
  reward_type text NOT NULL DEFAULT 'badge',
  reward_data jsonb DEFAULT '{}'::jsonb,
  stock_limit integer,
  times_redeemed integer NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_rewards table for tracking redeemed rewards
CREATE TABLE public.user_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  is_equipped boolean NOT NULL DEFAULT false,
  UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Rewards catalog is public read
CREATE POLICY "Anyone can read active rewards"
ON public.rewards FOR SELECT
USING (is_active = true);

-- User rewards policies
CREATE POLICY "Users can view their own rewards"
ON public.user_rewards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem rewards"
ON public.user_rewards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their equipped status"
ON public.user_rewards FOR UPDATE
USING (auth.uid() = user_id);

-- Insert initial rewards catalog
INSERT INTO public.rewards (name, description, category, point_cost, icon_emoji, reward_type, display_order) VALUES
-- Cosmetic Badges
('Warrior Badge', 'Show everyone you mean business with this fierce badge', 'cosmetic', 100, '⚔️', 'badge', 1),
('Fire Starter', 'You''re on fire! Display your burning dedication', 'cosmetic', 150, '🔥', 'badge', 2),
('Prayer Champion', 'A badge for those who never stop praying', 'cosmetic', 200, '🙏', 'badge', 3),
('Scripture Scholar', 'Mark yourself as a student of the Word', 'cosmetic', 250, 'đŸ"–', 'badge', 4),
('Early Bird', 'For those who rise early to seek God', 'cosmetic', 150, '🌅', 'badge', 5),
('Night Owl', 'Burning the midnight oil with the Lord', 'cosmetic', 150, '🌙', 'badge', 6),
('Diamond Soul', 'Forged under pressure, shining bright', 'cosmetic', 500, '💎', 'badge', 7),
('Crown of Glory', 'The ultimate symbol of dedication', 'cosmetic', 1000, '👑', 'badge', 8),

-- Profile Themes
('Dark Steel Theme', 'A sleek industrial theme for your profile', 'cosmetic', 300, '🔩', 'theme', 10),
('Golden Fire Theme', 'Flames of gold surround your profile', 'cosmetic', 400, '🏆', 'theme', 11),
('Emerald Grace Theme', 'A calming green theme of peace', 'cosmetic', 350, '💚', 'theme', 12),

-- Functional Rewards
('Streak Freeze', 'Protect your streak for one missed day', 'functional', 200, '❄️', 'streak_freeze', 20),
('Double XP Day', 'Earn double points for 24 hours', 'functional', 300, '⚡', 'xp_boost', 21),
('Custom Mission', 'Create your own daily mission', 'functional', 250, '🎯', 'custom_mission', 22),
('Extra Battle Verse Slot', 'Save one more verse in your arsenal', 'functional', 150, '📌', 'verse_slot', 23),
('Priority Support', 'Get your questions answered first', 'functional', 500, '⭐', 'support', 24),

-- Premium Exclusive (requires premium + points)
('Legend Frame', 'An exclusive frame for true legends', 'exclusive', 750, '🛡️', 'frame', 30),
('Founder Badge', 'Mark yourself as an early adopter', 'exclusive', 1000, '🎖️', 'badge', 31);

-- Create function to safely redeem rewards with point deduction
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id uuid)
RETURNS TABLE(success boolean, message text, reward_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _reward RECORD;
  _user_points INTEGER;
  _is_premium BOOLEAN;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Get reward details
  SELECT * INTO _reward FROM rewards WHERE id = _reward_id AND is_active = true;
  
  IF _reward IS NULL THEN
    RETURN QUERY SELECT false, 'Reward not found or no longer available'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Check if already redeemed
  IF EXISTS (SELECT 1 FROM user_rewards WHERE user_id = _user_id AND reward_id = _reward_id) THEN
    RETURN QUERY SELECT false, 'You already own this reward'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Get user points
  SELECT total_points INTO _user_points FROM user_progress WHERE user_id = _user_id;
  
  IF _user_points IS NULL THEN
    RETURN QUERY SELECT false, 'Progress record not found'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Check sufficient points
  IF _user_points < _reward.point_cost THEN
    RETURN QUERY SELECT false, format('Not enough points. You need %s more.', _reward.point_cost - _user_points)::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Check premium requirement
  IF _reward.is_premium_only THEN
    SELECT is_premium INTO _is_premium FROM profiles WHERE user_id = _user_id;
    IF NOT COALESCE(_is_premium, false) THEN
      RETURN QUERY SELECT false, 'This reward is only available to premium members'::TEXT, NULL::JSONB;
      RETURN;
    END IF;
  END IF;
  
  -- Check stock limit
  IF _reward.stock_limit IS NOT NULL AND _reward.times_redeemed >= _reward.stock_limit THEN
    RETURN QUERY SELECT false, 'This reward is sold out'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Deduct points
  UPDATE user_progress SET total_points = total_points - _reward.point_cost WHERE user_id = _user_id;
  
  -- Add to user rewards
  INSERT INTO user_rewards (user_id, reward_id) VALUES (_user_id, _reward_id);
  
  -- Increment redemption counter
  UPDATE rewards SET times_redeemed = times_redeemed + 1 WHERE id = _reward_id;
  
  RETURN QUERY SELECT 
    true, 
    format('You unlocked %s!', _reward.name)::TEXT,
    jsonb_build_object(
      'name', _reward.name,
      'icon', _reward.icon_emoji,
      'category', _reward.category,
      'type', _reward.reward_type
    );
END;
$$;