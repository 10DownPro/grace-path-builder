-- ═══════════════════════════════════════════════════════════════
-- SUBSCRIPTION & PAYWALL SYSTEM
-- ═══════════════════════════════════════════════════════════════

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  subscription_type TEXT NOT NULL DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium_monthly', 'premium_annual', 'lifetime_premium')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trialing')),
  premium_source TEXT CHECK (premium_source IN ('subscription', 'book_code', 'promo', 'admin_grant')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  book_code_used TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Feature gates table
CREATE TABLE public.feature_gates (
  feature_name TEXT PRIMARY KEY,
  requires_premium BOOLEAN NOT NULL DEFAULT true,
  free_tier_limit INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read)
ALTER TABLE public.feature_gates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature gates"
  ON public.feature_gates FOR SELECT
  USING (true);

-- User feature usage tracking
CREATE TABLE public.user_feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_name TEXT NOT NULL REFERENCES public.feature_gates(feature_name),
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reset_period TEXT CHECK (reset_period IN ('daily', 'weekly', 'monthly')),
  period_start TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('week', now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.user_feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.user_feature_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.user_feature_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.user_feature_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for usage lookups
CREATE INDEX idx_user_feature_usage_lookup ON public.user_feature_usage(user_id, feature_name);

-- Insert feature gates data
INSERT INTO public.feature_gates (feature_name, requires_premium, free_tier_limit, description) VALUES
('multiple_reading_plans', true, 1, 'Run multiple reading plans simultaneously'),
('extended_reading_plans', true, null, 'Access to 60+ day advanced reading plans'),
('unlimited_saved_verses', true, 50, 'Save unlimited verses (free = 50 max)'),
('custom_verse_collections', true, null, 'Create custom verse collections'),
('unlimited_posts', true, 5, 'Create unlimited posts per week (free = 5)'),
('unlimited_testimonies', true, 2, 'Share unlimited testimonies per month (free = 2)'),
('unlimited_follows', true, 25, 'Follow unlimited users (free = 25)'),
('ad_free_feed', true, null, 'Remove ads from community feed'),
('unlimited_squads', true, 1, 'Join unlimited squads (free = 1)'),
('unlimited_friends', true, 10, 'Add unlimited training partners (free = 10)'),
('private_squads', true, null, 'Create private squads'),
('unlimited_prayer_support', true, 10, 'Support unlimited prayers (free = 10)'),
('prayer_reminders', true, null, 'Custom prayer reminder schedules'),
('export_prayer_journal', true, null, 'Export prayer journal to PDF'),
('lifetime_calendar', true, 30, 'View calendar heat map (free = 30 days)'),
('detailed_analytics', true, null, 'Advanced analytics dashboard'),
('streak_freezes', true, null, 'Earn streak freezes'),
('2x_points_weekends', true, null, 'Double points every weekend'),
('exclusive_rewards', true, null, 'Access exclusive rewards in shop'),
('ad_free_experience', true, null, 'Remove all ads from app'),
('offline_mode', true, null, 'Download content for offline use'),
('priority_support', true, null, 'Priority customer support');

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_user_premium(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = _user_id
      AND subscription_status = 'active'
      AND subscription_type IN ('premium_monthly', 'premium_annual', 'lifetime_premium')
      AND (expires_at IS NULL OR expires_at > now())
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND is_premium = true
  )
$$;

CREATE OR REPLACE FUNCTION public.increment_feature_usage(p_user_id uuid, p_feature_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _reset_period text;
  _period_start timestamp with time zone;
BEGIN
  SELECT 
    CASE 
      WHEN p_feature_name = 'unlimited_posts' THEN 'weekly'
      WHEN p_feature_name = 'unlimited_testimonies' THEN 'monthly'
      ELSE 'weekly'
    END INTO _reset_period;
  
  IF _reset_period = 'weekly' THEN
    _period_start := date_trunc('week', now());
  ELSIF _reset_period = 'monthly' THEN
    _period_start := date_trunc('month', now());
  ELSE
    _period_start := date_trunc('day', now());
  END IF;

  INSERT INTO user_feature_usage (user_id, feature_name, usage_count, last_used_at, reset_period, period_start)
  VALUES (p_user_id, p_feature_name, 1, now(), _reset_period, _period_start)
  ON CONFLICT (user_id, feature_name)
  DO UPDATE SET 
    usage_count = CASE 
      WHEN user_feature_usage.period_start < _period_start THEN 1
      ELSE user_feature_usage.usage_count + 1
    END,
    last_used_at = now(),
    period_start = CASE 
      WHEN user_feature_usage.period_start < _period_start THEN _period_start
      ELSE user_feature_usage.period_start
    END;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_feature_access(p_user_id uuid, p_feature_name text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_premium boolean;
  _feature_gate record;
  _usage record;
  _current_usage integer;
  _period_start timestamp with time zone;
BEGIN
  _is_premium := public.is_user_premium(p_user_id);
  
  SELECT * INTO _feature_gate FROM feature_gates WHERE feature_name = p_feature_name;
  
  IF _feature_gate IS NULL OR NOT _feature_gate.requires_premium THEN
    RETURN jsonb_build_object('has_access', true, 'reason', 'free_feature');
  END IF;
  
  IF _is_premium THEN
    RETURN jsonb_build_object('has_access', true, 'reason', 'premium_user');
  END IF;
  
  IF _feature_gate.free_tier_limit IS NOT NULL THEN
    IF p_feature_name = 'unlimited_posts' THEN
      _period_start := date_trunc('week', now());
    ELSIF p_feature_name = 'unlimited_testimonies' THEN
      _period_start := date_trunc('month', now());
    ELSE
      _period_start := date_trunc('week', now());
    END IF;
    
    SELECT * INTO _usage FROM user_feature_usage 
    WHERE user_id = p_user_id AND feature_name = p_feature_name;
    
    IF _usage IS NULL OR _usage.period_start < _period_start THEN
      _current_usage := 0;
    ELSE
      _current_usage := _usage.usage_count;
    END IF;
    
    IF _current_usage < _feature_gate.free_tier_limit THEN
      RETURN jsonb_build_object(
        'has_access', true, 
        'reason', 'within_free_limit',
        'remaining', _feature_gate.free_tier_limit - _current_usage,
        'limit', _feature_gate.free_tier_limit,
        'current_usage', _current_usage
      );
    ELSE
      RETURN jsonb_build_object(
        'has_access', false, 
        'reason', 'limit_reached',
        'limit', _feature_gate.free_tier_limit,
        'current_usage', _current_usage
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object('has_access', false, 'reason', 'premium_required');
END;
$$;

-- Update trigger
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();