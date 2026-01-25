-- Squad Prayer Wall table
CREATE TABLE IF NOT EXISTS public.squad_prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  prayer_request TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  answered_testimony TEXT,
  prayed_by JSONB DEFAULT '[]'::jsonb,
  prayer_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  answered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.squad_prayer_requests ENABLE ROW LEVEL SECURITY;

-- Squad members can view prayer requests in their squads
CREATE POLICY "Squad members can view prayer requests"
  ON public.squad_prayer_requests FOR SELECT
  USING (is_squad_member(auth.uid(), squad_id));

-- Users can create prayer requests in squads they belong to
CREATE POLICY "Squad members can create prayer requests"
  ON public.squad_prayer_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_squad_member(auth.uid(), squad_id));

-- Users can update their own prayer requests
CREATE POLICY "Users can update their own prayer requests"
  ON public.squad_prayer_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own prayer requests
CREATE POLICY "Users can delete their own prayer requests"
  ON public.squad_prayer_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Squad Chat Messages table
CREATE TABLE IF NOT EXISTS public.squad_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.squad_messages ENABLE ROW LEVEL SECURITY;

-- Squad members can view messages
CREATE POLICY "Squad members can view messages"
  ON public.squad_messages FOR SELECT
  USING (is_squad_member(auth.uid(), squad_id));

-- Squad members can send messages
CREATE POLICY "Squad members can send messages"
  ON public.squad_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_squad_member(auth.uid(), squad_id));

-- Direct Messages table (1-on-1 between friends)
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Users can view DMs they sent or received
CREATE POLICY "Users can view their DMs"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send DMs
CREATE POLICY "Users can send DMs"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can mark their received DMs as read
CREATE POLICY "Users can update received DMs"
  ON public.direct_messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.squad_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.squad_prayer_requests;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_squad_messages_squad ON public.squad_messages(squad_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_users ON public.direct_messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_squad_prayer_squad ON public.squad_prayer_requests(squad_id, created_at DESC);