import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface Day1LaunchScreenProps {
  userName: string;
  onComplete: () => void;
}

export function Day1LaunchScreen({ userName, onComplete }: Day1LaunchScreenProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'launch'>('intro');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Phase 1: Show intro for 2 seconds
    const introTimer = setTimeout(() => {
      setPhase('countdown');
    }, 2000);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;

    // Countdown from 3 to 0
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Launch!
      setPhase('launch');
      
      // Fire confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#E87722', '#F5C842', '#3D8B61']
      });

      // Navigate to session after celebration
      setTimeout(() => {
        onComplete();
        navigate('/session');
      }, 2500);
    }
  }, [phase, countdown, navigate, onComplete]);

  const handleSkipToTraining = () => {
    onComplete();
    navigate('/session');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warning/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-md">
        {/* Phase 1: Welcome Message */}
        {phase === 'intro' && (
          <div className="animate-fade-in space-y-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto animate-pulse-glow">
              <Flame className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground font-body">
                Welcome, <span className="text-primary font-display uppercase">{userName}</span>
              </p>
              <h1 className="font-display text-4xl uppercase tracking-wider text-foreground">
                Your training
                <br />
                <span className="text-primary">begins now</span>
              </h1>
            </div>
          </div>
        )}

        {/* Phase 2: Countdown */}
        {phase === 'countdown' && (
          <div className="animate-scale-in space-y-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-primary mx-auto flex items-center justify-center relative">
                <span 
                  key={countdown}
                  className={cn(
                    "font-display text-8xl text-primary animate-scale-in",
                    countdown === 0 && "text-success"
                  )}
                >
                  {countdown === 0 ? '🔥' : countdown}
                </span>
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl uppercase tracking-wider text-foreground">
                Day 1
              </h2>
              <p className="text-muted-foreground font-body uppercase tracking-widest text-sm">
                Starts now
              </p>
            </div>
          </div>
        )}

        {/* Phase 3: Launch */}
        {phase === 'launch' && (
          <div className="animate-fade-in space-y-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-warning mx-auto flex items-center justify-center shadow-2xl shadow-primary/30">
                <Zap className="h-16 w-16 text-background" />
              </div>
              {/* Celebration particles */}
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🎉</div>
              <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-100">💪</div>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display text-5xl uppercase tracking-wider text-primary animate-pulse">
                Let's Go!
              </h1>
              <p className="text-lg text-muted-foreground font-body">
                Your first workout awaits...
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-body uppercase tracking-wider">Loading your session</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100" />
            </div>
          </div>
        )}

        {/* Skip button (subtle) */}
        {phase !== 'launch' && (
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <Button
              variant="ghost"
              onClick={handleSkipToTraining}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip to training
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
