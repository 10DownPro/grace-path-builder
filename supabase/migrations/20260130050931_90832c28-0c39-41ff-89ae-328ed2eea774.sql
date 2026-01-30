-- Recreate the award_points function to properly award points
CREATE OR REPLACE FUNCTION public.award_points(_user_id UUID, _points INTEGER, _reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_total INTEGER;
  _multiplier INTEGER := 1;
  _final_points INTEGER;
BEGIN
  -- Check for active Double XP reward
  IF EXISTS (
    SELECT 1 FROM user_rewards ur
    JOIN rewards r ON ur.reward_id = r.id
    WHERE ur.user_id = _user_id 
      AND r.reward_type = 'booster'
      AND r.name ILIKE '%double%xp%'
      AND ur.activated_at IS NOT NULL
      AND ur.expires_at > now()
  ) THEN
    _multiplier := 2;
  END IF;
  
  _final_points := _points * _multiplier;
  
  -- Upsert the user_progress record - create if doesn't exist
  INSERT INTO user_progress (user_id, total_points)
  VALUES (_user_id, _final_points)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_points = user_progress.total_points + _final_points,
    updated_at = now()
  RETURNING total_points INTO _current_total;
  
  RETURN COALESCE(_current_total, 0);
END;
$$;

-- Also create a function to update challenge progress automatically
CREATE OR REPLACE FUNCTION public.update_challenge_progress(_user_id UUID, _challenge_type TEXT, _increment INTEGER DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _challenge RECORD;
BEGIN
  -- Find active personal challenges matching the type
  FOR _challenge IN 
    SELECT id, current_value, target_value 
    FROM personal_challenges 
    WHERE user_id = _user_id 
      AND challenge_type = _challenge_type 
      AND status = 'active'
      AND ends_at > now()
  LOOP
    -- Update progress
    UPDATE personal_challenges 
    SET 
      current_value = LEAST(current_value + _increment, target_value),
      status = CASE 
        WHEN current_value + _increment >= target_value THEN 'completed'
        ELSE status
      END,
      completed_at = CASE 
        WHEN current_value + _increment >= target_value THEN now()
        ELSE completed_at
      END
    WHERE id = _challenge.id;
  END LOOP;

  -- Also update 1v1 challenges
  UPDATE challenge_progress cp
  SET 
    current_value = current_value + _increment,
    last_updated = now()
  FROM challenges c
  WHERE cp.challenge_id = c.id
    AND cp.user_id = _user_id
    AND c.challenge_type = _challenge_type
    AND c.status = 'active'
    AND c.end_date >= CURRENT_DATE;
END;
$$;