import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full",
      "bg-primary/10 border border-primary/20",
      "animate-gentle-glow",
      className
    )}>
      <Flame className="h-5 w-5 text-primary" />
      <span className="font-semibold text-primary">{streak} day streak</span>
    </div>
  );
}
