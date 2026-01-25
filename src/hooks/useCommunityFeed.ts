import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FeedPost {
  id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  post_type: 'milestone' | 'answered_prayer' | 'testimony' | 'streak' | 'challenge_complete' | 'micro_action_combo' | 'user_post';
  content_data: Record<string, unknown>;
  visibility: 'public' | 'squad_only' | 'friends_only';
  squad_id: string | null;
  engagement_score: number;
  reaction_count: number;
  comment_count: number;
  share_count: number;
  is_pinned: boolean;
  created_at: string;
  user_reaction?: string | null;
  // Reaction counts by type
  reaction_counts?: {
    fire: number;
    praying: number;
    amen: number;
    strong: number;
    heart: number;
  };
  // New fields for user-generated posts
  is_user_generated?: boolean;
  post_text?: string | null;
  media_type?: string | null;
  media_url?: string | null;
  link_preview_data?: Record<string, unknown> | null;
}

export interface FeedReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'fire' | 'praying' | 'amen' | 'strong' | 'heart';
  created_at: string;
}

export interface FeedComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name?: string;
  comment_text: string;
  created_at: string;
}

export function useCommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'squad' | 'friends' | 'following'>('all');

  const PAGE_SIZE = 20;

  const fetchPosts = useCallback(async (offset = 0) => {
    if (!user) return;

    setLoading(true);

    let query = supabase
      .from('community_feed_posts')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    // Apply visibility filter based on tab
    if (filter === 'squad') {
      query = query.eq('visibility', 'squad_only');
    } else if (filter === 'friends') {
      query = query.eq('visibility', 'friends_only');
    }
    // 'following' filter would need a subquery for followed users - handled below

    const { data: postsData, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    // Fetch user profiles for posts
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, name')
      .in('user_id', userIds);

    // Fetch user's reactions AND all reactions for counts
    const postIds = postsData.map(p => p.id);
    const { data: userReactions } = await supabase
      .from('feed_reactions')
      .select('*')
      .in('post_id', postIds)
      .eq('user_id', user.id);
    
    // Fetch all reactions for each post to get counts by type
    const { data: allReactions } = await supabase
      .from('feed_reactions')
      .select('post_id, reaction_type')
      .in('post_id', postIds);

    // Calculate reaction counts per post per type
    const reactionCountsMap: Record<string, Record<string, number>> = {};
    allReactions?.forEach(r => {
      if (!reactionCountsMap[r.post_id]) {
        reactionCountsMap[r.post_id] = { fire: 0, praying: 0, amen: 0, strong: 0, heart: 0 };
      }
      if (r.reaction_type in reactionCountsMap[r.post_id]) {
        reactionCountsMap[r.post_id][r.reaction_type]++;
      }
    });

    // Map profiles and reactions to posts
    const enrichedPosts: FeedPost[] = postsData.map(post => {
      const profile = profiles?.find(p => p.user_id === post.user_id);
      const userReaction = userReactions?.find(r => r.post_id === post.id);
      const reactionCounts = reactionCountsMap[post.id] || { fire: 0, praying: 0, amen: 0, strong: 0, heart: 0 };

      return {
        ...post,
        user_name: profile?.name || 'Anonymous',
        user_reaction: userReaction?.reaction_type || null,
        reaction_counts: reactionCounts as FeedPost['reaction_counts'],
        post_text: post.post_text,
        is_user_generated: post.is_user_generated,
        media_type: post.media_type,
        media_url: post.media_url,
        link_preview_data: post.link_preview_data
      } as FeedPost;
    });

    if (offset === 0) {
      setPosts(enrichedPosts);
    } else {
      setPosts(prev => [...prev, ...enrichedPosts]);
    }

    setHasMore(postsData.length === PAGE_SIZE);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPosts(0);
    }
  }, [user, fetchPosts, filter]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('feed-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_feed_posts' },
        async (payload) => {
          // Fetch the new post with user info
          const { data: profile } = await supabase
            .from('public_profiles')
            .select('user_id, name')
            .eq('user_id', payload.new.user_id)
            .single();

          const newPost: FeedPost = {
            ...(payload.new as FeedPost),
            user_name: profile?.name || 'Anonymous',
            user_reaction: null
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

  const addReaction = useCallback(async (postId: string, reactionType: FeedReaction['reaction_type']) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if user already reacted
    const post = posts.find(p => p.id === postId);
    const existingReaction = post?.user_reaction as FeedReaction['reaction_type'] | null;

    if (existingReaction) {
      // Remove existing reaction
      await supabase
        .from('feed_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      // If same reaction, just remove
      if (existingReaction === reactionType) {
        setPosts(prev => prev.map(p => {
          if (p.id !== postId) return p;
          const newCounts = { ...p.reaction_counts };
          if (newCounts && existingReaction in newCounts) {
            newCounts[existingReaction] = Math.max(0, (newCounts[existingReaction] || 0) - 1);
          }
          return { 
            ...p, 
            user_reaction: null, 
            reaction_count: Math.max(0, p.reaction_count - 1),
            reaction_counts: newCounts
          };
        }));
        return { error: null };
      }
    }

    // Add new reaction
    const { error } = await supabase
      .from('feed_reactions')
      .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });

    if (error) {
      return { error };
    }

    // Update local state with new reaction counts
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const newCounts = { ...p.reaction_counts };
      // Decrement old reaction if exists
      if (newCounts && existingReaction && existingReaction in newCounts) {
        newCounts[existingReaction] = Math.max(0, (newCounts[existingReaction] || 0) - 1);
      }
      // Increment new reaction
      if (newCounts && reactionType in newCounts) {
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
      }
      return {
        ...p,
        user_reaction: reactionType,
        reaction_count: existingReaction ? p.reaction_count : p.reaction_count + 1,
        reaction_counts: newCounts
      };
    }));

    return { error: null };
  }, [user, posts]);

  const addComment = useCallback(async (postId: string, commentText: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    if (commentText.length > 280) {
      return { error: new Error('Comment too long') };
    }

    const { error } = await supabase
      .from('feed_comments')
      .insert({ post_id: postId, user_id: user.id, comment_text: commentText });

    if (error) {
      return { error };
    }

    // Update comment count
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comment_count: p.comment_count + 1 }
        : p
    ));

    toast.success('Comment added!');
    return { error: null };
  }, [user]);

  const getComments = useCallback(async (postId: string) => {
    const { data: comments, error } = await supabase
      .from('feed_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    // Get user names
    const userIds = [...new Set(comments.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, name')
      .in('user_id', userIds);

    const enrichedComments: FeedComment[] = comments.map(comment => ({
      ...comment,
      user_name: profiles?.find(p => p.user_id === comment.user_id)?.name || 'Anonymous'
    }));

    return { data: enrichedComments, error: null };
  }, []);

  const createPost = useCallback(async (
    postType: FeedPost['post_type'],
    contentData: Record<string, unknown>,
    visibility: FeedPost['visibility'] = 'public',
    squadId?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('community_feed_posts')
      .insert([{
        user_id: user.id,
        post_type: postType,
        content_data: contentData as unknown as Record<string, never>,
        visibility,
        squad_id: squadId || null
      }]);

    if (error) {
      return { error };
    }

    toast.success('Posted to feed!');
    return { error: null };
  }, [user]);

  return {
    posts,
    loading,
    hasMore,
    filter,
    setFilter,
    loadMore,
    addReaction,
    addComment,
    getComments,
    createPost,
    refetch: () => fetchPosts(0)
  };
}
