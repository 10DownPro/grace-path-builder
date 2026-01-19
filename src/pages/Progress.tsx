import { PageLayout } from '@/components/layout/PageLayout';
import { useProgress } from '@/hooks/useProgress';
import { Flame, Trophy, Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Progress() {
  const { progress } = useProgress();

  const stats = [
    { label: 'Current Streak', value: progress.currentStreak, suffix: 'days', icon: Flame, color: 'text-primary' },
    { label: 'Best Streak', value: progress.longestStreak, suffix: 'days', icon: Trophy, color: 'text-accent' },
    { label: 'Total Sessions', value: progress.totalSessions, suffix: '', icon: BookOpen, color: 'text-sage' },
    { label: 'Time in Prayer', value: progress.totalMinutes, suffix: 'min', icon: Clock, color: 'text-navy' },
  ];

  // Generate calendar data for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const completedDays = new Set([1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6 stagger-children">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Growing in faith, one day at a time</p>
        </div>

        {/* Streak highlight */}
        <div className="spiritual-card p-6 gradient-golden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Flame className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-foreground">{progress.currentStreak}</p>
              <p className="text-primary-foreground/80">Day Streak 🔥</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80 italic">
            "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." — Galatians 6:9
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="spiritual-card p-4">
              <stat.icon className={cn("h-5 w-5 mb-2", stat.color)} />
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
                {stat.suffix && <span className="text-sm text-muted-foreground ml-1">{stat.suffix}</span>}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="spiritual-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-xs text-muted-foreground font-medium py-1">
                {day}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate();
              const isCompleted = completedDays.has(day);
              
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                    isToday && "ring-2 ring-primary ring-offset-2",
                    isCompleted 
                      ? "gradient-golden text-primary-foreground font-medium" 
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Milestones</h2>
          </div>
          
          {progress.milestones.map(milestone => (
            <div 
              key={milestone.id}
              className={cn(
                "spiritual-card p-4 flex items-start gap-4",
                milestone.achieved && "border-sage/30"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                milestone.achieved ? "bg-sage/10" : "bg-muted"
              )}>
                {milestone.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{milestone.name}</p>
                  {milestone.achieved && (
                    <span className="text-xs bg-sage/10 text-sage px-2 py-0.5 rounded-full">
                      Achieved
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                <p className="text-xs text-primary mt-2 italic">{milestone.scripture}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement */}
        <div className="spiritual-card p-5 bg-navy/5 border-navy/20">
          <div className="flex items-center gap-2 text-navy mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Growth Insight</span>
          </div>
          <p className="text-foreground/90">
            You've spent an average of <strong>15 minutes</strong> in prayer each session. 
            Your consistency is building a strong foundation of faith!
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
