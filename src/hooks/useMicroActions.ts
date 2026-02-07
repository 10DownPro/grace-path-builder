import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MicroAction {
  id: string;
  action_type: 'quick_prayer' | 'verse_snack' | 'encourage_friend' | 'gratitude_note' | 'breath_prayer';
  name: string;
  description: string | null;
  duration_seconds: number;
  points_reward: number;
  icon_emoji: string;
  is_active: boolean;
}

export interface DailyMicroGoals {
  id: string;
  user_id: string;
  goal_date: string;
  quick_prayers_goal: number;
  verse_snacks_goal: number;
  encouragements_goal: number;
  completed_prayers: number;
  completed_verses: number;
  completed_encouragements: number;
  completed_gratitude: number;
  completed_breath_prayers: number;
  bonus_claimed: boolean;
}

export interface UserMicroAction {
  id: string;
  user_id: string;
  micro_action_id: string | null;
  action_type: string;
  content_data: Record<string, unknown>;
  completed_at: string;
  session_date: string;
  points_earned: number;
}

export function useMicroActions() {
  const { user } = useAuth();
  const [microActions, setMicroActions] = useState<MicroAction[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyMicroGoals | null>(null);
  const [todayActions, setTodayActions] = useState<UserMicroAction[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchMicroActions = useCallback(async () => {
    const { data, error } = await supabase
      .from('micro_actions')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setMicroActions(data as MicroAction[]);
    }
  }, []);

  const fetchDailyGoals = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_micro_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('goal_date', today)
      .maybeSingle();

    if (!error && data) {
      setDailyGoals(data as DailyMicroGoals);
    } else if (!data) {
      // Create today's goals if they don't exist - use upsert to avoid conflicts
      const { data: newGoals, error: createError } = await supabase
        .from('daily_micro_goals')
        .upsert(
          { user_id: user.id, goal_date: today },
          { onConflict: 'user_id,goal_date' }
        )
        .select()
        .single();

      if (!createError && newGoals) {
        setDailyGoals(newGoals as DailyMicroGoals);
      }
    }
  }, [user, today]);

  const fetchTodayActions = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_micro_actions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .order('completed_at', { ascending: false });

    if (!error && data) {
      setTodayActions(data as UserMicroAction[]);
    }
  }, [user, today]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMicroActions(), fetchDailyGoals(), fetchTodayActions()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchMicroActions, fetchDailyGoals, fetchTodayActions]);

  const completeMicroAction = useCallback(async (
    actionType: MicroAction['action_type'],
    contentData: Record<string, unknown> = {}
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const action = microActions.find(a => a.action_type === actionType);
    if (!action) return { error: new Error('Action not found') };

    // Insert the completed action
    const { error: insertError } = await supabase
      .from('user_micro_actions')
      .insert([{
        user_id: user.id,
        micro_action_id: action.id,
        action_type: actionType,
        content_data: contentData as unknown as Record<string, never>,
        points_earned: action.points_reward,
        session_date: today
      }]);

    if (insertError) {
      console.error('Error completing micro action:', insertError);
      return { error: insertError };
    }

    // Award points
    await supabase.rpc('award_points', {
      _user_id: user.id,
      _points: action.points_reward,
      _reason: `micro_action_${actionType}`
    });

    // Update daily goals
    const goalField = getGoalFieldForAction(actionType);
    if (goalField && dailyGoals) {
      await supabase
        .from('daily_micro_goals')
        .update({ [goalField]: (dailyGoals[goalField as keyof DailyMicroGoals] as number) + 1 })
        .eq('id', dailyGoals.id);
    }

    toast.success(`+${action.points_reward} points!`, {
      description: action.name
    });

    // Refresh data
    await Promise.all([fetchDailyGoals(), fetchTodayActions()]);

    return { error: null };
  }, [user, microActions, dailyGoals, today, fetchDailyGoals, fetchTodayActions]);

  const getGoalFieldForAction = (actionType: MicroAction['action_type']): string | null => {
    switch (actionType) {
      case 'quick_prayer': return 'completed_prayers';
      case 'verse_snack': return 'completed_verses';
      case 'encourage_friend': return 'completed_encouragements';
      case 'gratitude_note': return 'completed_gratitude';
      case 'breath_prayer': return 'completed_breath_prayers';
      default: return null;
    }
  };

  const getActionStats = useCallback(() => {
    if (!dailyGoals) {
      return {
        prayers: { completed: 0, goal: 3 },
        verses: { completed: 0, goal: 5 },
        encouragements: { completed: 0, goal: 2 },
        gratitude: { completed: 0, goal: 1 },
        breathPrayers: { completed: 0, goal: 1 }
      };
    }

    return {
      prayers: { completed: dailyGoals.completed_prayers, goal: dailyGoals.quick_prayers_goal },
      verses: { completed: dailyGoals.completed_verses, goal: dailyGoals.verse_snacks_goal },
      encouragements: { completed: dailyGoals.completed_encouragements, goal: dailyGoals.encouragements_goal },
      gratitude: { completed: dailyGoals.completed_gratitude, goal: 1 },
      breathPrayers: { completed: dailyGoals.completed_breath_prayers, goal: 1 }
    };
  }, [dailyGoals]);

  const checkAllGoalsComplete = useCallback(() => {
    const stats = getActionStats();
    return (
      stats.prayers.completed >= stats.prayers.goal &&
      stats.verses.completed >= stats.verses.goal &&
      stats.encouragements.completed >= stats.encouragements.goal
    );
  }, [getActionStats]);

  const claimDailyBonus = useCallback(async () => {
    if (!user || !dailyGoals || dailyGoals.bonus_claimed) return { error: new Error('Cannot claim bonus') };

    if (!checkAllGoalsComplete()) {
      return { error: new Error('Goals not complete') };
    }

    // Award bonus points
    await supabase.rpc('award_points', {
      _user_id: user.id,
      _points: 50,
      _reason: 'daily_micro_goals_bonus'
    });

    // Mark bonus as claimed
    await supabase
      .from('daily_micro_goals')
      .update({ bonus_claimed: true })
      .eq('id', dailyGoals.id);

    toast.success('+50 BONUS points!', {
      description: 'All daily quick wins completed!'
    });

    await fetchDailyGoals();
    return { error: null };
  }, [user, dailyGoals, checkAllGoalsComplete, fetchDailyGoals]);

  return {
    microActions,
    dailyGoals,
    todayActions,
    loading,
    completeMicroAction,
    getActionStats,
    checkAllGoalsComplete,
    claimDailyBonus,
    refetch: () => Promise.all([fetchMicroActions(), fetchDailyGoals(), fetchTodayActions()])
  };
}
