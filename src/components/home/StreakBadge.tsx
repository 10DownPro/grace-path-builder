import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-lg border-l-4 border-l-primary bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-border">
      <div className="relative">
        <Flame className="h-8 w-8 text-primary animate-pulse-glow" />
        <div className="absolute inset-0 blur-md bg-primary/30 -z-10" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">{streak}</span>
        <span className="font-display text-lg text-primary uppercase tracking-wider">Day Grind</span>
      </div>
    </div>
  );
}
