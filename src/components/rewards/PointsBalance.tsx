import { cn } from '@/lib/utils';
import { TrendingUp, Zap } from 'lucide-react';

interface PointsBalanceProps {
  points: number;
  className?: string;
}

export function PointsBalance({ points, className }: PointsBalanceProps) {
  const getLevel = (pts: number) => {
    if (pts >= 5000) return { name: 'LEGEND', color: 'text-warning', bg: 'bg-warning/20' };
    if (pts >= 2500) return { name: 'ELITE', color: 'text-primary', bg: 'bg-primary/20' };
    if (pts >= 1000) return { name: 'VETERAN', color: 'text-success', bg: 'bg-success/20' };
    if (pts >= 500) return { name: 'SOLDIER', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (pts >= 100) return { name: 'WARRIOR', color: 'text-purple-400', bg: 'bg-purple-400/20' };
    return { name: 'RECRUIT', color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const level = getLevel(points);
  const nextLevel = points < 100 ? 100 : points < 500 ? 500 : points < 1000 ? 1000 : points < 2500 ? 2500 : points < 5000 ? 5000 : null;
  const progress = nextLevel ? (points / nextLevel) * 100 : 100;

  return (
    <div className={cn("gym-card p-5 border-l-4 border-l-primary", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Balance</p>
            <p className="font-display text-3xl text-foreground">{points.toLocaleString()}</p>
          </div>
        </div>
        <div className={cn("px-3 py-1.5 rounded-lg", level.bg)}>
          <p className={cn("font-display text-sm uppercase tracking-wide", level.color)}>
            {level.name}
          </p>
        </div>
      </div>

      {/* Level progress */}
      {nextLevel && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Progress to next rank
            </span>
            <span className="text-foreground font-medium">
              {points.toLocaleString()} / {nextLevel.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-warning transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* How to earn */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Zap className="h-3 w-3 text-warning" />
          Earn points by completing sessions, prayers, and challenges
        </p>
      </div>
    </div>
  );
}
