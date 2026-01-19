import { Zap, Target, BookOpen, TrendingUp } from 'lucide-react';

interface WeeklyGrindProps {
  sessions: number;
  prayers: number;
  verses: number;
}

export function WeeklyGrind({ sessions, prayers, verses }: WeeklyGrindProps) {
  const stats = [
    { label: 'Sessions', value: sessions, icon: Zap },
    { label: 'Prayers', value: prayers, icon: Target },
    { label: 'Verses', value: verses, icon: BookOpen },
  ];

  return (
    <div className="gym-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg text-primary uppercase tracking-wide">
          This Week's Grind
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="text-center">
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="stat-number">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
