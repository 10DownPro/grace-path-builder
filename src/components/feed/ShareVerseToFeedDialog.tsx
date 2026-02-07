import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { Send, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface ShareVerseToFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verse: {
    reference: string;
    text: string;
    book?: string;
    chapter?: number;
  };
}

export function ShareVerseToFeedDialog({ open, onOpenChange, verse }: ShareVerseToFeedDialogProps) {
  const [thoughts, setThoughts] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = useCommunityFeed();

  const handleShare = async () => {
    setIsSubmitting(true);

    const contentData = {
      verse_reference: verse.reference,
      verse_text: verse.text,
      verse_book: verse.book || null,
      verse_chapter: verse.chapter || null,
      user_thoughts: thoughts.trim() || null,
    };

    const { error } = await createPost('user_post', contentData, 'public');
    
    setIsSubmitting(false);
    
    if (error) {
      toast.error('Failed to share verse');
      return;
    }

    toast.success('Verse shared to The Trenches! 📖');
    setThoughts('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Share Verse to Feed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Verse Preview */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-primary uppercase tracking-wider mb-2 font-display">
              {verse.reference}
            </p>
            <p className="text-sm text-foreground italic leading-relaxed">
              "{verse.text}"
            </p>
          </div>

          {/* Your Thoughts */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your thoughts (optional)
            </label>
            <Textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="What does this verse mean to you? How is God speaking through it?"
              className="min-h-[80px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {thoughts.length}/500
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
