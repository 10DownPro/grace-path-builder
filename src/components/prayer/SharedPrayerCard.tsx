import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SharedPrayer, PrayerComment } from '@/hooks/usePrayerSocial';
import { prayerTypeConfig } from './PrayerCard';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, MessageCircle, Users, Send, ChevronDown, ChevronUp, 
  Flame, ThumbsUp, Loader2 
} from 'lucide-react';

const PRAYER_REACTIONS = [
  { type: 'praying' as const, emoji: '🙏', label: 'Praying' },
  { type: 'amen' as const, emoji: 'Amen', label: 'Amen' },
  { type: 'heart' as const, emoji: '❤️', label: 'Heart' },
  { type: 'strong' as const, emoji: '💪', label: 'Strong' },
];

interface SharedPrayerCardProps {
  prayer: SharedPrayer;
  onSupport: (prayerId: string) => Promise<void>;
  onReact: (prayerId: string, type: 'praying' | 'amen' | 'heart' | 'strong') => Promise<void>;
  onComment: (prayerId: string, text: string) => Promise<void>;
  onGetComments: (prayerId: string) => Promise<PrayerComment[]>;
  isCurrentUser?: boolean;
}

export function SharedPrayerCard({ 
  prayer, 
  onSupport, 
  onReact, 
  onComment,
  onGetComments,
  isCurrentUser 
}: SharedPrayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PrayerComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSupporting, setIsSupporting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const config = prayerTypeConfig[prayer.type as keyof typeof prayerTypeConfig] || prayerTypeConfig.supplication;
  const Icon = config.icon;
  const isLongContent = prayer.content.length > 200;
  const displayContent = isExpanded || !isLongContent 
    ? prayer.content 
    : prayer.content.slice(0, 200) + '...';

  const handleLoadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    
    setIsLoadingComments(true);
    const loadedComments = await onGetComments(prayer.id);
    setComments(loadedComments);
    setShowComments(true);
    setIsLoadingComments(false);
  };

  const handleSupport = async () => {
    setIsSupporting(true);
    await onSupport(prayer.id);
    setIsSupporting(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    await onComment(prayer.id, newComment);
    setNewComment('');
    const loadedComments = await onGetComments(prayer.id);
    setComments(loadedComments);
    setIsCommenting(false);
  };

  const totalReactions = Object.values(prayer.reaction_counts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border-2 border-l-4 transition-all duration-300",
      config.borderColor,
      prayer.answered 
        ? "border-success/40 bg-success/5" 
        : "border-border bg-card"
    )}>
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-30",
        config.gradient
      )} />
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              config.iconBg
            )}>
              <Icon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div>
              <p className="font-medium text-sm">@{prayer.user_name}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs uppercase tracking-wider", config.iconColor)}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {formatDistanceToNow(new Date(prayer.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {prayer.answered && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs">
              <Heart className="h-3 w-3 fill-current" />
              Answered
            </div>
          )}
        </div>
        
        {/* Prayer content */}
        <div className="space-y-2">
          <p className="text-foreground/90 leading-relaxed">{displayContent}</p>
          
          {isLongContent && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>

        {/* Answered testimony */}
        {prayer.answered && prayer.answered_note && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm text-success font-medium mb-1">
              How God answered:
            </p>
            <p className="text-sm text-muted-foreground italic">
              "{prayer.answered_note}"
            </p>
          </div>
        )}

        {/* Support count & I'm Praying button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{prayer.supporter_count || 0} people praying</span>
          </div>

          {!isCurrentUser && !prayer.is_supporting && (
            <Button 
              size="sm"
              onClick={handleSupport}
              disabled={isSupporting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSupporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <span className="mr-1">🙏</span>
              )}
              I'm Praying
            </Button>
          )}

          {prayer.is_supporting && (
            <span className="text-sm text-success flex items-center gap-1">
              ✓ You're praying
            </span>
          )}
        </div>

        {/* Reactions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {PRAYER_REACTIONS.map(reaction => {
              const count = prayer.reaction_counts?.[reaction.type] || 0;
              const hasReacted = prayer.my_reactions?.includes(reaction.type);
              
              return (
                <button
                  key={reaction.type}
                  onClick={() => onReact(prayer.id, reaction.type)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all",
                    hasReacted 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  {count > 0 && <span>{count}</span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLoadComments}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            <MessageCircle className="h-3 w-3" />
            {prayer.comment_count || 0}
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="pt-3 space-y-3 border-t border-border/50">
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No comments yet. Be the first to encourage!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-2 text-sm">
                        <span className="font-medium text-primary">@{comment.user_name}</span>
                        <span className="text-foreground/80">{comment.comment_text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write encouragement..."
                    className="min-h-[60px] text-sm resize-none"
                    maxLength={280}
                  />
                  <Button
                    size="icon"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isCommenting}
                    className="shrink-0"
                  >
                    {isCommenting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
