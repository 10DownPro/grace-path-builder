import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type TestimonyType = 'answered_prayer' | 'life_change' | 'breakthrough' | 'salvation' | 'healing' | 'provision' | 'deliverance';

export interface Testimony {
  id: string;
  user_id: string;
  testimony_type: TestimonyType;
  title: string;
  testimony_text: string;
  related_prayer_id: string | null;
  related_verse_reference: string | null;
  related_verse_text: string | null;
  media_urls: string[];
  visibility: 'public' | 'squad' | 'private';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  reaction_counts?: Record<string, number>;
  comment_count?: number;
  share_count?: number;
  my_reactions?: string[];
}

export interface TestimonyComment {
  id: string;
  testimony_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  user_name?: string;
}

export const TESTIMONY_TYPE_CONFIG = {
  answered_prayer: { label: 'Answered Prayer', emoji: '🙏', color: 'text-blue-400' },
  life_change: { label: 'Life Change', emoji: '✨', color: 'text-purple-400' },
  breakthrough: { label: 'Breakthrough', emoji: '🔥', color: 'text-orange-400' },
  salvation: { label: 'Salvation', emoji: '✝️', color: 'text-yellow-400' },
  healing: { label: 'Healing', emoji: '💚', color: 'text-emerald-400' },
  provision: { label: 'Provision', emoji: '🎁', color: 'text-cyan-400' },
  deliverance: { label: 'Deliverance', emoji: '⛓️', color: 'text-red-400' },
} as const;

export function useTestimonies() {
  const { user } = useAuth();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [featuredTestimony, setFeaturedTestimony] = useState<Testimony | null>(null);
  const [myTestimonies, setMyTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonies = useCallback(async (filter?: { type?: TestimonyType; visibility?: string }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('testimonies')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter?.type) {
        query = query.eq('testimony_type', filter.type);
      }
      if (filter?.visibility) {
        query = query.eq('visibility', filter.visibility);
      }

      const { data: testimonies, error } = await query.limit(50);

      if (error) throw error;

      // Get profiles
      const userIds = [...new Set((testimonies || []).map(t => t.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.user_id] = p.name || 'Unknown';
        return acc;
      }, {} as Record<string, string>);

      // Get reaction counts
      const testimonyIds = (testimonies || []).map(t => t.id);
      const { data: reactions } = await supabase
        .from('testimony_reactions')
        .select('testimony_id, reaction_type, user_id')
        .in('testimony_id', testimonyIds);

      const reactionCounts: Record<string, Record<string, number>> = {};
      const userReactions: Record<string, string[]> = {};
      (reactions || []).forEach(r => {
        if (!reactionCounts[r.testimony_id]) reactionCounts[r.testimony_id] = {};
        reactionCounts[r.testimony_id][r.reaction_type] = 
          (reactionCounts[r.testimony_id][r.reaction_type] || 0) + 1;
        if (user && r.user_id === user.id) {
          if (!userReactions[r.testimony_id]) userReactions[r.testimony_id] = [];
          userReactions[r.testimony_id].push(r.reaction_type);
        }
      });

      // Get comment counts
      const { data: comments } = await supabase
        .from('testimony_comments')
        .select('testimony_id')
        .in('testimony_id', testimonyIds);

      const commentCounts: Record<string, number> = {};
      (comments || []).forEach(c => {
        commentCounts[c.testimony_id] = (commentCounts[c.testimony_id] || 0) + 1;
      });

      // Get share counts
      const { data: shares } = await supabase
        .from('testimony_shares')
        .select('testimony_id')
        .in('testimony_id', testimonyIds);

      const shareCounts: Record<string, number> = {};
      (shares || []).forEach(s => {
        shareCounts[s.testimony_id] = (shareCounts[s.testimony_id] || 0) + 1;
      });

      const enriched: Testimony[] = (testimonies || []).map(t => ({
        ...t,
        testimony_type: t.testimony_type as TestimonyType,
        visibility: t.visibility as 'public' | 'squad' | 'private',
        media_urls: Array.isArray(t.media_urls) ? (t.media_urls as string[]) : [],
        user_name: profileMap[t.user_id] || 'Unknown',
        reaction_counts: reactionCounts[t.id] || {},
        comment_count: commentCounts[t.id] || 0,
        share_count: shareCounts[t.id] || 0,
        my_reactions: userReactions[t.id] || []
      }));

      setTestimonies(enriched);

      // Set featured testimony
      const featured = enriched.find(t => t.is_featured);
      setFeaturedTestimony(featured || null);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMyTestimonies = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('testimonies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMyTestimonies((data || []).map(t => ({
        ...t,
        testimony_type: t.testimony_type as TestimonyType,
        visibility: t.visibility as 'public' | 'squad' | 'private',
        media_urls: Array.isArray(t.media_urls) ? (t.media_urls as string[]) : []
      })));
    } catch (error) {
      console.error('Error fetching my testimonies:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchTestimonies();
    if (user) {
      fetchMyTestimonies();
    }
  }, [fetchTestimonies, fetchMyTestimonies, user]);

  const createTestimony = async (testimony: {
    testimony_type: TestimonyType;
    title: string;
    testimony_text: string;
    related_prayer_id?: string;
    related_verse_reference?: string;
    related_verse_text?: string;
    media_urls?: string[];
    visibility?: 'public' | 'squad' | 'private';
  }) => {
    if (!user) return { error: new Error('Not authenticated'), data: null };

    const { data, error } = await supabase
      .from('testimonies')
      .insert({
        user_id: user.id,
        testimony_type: testimony.testimony_type,
        title: testimony.title.slice(0, 100),
        testimony_text: testimony.testimony_text.slice(0, 2000),
        related_prayer_id: testimony.related_prayer_id || null,
        related_verse_reference: testimony.related_verse_reference || null,
        related_verse_text: testimony.related_verse_text || null,
        media_urls: testimony.media_urls || [],
        visibility: testimony.visibility || 'public'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating testimony:', error);
      return { error, data: null };
    }

    // Award points for sharing testimony
    try {
      await supabase.rpc('award_points', {
        _user_id: user.id,
        _points: 50,
        _reason: 'testimony_shared'
      });
      toast.success('+50 points! 📖', { description: 'Testimony shared' });
    } catch (e) {
      console.error('Error awarding points:', e);
    }

    fetchTestimonies();
    fetchMyTestimonies();
    return { error: null, data };
  };

  const addReaction = async (testimonyId: string, reactionType: 'amen' | 'fire' | 'praying' | 'glory' | 'heart') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('testimony_reactions')
      .insert({
        testimony_id: testimonyId,
        user_id: user.id,
        reaction_type: reactionType
      });

    if (error) {
      if (error.code === '23505') {
        // Already reacted, remove
        await supabase
          .from('testimony_reactions')
          .delete()
          .eq('testimony_id', testimonyId)
          .eq('user_id', user.id)
          .eq('reaction_type', reactionType);
      } else {
        console.error('Error adding testimony reaction:', error);
        return { error };
      }
    }

    fetchTestimonies();
    return { error: null };
  };

  const addComment = async (testimonyId: string, commentText: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('testimony_comments')
      .insert({
        testimony_id: testimonyId,
        user_id: user.id,
        comment_text: commentText.slice(0, 280)
      });

    if (error) {
      console.error('Error adding testimony comment:', error);
      return { error };
    }

    toast.success('Comment added');
    fetchTestimonies();
    return { error: null };
  };

  const getComments = async (testimonyId: string): Promise<TestimonyComment[]> => {
    const { data: comments, error } = await supabase
      .from('testimony_comments')
      .select('*')
      .eq('testimony_id', testimonyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching testimony comments:', error);
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
    }));
  };

  const shareTestimony = async (testimonyId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('testimony_shares')
      .insert({
        testimony_id: testimonyId,
        shared_by_user_id: user.id
      });

    if (error) {
      console.error('Error sharing testimony:', error);
      return { error };
    }

    toast.success('Testimony shared!');
    fetchTestimonies();
    return { error: null };
  };

  return {
    testimonies,
    featuredTestimony,
    myTestimonies,
    loading,
    createTestimony,
    addReaction,
    addComment,
    getComments,
    shareTestimony,
    refetch: fetchTestimonies,
    TESTIMONY_TYPE_CONFIG
  };
}
