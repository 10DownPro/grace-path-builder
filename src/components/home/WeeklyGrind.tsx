import { Zap, Target, BookOpen, TrendingUp, Award, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyGrindProps {
  sessions: number;
  prayers: number;
  verses: number;
}

// Achievement thresholds
const getAchievementLevel = (value: number, type: 'sessions' | 'prayers' | 'verses'): { level: string; icon: typeof Trophy; color: string } | null => {
  const thresholds = {
    sessions: [{ min: 7, level: 'PERFECT WEEK', icon: Trophy, color: 'text-warning' }, { min: 5, level: 'STRONG', icon: Star, color: 'text-primary' }],
    prayers: [{ min: 20, level: 'WARRIOR', icon: Trophy, color: 'text-warning' }, { min: 10, level: 'DEDICATED', icon: Award, color: 'text-primary' }],
    verses: [{ min: 30, level: 'SCHOLAR', icon: Trophy, color: 'text-warning' }, { min: 15, level: 'STUDIOUS', icon: Star, color: 'text-primary' }],
  };
  
  const typeThresholds = thresholds[type];
  for (const threshold of typeThresholds) {
    if (value >= threshold.min) {
      return threshold;
    }
  }
  return null;
};

export function WeeklyGrind({ sessions, prayers, verses }: WeeklyGrindProps) {
  const stats = [
    { label: 'Sessions', value: sessions, icon: Zap, type: 'sessions' as const },
    { label: 'Prayers', value: prayers, icon: Target, type: 'prayers' as const },
    { label: 'Verses', value: verses, icon: BookOpen, type: 'verses' as const },
  ];

  return (
    <div data-tour="weekly-grind" className="gym-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg text-primary uppercase tracking-wide">
          This Week's Grind
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, type }) => {
          const achievement = getAchievementLevel(value, type);
          const AchievementIcon = achievement?.icon;
          
          return (
            <div key={label} className="text-center relative">
              {/* Achievement badge */}
              {achievement && AchievementIcon && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center animate-pulse-glow",
                    achievement.color === 'text-warning' ? 'bg-warning/20' : 'bg-primary/20'
                  )}>
                    <AchievementIcon className={cn("h-3 w-3", achievement.color)} />
                  </div>
                </div>
              )}
              
              {/* Main icon with glow effect */}
              <div className={cn(
                "w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all",
                achievement ? "bg-primary/20 glow-accent" : "bg-muted"
              )}>
                <Icon className={cn(
                  "h-6 w-6",
                  achievement ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              {/* Stat number */}
              <p className="stat-number">{value}</p>
              
              {/* Label */}
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                {label}
              </p>
              
              {/* Achievement label */}
              {achievement && (
                <p className={cn(
                  "text-xs font-display uppercase tracking-wide mt-1",
                  achievement.color
                )}>
                  {achievement.level}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
