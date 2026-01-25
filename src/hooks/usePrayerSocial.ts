import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PrayerSupporter {
  id: string;
  prayer_id: string;
  user_id: string;
  added_to_my_list: boolean;
  prayed_today: boolean;
  last_prayed_at: string | null;
  total_times_prayed: number;
  created_at: string;
  user_name?: string;
}

export interface PrayerReaction {
  id: string;
  prayer_id: string;
  user_id: string;
  reaction_type: 'praying' | 'amen' | 'heart' | 'strong';
  created_at: string;
}

export interface PrayerComment {
  id: string;
  prayer_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  user_name?: string;
}

export interface SharedPrayer {
  id: string;
  user_id: string;
  type: string;
  content: string;
  answered: boolean;
  answered_date: string | null;
  answered_note: string | null;
  shared_to_squad: boolean;
  shared_at: string | null;
  created_at: string;
  user_name?: string;
  supporter_count?: number;
  reaction_counts?: Record<string, number>;
  comment_count?: number;
  is_supporting?: boolean;
  my_reactions?: string[];
}

export function usePrayerSocial() {
  const { user } = useAuth();
  const [sharedPrayers, setSharedPrayers] = useState<SharedPrayer[]>([]);
  const [supportedPrayers, setSupportedPrayers] = useState<SharedPrayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedPrayers = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get shared prayers
      const { data: prayers, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('shared_to_squad', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get profiles for names
      const userIds = [...new Set((prayers || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = p.name || 'Unknown';
        return acc;
      }, {} as Record<string, string>);

      // Get supporter counts and user's support status
      const prayerIds = (prayers || []).map(p => p.id);
      
      const { data: supporters } = await supabase
        .from('prayer_supporters')
        .select('prayer_id, user_id')
        .in('prayer_id', prayerIds);

      const supporterCounts: Record<string, number> = {};
      const userSupporting: Record<string, boolean> = {};
      (supporters || []).forEach(s => {
        supporterCounts[s.prayer_id] = (supporterCounts[s.prayer_id] || 0) + 1;
        if (s.user_id === user.id) {
          userSupporting[s.prayer_id] = true;
        }
      });

      // Get reactions
      const { data: reactions } = await supabase
        .from('prayer_reactions')
        .select('prayer_id, reaction_type, user_id')
        .in('prayer_id', prayerIds);

      const reactionCounts: Record<string, Record<string, number>> = {};
      const userReactions: Record<string, string[]> = {};
      (reactions || []).forEach(r => {
        if (!reactionCounts[r.prayer_id]) reactionCounts[r.prayer_id] = {};
        reactionCounts[r.prayer_id][r.reaction_type] = 
          (reactionCounts[r.prayer_id][r.reaction_type] || 0) + 1;
        if (r.user_id === user.id) {
          if (!userReactions[r.prayer_id]) userReactions[r.prayer_id] = [];
          userReactions[r.prayer_id].push(r.reaction_type);
        }
      });

      // Get comment counts
      const { data: comments } = await supabase
        .from('prayer_comments')
        .select('prayer_id')
        .in('prayer_id', prayerIds);

      const commentCounts: Record<string, number> = {};
      (comments || []).forEach(c => {
        commentCounts[c.prayer_id] = (commentCounts[c.prayer_id] || 0) + 1;
      });

      const enrichedPrayers: SharedPrayer[] = (prayers || []).map(p => ({
        ...p,
        user_name: profileMap[p.user_id] || 'Unknown',
        supporter_count: supporterCounts[p.id] || 0,
        reaction_counts: reactionCounts[p.id] || {},
        comment_count: commentCounts[p.id] || 0,
        is_supporting: userSupporting[p.id] || false,
        my_reactions: userReactions[p.id] || []
      }));

      setSharedPrayers(enrichedPrayers);
    } catch (error) {
      console.error('Error fetching shared prayers:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSupportedPrayers = useCallback(async () => {
    if (!user) return;

    try {
      const { data: support, error: supportError } = await supabase
        .from('prayer_supporters')
        .select('prayer_id, total_times_prayed, prayed_today, last_prayed_at')
        .eq('user_id', user.id);

      if (supportError) throw supportError;

      if (!support || support.length === 0) {
        setSupportedPrayers([]);
        return;
      }

      const prayerIds = support.map(s => s.prayer_id);
      const { data: prayers, error: prayerError } = await supabase
        .from('prayers')
        .select('*')
        .in('id', prayerIds);

      if (prayerError) throw prayerError;

      const userIds = [...new Set((prayers || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = p.name || 'Unknown';
        return acc;
      }, {} as Record<string, string>);

      const supportMap = support.reduce((acc, s) => {
        acc[s.prayer_id] = s;
        return acc;
      }, {} as Record<string, typeof support[0]>);

      const enriched = (prayers || []).map(p => ({
        ...p,
        user_name: profileMap[p.user_id],
        is_supporting: true,
        my_support: supportMap[p.id]
      })) as SharedPrayer[];

      setSupportedPrayers(enriched);
    } catch (error) {
      console.error('Error fetching supported prayers:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSharedPrayers();
      fetchSupportedPrayers();
    }
  }, [user, fetchSharedPrayers, fetchSupportedPrayers]);

  const sharePrayerToSquad = async (prayerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayers')
      .update({ shared_to_squad: true, shared_at: new Date().toISOString() })
      .eq('id', prayerId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error sharing prayer:', error);
      return { error };
    }

    toast.success('Prayer shared with your squad! 🙏');
    fetchSharedPrayers();
    return { error: null };
  };

  const addSupport = async (prayerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayer_supporters')
      .insert({
        prayer_id: prayerId,
        user_id: user.id,
        prayed_today: true,
        last_prayed_at: new Date().toISOString(),
        total_times_prayed: 1
      });

    if (error) {
      if (error.code === '23505') {
        toast.info('You\'re already praying for this request');
        return { error: null };
      }
      console.error('Error adding support:', error);
      return { error };
    }

    // Award points
    try {
      await supabase.rpc('award_points', {
        _user_id: user.id,
        _points: 15,
        _reason: 'prayer_support'
      });
      toast.success('+15 points! 🙏', { description: 'You\'re praying for this request' });
    } catch (e) {
      console.error('Error awarding points:', e);
    }

    fetchSharedPrayers();
    fetchSupportedPrayers();
    return { error: null };
  };

  const removeSupport = async (prayerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayer_supporters')
      .delete()
      .eq('prayer_id', prayerId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing support:', error);
      return { error };
    }

    toast.info('Stopped supporting this prayer');
    fetchSharedPrayers();
    fetchSupportedPrayers();
    return { error: null };
  };

  const markPrayedToday = async (prayerId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data: existing } = await supabase
      .from('prayer_supporters')
      .select('total_times_prayed')
      .eq('prayer_id', prayerId)
      .eq('user_id', user.id)
      .single();

    const newCount = (existing?.total_times_prayed || 0) + 1;

    const { error } = await supabase
      .from('prayer_supporters')
      .update({
        prayed_today: true,
        last_prayed_at: new Date().toISOString(),
        total_times_prayed: newCount
      })
      .eq('prayer_id', prayerId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking prayed:', error);
      return { error };
    }

    toast.success('Prayed! 🙏');
    fetchSupportedPrayers();
    return { error: null };
  };

  const addReaction = async (prayerId: string, reactionType: PrayerReaction['reaction_type']) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayer_reactions')
      .insert({
        prayer_id: prayerId,
        user_id: user.id,
        reaction_type: reactionType
      });

    if (error) {
      if (error.code === '23505') {
        // Already reacted, remove reaction
        await supabase
          .from('prayer_reactions')
          .delete()
          .eq('prayer_id', prayerId)
          .eq('user_id', user.id)
          .eq('reaction_type', reactionType);
      } else {
        console.error('Error adding reaction:', error);
        return { error };
      }
    }

    fetchSharedPrayers();
    return { error: null };
  };

  const addComment = async (prayerId: string, commentText: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayer_comments')
      .insert({
        prayer_id: prayerId,
        user_id: user.id,
        comment_text: commentText.slice(0, 280)
      });

    if (error) {
      console.error('Error adding comment:', error);
      return { error };
    }

    toast.success('Comment added');
    fetchSharedPrayers();
    return { error: null };
  };

  const getComments = async (prayerId: string): Promise<PrayerComment[]> => {
    const { data: comments, error } = await supabase
      .from('prayer_comments')
      .select('*')
      .eq('prayer_id', prayerId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    const userIds = [...new Set((comments || []).map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name')
      .in('user_id', userIds);

    const profileMap = (profiles || []).reduce((acc, p) => {
      acc[p.user_id] = p.name || 'Unknown';
      return acc;
    }, {} as Record<string, string>);

    return (comments || []).map(c => ({
      ...c,
      user_name: profileMap[c.user_id] || 'Unknown'
    })) as PrayerComment[];
  };

  return {
    sharedPrayers,
    supportedPrayers,
    loading,
    sharePrayerToSquad,
    addSupport,
    removeSupport,
    markPrayedToday,
    addReaction,
    addComment,
    getComments,
    refetch: fetchSharedPrayers
  };
}
