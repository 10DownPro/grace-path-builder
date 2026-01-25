import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Testimony, TestimonyComment, TESTIMONY_TYPE_CONFIG } from '@/hooks/useTestimonies';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, Share2, Send, ChevronDown, ChevronUp, 
  BookOpen, Star, Loader2 
} from 'lucide-react';

const TESTIMONY_REACTIONS = [
  { type: 'amen' as const, emoji: '🙏', label: 'Amen' },
  { type: 'fire' as const, emoji: '🔥', label: 'Fire' },
  { type: 'glory' as const, emoji: '✨', label: 'Glory' },
  { type: 'heart' as const, emoji: '❤️', label: 'Heart' },
  { type: 'praying' as const, emoji: 'Praying', label: 'Praying' },
];

interface TestimonyCardProps {
  testimony: Testimony;
  onReact: (testimonyId: string, type: 'amen' | 'fire' | 'praying' | 'glory' | 'heart') => Promise<{ error: Error | null } | void>;
  onComment: (testimonyId: string, text: string) => Promise<{ error: Error | null } | void>;
  onGetComments: (testimonyId: string) => Promise<TestimonyComment[]>;
  onShare?: (testimonyId: string) => Promise<{ error: Error | null } | void>;
  compact?: boolean;
}

export function TestimonyCard({ 
  testimony, 
  onReact, 
  onComment,
  onGetComments,
  onShare,
  compact = false
}: TestimonyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<TestimonyComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const typeConfig = TESTIMONY_TYPE_CONFIG[testimony.testimony_type];
  const isLongContent = testimony.testimony_text.length > 300;
  const displayContent = isExpanded || !isLongContent 
    ? testimony.testimony_text 
    : testimony.testimony_text.slice(0, 300) + '...';

  const handleLoadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    
    setIsLoadingComments(true);
    const loadedComments = await onGetComments(testimony.id);
    setComments(loadedComments);
    setShowComments(true);
    setIsLoadingComments(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsCommenting(true);
    await onComment(testimony.id, newComment);
    setNewComment('');
    const loadedComments = await onGetComments(testimony.id);
    setComments(loadedComments);
    setIsCommenting(false);
  };

  const totalReactions = Object.values(testimony.reaction_counts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border-2 transition-all duration-300",
      "border-success/30 bg-card",
      testimony.is_featured && "ring-2 ring-warning/50"
    )}>
      {/* Featured badge */}
      {testimony.is_featured && (
        <div className="absolute top-0 right-0 bg-warning text-warning-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-bl-lg">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />
      
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-success" />
              <span className="text-xs uppercase tracking-wider text-success font-display">
                Testimony
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className={cn("text-xs", typeConfig.color)}>
                {typeConfig.emoji} {typeConfig.label}
              </span>
            </div>
            <p className="font-medium text-sm">
              @{testimony.user_name} • {formatDistanceToNow(new Date(testimony.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
          {testimony.title}
        </h3>

        {/* Testimony content */}
        <div className="space-y-2">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{displayContent}</p>
          
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
                  Read full testimony
                </>
              )}
            </button>
          )}
        </div>

        {/* Related verse */}
        {testimony.related_verse_reference && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm font-medium text-success mb-1">
              📖 {testimony.related_verse_reference}
            </p>
            {testimony.related_verse_text && (
              <p className="text-sm text-muted-foreground italic">
                "{testimony.related_verse_text}"
              </p>
            )}
          </div>
        )}

        {/* Media gallery */}
        {testimony.media_urls && testimony.media_urls.length > 0 && (
          <div className={cn(
            "grid gap-2",
            testimony.media_urls.length === 1 && "grid-cols-1",
            testimony.media_urls.length === 2 && "grid-cols-2",
            testimony.media_urls.length >= 3 && "grid-cols-3"
          )}>
            {testimony.media_urls.map((url, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Reactions bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 flex-wrap">
            {TESTIMONY_REACTIONS.map(reaction => {
              const count = testimony.reaction_counts?.[reaction.type] || 0;
              const hasReacted = testimony.my_reactions?.includes(reaction.type);
              
              return (
                <button
                  key={reaction.type}
                  onClick={() => onReact(testimony.id, reaction.type)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all",
                    hasReacted 
                      ? "bg-success/20 text-success" 
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  {count > 0 && <span>{count}</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadComments}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80 text-muted-foreground"
            >
              <MessageCircle className="h-3 w-3" />
              {testimony.comment_count || 0}
            </button>

            {onShare && (
              <button
                onClick={() => onShare(testimony.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80 text-muted-foreground"
              >
                <Share2 className="h-3 w-3" />
                {testimony.share_count || 0}
              </button>
            )}
          </div>
        </div>

        {/* Comments section */}
        {showComments && !compact && (
          <div className="pt-3 space-y-3 border-t border-border/50">
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No comments yet. Share your encouragement!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-2 text-sm">
                        <span className="font-medium text-success">@{comment.user_name}</span>
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
                    className="shrink-0 bg-success hover:bg-success/90"
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
