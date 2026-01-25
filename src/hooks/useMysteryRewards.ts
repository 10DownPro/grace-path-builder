import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MysteryReward {
  id: string;
  reward_type: 'points' | 'streak_freeze' | 'badge' | 'bonus_verse_pack' | 'xp_boost' | 'cosmetic';
  reward_name: string;
  reward_value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  drop_rate_percentage: number;
  icon_emoji: string;
  description: string | null;
}

export interface SpinTracking {
  id: string;
  user_id: string;
  spin_date: string;
  has_spun_today: boolean;
  spin_result_reward_id: string | null;
  spun_at: string | null;
}

export function useMysteryRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<MysteryReward[]>([]);
  const [todaySpin, setTodaySpin] = useState<SpinTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWonReward, setLastWonReward] = useState<MysteryReward | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchRewards = useCallback(async () => {
    const { data, error } = await supabase
      .from('mystery_rewards_catalog')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setRewards(data as MysteryReward[]);
    }
  }, []);

  const fetchTodaySpin = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_spin_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('spin_date', today)
      .maybeSingle();

    if (!error) {
      setTodaySpin(data as SpinTracking | null);
    }
  }, [user, today]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRewards(), fetchTodaySpin()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchRewards, fetchTodaySpin]);

  const calculateSpinResult = useCallback((): MysteryReward | null => {
    if (rewards.length === 0) return null;

    // Calculate total drop rate
    const totalRate = rewards.reduce((sum, r) => sum + r.drop_rate_percentage, 0);
    const random = Math.random() * totalRate;

    let cumulative = 0;
    for (const reward of rewards) {
      cumulative += reward.drop_rate_percentage;
      if (random <= cumulative) {
        return reward;
      }
    }

    // Fallback to first reward
    return rewards[0];
  }, [rewards]);

  const spinWheel = useCallback(async (): Promise<MysteryReward | null> => {
    if (!user || isSpinning || (todaySpin?.has_spun_today)) {
      return null;
    }

    setIsSpinning(true);

    // Determine reward
    const wonReward = calculateSpinResult();
    if (!wonReward) {
      setIsSpinning(false);
      return null;
    }

    try {
      // Create or update spin tracking
      if (todaySpin) {
        await supabase
          .from('daily_spin_tracking')
          .update({
            has_spun_today: true,
            spin_result_reward_id: wonReward.id,
            spun_at: new Date().toISOString()
          })
          .eq('id', todaySpin.id);
      } else {
        await supabase
          .from('daily_spin_tracking')
          .insert({
            user_id: user.id,
            spin_date: today,
            has_spun_today: true,
            spin_result_reward_id: wonReward.id,
            spun_at: new Date().toISOString()
          });
      }

      // Record the won reward
      await supabase
        .from('user_mystery_rewards')
        .insert({
          user_id: user.id,
          reward_id: wonReward.id
        });

      // Award points if it's a points reward
      if (wonReward.reward_type === 'points') {
        await supabase.rpc('award_points', {
          _user_id: user.id,
          _points: wonReward.reward_value,
          _reason: `mystery_reward_${wonReward.rarity}`
        });
      }

      setLastWonReward(wonReward);
      await fetchTodaySpin();

      return wonReward;
    } catch (error) {
      console.error('Spin error:', error);
      toast.error('Error spinning wheel');
      return null;
    } finally {
      setIsSpinning(false);
    }
  }, [user, isSpinning, todaySpin, calculateSpinResult, today, fetchTodaySpin]);

  const claimReward = useCallback(async (rewardId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_mystery_rewards')
      .update({ is_claimed: true, claimed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('reward_id', rewardId)
      .eq('is_claimed', false);

    if (error) {
      return { error };
    }

    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      toast.success(`${reward.icon_emoji} ${reward.reward_name} claimed!`);
    }

    return { error: null };
  }, [user, rewards]);

  const canSpinToday = !todaySpin?.has_spun_today;

  const getRewardsByRarity = useCallback((rarity: MysteryReward['rarity']) => {
    return rewards.filter(r => r.rarity === rarity);
  }, [rewards]);

  return {
    rewards,
    todaySpin,
    loading,
    isSpinning,
    lastWonReward,
    canSpinToday,
    spinWheel,
    claimReward,
    getRewardsByRarity,
    refetch: () => Promise.all([fetchRewards(), fetchTodaySpin()])
  };
}
