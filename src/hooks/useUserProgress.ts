import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProgress {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
  total_minutes: number;
  last_session_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data as UserProgress);
    }
    setLoading(false);
  };

  const incrementStreak = async () => {
    if (!user || !progress) return { error: new Error('Not authenticated') };

    const today = new Date().toISOString().split('T')[0];
    const lastSessionDate = progress.last_session_date;
    
    // Check if already completed today - don't double increment
    if (lastSessionDate === today) {
      return { data: progress, error: null };
    }
    
    // Check if we missed a day - reset streak if not consecutive
    let newStreak = 1; // Default to starting fresh
    
    if (lastSessionDate) {
      const lastDate = new Date(lastSessionDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day - increment streak
        newStreak = progress.current_streak + 1;
      } else if (diffDays === 0) {
        // Same day - keep current streak
        newStreak = progress.current_streak;
      }
      // If diffDays > 1, streak resets to 1 (already set above)
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, progress.longest_streak),
        total_sessions: progress.total_sessions + 1,
        last_session_date: today
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      return { error };
    }
    
    setProgress(data as UserProgress);
    return { data, error: null };
  };

  // Check and reset streak if user missed a day (call on app load)
  const checkStreakStatus = async () => {
    if (!user || !progress || !progress.last_session_date) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(progress.last_session_date);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If more than 1 day has passed and streak is > 0, reset it
    if (diffDays > 1 && progress.current_streak > 0) {
      const { data, error } = await supabase
        .from('user_progress')
        .update({ current_streak: 0 })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        setProgress(data as UserProgress);
      }
    }
  };

  const addMinutes = async (minutes: number) => {
    if (!user || !progress) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('user_progress')
      .update({
        total_minutes: progress.total_minutes + minutes
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating minutes:', error);
      return { error };
    }
    
    setProgress(data as UserProgress);
    return { data, error: null };
  };

  return {
    progress,
    loading,
    incrementStreak,
    checkStreakStatus,
    addMinutes,
    refetch: fetchProgress
  };
}
