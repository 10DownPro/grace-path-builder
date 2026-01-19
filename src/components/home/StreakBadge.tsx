import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-3 px-5 py-2.5 rounded-full",
      "bg-accent/10 border border-accent/30",
      "shadow-gold",
      className
    )}>
      <Flame className="h-5 w-5 text-accent animate-gentle-glow" />
      <span className="font-medium text-accent">{streak} day streak</span>
    </div>
  );
}
