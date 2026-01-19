import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Milestone {
  id: string;
  milestone_type: string;
  name: string;
  description: string;
  icon_emoji: string;
  requirement_type: string;
  requirement_value: number;
  reward_message: string;
  scripture_reference: string;
  scripture_text: string;
  tier: string;
  display_order: number;
  is_active: boolean;
}

export interface UserMilestone {
  id: string;
  user_id: string;
  milestone_id: string;
  achieved_at: string;
  is_viewed: boolean;
  milestone?: Milestone;
}

export function useMilestones() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [userMilestones, setUserMilestones] = useState<UserMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
    if (user) {
      fetchUserMilestones();
    }
  }, [user]);

  const fetchMilestones = async () => {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching milestones:', error);
      return;
    }

    setMilestones(data as Milestone[]);
  };

  const fetchUserMilestones = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('user_milestones')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user milestones:', error);
      setLoading(false);
      return;
    }

    setUserMilestones(data as UserMilestone[]);
    setLoading(false);
  };

  const awardMilestone = async (milestoneId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if already achieved
    const existing = userMilestones.find(um => um.milestone_id === milestoneId);
    if (existing) {
      return { error: null, alreadyAchieved: true };
    }

    const { data, error } = await supabase
      .from('user_milestones')
      .insert({
        user_id: user.id,
        milestone_id: milestoneId
      })
      .select()
      .single();

    if (error) {
      return { error };
    }

    await fetchUserMilestones();
    return { data, error: null };
  };

  const markViewed = async (userMilestoneId: string) => {
    if (!user) return;

    await supabase
      .from('user_milestones')
      .update({ is_viewed: true })
      .eq('id', userMilestoneId);

    await fetchUserMilestones();
  };

  const getUnviewedMilestones = () => {
    return userMilestones
      .filter(um => !um.is_viewed)
      .map(um => ({
        ...um,
        milestone: milestones.find(m => m.id === um.milestone_id)
      }))
      .filter(um => um.milestone);
  };

  const getAchievedMilestones = () => {
    return userMilestones.map(um => ({
      ...um,
      milestone: milestones.find(m => m.id === um.milestone_id)
    })).filter(um => um.milestone);
  };

  const getMilestonesByType = (type: string) => {
    return milestones.filter(m => m.milestone_type === type);
  };

  const isMilestoneAchieved = (milestoneId: string) => {
    return userMilestones.some(um => um.milestone_id === milestoneId);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-amber-700 to-amber-500';
      case 'silver': return 'from-gray-400 to-gray-200';
      case 'gold': return 'from-yellow-500 to-yellow-300';
      case 'platinum': return 'from-cyan-400 to-blue-300';
      case 'diamond': return 'from-purple-400 to-pink-300';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  return {
    milestones,
    userMilestones,
    loading,
    awardMilestone,
    markViewed,
    getUnviewedMilestones,
    getAchievedMilestones,
    getMilestonesByType,
    isMilestoneAchieved,
    getTierColor,
    refetch: () => {
      fetchMilestones();
      fetchUserMilestones();
    }
  };
}
