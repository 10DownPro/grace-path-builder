import { Footprints, Heart, BookOpen, PenLine } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ThisWeeksWalkProps {
  sessions: number;
  prayers: number;
  reflections: number;
  scriptures: number;
}

export function ThisWeeksWalk({ sessions, prayers, reflections, scriptures }: ThisWeeksWalkProps) {
  const stats = [
    { label: 'Sessions', value: sessions, goal: 7, icon: Footprints },
    { label: 'Prayers', value: prayers, goal: 7, icon: Heart },
    { label: 'Reflections', value: reflections, goal: 5, icon: PenLine },
    { label: 'Scripture', value: scriptures, goal: 10, icon: BookOpen },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">This week</p>
        <h3 className="font-display text-2xl text-foreground">This Week's Walk</h3>
        <p className="text-sm text-muted-foreground mt-1">Growth, not perfection.</p>
      </div>

      <div className="space-y-4">
        {stats.map(({ label, value, goal, icon: Icon }) => {
          const pct = Math.min(100, Math.round((value / goal) * 100));
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base text-foreground font-medium">{label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
