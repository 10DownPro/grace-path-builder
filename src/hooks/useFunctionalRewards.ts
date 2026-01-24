import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ActiveReward {
  id: string;
  reward_id: string;
  reward_name: string;
  reward_type: string;
  effect: string;
  expires_at: string | null;
  uses_remaining: number | null;
}

export function useFunctionalRewards() {
  const { user } = useAuth();
  const [activeRewards, setActiveRewards] = useState<ActiveReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActiveRewards();
    } else {
      setActiveRewards([]);
      setLoading(false);
    }
  }, [user]);

  const fetchActiveRewards = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('user_rewards')
      .select(`
        id,
        reward_id,
        expires_at,
        uses_remaining,
        activated_at,
        reward:rewards(name, reward_type, reward_data)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching active rewards:', error);
    } else if (data) {
      const active = data
        .filter(ur => {
          const reward = ur.reward as { name: string; reward_type: string; reward_data: Record<string, unknown> } | null;
          if (!reward) return false;
          
          // Check if it's a functional reward type
          const isFunctional = ['consumable', 'booster'].includes(reward.reward_type);
          if (!isFunctional) return false;
          
          // Check if it has uses remaining or hasn't expired
          const hasUses = ur.uses_remaining === null || ur.uses_remaining > 0;
          const notExpired = !ur.expires_at || new Date(ur.expires_at) > new Date();
          
          return hasUses && (notExpired || !ur.activated_at);
        })
        .map(ur => {
          const reward = ur.reward as { name: string; reward_type: string; reward_data: Record<string, unknown> };
          return {
            id: ur.id,
            reward_id: ur.reward_id,
            reward_name: reward.name,
            reward_type: reward.reward_type,
            effect: (reward.reward_data?.effect as string) || '',
            expires_at: ur.expires_at,
            uses_remaining: ur.uses_remaining
          };
        });
      
      setActiveRewards(active);
    }

    setLoading(false);
  };

  const activateReward = async (userRewardId: string): Promise<{ success: boolean; expiresAt?: string }> => {
    if (!user) return { success: false };

    const { data, error } = await supabase.rpc('activate_reward', {
      _user_reward_id: userRewardId
    });

    if (error) {
      console.error('Error activating reward:', error);
      toast.error('Failed to activate reward');
      return { success: false };
    }

    // Handle array result from RPC
    if (data && Array.isArray(data) && data.length > 0) {
      const row = data[0] as { success: boolean; message: string; expires_at: string };
      if (row.success) {
        toast.success(row.message);
        await fetchActiveRewards();
        return { success: true, expiresAt: row.expires_at };
      } else {
        toast.error(row.message);
        return { success: false };
      }
    }

    return { success: false };
  };

  const hasActiveDoubleXP = (): boolean => {
    return activeRewards.some(r => 
      r.effect === 'double_xp' && 
      r.expires_at && 
      new Date(r.expires_at) > new Date()
    );
  };

  const hasStreakFreeze = (): boolean => {
    return activeRewards.some(r => 
      r.effect === 'streak_protection' && 
      (r.uses_remaining === null || r.uses_remaining > 0)
    );
  };

  const getDoubleXPExpiry = (): Date | null => {
    const doubleXP = activeRewards.find(r => 
      r.effect === 'double_xp' && 
      r.expires_at && 
      new Date(r.expires_at) > new Date()
    );
    return doubleXP?.expires_at ? new Date(doubleXP.expires_at) : null;
  };

  const getStreakFreezeCount = (): number => {
    return activeRewards
      .filter(r => r.effect === 'streak_protection')
      .reduce((sum, r) => sum + (r.uses_remaining ?? 1), 0);
  };

  return {
    activeRewards,
    loading,
    activateReward,
    hasActiveDoubleXP,
    hasStreakFreeze,
    getDoubleXPExpiry,
    getStreakFreezeCount,
    refetch: fetchActiveRewards
  };
}
