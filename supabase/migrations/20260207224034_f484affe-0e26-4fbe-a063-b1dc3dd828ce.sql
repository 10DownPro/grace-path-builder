-- Create SECURITY DEFINER function to create challenges with progress for both participants
CREATE OR REPLACE FUNCTION public.create_challenge_with_progress(
  _challenger_id uuid,
  _challenged_id uuid,
  _challenge_type text,
  _challenge_name text,
  _target_value integer,
  _end_date date,
  _description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _challenge_id uuid;
BEGIN
  -- Verify the caller is the challenger
  IF auth.uid() != _challenger_id THEN
    RAISE EXCEPTION 'Not authorized to create challenge for another user';
  END IF;

  -- Insert the challenge
  INSERT INTO challenges (
    challenger_id, challenged_id, challenge_type,
    challenge_name, target_value, end_date, description, status
  )
  VALUES (
    _challenger_id, _challenged_id, _challenge_type,
    _challenge_name, _target_value, _end_date, _description, 'pending'
  )
  RETURNING id INTO _challenge_id;

  -- Create progress records for BOTH users (bypasses RLS)
  INSERT INTO challenge_progress (challenge_id, user_id, current_value)
  VALUES 
    (_challenge_id, _challenger_id, 0),
    (_challenge_id, _challenged_id, 0);

  RETURN _challenge_id;
END;
$$;