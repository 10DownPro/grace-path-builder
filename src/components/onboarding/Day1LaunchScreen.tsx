import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sunrise, ChevronRight, Compass, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Day1LaunchScreenProps {
  userName: string;
  journey?: 'new' | 'curious' | 'returning' | 'longtime';
  onComplete: () => void;
}

export function Day1LaunchScreen({ userName, journey = 'new', onComplete }: Day1LaunchScreenProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'welcome' | 'reveal'>('welcome');

  useEffect(() => {
    const t = setTimeout(() => setPhase('reveal'), 1600);
    return () => clearTimeout(t);
  }, []);

  const isReturning = journey === 'returning';
  const trackName = isReturning ? 'Coming Back' : journey === 'longtime' ? 'Daily Rhythm' : 'Starting Faith';
  const TrackIcon = isReturning ? HandHeart : Compass;

  const handleContinue = () => {
    onComplete();
    navigate('/session');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden gradient-dawn">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />

      <div className="relative z-10 text-center px-6 max-w-md">
        {phase === 'welcome' && (
          <div className="animate-fade-in space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto">
              <Sunrise className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground text-balance">
              {isReturning ? 'Welcome back, ' : 'Welcome, '}
              <span className="text-primary">{userName}.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isReturning
                ? "We're so glad you're here. Let's continue together."
                : "Your walk begins today — one quiet step at a time."}
            </p>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="animate-fade-in space-y-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Your guided track</p>
              <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mt-4">
                <TrackIcon className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="font-display text-4xl text-foreground pt-2">{trackName}</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed pt-2">
                A clear path for where you are today. We'll start with Worship, Scripture, Prayer, and Reflection.
              </p>
            </div>

            <Button onClick={handleContinue} className="btn-gym w-full sm:w-auto px-8 py-6">
              Begin today's walk
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>

            <p className="text-xs text-muted-foreground italic">
              Take your time. There's no rush.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
