import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useBookCode } from '@/hooks/useBookCode';
import confetti from 'canvas-confetti';

interface BookCodeStepProps {
  onSuccess: () => void;
  onSkip: () => void;
}

export function BookCodeStep({ onSuccess, onSkip }: BookCodeStepProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { redeemCode, formatCodeInput, validateCodeFormat, loading } = useBookCode();

  const handleCodeChange = (value: string) => {
    setError(null);
    setCode(formatCodeInput(value));
  };

  const handleRedeem = async () => {
    if (!validateCodeFormat(code)) {
      setError('Please enter a valid code (Format: FT-XXXXXX)');
      return;
    }

    const result = await redeemCode(code);
    
    if (result.success) {
      setSuccess(true);
      // Trigger confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Wait a moment to show success, then continue
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.message);
      // Shake animation on error
      const input = document.getElementById('book-code-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 rounded-2xl bg-success/20 flex items-center justify-center">
          <Check className="h-12 w-12 text-success" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-display text-3xl uppercase tracking-wider text-success">
            Premium Unlocked! 🔥
          </h2>
          <p className="text-muted-foreground">
            You now have lifetime access to all premium features.
          </p>
          <p className="font-display text-lg uppercase tracking-wider text-foreground mt-4">
            Let's train.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in">
      <div className="space-y-3 text-center">
        <div className="w-16 h-16 rounded-xl bg-warning/20 flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-warning" />
        </div>
        <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
          Unlock Premium Features
        </h2>
        <p className="text-muted-foreground">
          Each Faith Training Guide includes a unique code for lifetime premium access.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="book-code-input"
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="FT-XXXXXX"
            className={cn(
              "text-center font-display text-xl uppercase tracking-widest py-6",
              error && "border-destructive"
            )}
            maxLength={9}
            autoFocus
          />
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <Button
          onClick={handleRedeem}
          disabled={loading || code.length < 9}
          className="w-full btn-gym"
          size="lg"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="font-display uppercase tracking-wider">Redeem Code</span>
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2 text-center text-sm text-muted-foreground">
        <p>Find your code on the inside back cover of your book.</p>
        <button
          onClick={onSkip}
          className="underline hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
