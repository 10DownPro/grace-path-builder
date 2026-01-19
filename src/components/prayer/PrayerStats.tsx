import { PrayerEntry } from '@/types/faith';
import { Target, Heart, TrendingUp, Flame } from 'lucide-react';

interface PrayerStatsProps {
  prayers: PrayerEntry[];
}

export function PrayerStats({ prayers }: PrayerStatsProps) {
  const answeredCount = prayers.filter(p => p.answered).length;
  const answeredPercentage = prayers.length > 0 
    ? Math.round((answeredCount / prayers.length) * 100) 
    : 0;
  
  const typeBreakdown = {
    adoration: prayers.filter(p => p.type === 'adoration').length,
    confession: prayers.filter(p => p.type === 'confession').length,
    thanksgiving: prayers.filter(p => p.type === 'thanksgiving').length,
    supplication: prayers.filter(p => p.type === 'supplication').length,
  };

  // Get current streak (consecutive days with prayers)
  const getDayStreak = () => {
    const sortedPrayers = [...prayers].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (sortedPrayers.length === 0) return 0;
    
    const uniqueDates = [...new Set(sortedPrayers.map(p => p.date))];
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (uniqueDates.includes(dateStr)) {
        streak++;
      } else if (i === 0) {
        // Allow today to be skipped
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getDayStreak();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Prayers */}
      <div className="gym-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />
        <div className="relative space-y-1">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Lifted Up</span>
          </div>
          <p className="font-display text-3xl text-foreground">{prayers.length}</p>
          <p className="text-xs text-muted-foreground">Total prayers</p>
        </div>
      </div>

      {/* Answered Prayers */}
      <div className="gym-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-success/10 rounded-bl-full" />
        <div className="relative space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Answered</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-3xl text-success">{answeredCount}</p>
            <span className="text-sm text-muted-foreground">({answeredPercentage}%)</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${answeredPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Prayer Streak */}
      <div className="gym-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-warning/10 rounded-bl-full" />
        <div className="relative space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Streak</span>
          </div>
          <p className="font-display text-3xl text-warning">{streak}</p>
          <p className="text-xs text-muted-foreground">Day{streak !== 1 ? 's' : ''} praying</p>
        </div>
      </div>

      {/* ACTS Breakdown */}
      <div className="gym-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">ACTS</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: 'adoration', label: 'A', color: 'bg-orange-500' },
              { key: 'confession', label: 'C', color: 'bg-purple-500' },
              { key: 'thanksgiving', label: 'T', color: 'bg-emerald-500' },
              { key: 'supplication', label: 'S', color: 'bg-blue-500' },
            ].map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <div className={`w-6 h-6 rounded ${color}/20 flex items-center justify-center mx-auto mb-0.5`}>
                  <span className="text-xs font-bold text-foreground/80">{label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {typeBreakdown[key as keyof typeof typeBreakdown]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
