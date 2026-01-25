import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FollowUser {
  user_id: string;
  name: string;
  followed_at: string;
}

export function useFollows() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFollows = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    // Fetch who the user is following
    const { data: followingData } = await supabase
      .from('user_follows')
      .select('followed_user_id, followed_at')
      .eq('follower_user_id', user.id);

    // Fetch who follows the user
    const { data: followersData } = await supabase
      .from('user_follows')
      .select('follower_user_id, followed_at')
      .eq('followed_user_id', user.id);

    // Get profile info for all users
    const followingUserIds = followingData?.map(f => f.followed_user_id) || [];
    const followerUserIds = followersData?.map(f => f.follower_user_id) || [];
    const allUserIds = [...new Set([...followingUserIds, ...followerUserIds])];

    let profiles: { user_id: string; name: string }[] = [];
    if (allUserIds.length > 0) {
      const { data } = await supabase
        .from('public_profiles')
        .select('user_id, name')
        .in('user_id', allUserIds);
      profiles = data || [];
    }

    // Map following data
    const followingUsers: FollowUser[] = (followingData || []).map(f => ({
      user_id: f.followed_user_id,
      name: profiles.find(p => p.user_id === f.followed_user_id)?.name || 'User',
      followed_at: f.followed_at
    }));

    // Map followers data
    const followerUsers: FollowUser[] = (followersData || []).map(f => ({
      user_id: f.follower_user_id,
      name: profiles.find(p => p.user_id === f.follower_user_id)?.name || 'User',
      followed_at: f.followed_at
    }));

    setFollowing(followingUsers);
    setFollowers(followerUsers);
    setFollowingIds(new Set(followingUserIds));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFollows();
  }, [fetchFollows]);

  const followUser = useCallback(async (targetUserId: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    if (targetUserId === user.id) return { error: new Error('Cannot follow yourself') };

    // Check feature access
    const { data: accessData } = await supabase.rpc('check_feature_access', {
      p_user_id: user.id,
      p_feature_name: 'unlimited_follows'
    });

    const access = accessData as { has_access: boolean; reason: string; limit?: number; current_usage?: number } | null;

    if (access && !access.has_access) {
      return { 
        error: new Error('limit_reached'), 
        paywallData: access 
      };
    }

    const { error } = await supabase
      .from('user_follows')
      .insert({ follower_user_id: user.id, followed_user_id: targetUserId });

    if (error) {
      if (error.code === '23505') {
        toast.error('Already following this user');
      }
      return { error };
    }

    // Track usage for free tier
    if (access?.reason === 'within_free_limit') {
      await supabase.rpc('increment_feature_usage', {
        p_user_id: user.id,
        p_feature_name: 'unlimited_follows'
      });
    }

    // Update local state
    setFollowingIds(prev => new Set([...prev, targetUserId]));
    toast.success('Now following!');
    await fetchFollows();
    
    return { error: null };
  }, [user, fetchFollows]);

  const unfollowUser = useCallback(async (targetUserId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_user_id', user.id)
      .eq('followed_user_id', targetUserId);

    if (error) {
      return { error };
    }

    // Update local state
    setFollowingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(targetUserId);
      return newSet;
    });
    
    toast.success('Unfollowed');
    await fetchFollows();
    
    return { error: null };
  }, [user, fetchFollows]);

  const isFollowing = useCallback((targetUserId: string) => {
    return followingIds.has(targetUserId);
  }, [followingIds]);

  const getFollowedUserIds = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    
    const { data } = await supabase
      .from('user_follows')
      .select('followed_user_id')
      .eq('follower_user_id', user.id);
    
    return data?.map(f => f.followed_user_id) || [];
  }, [user]);

  return {
    following,
    followers,
    followingIds,
    loading,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowedUserIds,
    refetch: fetchFollows
  };
}
