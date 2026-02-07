import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { PrayerEntry } from '@/types/faith';
import { Send, Target } from 'lucide-react';
import { toast } from 'sonner';

interface SharePrayerToFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prayer: PrayerEntry;
}

export function SharePrayerToFeedDialog({ open, onOpenChange, prayer }: SharePrayerToFeedDialogProps) {
  const [additionalContext, setAdditionalContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = useCommunityFeed();

  const handleShare = async () => {
    setIsSubmitting(true);
    
    const postText = additionalContext.trim() 
      ? `${additionalContext}\n\n🙏 ${prayer.content}`
      : `🙏 ${prayer.content}`;

    const contentData = {
      prayer_content: prayer.content,
      prayer_type: prayer.type,
      additional_context: additionalContext.trim() || null,
      is_answered: prayer.answered,
      answered_note: prayer.answeredNote || null,
    };

    const { error } = await createPost('user_post', contentData, 'public');
    
    setIsSubmitting(false);
    
    if (error) {
      toast.error('Failed to share prayer');
      return;
    }

    toast.success('Prayer shared to The Trenches! 🙏');
    setAdditionalContext('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Share Prayer to Feed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Prayer Preview */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Your Prayer
            </p>
            <p className="text-sm text-foreground">{prayer.content}</p>
            {prayer.answered && prayer.answeredNote && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-success">✓ Answered: {prayer.answeredNote}</p>
              </div>
            )}
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Add context (optional)
            </label>
            <Textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Share why this prayer is important to you, or ask others to pray with you..."
              className="min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {additionalContext.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              className="flex-1"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sharing...' : 'Share'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
