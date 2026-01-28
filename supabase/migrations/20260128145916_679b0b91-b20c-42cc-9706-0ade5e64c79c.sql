-- ================================================
-- FIX CRITICAL SECURITY ISSUES
-- ================================================

-- 1. FIX PROFILES TABLE SELECT POLICY
-- Currently allows ANY authenticated user to see ALL profiles
-- Change to: Users can only see their own profile OR profiles of accepted friends

DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- Allow users to see their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to see profiles of accepted friends
CREATE POLICY "Users can view friend profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
    AND (
      (requester_id = auth.uid() AND addressee_id = profiles.user_id)
      OR (addressee_id = auth.uid() AND requester_id = profiles.user_id)
    )
  )
);

-- 2. DROP INSECURE PUBLIC_PROFILES VIEW AND CREATE SECURE VERSION
DROP VIEW IF EXISTS public.public_profiles;

-- Create a secure view with limited, masked data for leaderboards/discovery
CREATE VIEW public.public_profiles AS
SELECT 
  user_id,
  -- Mask name for privacy: show first letter + asterisks
  CASE 
    WHEN length(name) > 0 THEN LEFT(name, 1) || '***'
    ELSE 'User'
  END as display_name,
  commitment,
  -- Don't expose: friend_code, is_premium, premium_source, book_code_used
  created_at
FROM profiles;

-- 3. ADD POLICY FOR POST OWNERS TO DELETE ABUSIVE COMMENTS
-- Post owners should be able to moderate comments on their posts

DROP POLICY IF EXISTS "Post owners can delete comments" ON public.feed_comments;

CREATE POLICY "Post owners can delete comments"
ON public.feed_comments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.community_feed_posts
    WHERE community_feed_posts.id = feed_comments.post_id
    AND community_feed_posts.user_id = auth.uid()
  )
);

-- 4. ADD RATE LIMITING FOR BOOK CODE REDEMPTION
-- Track redemption attempts per user to prevent brute force

CREATE TABLE IF NOT EXISTS public.book_code_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  was_successful BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.book_code_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own attempts
CREATE POLICY "Users can view own attempts"
ON public.book_code_attempts
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert attempts (via security definer function)
CREATE POLICY "System can insert attempts"
ON public.book_code_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_book_code_attempts_user_time 
ON public.book_code_attempts(user_id, attempted_at DESC);

-- 5. UPDATE redeem_book_code FUNCTION WITH RATE LIMITING
CREATE OR REPLACE FUNCTION public.redeem_book_code(_code text)
RETURNS TABLE(success boolean, message text, code_info jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id UUID;
  _code_record RECORD;
  _attempt_count INTEGER;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- RATE LIMITING: Check attempts in last 15 minutes
  SELECT COUNT(*) INTO _attempt_count
  FROM public.book_code_attempts
  WHERE user_id = _user_id
    AND attempted_at > now() - interval '15 minutes';
  
  IF _attempt_count >= 5 THEN
    RETURN QUERY SELECT false, 'Too many attempts. Please wait 15 minutes before trying again.'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Log this attempt
  INSERT INTO public.book_code_attempts (user_id, was_successful)
  VALUES (_user_id, false);
  
  -- Check if user already has premium via book code
  IF EXISTS (SELECT 1 FROM profiles WHERE user_id = _user_id AND book_code_used IS NOT NULL) THEN
    RETURN QUERY SELECT false, 'You have already redeemed a book code'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Find the code
  SELECT * INTO _code_record FROM book_codes 
  WHERE UPPER(code) = UPPER(_code);
  
  IF _code_record IS NULL THEN
    RETURN QUERY SELECT false, 'Invalid code. Please check and try again.'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  IF _code_record.is_redeemed THEN
    RETURN QUERY SELECT false, 'This code has already been redeemed'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
  -- Redeem the code
  UPDATE book_codes 
  SET is_redeemed = true, 
      redeemed_by_user_id = _user_id,
      redeemed_at = now()
  WHERE id = _code_record.id;
  
  -- Update user profile
  UPDATE profiles 
  SET is_premium = true,
      premium_source = 'book_code',
      premium_activated_at = now(),
      book_code_used = _code_record.code,
      has_book = true
  WHERE user_id = _user_id;
  
  -- Mark attempt as successful
  UPDATE public.book_code_attempts
  SET was_successful = true
  WHERE user_id = _user_id
    AND attempted_at = (SELECT MAX(attempted_at) FROM public.book_code_attempts WHERE user_id = _user_id);
  
  RETURN QUERY SELECT 
    true, 
    'PREMIUM UNLOCKED! You now have lifetime access to all premium features.'::TEXT,
    jsonb_build_object(
      'code', _code_record.code,
      'edition', _code_record.book_edition,
      'redeemed_at', now()
    );
END;
$$;