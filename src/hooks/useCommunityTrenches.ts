import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityTopic {
  id: string;
  topic_date: string;
  topic_text: string;
  topic_category: string;
  related_scripture_reference: string | null;
  related_scripture_text: string | null;
  is_active: boolean;
  comment_count: number;
  created_at: string;
}

export interface CommunityComment {
  id: string;
  topic_id: string;
  user_id: string;
  comment_text: string;
  parent_comment_id: string | null;
  depth: number;
  upvotes: number;
  downvotes: number;
  is_thoughtful_pick: boolean;
  is_flagged: boolean;
  is_hidden: boolean;
  word_count: number;
  has_scripture: boolean;
  created_at: string;
  edited_at: string | null;
  // Joined data
  user_name?: string;
  user_streak?: number;
  user_level?: string;
  replies?: CommunityComment[];
  reactions?: CommentReaction[];
  user_vote?: number | null;
}

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

interface CommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  vote_type: number;
}

export type SortOption = 'recent' | 'top' | 'controversial';

const CATEGORY_LABELS: Record<string, string> = {
  theology: 'THEOLOGY',
  practical_faith: 'PRACTICAL FAITH',
  cultural_issues: 'CULTURAL ISSUES',
  personal_struggles: 'PERSONAL STRUGGLES',
  hot_takes: 'HOT TAKES',
  scripture_application: 'SCRIPTURE APPLICATION',
  rest: 'REST DAY'
};

const CATEGORY_SCHEDULE: Record<number, string> = {
  0: 'rest',
  1: 'theology',
  2: 'practical_faith',
  3: 'cultural_issues',
  4: 'personal_struggles',
  5: 'hot_takes',
  6: 'scripture_application'
};

export function useCommunityTrenches() {
  const { user } = useAuth();
  const [topic, setTopic] = useState<CommunityTopic | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('top');

  const fetchTodaysTopic = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await (supabase
        .from('daily_community_topics' as any)
        .select('*')
        .eq('topic_date', today)
        .eq('is_active', true)
        .maybeSingle()) as { data: CommunityTopic | null; error: any };

      if (error) throw error;
      setTopic(data);
    } catch (err) {
      console.error('Error fetching topic:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComments = useCallback(async (topicId: string) => {
    if (!topicId) return;
    
    try {
      setCommentsLoading(true);
      
      const { data: commentsData, error: commentsError } = await (supabase
        .from('community_comments' as any)
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })) as { data: CommunityComment[] | null; error: any };

      if (commentsError) throw commentsError;

      const userIds = [...new Set((commentsData || []).map(c => c.user_id))];
      
      let profiles: Record<string, { name: string }> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, name')
          .in('user_id', userIds);
        
        profiles = (profilesData || []).reduce((acc, p) => {
          acc[p.user_id] = { name: p.name };
          return acc;
        }, {} as Record<string, { name: string }>);
      }

      const commentIds = (commentsData || []).map(c => c.id);
      let reactions: CommentReaction[] = [];
      if (commentIds.length > 0) {
        const { data: reactionsData } = await (supabase
          .from('comment_reactions' as any)
          .select('*')
          .in('comment_id', commentIds)) as { data: CommentReaction[] | null; error: any };
        reactions = reactionsData || [];
      }

      let userVotes: Record<string, number> = {};
      if (user && commentIds.length > 0) {
        const { data: votesData } = await (supabase
          .from('comment_votes' as any)
          .select('comment_id, vote_type')
          .eq('user_id', user.id)
          .in('comment_id', commentIds)) as { data: CommentVote[] | null; error: any };
        
        userVotes = (votesData || []).reduce((acc, v) => {
          acc[v.comment_id] = v.vote_type;
          return acc;
        }, {} as Record<string, number>);
      }

      const enrichedComments: CommunityComment[] = (commentsData || []).map(c => ({
        ...c,
        user_name: profiles[c.user_id]?.name || 'Anonymous',
        reactions: reactions.filter(r => r.comment_id === c.id),
        user_vote: userVotes[c.id] || null,
        replies: []
      }));

      const commentMap = new Map<string, CommunityComment>();
      const topLevelComments: CommunityComment[] = [];

      enrichedComments.forEach(c => commentMap.set(c.id, c));
      
      enrichedComments.forEach(c => {
        if (c.parent_comment_id && commentMap.has(c.parent_comment_id)) {
          const parent = commentMap.get(c.parent_comment_id)!;
          parent.replies = parent.replies || [];
          parent.replies.push(c);
        } else if (!c.parent_comment_id) {
          topLevelComments.push(c);
        }
      });

      const sortComments = (arr: CommunityComment[]) => {
        return arr.sort((a, b) => {
          if (sortBy === 'top') {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
          } else if (sortBy === 'controversial') {
            const aScore = Math.min(a.upvotes, a.downvotes);
            const bScore = Math.min(b.upvotes, b.downvotes);
            return bScore - aScore;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      };

      const sortedComments = sortComments(topLevelComments);
      sortedComments.forEach(c => {
        if (c.replies) {
          c.replies = sortComments(c.replies);
        }
      });

      setComments(sortedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [user, sortBy]);

  useEffect(() => {
    fetchTodaysTopic();
  }, [fetchTodaysTopic]);

  useEffect(() => {
    if (topic?.id) {
      fetchComments(topic.id);
    }
  }, [topic?.id, fetchComments]);

  useEffect(() => {
    if (!topic?.id) return;

    const channel = supabase
      .channel('community-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_comments',
          filter: `topic_id=eq.${topic.id}`
        },
        () => {
          fetchComments(topic.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topic?.id, fetchComments]);

  const addComment = async (text: string, parentId?: string) => {
    if (!user || !topic) {
      toast.error('Please log in to comment');
      return false;
    }

    try {
      const parentComment = parentId 
        ? comments.find(c => c.id === parentId) || 
          comments.flatMap(c => c.replies || []).find(c => c.id === parentId)
        : null;
      
      const depth = parentComment ? Math.min(parentComment.depth + 1, 3) : 0;

      const { error } = await (supabase
        .from('community_comments' as any)
        .insert({
          topic_id: topic.id,
          user_id: user.id,
          comment_text: text,
          parent_comment_id: parentId || null,
          depth
        })) as { error: any };

      if (error) throw error;
      
      toast.success('Comment posted!');
      return true;
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment');
      return false;
    }
  };

  const voteComment = async (commentId: string, voteType: 1 | -1) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      const { data: existingVote } = await (supabase
        .from('comment_votes' as any)
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle()) as { data: CommentVote | null; error: any };

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          await (supabase
            .from('comment_votes' as any)
            .delete()
            .eq('id', existingVote.id));
        } else {
          await (supabase
            .from('comment_votes' as any)
            .update({ vote_type: voteType })
            .eq('id', existingVote.id));
        }
      } else {
        await (supabase
          .from('comment_votes' as any)
          .insert({
            comment_id: commentId,
            user_id: user.id,
            vote_type: voteType
          }));
      }

      if (topic?.id) {
        fetchComments(topic.id);
      }
    } catch (err) {
      console.error('Error voting:', err);
      toast.error('Failed to vote');
    }
  };

  const addReaction = async (commentId: string, reactionType: string) => {
    if (!user) {
      toast.error('Please log in to react');
      return;
    }

    try {
      const { data: existing } = await (supabase
        .from('comment_reactions' as any)
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle()) as { data: CommentReaction | null; error: any };

      if (existing) {
        await (supabase
          .from('comment_reactions' as any)
          .delete()
          .eq('id', existing.id));
      } else {
        await (supabase
          .from('comment_reactions' as any)
          .insert({
            comment_id: commentId,
            user_id: user.id,
            reaction_type: reactionType
          }));
      }

      if (topic?.id) {
        fetchComments(topic.id);
      }
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  const reportComment = async (commentId: string, reason: string) => {
    if (!user) {
      toast.error('Please log in to report');
      return;
    }

    try {
      await (supabase
        .from('comment_reports' as any)
        .insert({
          comment_id: commentId,
          reported_by_user_id: user.id,
          reason
        }));

      toast.success('Comment reported. Thank you for helping keep our community safe.');
    } catch (err) {
      console.error('Error reporting:', err);
      toast.error('Failed to report comment');
    }
  };

  const editComment = async (commentId: string, newText: string) => {
    if (!user) return false;

    try {
      const { error } = await (supabase
        .from('community_comments' as any)
        .update({ 
          comment_text: newText,
          edited_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user.id)) as { error: any };

      if (error) throw error;
      
      toast.success('Comment updated');
      if (topic?.id) {
        fetchComments(topic.id);
      }
      return true;
    } catch (err) {
      console.error('Error editing comment:', err);
      toast.error('Failed to edit comment');
      return false;
    }
  };

  const getCategoryLabel = (category: string) => CATEGORY_LABELS[category] || category.toUpperCase();
  const getTodaysCategory = () => CATEGORY_SCHEDULE[new Date().getDay()];

  return {
    topic,
    comments,
    loading,
    commentsLoading,
    sortBy,
    setSortBy,
    addComment,
    voteComment,
    addReaction,
    reportComment,
    editComment,
    getCategoryLabel,
    getTodaysCategory,
    refetch: fetchTodaysTopic
  };
}
