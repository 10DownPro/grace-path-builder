import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMicroActions } from '@/hooks/useMicroActions';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { ChevronLeft, ChevronRight, Bookmark, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerseSnackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ENCOURAGING_VERSES = [
  { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." },
  { reference: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God." },
  { reference: "Psalm 23:4", text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me." },
  { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God." },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { reference: "Joshua 1:9", text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee." },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { reference: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
  { reference: "2 Timothy 1:7", text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." }
];

export function VerseSnackDialog({ open, onOpenChange }: VerseSnackDialogProps) {
  const { completeMicroAction } = useMicroActions();
  const { lightTap, successPattern } = useHapticFeedback();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [versesConsumed, setVersesConsumed] = useState(0);

  const currentVerse = ENCOURAGING_VERSES[currentIndex];

  useEffect(() => {
    if (open) {
      // Randomize starting verse
      setCurrentIndex(Math.floor(Math.random() * ENCOURAGING_VERSES.length));
      setSaved(false);
    }
  }, [open]);

  const handleNext = () => {
    lightTap();
    setCurrentIndex((prev) => (prev + 1) % ENCOURAGING_VERSES.length);
    setSaved(false);
  };

  const handlePrev = () => {
    lightTap();
    setCurrentIndex((prev) => (prev - 1 + ENCOURAGING_VERSES.length) % ENCOURAGING_VERSES.length);
    setSaved(false);
  };

  const handleSave = async () => {
    if (saved) return;

    const { error } = await completeMicroAction('verse_snack', {
      verse_reference: currentVerse.reference,
      verse_text: currentVerse.text
    });

    if (!error) {
      setSaved(true);
      setVersesConsumed(prev => prev + 1);
      successPattern();
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            📖 Verse Snack
            <span className="text-sm text-primary font-normal">+3 pts</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Counter */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Quick encouragement</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {versesConsumed} consumed today
            </span>
          </div>

          {/* Verse Card */}
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 min-h-[180px] flex flex-col justify-center border-2 border-border">
            <blockquote className="text-center space-y-3">
              <p className="text-lg font-medium leading-relaxed italic">
                "{currentVerse.text}"
              </p>
              <footer className="text-sm text-primary font-bold">
                — {currentVerse.reference}
              </footer>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant={saved ? "default" : "golden"}
              onClick={handleSave}
              disabled={saved}
              className="gap-2"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save Verse
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Swipe through verses and save your favorites
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
