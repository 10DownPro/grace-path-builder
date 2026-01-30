import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { MediaEmbed } from '@/components/feed/MediaEmbed';
import { FollowButton } from '@/components/social/FollowButton';
import { useAuth } from '@/hooks/useAuth';
import { CommunityPost } from '@/hooks/useCommunityPosts';
import { cn } from '@/lib/utils';
import { 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Send, 
  HandHeart,
  CheckCircle2,
  Flame,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface EnhancedFeedPostProps {
  post: CommunityPost;
  onReaction: (postId: string, reactionType: string) => Promise<{ error: Error | null }>;
  onPray: (postId: string) => Promise<{ error: Error | null }>;
  onVotePoll: (postId: string, optionIndex: number) => Promise<{ error: Error | null }>;
  onComment: (postId: string, text: string) => Promise<{ error: Error | null }>;
  onMarkAnswered?: (postId: string, testimony: string) => Promise<{ error: Error | null }>;
}

const REACTIONS = [
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'praying', emoji: '🙏', label: 'Praying' },
  { type: 'strong', emoji: '💪', label: 'Strong' },
  { type: 'heart', emoji: '❤️', label: 'Heart' },
  { type: 'lightbulb', emoji: '💡', label: 'Insightful' },
];

const URGENCY_CONFIG = {
  routine: { color: 'bg-muted text-foreground', label: 'Prayer Request' },
  urgent: { color: 'bg-orange-500/20 text-orange-500', label: 'Urgent Prayer' },
  crisis: { color: 'bg-red-500/20 text-red-500', label: 'Crisis Prayer' }
};

export function EnhancedFeedPost({ 
  post, 
  onReaction, 
  onPray, 
  onVotePoll,
  onComment,
  onMarkAnswered 
}: EnhancedFeedPostProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwnPost = user?.id === post.user_id;
  const isPrayerRequest = post.post_type === 'prayer_request' || 
    (post.content_data as Record<string, unknown>)?.is_prayer_request;
  const isPoll = post.post_type === 'poll' && post.poll_data;

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const { error } = await onComment(post.id, newComment.trim());
    if (!error) {
      setNewComment('');
    }
    setSubmitting(false);
  };

  const renderUrgencyBadge = () => {
    if (!isPrayerRequest) return null;
    const config = URGENCY_CONFIG[post.prayer_urgency];
    
    if (post.is_answered) {
      return (
        <Badge className="bg-green-500/20 text-green-500 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Answered Prayer
        </Badge>
      );
    }
    
    return (
      <Badge className={cn("gap-1", config.color)}>
        {post.prayer_urgency === 'crisis' && <AlertTriangle className="h-3 w-3" />}
        {post.prayer_urgency === 'urgent' && <Clock className="h-3 w-3" />}
        <HandHeart className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const renderPollContent = () => {
    if (!isPoll || !post.poll_data) return null;
    
    const totalVotes = post.poll_data.options.reduce((sum, opt) => sum + opt.votes, 0);
    const hasVoted = post.user_poll_vote !== null;
    const isExpired = post.poll_expires_at && new Date(post.poll_expires_at) < new Date();
    
    return (
      <div className="space-y-3 mt-3">
        <p className="font-medium">{post.poll_data.question}</p>
        
        {post.poll_data.options.map((option, idx) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isUserVote = post.user_poll_vote === idx;
          
          return (
            <button
              key={idx}
              onClick={() => !hasVoted && !isExpired && onVotePoll(post.id, idx)}
              disabled={hasVoted || isExpired}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all",
                hasVoted || isExpired
                  ? "cursor-default"
                  : "hover:border-primary/50 cursor-pointer",
                isUserVote && "border-primary bg-primary/5"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn("text-sm", isUserVote && "font-medium")}>
                  {option.text}
                  {isUserVote && " ✓"}
                </span>
                {(hasVoted || isExpired) && (
                  <span className="text-xs text-muted-foreground">
                    {percentage}% ({option.votes})
                  </span>
                )}
              </div>
              {(hasVoted || isExpired) && (
                <Progress value={percentage} className="h-1.5" />
              )}
            </button>
          );
        })}
        
        <p className="text-xs text-muted-foreground">
          {totalVotes} votes
          {post.poll_expires_at && !isExpired && (
            <> • Ends {formatDistanceToNow(new Date(post.poll_expires_at), { addSuffix: true })}</>
          )}
          {isExpired && <> • Poll ended</>}
        </p>
      </div>
    );
  };

  const renderAnsweredTestimony = () => {
    if (!post.is_answered || !post.answered_testimony) return null;
    
    return (
      <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <p className="text-sm font-medium text-green-500 mb-1">🙌 UPDATE:</p>
        <p className="text-sm">{post.answered_testimony}</p>
      </div>
    );
  };

  return (
    <Card className="border-2 border-border hover:border-primary/20 transition-colors">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
            {(post.user_name || 'A').charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{post.user_name}</span>
              {post.user_level && (
                <Badge variant="outline" className="text-xs">
                  Level {post.user_level}
                </Badge>
              )}
              {post.user_streak && post.user_streak > 0 && (
                <Badge variant="outline" className="text-xs gap-1 text-orange-500 border-orange-500/30">
                  <Flame className="h-3 w-3" />
                  {post.user_streak}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isOwnPost && <FollowButton userId={post.user_id} size="sm" />}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {renderUrgencyBadge()}
          {post.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Content */}
        <div>
          {post.post_text && (
            <p className="text-foreground whitespace-pre-wrap">{post.post_text}</p>
          )}
          
          {renderAnsweredTestimony()}
          
          <MediaEmbed 
            mediaType={post.media_type || undefined}
            mediaUrl={post.media_url || undefined}
            contentData={post.content_data}
          />
          
          {renderPollContent()}
        </div>

        {/* Prayer CTA */}
        {isPrayerRequest && !post.is_answered && (
          <Button 
            variant={post.user_prayed ? "default" : "outline"} 
            size="sm" 
            className="gap-2"
            onClick={() => onPray(post.id)}
          >
            🙏 {post.user_prayed ? "Praying" : "I'm Praying"}
            {post.prayer_count > 0 && (
              <span className="text-xs">({post.prayer_count})</span>
            )}
          </Button>
        )}

        {/* Mark as Answered (own posts only) */}
        {isPrayerRequest && isOwnPost && !post.is_answered && onMarkAnswered && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-green-500 border-green-500/30 hover:bg-green-500/10"
            onClick={() => {
              const testimony = prompt("Share how God answered this prayer:");
              if (testimony) {
                onMarkAnswered(post.id, testimony);
              }
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Answered
          </Button>
        )}

        {/* Reactions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 flex-wrap">
            {REACTIONS.map((reaction) => {
              const count = post.reaction_counts?.[reaction.type as keyof typeof post.reaction_counts] || 0;
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
              onClick={() => setShowComments(!showComments)}
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
