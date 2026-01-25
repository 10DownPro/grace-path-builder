import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMicroActions } from '@/hooks/useMicroActions';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { Loader2, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GratitudeNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you thankful for right now?",
  "What blessing did you receive today?",
  "What simple joy are you grateful for?",
  "What answered prayer are you thankful for?"
];

export function GratitudeNoteDialog({ open, onOpenChange }: GratitudeNoteDialogProps) {
  const { completeMicroAction } = useMicroActions();
  const { successPattern } = useHapticFeedback();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [promptIndex] = useState(() => Math.floor(Math.random() * GRATITUDE_PROMPTS.length));

  const handleSubmit = async () => {
    if (!note.trim()) return;

    setLoading(true);
    const { error } = await completeMicroAction('gratitude_note', {
      note: note.trim(),
      prompt: GRATITUDE_PROMPTS[promptIndex]
    });
    setLoading(false);

    if (!error) {
      setCompleted(true);
      successPattern();
      confetti({
        particleCount: 80,
        spread: 100,
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setCompleted(false);
        setNote('');
        onOpenChange(false);
      }, 1500);
    }
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setNote('');
      setCompleted(false);
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            ✨ Gratitude Note
            <span className="text-sm text-primary font-normal">+8 pts</span>
          </DialogTitle>
        </DialogHeader>

        {completed ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center animate-scale-in">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-yellow-500">Gratitude Recorded!</p>
            <p className="text-sm text-muted-foreground text-center">
              Thankfulness transforms your perspective
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Prompt */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
              <p className="text-sm font-medium text-center">
                {GRATITUDE_PROMPTS[promptIndex]}
              </p>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="I'm grateful for..."
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 100))}
                className="h-24 resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {note.length}/100
                </span>
              </div>
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              variant="golden"
              disabled={!note.trim() || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Record Gratitude ✨
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
