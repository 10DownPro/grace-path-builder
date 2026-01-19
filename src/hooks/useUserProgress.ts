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
    const newStreak = progress.current_streak + 1;

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
    addMinutes,
    refetch: fetchProgress
  };
}
