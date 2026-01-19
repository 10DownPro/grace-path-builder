-- Book codes table for premium redemption
CREATE TABLE public.book_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_by_user_id UUID NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NULL,
  book_edition TEXT DEFAULT 'First Edition',
  batch_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can check if a code exists (for validation), but not see who redeemed it
CREATE POLICY "Anyone can check code validity"
ON public.book_codes
FOR SELECT
USING (true);

-- Only authenticated users can redeem codes
CREATE POLICY "Authenticated users can redeem codes"
ON public.book_codes
FOR UPDATE
USING (auth.uid() IS NOT NULL AND is_redeemed = false)
WITH CHECK (auth.uid() = redeemed_by_user_id);

-- Track which book promotions user has seen
CREATE TABLE public.user_book_promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  promotion_type TEXT NOT NULL,
  shown_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dismissed BOOLEAN NOT NULL DEFAULT false,
  clicked BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.user_book_promotions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own promotions
CREATE POLICY "Users can view their own promotions"
ON public.user_book_promotions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own promotions
CREATE POLICY "Users can insert their own promotions"
ON public.user_book_promotions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own promotions
CREATE POLICY "Users can update their own promotions"
ON public.user_book_promotions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add premium fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN premium_source TEXT NULL,
ADD COLUMN premium_activated_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN book_code_used TEXT NULL,
ADD COLUMN has_book BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN hide_book_promos BOOLEAN NOT NULL DEFAULT false;

-- Insert test book codes
INSERT INTO public.book_codes (code, book_edition, batch_number) VALUES
('FT-TEST01', 'First Edition', 1),
('FT-TEST02', 'First Edition', 1),
('FT-TEST03', 'First Edition', 1);

-- Create secure function to redeem book code
CREATE OR REPLACE FUNCTION public.redeem_book_code(_code TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, code_info JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _code_record RECORD;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::TEXT, NULL::JSONB;
    RETURN;
  END IF;
  
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