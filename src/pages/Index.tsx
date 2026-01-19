import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { StreakBadge } from '@/components/home/StreakBadge';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { WeeklyGrind } from '@/components/home/WeeklyGrind';
import { MissionCard } from '@/components/home/MissionCard';
import { BattleVerse } from '@/components/home/BattleVerse';
import { BattleMode } from '@/components/session/BattleMode';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useProfile } from '@/hooks/useProfile';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePrayers } from '@/hooks/usePrayers';
import { useSessions } from '@/hooks/useSessions';
import { Settings, Shield, Flame, Zap, Trophy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const dailyMissions = [
  "Pray for someone who wronged you",
  "Memorize one verse and recite it 10 times",
  "Write down 3 things you're grateful for",
  "Spend 5 minutes in complete silence with God",
  "Send an encouraging text to someone struggling",
  "Confess one thing you've been avoiding",
  "Read a full chapter without distractions",
];

export default function Index() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { progress, loading: progressLoading } = useUserProgress();
  const { prayers } = usePrayers();
  const { todaySession, loading: sessionsLoading } = useSessions();
  const [battleModeOpen, setBattleModeOpen] = useState(false);
  const formattedDate = getFormattedDate();
  
  // Get consistent daily mission
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayMission = dailyMissions[dayOfYear % dailyMissions.length];

  const handleBattleModeComplete = () => {
    toast.success('Battle Mode Victory! 🏆 Streak maintained!');
  };

  const handleOnboardingComplete = async (data: {
    name: string;
    commitment: 'starter' | 'committed' | 'warrior';
    preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
    focusAreas: string[];
    weeklyGoal: number;
  }) => {
    await updateProfile({
      name: data.name,
      commitment: data.commitment,
      preferred_time: data.preferredTime,
      focus_areas: data.focusAreas,
      weekly_goal: data.weeklyGoal
    });
  };

  // Show loading state
  if (profileLoading || progressLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Flame className="h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  // Show onboarding if profile has no name set
  if (profile && !profile.name) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const userName = profile?.name || 'Soldier';
  const currentStreak = progress?.current_streak || 0;
  const totalSessions = progress?.total_sessions || 0;
  const totalMinutes = progress?.total_minutes || 0;
  const longestStreak = progress?.longest_streak || 0;

  // Build today's steps from session data
  const todaySteps = [
    { name: 'Worship', icon: '🎵', completed: todaySession?.worship_completed || false, duration: '15 min' },
    { name: 'Scripture', icon: '📖', completed: todaySession?.scripture_completed || false, duration: '10 min' },
    { name: 'Prayer', icon: '🙏', completed: todaySession?.prayer_completed || false, duration: '10 min' },
    { name: 'Reflect', icon: '✍️', completed: todaySession?.reflection_completed || false, duration: '5 min' },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Header with Gradient Background */}
        <div className="relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative px-4 pt-6 pb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs text-primary font-display uppercase tracking-[0.3em]">
                  {formattedDate}
                </p>
                <h1 className="font-display text-4xl text-foreground uppercase tracking-wide leading-none">
                  Let's go,
                  <br />
                  <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                  No days off. No excuses.
                </p>
              </div>
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Settings className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Bottom border accent */}
          <div className="h-1 bg-gradient-to-r from-primary via-warning to-primary" />
        </div>

        <div className="px-4 pb-28 space-y-5 -mt-2">
          {/* Streak Badge - Enhanced */}
          <StreakBadge streak={currentStreak} />

          {/* Today's Workout */}
          <WorkoutCard 
            steps={todaySteps} 
            allCompleted={todaySteps.every(s => s.completed)} 
          />

          {/* Battle Mode Button */}
          <Button
            variant="outline"
            onClick={() => setBattleModeOpen(true)}
            className="w-full h-14 border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 text-destructive font-display uppercase tracking-wide text-base"
          >
            <Shield className="h-5 w-5 mr-2" />
            Struggling today? Battle Mode →
          </Button>

          {/* Weekly Stats */}
          <WeeklyGrind 
            sessions={totalSessions} 
            prayers={prayers.length} 
            verses={0} 
          />

          {/* Daily Mission */}
          <MissionCard mission={todayMission} />

          {/* Battle Verse */}
          <BattleVerse />

          {/* Stats Row with Icons */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard 
              label="Sessions" 
              value={totalSessions} 
              icon={Zap}
              color="text-primary"
            />
            <StatCard 
              label="Minutes" 
              value={totalMinutes}
              icon={Flame}
              color="text-warning"
            />
            <StatCard 
              label="Best Streak" 
              value={longestStreak}
              icon={Trophy}
              color="text-success"
            />
          </div>

          {/* Growth Card */}
          <div className="gym-card p-5 border-l-4 border-l-success">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-display text-sm text-success uppercase tracking-wide">Growth Track</p>
                <p className="text-xs text-muted-foreground">You're building momentum</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-success to-primary transition-all duration-1000"
                style={{ width: '67%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              67% to your next milestone • Keep grinding!
            </p>
          </div>

          {/* Motivational Footer */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
              <Flame className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Faith won't build itself
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Mode Overlay */}
      <BattleMode 
        isOpen={battleModeOpen} 
        onClose={() => setBattleModeOpen(false)}
        onComplete={handleBattleModeComplete}
      />
    </PageLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="gym-card p-4 text-center relative overflow-hidden group hover:border-primary/50 transition-colors">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className={cn("w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center", 
          color === 'text-primary' && "bg-primary/20",
          color === 'text-warning' && "bg-warning/20",
          color === 'text-success' && "bg-success/20"
        )}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
        <p className="font-display text-3xl text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();
}
