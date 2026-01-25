import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMicroActions } from '@/hooks/useMicroActions';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface BreathPrayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BreathPhase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'complete';

export function BreathPrayerDialog({ open, onOpenChange }: BreathPrayerDialogProps) {
  const { completeMicroAction } = useMicroActions();
  const { lightTap, successPattern } = useHapticFeedback();
  const [phase, setPhase] = useState<BreathPhase>('ready');
  const [cycleCount, setCycleCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const TOTAL_CYCLES = 3;
  const INHALE_DURATION = 4000;
  const HOLD_DURATION = 2000;
  const EXHALE_DURATION = 4000;

  const runBreathCycle = useCallback(async () => {
    // Inhale
    setPhase('inhale');
    lightTap();
    await new Promise(resolve => setTimeout(resolve, INHALE_DURATION));

    // Hold
    setPhase('hold');
    await new Promise(resolve => setTimeout(resolve, HOLD_DURATION));

    // Exhale
    setPhase('exhale');
    lightTap();
    await new Promise(resolve => setTimeout(resolve, EXHALE_DURATION));
  }, [lightTap]);

  const startBreathing = useCallback(async () => {
    for (let i = 0; i < TOTAL_CYCLES; i++) {
      await runBreathCycle();
      setCycleCount(i + 1);
    }

    // Complete
    setPhase('complete');
    const { error } = await completeMicroAction('breath_prayer', {
      cycles_completed: TOTAL_CYCLES
    });

    if (!error) {
      setCompleted(true);
      successPattern();
      confetti({
        particleCount: 40,
        spread: 70,
        colors: ['#87CEEB', '#E6E6FA', '#B0E0E6'],
        origin: { y: 0.5 }
      });
    }
  }, [runBreathCycle, completeMicroAction, successPattern]);

  useEffect(() => {
    if (!open) {
      setPhase('ready');
      setCycleCount(0);
      setCompleted(false);
    }
  }, [open]);

  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Tap to Begin';
      case 'inhale': return 'Lord Jesus Christ...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Have mercy on me.';
      case 'complete': return 'Peace be with you';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'BREATHE IN';
      case 'hold': return 'HOLD';
      case 'exhale': return 'BREATHE OUT';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🌬️ Breath Prayer
            <span className="text-sm text-primary font-normal">+3 pts</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {completed ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-sky-500/20 flex items-center justify-center animate-scale-in">
                <Check className="h-8 w-8 text-sky-500" />
              </div>
              <p className="text-lg font-bold text-sky-500">Prayer Complete</p>
              <p className="text-sm text-muted-foreground text-center">
                Go in peace
              </p>
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Breathing Circle */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "relative flex items-center justify-center rounded-full transition-all duration-1000",
                    "bg-gradient-to-br from-sky-400/20 to-purple-400/20 border-2 border-sky-400/30",
                    phase === 'inhale' && "w-40 h-40 animate-pulse",
                    phase === 'hold' && "w-40 h-40",
                    phase === 'exhale' && "w-24 h-24",
                    phase === 'ready' && "w-32 h-32",
                    phase === 'complete' && "w-32 h-32"
                  )}
                >
                  <div className="text-center px-4">
                    {phase !== 'ready' && phase !== 'complete' && (
                      <p className="text-xs font-bold text-sky-400 uppercase mb-1">
                        {getPhaseInstruction()}
                      </p>
                    )}
                    <p className={cn(
                      "font-medium",
                      phase === 'ready' ? "text-sm" : "text-xs"
                    )}>
                      {getPhaseText()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="flex justify-center gap-2">
                {[...Array(TOTAL_CYCLES)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      i < cycleCount ? "bg-sky-500" : "bg-border"
                    )}
                  />
                ))}
              </div>

              {/* Start Button */}
              {phase === 'ready' && (
                <Button
                  className="w-full"
                  onClick={startBreathing}
                >
                  Begin Breath Prayer
                </Button>
              )}

              {/* Instructions */}
              <p className="text-xs text-center text-muted-foreground">
                {phase === 'ready' 
                  ? "3 guided breath cycles with the Jesus Prayer"
                  : `Cycle ${Math.min(cycleCount + 1, TOTAL_CYCLES)} of ${TOTAL_CYCLES}`
                }
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
