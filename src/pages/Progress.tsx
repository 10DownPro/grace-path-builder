import { PageLayout } from '@/components/layout/PageLayout';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePrayers } from '@/hooks/usePrayers';
import { useSessions } from '@/hooks/useSessions';
import { Flame, Trophy, Clock, BookOpen, Calendar, TrendingUp, Award, Dumbbell, Target, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple bar chart component
function SimpleBarChart({ data, maxValue }: { data: number[]; maxValue: number }) {
  return (
    <div className="flex items-end justify-between gap-1 h-20">
      {data.map((value, index) => {
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-gradient-to-t from-primary to-warning rounded-t-sm transition-all duration-500"
              style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0' }}
            />
            <span className="text-xs text-muted-foreground">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Circular progress ring
function ProgressRing({ value, max, size = 80, strokeWidth = 8, children }: { 
  value: number; 
  max: number; 
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - (progress * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--warning))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// Milestone badge graphics
const badgeStyles = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-slate-400 to-slate-300',
  gold: 'from-yellow-500 to-yellow-300',
};

function MilestoneBadge({ type, achieved }: { type: 'bronze' | 'silver' | 'gold'; achieved: boolean }) {
  if (!achieved) {
    return (
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <Trophy className="h-6 w-6 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className={cn(
      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
      badgeStyles[type]
    )}>
      <Trophy className="h-6 w-6 text-white drop-shadow-md" />
    </div>
  );
}

// Default milestones for new users
const defaultMilestones = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first devotional session',
    scripture: '"For we walk by faith, not by sight." - 2 Corinthians 5:7',
    achieved: false,
    icon: '🌱'
  },
  {
    id: '2',
    name: 'Week of Faith',
    description: 'Complete 7 consecutive days',
    scripture: '"But they that wait upon the LORD shall renew their strength." - Isaiah 40:31',
    achieved: false,
    icon: '🌿'
  },
  {
    id: '3',
    name: 'Prayer Warrior',
    description: 'Write 30 prayer entries',
    scripture: '"Pray without ceasing." - 1 Thessalonians 5:17',
    achieved: false,
    icon: '🙏'
  },
  {
    id: '4',
    name: 'Month of Devotion',
    description: 'Complete 30 consecutive days',
    scripture: '"Be still, and know that I am God." - Psalm 46:10',
    achieved: false,
    icon: '🌳'
  }
];

export default function Progress() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { prayers, loading: prayersLoading } = usePrayers();
  const { sessions, getCompletedDates, getWeeklyData, loading: sessionsLoading } = useSessions();

  if (progressLoading || prayersLoading || sessionsLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </PageLayout>
    );
  }

  // Calculate actual stats from sessions table
  const completedSessions = sessions.filter(s => s.completed_at !== null);
  const totalSessions = completedSessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
  
  // Calculate streak from completed sessions
  const calculateStreak = () => {
    if (completedSessions.length === 0) return { current: 0, longest: 0 };
    
    const sortedDates = completedSessions
      .map(s => s.session_date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    // Check if today or yesterday has a session for current streak
    const mostRecentDate = new Date(sortedDates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    const isActiveStreak = mostRecentDate.getTime() === today.getTime() || 
                           mostRecentDate.getTime() === yesterday.getTime();
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
        continue;
      }
      
      const curr = new Date(sortedDates[i]);
      const prev = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    currentStreak = isActiveStreak ? tempStreak : 0;
    
    // Recalculate current streak by walking back from most recent
    if (isActiveStreak) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const curr = new Date(sortedDates[i]);
        const prev = new Date(sortedDates[i - 1]);
        const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return { current: currentStreak, longest: longestStreak };
  };
  
  const streaks = calculateStreak();
  const currentStreak = streaks.current;
  const longestStreak = streaks.longest;

  const stats = [
    { label: 'Current Streak', value: currentStreak, suffix: 'days', icon: Flame, color: 'text-primary' },
    { label: 'Best Streak', value: longestStreak, suffix: 'days', icon: Trophy, color: 'text-warning' },
    { label: 'Total Sessions', value: totalSessions, suffix: '', icon: Dumbbell, color: 'text-success' },
    { label: 'Time in Prayer', value: totalMinutes, suffix: 'min', icon: Clock, color: 'text-secondary' },
  ];

  // Generate calendar data from sessions
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  // Get completed dates from database
  const completedDateStrings = getCompletedDates();
  const completedDays = new Set<number>();
  completedDateStrings.forEach(dateStr => {
    const date = new Date(dateStr);
    if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
      completedDays.add(date.getDate());
    }
  });

  // Weekly session data from database
  const weeklyData = getWeeklyData();
  
  // Count sessions this week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const sessionsThisWeek = completedSessions.filter(s => {
    const sessionDate = new Date(s.session_date);
    return sessionDate >= weekStart;
  }).length;

  // Weekly goals - use actual data from database
  const weeklyGoals = [
    { label: 'Sessions', current: sessionsThisWeek, target: 7, icon: Zap },
    { label: 'Prayers', current: prayers.length, target: 15, icon: Target },
    { label: 'Verses', current: 0, target: 20, icon: BookOpen },
  ];

  // Personal records - based on actual progress
  const longestSession = sessions.length > 0 ? Math.max(...sessions.map(s => s.duration_minutes || 0)) : 0;
  const personalRecords = [
    { label: 'Longest Session', value: `${longestSession} min`, icon: Clock },
    { label: 'Consecutive Days', value: longestStreak.toString(), icon: Flame },
    { label: 'Total Prayers', value: prayers.length.toString(), icon: Target },
  ];

  // Calculate milestones based on actual progress
  const milestones = defaultMilestones.map(m => {
    let achieved = false;
    if (m.id === '1') achieved = totalSessions >= 1;
    if (m.id === '2') achieved = longestStreak >= 7;
    if (m.id === '3') achieved = prayers.length >= 30;
    if (m.id === '4') achieved = longestStreak >= 30;
    return { ...m, achieved };
  });

  // Determine badge type based on milestone
  const getBadgeType = (name: string): 'bronze' | 'silver' | 'gold' => {
    if (name.includes('Month')) return 'gold';
    if (name.includes('Week') || name.includes('Warrior')) return 'silver';
    return 'bronze';
  };

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6 stagger-children">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl text-primary uppercase tracking-wide">Your Stats</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-wider">Track your grind</p>
        </div>

        {/* Streak highlight with gritty styling */}
        <div className="gym-card-accent p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center glow-accent">
              <Flame className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-display text-5xl text-foreground">{currentStreak}</p>
              <p className="font-display text-sm text-primary uppercase tracking-wide">
                {currentStreak === 0 ? 'Start Your Grind 💪' : 'Day Grind 🔥'}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
            "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." — Galatians 6:9
          </p>
        </div>

        {/* Weekly Goals - Circular Progress */}
        <div className="gym-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg text-primary uppercase tracking-wide">Weekly Goals</h2>
          </div>
          <div className="flex justify-around">
            {weeklyGoals.map(({ label, current, target, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center">
                <ProgressRing value={current} max={target} size={70} strokeWidth={6}>
                  <Icon className="h-5 w-5 text-primary" />
                </ProgressRing>
                <p className="font-display text-lg text-foreground mt-2">{current}/{target}</p>
                <p className="text-xs text-muted-foreground uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* This Week's Activity - Bar Chart */}
        <div className="gym-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg text-primary uppercase tracking-wide">This Week</h2>
            </div>
            <span className="text-xs text-muted-foreground">Sessions per day</span>
          </div>
          <SimpleBarChart data={weeklyData} maxValue={5} />
        </div>

        {/* Stats grid with gritty styling */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="gym-card p-4">
              <div className={cn(
                "w-10 h-10 rounded-lg mb-2 flex items-center justify-center",
                stat.color === 'text-primary' && "bg-primary/20",
                stat.color === 'text-warning' && "bg-warning/20",
                stat.color === 'text-success' && "bg-success/20",
                stat.color === 'text-secondary' && "bg-secondary/20"
              )}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="font-display text-3xl text-foreground">
                {stat.value}
                {stat.suffix && <span className="text-sm text-muted-foreground ml-1">{stat.suffix}</span>}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Personal Records */}
        <div className="gym-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-warning" />
            <h2 className="font-display text-lg text-warning uppercase tracking-wide">Personal Records</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {personalRecords.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-muted/50">
                <Icon className="h-5 w-5 text-warning mx-auto mb-1" />
                <p className="font-display text-xl text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar with enhanced styling */}
        <div className="gym-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg text-primary uppercase tracking-wide">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-xs text-muted-foreground font-display uppercase py-1">
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
              const isPast = day < today.getDate();
              
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    isCompleted 
                      ? "bg-gradient-to-br from-primary to-warning text-background glow-accent" 
                      : isPast 
                        ? "bg-muted/30 text-muted-foreground/50" 
                        : "bg-muted/50 text-muted-foreground"
                  )}
                  title={isCompleted ? `Day ${day}: Completed` : undefined}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-primary to-warning" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/50" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>

        {/* Milestones with actual badge graphics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            <h2 className="font-display text-lg text-warning uppercase tracking-wide">Milestones</h2>
          </div>
          
          {milestones.map(milestone => (
            <div 
              key={milestone.id}
              className={cn(
                "gym-card p-4 flex items-start gap-4",
                milestone.achieved && "border-l-4 border-l-success"
              )}
            >
              <MilestoneBadge 
                type={getBadgeType(milestone.name)} 
                achieved={milestone.achieved} 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm text-foreground uppercase tracking-wide">{milestone.name}</p>
                  {milestone.achieved && (
                    <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-md font-bold uppercase">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                <p className="text-xs text-primary mt-2 italic">{milestone.scripture}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Growth Insight with gritty styling */}
        <div className="gym-card p-5 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 text-primary mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-display text-sm uppercase tracking-wide">Growth Insight</span>
          </div>
          <p className="text-foreground">
            {totalSessions === 0 ? (
              <>Start your first session to begin tracking your spiritual growth. <span className="text-primary font-bold">Let's go!</span></>
            ) : (
              <>You've completed <strong className="text-primary">{totalSessions} session{totalSessions !== 1 ? 's' : ''}</strong> and spent <strong className="text-primary">{totalMinutes} minutes</strong> in devotion. <span className="text-primary font-bold">Keep grinding!</span></>
            )}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
