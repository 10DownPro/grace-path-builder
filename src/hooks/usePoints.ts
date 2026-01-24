import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Point values for different actions
export const POINT_VALUES = {
  SESSION_COMPLETE: 50,
  PRAYER_LOGGED: 10,
  VERSE_READ: 5,
} as const;

export function usePoints() {
  const { user } = useAuth();

  const awardPoints = async (points: number, reason: string): Promise<number | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('award_points', {
        _user_id: user.id,
        _points: points,
        _reason: reason
      });

      if (error) {
        console.error('Error awarding points:', error);
        return null;
      }

      return data as number;
    } catch (err) {
      console.error('Error in awardPoints:', err);
      return null;
    }
  };

  const awardSessionPoints = async () => {
    const newTotal = await awardPoints(POINT_VALUES.SESSION_COMPLETE, 'session_complete');
    if (newTotal !== null) {
      toast.success(`+${POINT_VALUES.SESSION_COMPLETE} points earned!`, {
        description: 'Session completed'
      });
    }
    return newTotal;
  };

  const awardPrayerPoints = async () => {
    const newTotal = await awardPoints(POINT_VALUES.PRAYER_LOGGED, 'prayer_logged');
    if (newTotal !== null) {
      toast.success(`+${POINT_VALUES.PRAYER_LOGGED} points!`, {
        description: 'Prayer logged'
      });
    }
    return newTotal;
  };

  const awardVersePoints = async (verseCount: number = 1) => {
    const totalPoints = POINT_VALUES.VERSE_READ * verseCount;
    const newTotal = await awardPoints(totalPoints, 'verse_read');
    if (newTotal !== null && verseCount > 0) {
      toast.success(`+${totalPoints} points!`, {
        description: `${verseCount} verse${verseCount > 1 ? 's' : ''} read`
      });
    }
    return newTotal;
  };

  return {
    awardPoints,
    awardSessionPoints,
    awardPrayerPoints,
    awardVersePoints,
    POINT_VALUES
  };
}
