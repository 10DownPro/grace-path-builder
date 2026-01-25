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
import { Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickPrayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRAYER_TEMPLATES = [
  "Lord, give me strength today",
  "Thank you for this moment",
  "Help me with my struggles",
  "Guide my steps today",
  "Fill me with your peace",
  "Protect my loved ones"
];

export function QuickPrayerDialog({ open, onOpenChange }: QuickPrayerDialogProps) {
  const { completeMicroAction } = useMicroActions();
  const { successPattern } = useHapticFeedback();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customPrayer, setCustomPrayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async () => {
    const prayer = customPrayer || selectedTemplate;
    if (!prayer) return;

    setLoading(true);
    const { error } = await completeMicroAction('quick_prayer', { prayer });
    setLoading(false);

    if (!error) {
      setCompleted(true);
      successPattern();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      setTimeout(() => {
        setCompleted(false);
        setCustomPrayer('');
        setSelectedTemplate(null);
        onOpenChange(false);
      }, 1500);
    }
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setCustomPrayer('');
      setSelectedTemplate(null);
      setCompleted(false);
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🙏 Quick Prayer
            <span className="text-sm text-primary font-normal">+5 pts</span>
          </DialogTitle>
        </DialogHeader>

        {completed ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
              <Check className="h-8 w-8 text-success" />
            </div>
            <p className="text-lg font-bold text-success">Prayer Logged!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a quick prayer or write your own (30 seconds)
            </p>

            {/* Templates */}
            <div className="grid grid-cols-2 gap-2">
              {PRAYER_TEMPLATES.map((template) => (
                <Button
                  key={template}
                  variant={selectedTemplate === template ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-2 whitespace-normal text-left"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setCustomPrayer('');
                  }}
                >
                  {template}
                </Button>
              ))}
            </div>

            {/* Custom input */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Or write your own:</p>
              <Textarea
                placeholder="Your prayer..."
                value={customPrayer}
                onChange={(e) => {
                  setCustomPrayer(e.target.value);
                  setSelectedTemplate(null);
                }}
                className="h-20 resize-none"
              />
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              disabled={!selectedTemplate && !customPrayer.trim() || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Pray 🙏
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
