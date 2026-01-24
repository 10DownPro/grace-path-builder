import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  category: string;
  point_cost: number;
  icon_emoji: string;
  image_url: string | null;
  is_active: boolean;
  is_premium_only: boolean;
  reward_type: string;
  reward_data: Record<string, unknown>;
  stock_limit: number | null;
  times_redeemed: number;
  display_order: number;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  is_equipped: boolean;
  reward?: Reward;
}

export function useRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
    if (user) {
      fetchUserRewards();
      fetchUserPoints();
    }
  }, [user]);

  const fetchRewards = async () => {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching rewards:', error);
    } else {
      setRewards(data as Reward[]);
    }
    setLoading(false);
  };

  const fetchUserRewards = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_rewards')
      .select('*, reward:rewards(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user rewards:', error);
    } else {
      setUserRewards(data as UserReward[]);
    }
  };

  const fetchUserPoints = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('total_points')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user points:', error);
    } else if (data) {
      setUserPoints(data.total_points);
    }
  };

  const redeemReward = async (rewardId: string) => {
    if (!user) {
      toast.error('Please log in to redeem rewards');
      return { success: false };
    }

    setRedeeming(rewardId);

    const { data, error } = await supabase.rpc('redeem_reward', {
      _reward_id: rewardId
    });

    setRedeeming(null);

    if (error) {
      console.error('Redeem error:', error);
      toast.error('Failed to redeem reward');
      return { success: false };
    }

    const result = data?.[0] as { success: boolean; message: string; reward_info: Record<string, unknown> | null } | undefined;
    if (result?.success) {
      const rewardIcon = (result.reward_info?.icon as string) || '🎁';
      toast.success(result.message, { icon: rewardIcon });
      await fetchUserRewards();
      await fetchUserPoints();
      return { success: true, reward: result.reward_info };
    } else {
      toast.error(result?.message || 'Failed to redeem reward');
      return { success: false, message: result?.message };
    }
  };

  const equipReward = async (userRewardId: string, equipped: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_rewards')
      .update({ is_equipped: equipped })
      .eq('id', userRewardId)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update equipped status');
      return { error };
    }

    await fetchUserRewards();
    toast.success(equipped ? 'Reward equipped!' : 'Reward unequipped');
    return { error: null };
  };

  const hasReward = (rewardId: string) => {
    return userRewards.some(ur => ur.reward_id === rewardId);
  };

  const getEquippedRewards = () => {
    return userRewards.filter(ur => ur.is_equipped);
  };

  const getRewardsByCategory = (category: string) => {
    return rewards.filter(r => r.category === category);
  };

  return {
    rewards,
    userRewards,
    userPoints,
    loading,
    redeeming,
    redeemReward,
    equipReward,
    hasReward,
    getEquippedRewards,
    getRewardsByCategory,
    refetch: () => {
      fetchRewards();
      fetchUserRewards();
      fetchUserPoints();
    }
  };
}
