import { milestonesV2, type MilestoneStats } from '@/lib/milestonesV2';
import { cn } from '@/lib/utils';

interface MilestoneShelfProps {
  stats: MilestoneStats;
}

export function MilestoneShelf({ stats }: MilestoneShelfProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Milestones</p>
        <h3 className="font-display text-2xl text-foreground">Moments worth remembering</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {milestonesV2.map((m) => {
          const earned = m.predicate(stats);
          return (
            <div
              key={m.id}
              title={m.description}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
                earned
                  ? 'border-secondary/40 bg-secondary/10'
                  : 'border-border bg-muted/30 opacity-50'
              )}
            >
              <span className={cn('text-2xl', !earned && 'grayscale')}>{m.emoji}</span>
              <span className="text-[11px] text-foreground font-medium leading-tight">{m.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
