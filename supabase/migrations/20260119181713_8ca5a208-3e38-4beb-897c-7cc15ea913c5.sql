-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT NOT NULL DEFAULT '🏆',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  reward_message TEXT,
  scripture_reference TEXT,
  scripture_text TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_milestones table to track which milestones users have achieved
CREATE TABLE public.user_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  shared_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, milestone_id)
);

-- Create friendships table
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID NOT NULL,
  challenged_id UUID NOT NULL,
  challenge_type TEXT NOT NULL,
  challenge_name TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (challenger_id != challenged_id)
);

-- Create challenge_progress table
CREATE TABLE public.challenge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

-- Milestones policies (read-only for everyone)
CREATE POLICY "Anyone can read milestones"
ON public.milestones FOR SELECT
USING (true);

-- User milestones policies
CREATE POLICY "Users can view their own milestones"
ON public.user_milestones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones"
ON public.user_milestones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.user_milestones FOR UPDATE
USING (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view their friendships"
ON public.friendships FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friendship requests"
ON public.friendships FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of"
ON public.friendships FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can delete friendships they're part of"
ON public.friendships FOR DELETE
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Challenges policies
CREATE POLICY "Users can view challenges they're part of"
ON public.challenges FOR SELECT
USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Users can create challenges"
ON public.challenges FOR INSERT
WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update challenges they're part of"
ON public.challenges FOR UPDATE
USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Challenge progress policies
CREATE POLICY "Users can view their challenge progress"
ON public.challenge_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their challenge progress"
ON public.challenge_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their challenge progress"
ON public.challenge_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add friend_code to profiles for easy friend adding
ALTER TABLE public.profiles ADD COLUMN friend_code TEXT UNIQUE;

-- Generate friend codes for existing users
UPDATE public.profiles 
SET friend_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))
WHERE friend_code IS NULL;

-- Make friend_code required for new profiles
ALTER TABLE public.profiles ALTER COLUMN friend_code SET DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));