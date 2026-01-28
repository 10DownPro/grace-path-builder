import { Flame, TrendingUp } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  // Determine streak status
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;
  
  return (
    <div data-tour="streak-badge" className="relative overflow-hidden rounded-xl border-2 border-primary/50 bg-gradient-to-r from-primary/20 via-card to-primary/10">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 animate-pulse opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          {/* Flame icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-primary/50 animate-pulse" />
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center">
              <Flame className="h-9 w-9 text-background" />
            </div>
            {isOnFire && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                <span className="text-xs">🔥</span>
              </div>
            )}
          </div>
          
          {/* Streak info */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl text-foreground">{streak}</span>
              <span className="font-display text-xl text-primary uppercase tracking-wider">Day</span>
            </div>
            <p className="font-display text-sm text-primary uppercase tracking-widest">
              {isOnFire ? 'BEAST MODE 🔥' : isHot ? 'On Fire!' : 'Day Grind'}
            </p>
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className="flex flex-col items-center gap-1 text-success">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs font-display uppercase">Rising</span>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}
