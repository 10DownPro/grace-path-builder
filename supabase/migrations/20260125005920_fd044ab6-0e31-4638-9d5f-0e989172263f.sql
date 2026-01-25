-- =============================================
-- COMMUNITY FEED UPGRADE: User-Generated Posts
-- =============================================

-- Add columns for user-generated posts to community_feed_posts
ALTER TABLE public.community_feed_posts 
  ADD COLUMN IF NOT EXISTS is_user_generated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS post_text text,
  ADD COLUMN IF NOT EXISTS media_type text,
  ADD COLUMN IF NOT EXISTS media_url text,
  ADD COLUMN IF NOT EXISTS link_preview_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS edited_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

-- Add constraint for post text length
ALTER TABLE public.community_feed_posts 
  ADD CONSTRAINT post_text_length CHECK (char_length(post_text) <= 500);

-- Add constraint for media_type values
ALTER TABLE public.community_feed_posts 
  ADD CONSTRAINT valid_media_type CHECK (
    media_type IS NULL OR 
    media_type IN ('image', 'link', 'youtube', 'spotify', 'apple_music', 'verse', 'prayer_request')
  );

-- Create post_media table for multiple images per post
CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_feed_posts(id) ON DELETE CASCADE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  thumbnail_url text,
  upload_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on post_media
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_media
CREATE POLICY "Anyone can view post media" 
ON public.post_media FOR SELECT 
USING (true);

CREATE POLICY "Users can insert media for own posts" 
ON public.post_media FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.community_feed_posts 
    WHERE id = post_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete media for own posts" 
ON public.post_media FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.community_feed_posts 
    WHERE id = post_id AND user_id = auth.uid()
  )
);

-- Create user_follows table for following system
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_user_id uuid NOT NULL,
  followed_user_id uuid NOT NULL,
  followed_at timestamp with time zone DEFAULT now(),
  UNIQUE(follower_user_id, followed_user_id),
  CHECK (follower_user_id != followed_user_id)
);

-- Enable RLS on user_follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_follows
CREATE POLICY "Users can view their follows" 
ON public.user_follows FOR SELECT 
USING (
  follower_user_id = auth.uid() OR followed_user_id = auth.uid()
);

CREATE POLICY "Users can follow others" 
ON public.user_follows FOR INSERT 
WITH CHECK (follower_user_id = auth.uid());

CREATE POLICY "Users can unfollow" 
ON public.user_follows FOR DELETE 
USING (follower_user_id = auth.uid());

-- Create reported_posts table for content moderation
CREATE TABLE IF NOT EXISTS public.reported_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_feed_posts(id) ON DELETE CASCADE NOT NULL,
  reported_by_user_id uuid NOT NULL,
  report_reason text NOT NULL CHECK (
    report_reason IN ('inappropriate', 'spam', 'harassment', 'false_teaching', 'off_topic')
  ),
  report_details text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'removed', 'dismissed')),
  created_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  UNIQUE(post_id, reported_by_user_id)
);

-- Enable RLS on reported_posts
ALTER TABLE public.reported_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for reported_posts
CREATE POLICY "Users can report posts" 
ON public.reported_posts FOR INSERT 
WITH CHECK (reported_by_user_id = auth.uid());

CREATE POLICY "Users can view their own reports" 
ON public.reported_posts FOR SELECT 
USING (reported_by_user_id = auth.uid());

-- Update post_type constraint to include new types
ALTER TABLE public.community_feed_posts 
  DROP CONSTRAINT IF EXISTS community_feed_posts_post_type_check;

-- Create storage bucket for feed images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-feed-images',
  'community-feed-images', 
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for community-feed-images bucket
CREATE POLICY "Anyone can view feed images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'community-feed-images');

CREATE POLICY "Authenticated users can upload feed images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'community-feed-images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own feed images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'community-feed-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);