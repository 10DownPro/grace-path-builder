import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Download, BookOpen, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface FreeChapterUnlockedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

export function FreeChapterUnlockedDialog({ 
  open, 
  onOpenChange, 
  onDownload 
}: FreeChapterUnlockedDialogProps) {
  
  useEffect(() => {
    if (open) {
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ea580c', '#fb923c', '#ffedd5'],
      });
    }
  }, [open]);

  const handleDownload = () => {
    onDownload();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-2 border-warning bg-card">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Gift icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center animate-pulse">
            <Gift className="h-10 w-10 text-warning" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center space-y-4">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
              GIFT UNLOCKED
            </h2>
            <p className="text-warning font-medium mt-1">🎁 7-Day Streak Achievement!</p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              You completed your first week of training. That takes discipline.
            </p>
            <p className="text-muted-foreground">
              Here's <span className="text-foreground font-medium">Chapter 1</span> of the Faith Training Guide as a reward.
            </p>
          </div>

          {/* Book preview */}
          <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-16 rounded bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-warning-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-foreground text-sm">Faith Training Guide</p>
              <p className="text-xs text-muted-foreground">Chapter 1: The Foundation</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleDownload}
              className="w-full btn-gym"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="font-display uppercase tracking-wider">Download Free Chapter</span>
            </Button>
            
            <button
              onClick={() => onOpenChange(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
