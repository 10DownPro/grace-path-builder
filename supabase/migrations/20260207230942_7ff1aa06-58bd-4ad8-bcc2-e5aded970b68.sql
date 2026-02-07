-- Create a security definer function to create study groups and add creator as leader
CREATE OR REPLACE FUNCTION public.create_study_group(
  _group_name text,
  _group_type text,
  _description text DEFAULT NULL,
  _group_avatar_emoji text DEFAULT '📖'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid;
  _group_id uuid;
BEGIN
  -- Get current user
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert the group
  INSERT INTO study_groups (
    group_name, group_type, description, group_avatar_emoji, created_by
  )
  VALUES (
    _group_name, _group_type, _description, _group_avatar_emoji, _user_id
  )
  RETURNING id INTO _group_id;

  -- Add creator as leader
  INSERT INTO group_members (group_id, user_id, role, age_group, reading_level)
  VALUES (_group_id, _user_id, 'leader', 'adult', 'adult');

  RETURN _group_id;
END;
$$;