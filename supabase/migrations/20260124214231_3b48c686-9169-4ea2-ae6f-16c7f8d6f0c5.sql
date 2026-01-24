-- =============================================
-- ENHANCED GROUP BIBLE STUDY SYSTEM
-- Phase 1: Core tables for multi-level group studies
-- =============================================

-- Study Groups Table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  group_type TEXT NOT NULL DEFAULT 'custom', -- 'family', 'friends', 'small_group', 'church', 'youth', 'couples', 'custom'
  description TEXT,
  created_by UUID NOT NULL,
  group_code TEXT UNIQUE DEFAULT upper(substring(md5(random()::text) from 1 for 8)),
  is_public BOOLEAN DEFAULT FALSE,
  max_members INTEGER DEFAULT 20,
  group_avatar_emoji TEXT DEFAULT '📖',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group Members Table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member', -- 'leader', 'co_leader', 'member', 'child'
  age_group TEXT DEFAULT 'adult', -- 'early_childhood', 'elementary', 'middle_school', 'teen', 'young_adult', 'adult', 'senior'
  reading_level TEXT DEFAULT 'adult', -- 'picture', 'early_reader', 'intermediate', 'advanced', 'adult'
  display_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Group Study Plans Table
CREATE TABLE public.group_study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  plan_type TEXT DEFAULT 'weekly', -- 'one_time', 'weekly', 'daily', 'custom_schedule'
  book TEXT NOT NULL,
  chapter_start INTEGER NOT NULL DEFAULT 1,
  chapter_end INTEGER NOT NULL DEFAULT 1,
  current_chapter INTEGER NOT NULL DEFAULT 1,
  frequency TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'biweekly', 'monthly'
  study_day TEXT, -- 'monday', 'sunday', etc.
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group Study Sessions Table
CREATE TABLE public.group_study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.group_study_plans(id) ON DELETE SET NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  session_title TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  discussion_time TIMESTAMP WITH TIME ZONE,
  leader_notes TEXT,
  completed_by JSONB DEFAULT '[]'::jsonb,
  discussed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group Member Progress Table
CREATE TABLE public.group_member_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  reading_level TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_spent_minutes INTEGER DEFAULT 0,
  reflection_text TEXT,
  discussion_notes TEXT,
  questions_for_group TEXT,
  leader_feedback TEXT,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Group Discussions Table
CREATE TABLE public.group_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.group_study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'comment', -- 'comment', 'question', 'insight', 'prayer_request', 'answer'
  parent_message_id UUID REFERENCES public.group_discussions(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  reactions JSONB DEFAULT '{}'::jsonb,
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_member_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discussions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is a group member
CREATE OR REPLACE FUNCTION public.is_study_group_member(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id AND is_active = TRUE
  ) OR EXISTS (
    SELECT 1 FROM public.study_groups
    WHERE id = _group_id AND created_by = _user_id
  )
$$;

-- Helper function to check if user is group leader
CREATE OR REPLACE FUNCTION public.is_study_group_leader(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id AND role IN ('leader', 'co_leader') AND is_active = TRUE
  ) OR EXISTS (
    SELECT 1 FROM public.study_groups
    WHERE id = _group_id AND created_by = _user_id
  )
$$;

-- RLS Policies for study_groups
CREATE POLICY "Users can create study groups"
ON public.study_groups FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can view their groups"
ON public.study_groups FOR SELECT
USING (is_study_group_member(auth.uid(), id) OR is_public = TRUE);

CREATE POLICY "Creators can update their groups"
ON public.study_groups FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their groups"
ON public.study_groups FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for group_members
CREATE POLICY "Members can view group members"
ON public.group_members FOR SELECT
USING (is_study_group_member(auth.uid(), group_id));

CREATE POLICY "Leaders can add members"
ON public.group_members FOR INSERT
WITH CHECK (is_study_group_leader(auth.uid(), group_id) OR auth.uid() = user_id);

CREATE POLICY "Leaders can update members"
ON public.group_members FOR UPDATE
USING (is_study_group_leader(auth.uid(), group_id) OR auth.uid() = user_id);

CREATE POLICY "Leaders or self can remove members"
ON public.group_members FOR DELETE
USING (is_study_group_leader(auth.uid(), group_id) OR auth.uid() = user_id);

-- RLS Policies for group_study_plans
CREATE POLICY "Members can view study plans"
ON public.group_study_plans FOR SELECT
USING (is_study_group_member(auth.uid(), group_id));

CREATE POLICY "Leaders can create study plans"
ON public.group_study_plans FOR INSERT
WITH CHECK (is_study_group_leader(auth.uid(), group_id));

CREATE POLICY "Leaders can update study plans"
ON public.group_study_plans FOR UPDATE
USING (is_study_group_leader(auth.uid(), group_id));

CREATE POLICY "Leaders can delete study plans"
ON public.group_study_plans FOR DELETE
USING (is_study_group_leader(auth.uid(), group_id));

-- RLS Policies for group_study_sessions
CREATE POLICY "Members can view sessions"
ON public.group_study_sessions FOR SELECT
USING (is_study_group_member(auth.uid(), group_id));

CREATE POLICY "Leaders can create sessions"
ON public.group_study_sessions FOR INSERT
WITH CHECK (is_study_group_leader(auth.uid(), group_id));

CREATE POLICY "Leaders can update sessions"
ON public.group_study_sessions FOR UPDATE
USING (is_study_group_leader(auth.uid(), group_id));

CREATE POLICY "Leaders can delete sessions"
ON public.group_study_sessions FOR DELETE
USING (is_study_group_leader(auth.uid(), group_id));

-- RLS Policies for group_member_progress
CREATE POLICY "Members can view group progress"
ON public.group_member_progress FOR SELECT
USING (is_study_group_member(auth.uid(), group_id));

CREATE POLICY "Users can create their own progress"
ON public.group_member_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.group_member_progress FOR UPDATE
USING (auth.uid() = user_id OR is_study_group_leader(auth.uid(), group_id));

-- RLS Policies for group_discussions
CREATE POLICY "Members can view discussions"
ON public.group_discussions FOR SELECT
USING (is_study_group_member(auth.uid(), (SELECT group_id FROM group_study_sessions WHERE id = session_id)));

CREATE POLICY "Members can create discussions"
ON public.group_discussions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their discussions"
ON public.group_discussions FOR UPDATE
USING (auth.uid() = user_id OR is_study_group_leader(auth.uid(), (SELECT group_id FROM group_study_sessions WHERE id = session_id)));

CREATE POLICY "Users can delete their discussions"
ON public.group_discussions FOR DELETE
USING (auth.uid() = user_id OR is_study_group_leader(auth.uid(), (SELECT group_id FROM group_study_sessions WHERE id = session_id)));

-- Create indexes for performance
CREATE INDEX idx_study_groups_created_by ON public.study_groups(created_by);
CREATE INDEX idx_study_groups_code ON public.study_groups(group_code);
CREATE INDEX idx_group_members_group ON public.group_members(group_id);
CREATE INDEX idx_group_members_user ON public.group_members(user_id);
CREATE INDEX idx_group_study_plans_group ON public.group_study_plans(group_id);
CREATE INDEX idx_group_study_sessions_group ON public.group_study_sessions(group_id);
CREATE INDEX idx_group_study_sessions_date ON public.group_study_sessions(group_id, session_date);
CREATE INDEX idx_group_member_progress_session ON public.group_member_progress(session_id);
CREATE INDEX idx_group_member_progress_user ON public.group_member_progress(user_id);
CREATE INDEX idx_group_discussions_session ON public.group_discussions(session_id);

-- Trigger for updated_at
CREATE TRIGGER update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();