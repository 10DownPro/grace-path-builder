-- Create waitlist table for email signups
CREATE TABLE public.waitlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    source text DEFAULT 'landing_page',
    notified boolean DEFAULT false,
    referral_code text UNIQUE DEFAULT upper(substring(md5(random()::text) from 1 for 6)),
    referred_by text
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public signup)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view their own entry
CREATE POLICY "Users can view own waitlist entry"
ON public.waitlist
FOR SELECT
TO authenticated
USING (email = (SELECT auth.jwt() ->> 'email'));

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist (email);
CREATE INDEX idx_waitlist_referral_code ON public.waitlist (referral_code);