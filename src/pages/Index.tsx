import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { StreakBadge } from '@/components/home/StreakBadge';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { WeeklyGrind } from '@/components/home/WeeklyGrind';
import { MissionCard } from '@/components/home/MissionCard';
import { BattleVerse } from '@/components/home/BattleVerse';
import { BattleVersesCard } from '@/components/home/BattleVersesCard';
import { TestimonyOfTheWeekCard } from '@/components/home/TestimonyOfTheWeekCard';
import { BattleMode } from '@/components/session/BattleMode';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { FreeChapterUnlockedDialog } from '@/components/rewards/FreeChapterUnlockedDialog';
import { QuickActionsBar } from '@/components/micro-actions';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useProfile } from '@/hooks/useProfile';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePrayers } from '@/hooks/usePrayers';
import { useSessions } from '@/hooks/useSessions';
import { useMilestoneChecker } from '@/hooks/useMilestoneChecker';
import { useFreeChapter } from '@/hooks/useFreeChapter';
import { User, Shield, Flame, Zap, Trophy, TrendingUp, Info, X } from 'lucide-react';
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
  const { progress, loading: progressLoading, checkStreakStatus } = useUserProgress();
  const { prayers } = usePrayers();
  const { todaySession, loading: sessionsLoading, getWeeklyData, getWeeklyVersesRead } = useSessions();
  const { checkAndAwardMilestones } = useMilestoneChecker();
  const { shouldShowUnlock, downloadChapter, closeDialog } = useFreeChapter();
  const [battleModeOpen, setBattleModeOpen] = useState(false);
  const [freeChapterOpen, setFreeChapterOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('home-instructions-dismissed') !== 'true';
  });
  const formattedDate = getFormattedDate();

  const dismissInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('home-instructions-dismissed', 'true');
  };

  // Show free chapter unlock dialog when user hits 7-day streak
  useEffect(() => {
    if (shouldShowUnlock) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setFreeChapterOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowUnlock]);

  // Check milestones and streak status on page load
  useEffect(() => {
    if (!profileLoading && !progressLoading && !sessionsLoading && profile) {
      checkStreakStatus(); // Reset streak if user missed a day
      checkAndAwardMilestones();
    }
  }, [profileLoading, progressLoading, sessionsLoading, profile]);
  
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
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Bottom border accent */}
          <div className="h-1 bg-gradient-to-r from-primary via-warning to-primary" />
        </div>

        <div className="px-4 pb-28 space-y-5 -mt-2">
          {/* Instructions Banner */}
          {showInstructions && (
            <div className="relative gym-card p-4 border-l-4 border-primary bg-primary/5">
              <button
                onClick={dismissInstructions}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-display text-sm uppercase tracking-wider text-foreground">
                    Welcome to Your Training HQ
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>🔥 <strong>Streak</strong> — Your consecutive training days</li>
                    <li>💪 <strong>Today's Workout</strong> — Complete all 4 sets: Worship, Scripture, Prayer, Reflect</li>
                    <li>⚔️ <strong>Battle Mode</strong> — Quick spiritual reset when you're struggling</li>
                    <li>🎯 <strong>Daily Mission</strong> — Extra challenge to push your faith</li>
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    Tap <strong>Train</strong> below to start your daily workout!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Streak Badge - Enhanced */}
          <StreakBadge streak={currentStreak} />

          {/* Today's Workout */}
          <WorkoutCard 
            steps={todaySteps} 
            allCompleted={todaySteps.every(s => s.completed)} 
          />

          {/* Quick Actions - Micro-Actions */}
          <QuickActionsBar />

          {/* Battle Verses Card - Navigate to Battles page */}
          <BattleVersesCard />

          {/* Battle Mode Button - Mobile Optimized */}
          <Button
            variant="destructive"
            onClick={() => setBattleModeOpen(true)}
            className="w-full h-auto min-h-14 py-4 px-4 bg-destructive/90 hover:bg-destructive text-destructive-foreground font-display uppercase tracking-wide text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg"
          >
            <Shield className="h-6 w-6 flex-shrink-0" />
            <span className="whitespace-normal text-center leading-tight">
              Need a quick reset? Enter Battle Mode
            </span>
          </Button>

          {/* Weekly Stats - Use weekly session count */}
          <WeeklyGrind 
            sessions={getWeeklyData().filter(d => d === 1).length} 
            prayers={prayers.filter(p => {
              const prayerDate = new Date(p.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return prayerDate >= weekAgo;
            }).length} 
            verses={getWeeklyVersesRead()} 
          />

          {/* Daily Mission */}
          <MissionCard mission={todayMission} />

          {/* Testimony of the Week */}
          <TestimonyOfTheWeekCard />

          {/* Battle Verse */}
          <BattleVerse />

          {/* Stats moved to Squad/Profile page */}

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

      {/* Free Chapter Unlock Dialog - Triggered on 7-day streak */}
      <FreeChapterUnlockedDialog
        open={freeChapterOpen}
        onOpenChange={(open) => {
          setFreeChapterOpen(open);
          if (!open) closeDialog();
        }}
        onDownload={() => {
          downloadChapter();
          toast.success('Chapter 1 unlocked! Check your downloads.', { icon: '📖' });
        }}
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
