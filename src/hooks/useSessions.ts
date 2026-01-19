import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Session {
  id: string;
  user_id: string;
  session_date: string;
  worship_completed: boolean;
  scripture_completed: boolean;
  prayer_completed: boolean;
  reflection_completed: boolean;
  duration_minutes: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [todaySession, setTodaySession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setTodaySession(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch all sessions for calendar
    const { data: allSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
    } else {
      setSessions(allSessions as Session[]);
    }

    // Fetch or create today's session
    const { data: todayData, error: todayError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .maybeSingle();

    if (todayError) {
      console.error('Error fetching today session:', todayError);
    } else {
      setTodaySession(todayData as Session | null);
    }

    setLoading(false);
  };

  const getOrCreateTodaySession = async () => {
    if (!user) return { error: new Error('Not authenticated'), data: null };

    // Check if session exists
    const { data: existing, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .maybeSingle();

    if (fetchError) {
      return { error: fetchError, data: null };
    }

    if (existing) {
      setTodaySession(existing as Session);
      return { error: null, data: existing as Session };
    }

    // Create new session for today
    const { data: newSession, error: insertError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        session_date: today
      })
      .select()
      .single();

    if (insertError) {
      return { error: insertError, data: null };
    }

    const session = newSession as Session;
    setTodaySession(session);
    setSessions([session, ...sessions]);
    return { error: null, data: session };
  };

  const updateTodaySession = async (updates: Partial<Pick<Session, 'worship_completed' | 'scripture_completed' | 'prayer_completed' | 'reflection_completed' | 'duration_minutes'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Ensure today's session exists
    let session = todaySession;
    if (!session) {
      const result = await getOrCreateTodaySession();
      if (result.error) return { error: result.error };
      session = result.data;
    }

    if (!session) return { error: new Error('Failed to create session') };

    // Check if all steps will be completed
    const updatedSession = { ...session, ...updates };
    const allCompleted = 
      updatedSession.worship_completed && 
      updatedSession.scripture_completed && 
      updatedSession.prayer_completed && 
      updatedSession.reflection_completed;

    // If completing all steps, set completed_at
    const finalUpdates = {
      ...updates,
      ...(allCompleted && !session.completed_at ? { completed_at: new Date().toISOString() } : {})
    };

    const { data, error } = await supabase
      .from('sessions')
      .update(finalUpdates)
      .eq('id', session.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      return { error };
    }

    const updated = data as Session;
    setTodaySession(updated);
    setSessions(sessions.map(s => s.id === updated.id ? updated : s));
    
    return { data: updated, error: null };
  };

  const addMinutes = async (minutes: number) => {
    if (!todaySession) {
      await getOrCreateTodaySession();
    }
    
    const currentMinutes = todaySession?.duration_minutes || 0;
    return updateTodaySession({ duration_minutes: currentMinutes + minutes });
  };

  // Get completed dates for calendar
  const getCompletedDates = (): Set<string> => {
    return new Set(
      sessions
        .filter(s => s.completed_at !== null)
        .map(s => s.session_date)
    );
  };

  // Get sessions for a specific month
  const getSessionsForMonth = (year: number, month: number): Session[] => {
    return sessions.filter(s => {
      const date = new Date(s.session_date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  // Calculate weekly data (sessions per day for current week)
  const getWeeklyData = (): number[] => {
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    // Get start of week (Sunday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    sessions.forEach(session => {
      const sessionDate = new Date(session.session_date);
      const diffTime = sessionDate.getTime() - weekStart.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 7 && session.completed_at) {
        weekData[diffDays] = 1; // Mark as completed
      }
    });

    return weekData;
  };

  return {
    sessions,
    todaySession,
    loading,
    getOrCreateTodaySession,
    updateTodaySession,
    addMinutes,
    getCompletedDates,
    getSessionsForMonth,
    getWeeklyData,
    refetch: fetchSessions
  };
}
