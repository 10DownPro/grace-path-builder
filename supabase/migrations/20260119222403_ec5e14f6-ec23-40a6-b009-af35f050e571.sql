-- Drop the insecure SELECT policy that exposes all codes
DROP POLICY IF EXISTS "Anyone can check code validity" ON public.book_codes;

-- Create a restrictive SELECT policy that denies all direct access
-- The SECURITY DEFINER function redeem_book_code bypasses RLS, so no SELECT is needed
CREATE POLICY "No direct SELECT access to book codes"
ON public.book_codes
FOR SELECT
USING (false);