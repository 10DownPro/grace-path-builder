import { useState } from 'react';
import { FeedPost as FeedPostType, FeedComment } from '@/hooks/useCommunityFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MediaEmbed } from './MediaEmbed';
import { cn } from '@/lib/utils';
import { MessageCircle, Share2, MoreHorizontal, Send, Pencil, HandHeart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedPostProps {
  post: FeedPostType;
  onReaction: (postId: string, reactionType: 'fire' | 'praying' | 'amen' | 'strong' | 'heart') => Promise<{ error: Error | null }>;
  onComment: (postId: string, text: string) => Promise<{ error: Error | null }>;
  onGetComments: (postId: string) => Promise<{ data: FeedComment[] | null; error: Error | null }>;
}

const REACTIONS = [
  { type: 'fire' as const, emoji: '🔥', label: 'Fire' },
  { type: 'praying' as const, emoji: '🙏', label: 'Praying' },
  { type: 'strong' as const, emoji: '💪', label: 'Strong' },
  { type: 'heart' as const, emoji: '❤️', label: 'Heart' },
];

const POST_TYPE_CONFIG: Record<string, { badge: string; emoji: string; color: string }> = {
  milestone: { badge: 'Milestone', emoji: '🏆', color: 'bg-yellow-500/20 text-yellow-600' },
  answered_prayer: { badge: 'Prayer Answered', emoji: '✨', color: 'bg-purple-500/20 text-purple-500' },
  testimony: { badge: 'Post', emoji: '✍️', color: 'bg-blue-500/20 text-blue-500' },
  streak: { badge: 'Streak', emoji: '🔥', color: 'bg-orange-500/20 text-orange-500' },
  challenge_complete: { badge: 'Challenge', emoji: '⚔️', color: 'bg-green-500/20 text-green-500' },
  micro_action_combo: { badge: 'Combo', emoji: '⚡', color: 'bg-primary/20 text-primary' },
  user_post: { badge: 'Post', emoji: '✍️', color: 'bg-muted text-foreground' },
};

export function FeedPost({ post, onReaction, onComment, onGetComments }: FeedPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const config = POST_TYPE_CONFIG[post.post_type] || POST_TYPE_CONFIG.testimony;
  const contentData = post.content_data as Record<string, unknown>;

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      const { data } = await onGetComments(post.id);
      if (data) {
        setComments(data);
      }
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    const { error } = await onComment(post.id, newComment.trim());
    setSubmitting(false);

    if (!error) {
      setNewComment('');
      // Refresh comments
      const { data } = await onGetComments(post.id);
      if (data) {
        setComments(data);
      }
    }
  };

  const renderPostContent = () => {
    // Check if this is a user-generated post with text
    const userText = post.post_text || (contentData.text as string);
    const isPrayerRequest = contentData.is_prayer_request as boolean;
    
    // User-generated content with media
    if (post.is_user_generated || userText) {
      return (
        <div className="space-y-3">
          {/* Prayer request banner */}
          {isPrayerRequest && (
            <div className="flex items-center gap-2 text-primary">
              <HandHeart className="h-4 w-4" />
              <span className="text-sm font-medium">Prayer Request</span>
            </div>
          )}
          
          {/* Post text */}
          {userText && (
            <p className="text-foreground whitespace-pre-wrap">{userText}</p>
          )}
          
          {/* Media embed */}
          <MediaEmbed 
            mediaType={post.media_type || undefined}
            mediaUrl={post.media_url || undefined}
            contentData={contentData}
          />

          {/* Prayer button for prayer requests */}
          {isPrayerRequest && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => onReaction(post.id, 'praying')}
            >
              🙏 I'm Praying
            </Button>
          )}
        </div>
      );
    }
    
    // System-generated posts (milestones, streaks, etc.)
    switch (post.post_type) {
      case 'milestone':
        return (
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {String(contentData.milestone_name || 'Achievement Unlocked')}
            </p>
            {contentData.scripture_verse && (
              <p className="text-sm text-muted-foreground italic">
                "{String(contentData.scripture_verse)}"
              </p>
            )}
            {contentData.days_count && (
              <Badge variant="secondary">{String(contentData.days_count)} days</Badge>
            )}
          </div>
        );

      case 'answered_prayer':
        return (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {String(contentData.testimony || 'Prayer has been answered!')}
            </p>
            {contentData.days_prayed && (
              <p className="text-sm">
                Prayed for <strong>{String(contentData.days_prayed)} days</strong>
              </p>
            )}
          </div>
        );

      case 'streak':
        return (
          <div className="text-center py-4">
            <div className="text-5xl mb-2">🔥</div>
            <p className="text-2xl font-display font-bold text-primary">
              {String(contentData.streak_count || 0)} DAY STREAK
            </p>
            <p className="text-muted-foreground text-sm mt-1">NO DAYS OFF</p>
          </div>
        );

      case 'challenge_complete':
        return (
          <div className="space-y-2">
            <p className="font-semibold">
              Completed: {String(contentData.challenge_name || 'Challenge')}
            </p>
            {contentData.points_earned && (
              <Badge className="bg-success/20 text-success">
                +{String(contentData.points_earned)} pts
              </Badge>
            )}
          </div>
        );

      case 'testimony':
        return (
          <div className="space-y-2">
            {contentData.verse_reference && (
              <p className="text-sm font-medium text-primary">
                {String(contentData.verse_reference)}
              </p>
            )}
            <p className="text-muted-foreground">
              {String(contentData.reflection_text || contentData.text || '')}
            </p>
            <MediaEmbed 
              mediaType={post.media_type || undefined}
              mediaUrl={post.media_url || undefined}
              contentData={contentData}
            />
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground">
            {contentData.text ? String(contentData.text) : JSON.stringify(contentData)}
          </p>
        );
    }
  };

  return (
    <Card className="border-2 border-border hover:border-primary/20 transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
            {(post.user_name || 'A').charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{post.user_name || 'Anonymous'}</span>
              {post.is_user_generated && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Pencil className="h-3 w-3" />
                  Post
                </Badge>
              )}
              {!post.is_user_generated && (
                <Badge className={cn("text-xs", config.color)}>
                  {config.emoji} {config.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="pl-0">
          {renderPostContent()}
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 flex-wrap">
            {REACTIONS.map((reaction) => {
              const count = post.reaction_counts?.[reaction.type] || 0;
              const isUserReaction = post.user_reaction === reaction.type;
              
              return (
                <button
                  key={reaction.type}
                  onClick={() => onReaction(post.id, reaction.type)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all",
                    "hover:bg-muted active:scale-95",
                    isUserReaction && "bg-primary/20 border border-primary/40"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  {count > 0 && (
                    <span className={cn(
                      "text-xs",
                      isUserReaction ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleComments}
              className="text-xs gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              {post.comment_count > 0 && post.comment_count}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-border">
            {loadingComments ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No comments yet. Be the first!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {(comment.user_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium">{comment.user_name}</p>
                      <p className="text-sm">{comment.comment_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value.slice(0, 280))}
                placeholder="Write a comment..."
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              />
              <Button
                size="icon"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {newComment.length}/280
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
