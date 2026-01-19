import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BookOwnershipStepProps {
  onHasBook: () => void;
  onNoBook: () => void;
}

export function BookOwnershipStep({ onHasBook, onNoBook }: BookOwnershipStepProps) {
  const [showBookInfo, setShowBookInfo] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in">
      <div className="space-y-3 text-center">
        <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
          Do You Have The Book?
        </h2>
        <p className="text-muted-foreground">
          The Faith Training Guide that goes with this app
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onHasBook}
          className={cn(
            "w-full p-6 rounded-xl border-2 transition-all duration-200 text-left",
            "border-primary bg-primary/10 hover:bg-primary/20",
            "relative overflow-hidden group"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-display text-lg uppercase tracking-wider text-primary">
                Yes, I Have The Book
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock premium features with your book code
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-warning animate-pulse" />
          </div>
        </button>

        <button
          onClick={onNoBook}
          className={cn(
            "w-full p-6 rounded-xl border-2 transition-all duration-200 text-left",
            "border-border hover:border-muted-foreground/50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display text-lg uppercase tracking-wider text-foreground">
                No, Not Yet
              </p>
              <p className="text-sm text-muted-foreground">
                Continue with free features
              </p>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={() => setShowBookInfo(true)}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
        What's the book?
      </button>

      <Dialog open={showBookInfo} onOpenChange={setShowBookInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl uppercase tracking-wider">
              The Faith Training Guide
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              The Faith Training Guide is the companion book that teaches you the <strong>WHY</strong> behind every practice in this app.
            </p>
            <div className="space-y-2">
              <p className="font-display uppercase text-sm text-foreground">What You'll Learn:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• How to build unshakeable faith through daily discipline</li>
                <li>• The secrets to powerful prayer and worship</li>
                <li>• How to overcome spiritual battles and temptation</li>
                <li>• Building a Scripture meditation practice</li>
                <li>• Creating lasting spiritual transformation</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning">
                <strong>Book Buyers Get:</strong> Lifetime premium access with exclusive audio devotionals and extended training plans.
              </p>
            </div>
            <Button
              onClick={() => window.open('#', '_blank')} // Placeholder link
              className="w-full btn-gym"
            >
              Get The Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
