import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { usePoints, POINT_VALUES } from './usePoints';

export type PostType = 
  | 'text' 
  | 'prayer_request' 
  | 'image' 
  | 'video' 
  | 'music' 
  | 'link' 
  | 'poll' 
  | 'milestone' 
  | 'daily_topic'
  | 'testimony'
  | 'answered_prayer'
  | 'streak';

export type PostTag = 
  | 'prayer_request' 
  | 'testimony' 
  | 'question' 
  | 'encouragement' 
  | 'discussion';

export type PrayerUrgency = 'routine' | 'urgent' | 'crisis';

export interface PollOption {
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  duration: '24h' | '3d' | '7d' | 'none';
  anonymous: boolean;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  user_level?: number;
  user_streak?: number;
  post_type: PostType;
  post_text: string | null;
  content_data: Record<string, unknown>;
  media_type: string | null;
  media_url: string | null;
  visibility: 'public' | 'squad_only' | 'friends_only';
  squad_id: string | null;
  engagement_score: number;
  reaction_count: number;
  comment_count: number;
  share_count: number;
  is_pinned: boolean;
  is_user_generated: boolean;
  created_at: string;
  edited_at: string | null;
  // Prayer request fields
  prayer_urgency: PrayerUrgency;
  is_answered: boolean;
  answered_at: string | null;
  answered_testimony: string | null;
  prayer_count: number;
  // Poll fields
  poll_data: PollData | null;
  poll_expires_at: string | null;
  // Tags
  tags: string[];
  mentioned_users: string[];
  // User's reaction
  user_reaction: string | null;
  user_prayed: boolean;
  user_poll_vote: number | null;
  // Reaction counts
  reaction_counts: {
    fire: number;
    praying: number;
    amen: number;
    strong: number;
    heart: number;
    lightbulb: number;
  };
}

export interface PostFilter {
  type: 'all' | 'prayer_requests' | 'testimonies' | 'questions' | 'polls' | 'music' | 'following' | 'my_posts';
  sort: 'recent' | 'top' | 'trending' | 'unanswered_prayers';
}

export function useCommunityPosts() {
  const { user } = useAuth();
  const { awardPoints } = usePoints();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<PostFilter>({ type: 'all', sort: 'recent' });

  const PAGE_SIZE = 20;

  const fetchPosts = useCallback(async (offset = 0) => {
    if (!user) return;

    setLoading(true);

    try {
      // For 'following' filter, first get followed user IDs
      let followedUserIds: string[] = [];
      if (filter.type === 'following') {
        const { data: follows } = await supabase
          .from('user_follows')
          .select('followed_user_id')
          .eq('follower_user_id', user.id);
        followedUserIds = follows?.map(f => f.followed_user_id) || [];
        
        if (followedUserIds.length === 0) {
          setPosts([]);
          setHasMore(false);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from('community_feed_posts')
        .select('*')
        .eq('is_deleted', false);

      // Apply filters
      switch (filter.type) {
        case 'prayer_requests':
          query = query.or(`post_type.eq.prayer_request,content_data->is_prayer_request.eq.true`);
          break;
        case 'testimonies':
          query = query.or('post_type.eq.testimony,post_type.eq.answered_prayer');
          break;
        case 'questions':
          query = query.contains('tags', ['question']);
          break;
        case 'polls':
          query = query.eq('post_type', 'poll');
          break;
        case 'music':
          query = query.or('media_type.eq.youtube,media_type.eq.spotify');
          break;
        case 'following':
          if (followedUserIds.length > 0) {
            query = query.in('user_id', followedUserIds);
          }
          break;
        case 'my_posts':
          query = query.eq('user_id', user.id);
          break;
      }

      // Apply sorting
      switch (filter.sort) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'top':
          query = query.order('engagement_score', { ascending: false });
          break;
        case 'trending':
          // Recent posts with high engagement
          query = query
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .order('engagement_score', { ascending: false });
          break;
        case 'unanswered_prayers':
          query = query
            .or(`post_type.eq.prayer_request,content_data->is_prayer_request.eq.true`)
            .eq('is_answered', false)
            .order('prayer_count', { ascending: true });
          break;
      }

      query = query.range(offset, offset + PAGE_SIZE - 1);

      const { data: postsData, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
        return;
      }

      if (!postsData || postsData.length === 0) {
        if (offset === 0) setPosts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Fetch user profiles and progress
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const [profilesRes, progressRes] = await Promise.all([
        supabase.from('public_profiles').select('user_id, display_name').in('user_id', userIds),
        supabase.from('user_progress').select('user_id, current_streak, total_points').in('user_id', userIds)
      ]);

      // Fetch reactions
      const postIds = postsData.map(p => p.id);
      const [userReactionsRes, allReactionsRes, prayerInteractionsRes, pollVotesRes] = await Promise.all([
        supabase.from('feed_reactions').select('*').in('post_id', postIds).eq('user_id', user.id),
        supabase.from('feed_reactions').select('post_id, reaction_type').in('post_id', postIds),
        (supabase.from('prayer_interactions' as any).select('post_id').in('post_id', postIds).eq('user_id', user.id)) as unknown as Promise<{ data: { post_id: string }[] | null }>,
        (supabase.from('poll_votes' as any).select('post_id, option_index').in('post_id', postIds).eq('user_id', user.id)) as unknown as Promise<{ data: { post_id: string; option_index: number }[] | null }>
      ]);

      // Calculate reaction counts
      const reactionCountsMap: Record<string, Record<string, number>> = {};
      allReactionsRes.data?.forEach(r => {
        if (!reactionCountsMap[r.post_id]) {
          reactionCountsMap[r.post_id] = { fire: 0, praying: 0, amen: 0, strong: 0, heart: 0, lightbulb: 0 };
        }
        if (r.reaction_type in reactionCountsMap[r.post_id]) {
          reactionCountsMap[r.post_id][r.reaction_type]++;
        }
      });

      const userPrayedSet = new Set(prayerInteractionsRes.data?.map(p => p.post_id) || []);
      const userPollVotesMap = new Map(pollVotesRes.data?.map(v => [v.post_id, v.option_index]) || []);

      // Enrich posts
      type ProgressRecord = { user_id: string; current_streak: number; total_points: number };
      const enrichedPosts: CommunityPost[] = postsData.map(post => {
        const profile = profilesRes.data?.find(p => p.user_id === post.user_id);
        const progress = (progressRes.data as ProgressRecord[] | null)?.find(p => p.user_id === post.user_id);
        const userReaction = userReactionsRes.data?.find(r => r.post_id === post.id);
        const reactionCounts = reactionCountsMap[post.id] || { fire: 0, praying: 0, amen: 0, strong: 0, heart: 0, lightbulb: 0 };
        const calculatedLevel = progress ? Math.floor((progress.total_points || 0) / 100) + 1 : 1;

        return {
          ...post,
          user_name: profile?.display_name || 'Anonymous',
          user_level: calculatedLevel,
          user_streak: progress?.current_streak || 0,
          user_reaction: userReaction?.reaction_type || null,
          user_prayed: userPrayedSet.has(post.id),
          user_poll_vote: userPollVotesMap.get(post.id) ?? null,
          reaction_counts: reactionCounts as CommunityPost['reaction_counts'],
          poll_data: post.poll_data as unknown as PollData | null,
          tags: (post.tags || []) as string[],
          mentioned_users: (post.mentioned_users || []) as string[]
        } as CommunityPost;
      });

      if (offset === 0) {
        setPosts(enrichedPosts);
      } else {
        setPosts(prev => [...prev, ...enrichedPosts]);
      }

      setHasMore(postsData.length === PAGE_SIZE);
    } catch (err) {
      console.error('Error in fetchPosts:', err);
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    if (user) {
      fetchPosts(0);
    }
  }, [user, fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('community-posts-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_feed_posts' },
        async (payload) => {
          const { data: profile } = await supabase
            .from('public_profiles')
            .select('user_id, display_name')
            .eq('user_id', payload.new.user_id)
            .single();

          const newPost: CommunityPost = {
            ...(payload.new as unknown as CommunityPost),
            user_name: profile?.display_name || 'Anonymous',
            user_reaction: null,
            user_prayed: false,
            user_poll_vote: null,
            reaction_counts: { fire: 0, praying: 0, amen: 0, strong: 0, heart: 0, lightbulb: 0 }
          };

          setPosts(prev => [newPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(posts.length);
    }
  }, [loading, hasMore, posts.length, fetchPosts]);

  const addReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const post = posts.find(p => p.id === postId);
    const existingReaction = post?.user_reaction;

    if (existingReaction) {
      await supabase
        .from('feed_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (existingReaction === reactionType) {
        setPosts(prev => prev.map(p => {
          if (p.id !== postId) return p;
          const newCounts = { ...p.reaction_counts };
          if (existingReaction in newCounts) {
            newCounts[existingReaction as keyof typeof newCounts] = Math.max(0, newCounts[existingReaction as keyof typeof newCounts] - 1);
          }
          return { ...p, user_reaction: null, reaction_count: Math.max(0, p.reaction_count - 1), reaction_counts: newCounts };
        }));
        return { error: null };
      }
    }

    const { error } = await supabase
      .from('feed_reactions')
      .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });

    if (error) return { error };

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const newCounts = { ...p.reaction_counts };
      if (existingReaction && existingReaction in newCounts) {
        newCounts[existingReaction as keyof typeof newCounts] = Math.max(0, newCounts[existingReaction as keyof typeof newCounts] - 1);
      }
      if (reactionType in newCounts) {
        newCounts[reactionType as keyof typeof newCounts]++;
      }
      return {
        ...p,
        user_reaction: reactionType,
        reaction_count: existingReaction ? p.reaction_count : p.reaction_count + 1,
        reaction_counts: newCounts
      };
    }));

    // Award points for first reaction
    if (!existingReaction) {
      awardPoints(1, 'post_reaction');
    }

    return { error: null };
  }, [user, posts, awardPoints]);

  const prayForPost = useCallback(async (postId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const post = posts.find(p => p.id === postId);
    if (post?.user_prayed) {
      // Remove prayer
      await supabase.from('prayer_interactions').delete().eq('post_id', postId).eq('user_id', user.id);
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, user_prayed: false, prayer_count: Math.max(0, p.prayer_count - 1) } : p
      ));
      return { error: null };
    }

    const { error } = await supabase.from('prayer_interactions').insert({ post_id: postId, user_id: user.id });
    if (error) return { error };

    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, user_prayed: true, prayer_count: p.prayer_count + 1 } : p
    ));

    // Award points and notify
    awardPoints(5, 'prayed_for_someone');
    if (post && post.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        actor_id: user.id,
        notification_type: 'prayer',
        title: 'Someone Prayed for You',
        message: 'is praying for your request',
        reference_id: postId,
        reference_type: 'post'
      });
    }

    toast.success('🙏 Praying for this request');
    return { error: null };
  }, [user, posts, awardPoints]);

  const votePoll = useCallback(async (postId: string, optionIndex: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const post = posts.find(p => p.id === postId);
    if (post?.user_poll_vote !== null) {
      toast.error('You have already voted');
      return { error: new Error('Already voted') };
    }

    const { error } = await supabase.from('poll_votes').insert({ 
      post_id: postId, 
      user_id: user.id, 
      option_index: optionIndex 
    });

    if (error) return { error };

    // Update local state
    setPosts(prev => prev.map(p => {
      if (p.id !== postId || !p.poll_data) return p;
      const newPollData = { ...p.poll_data };
      newPollData.options = newPollData.options.map((opt, idx) => 
        idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
      );
      return { ...p, user_poll_vote: optionIndex, poll_data: newPollData };
    }));

    awardPoints(1, 'poll_vote');
    return { error: null };
  }, [user, posts, awardPoints]);

  const createPost = useCallback(async (
    postType: PostType,
    postText: string,
    options: {
      mediaType?: string;
      mediaUrl?: string;
      contentData?: Record<string, unknown>;
      visibility?: 'public' | 'squad_only' | 'friends_only';
      squadId?: string;
      prayerUrgency?: PrayerUrgency;
      pollData?: PollData;
      tags?: string[];
    } = {}
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const result = await supabase.from('community_feed_posts').insert([{
      user_id: user.id,
      post_type: postType,
      post_text: postText,
      media_type: options.mediaType || null,
      media_url: options.mediaUrl || null,
      content_data: options.contentData as Record<string, never> || {},
      visibility: options.visibility || 'public',
      squad_id: options.squadId || null,
      is_user_generated: true
    }]);
    const error = result.error;

    if (error) {
      toast.error('Failed to create post');
      return { error };
    }

    // Award points based on post type
    const pointsMap: Record<string, number> = {
      text: 5,
      prayer_request: 10,
      image: 8,
      video: 12,
      music: 5,
      link: 5,
      poll: 10,
      testimony: 15
    };
    awardPoints(pointsMap[postType] || 5, `${postType}_post`);

    toast.success('Posted successfully! 🎉');
    fetchPosts(0);
    return { error: null };
  }, [user, awardPoints, fetchPosts]);

  const markPrayerAnswered = useCallback(async (postId: string, testimony: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('community_feed_posts')
      .update({
        is_answered: true,
        answered_at: new Date().toISOString(),
        answered_testimony: testimony
      })
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) return { error };

    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, is_answered: true, answered_testimony: testimony } : p
    ));

    awardPoints(30, 'prayer_answered');
    toast.success('🙌 Prayer marked as answered!');
    return { error: null };
  }, [user, awardPoints]);

  return {
    posts,
    loading,
    hasMore,
    filter,
    setFilter,
    loadMore,
    addReaction,
    prayForPost,
    votePoll,
    createPost,
    markPrayerAnswered,
    refetch: () => fetchPosts(0)
  };
}

function calculatePollExpiry(duration: PollData['duration']): string | null {
  if (duration === 'none') return null;
  const hours = { '24h': 24, '3d': 72, '7d': 168 }[duration];
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}
