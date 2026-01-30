import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Flag, 
  MoreHorizontal,
  Pencil,
  Flame,
  Sparkles,
  Heart,
  Lightbulb,
  HelpCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommunityComment } from '@/hooks/useCommunityTrenches';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface CommentThreadProps {
  comment: CommunityComment;
  onVote: (commentId: string, voteType: 1 | -1) => void;
  onReply: (text: string, parentId: string) => Promise<boolean>;
  onReact: (commentId: string, reactionType: string) => void;
  onReport: (commentId: string, reason: string) => void;
  onEdit: (commentId: string, newText: string) => Promise<boolean>;
  depth?: number;
}

const REACTIONS = [
  { type: 'fire', emoji: '🔥', label: 'Fire' },
  { type: 'muscle', emoji: '💪', label: 'Strong' },
  { type: 'pray', emoji: '🙏', label: 'Praying' },
  { type: 'lightbulb', emoji: '💡', label: 'Insightful' },
  { type: 'thinking', emoji: '🤔', label: 'Thinking' },
  { type: 'heart', emoji: '❤️', label: 'Love' },
];

const REPORT_REASONS = [
  'Inappropriate language',
  'Personal attack',
  'Spam or self-promotion',
  'Misinformation',
  'Off-topic',
  'Other'
];

export function CommentThread({ 
  comment, 
  onVote, 
  onReply, 
  onReact, 
  onReport,
  onEdit,
  depth = 0 
}: CommentThreadProps) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);

  const score = comment.upvotes - comment.downvotes;
  const isOwnComment = user?.id === comment.user_id;
  const canReply = depth < 3;
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

  // Group reactions by type with counts
  const reactionCounts = REACTIONS.reduce((acc, r) => {
    const count = comment.reactions?.filter(cr => cr.reaction_type === r.type).length || 0;
    if (count > 0) {
      acc[r.type] = count;
    }
    return acc;
  }, {} as Record<string, number>);

  const userReactions = comment.reactions?.filter(r => r.user_id === user?.id).map(r => r.reaction_type) || [];

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    const success = await onReply(replyText, comment.id);
    if (success) {
      setReplyText('');
      setShowReply(false);
    }
    setSubmitting(false);
  };

  const handleSubmitEdit = async () => {
    if (!editText.trim()) return;
    setSubmitting(true);
    const success = await onEdit(comment.id, editText);
    if (success) {
      setIsEditing(false);
    }
    setSubmitting(false);
  };

  const handleReport = () => {
    if (reportReason) {
      onReport(comment.id, reportReason);
      setShowReportDialog(false);
      setReportReason('');
    }
  };

  return (
    <div className={cn(
      "relative",
      depth > 0 && "ml-4 pl-4 border-l-2 border-border"
    )}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm text-foreground">
            {comment.user_name}
          </span>
          {comment.is_thoughtful_pick && (
            <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              <Star className="h-3 w-3 mr-1" />
              Thoughtful
            </Badge>
          )}
          {comment.has_scripture && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">
              📖 Scripture
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {comment.edited_at && (
            <span className="text-xs text-muted-foreground italic">(edited)</span>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mb-3">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[80px] mb-2"
              maxLength={2000}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmitEdit} disabled={submitting}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsEditing(false);
                setEditText(comment.comment_text);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 mb-3 whitespace-pre-wrap">
            {comment.comment_text}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Voting */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7",
                comment.user_vote === 1 && "text-green-500"
              )}
              onClick={() => onVote(comment.id, 1)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className={cn(
              "text-sm font-medium min-w-[20px] text-center",
              score > 0 && "text-green-500",
              score < 0 && "text-red-500"
            )}>
              {score}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7",
                comment.user_vote === -1 && "text-red-500"
              )}
              onClick={() => onVote(comment.id, -1)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-1">
            {Object.entries(reactionCounts).map(([type, count]) => {
              const reaction = REACTIONS.find(r => r.type === type);
              return (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs",
                    userReactions.includes(type) && "bg-primary/20"
                  )}
                  onClick={() => onReact(comment.id, type)}
                >
                  {reaction?.emoji} {count}
                </Button>
              );
            })}
            
            <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  +
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {REACTIONS.map((r) => (
                  <DropdownMenuItem
                    key={r.type}
                    onClick={() => {
                      onReact(comment.id, r.type);
                      setShowReactions(false);
                    }}
                  >
                    <span className="mr-2">{r.emoji}</span>
                    {r.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply */}
          {canReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={() => setShowReply(!showReply)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnComment && (
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {!isOwnComment && (
                <DropdownMenuItem 
                  onClick={() => setShowReportDialog(true)}
                  className="text-destructive"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reply input */}
        {showReply && (
          <div className="mt-3 pl-4 border-l-2 border-primary/30">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px] mb-2"
              maxLength={2000}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmitReply} disabled={submitting || !replyText.trim()}>
                Post Reply
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowReply(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onVote={onVote}
              onReply={onReply}
              onReact={onReact}
              onReport={onReport}
              onEdit={onEdit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
            <DialogDescription>
              Why are you reporting this comment?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {REPORT_REASONS.map((reason) => (
              <Button
                key={reason}
                variant={reportReason === reason ? "default" : "outline"}
                className="justify-start"
                onClick={() => setReportReason(reason)}
              >
                {reason}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport} disabled={!reportReason}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
