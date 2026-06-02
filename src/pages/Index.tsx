import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GraceStreakBadge } from '@/components/home/GraceStreakBadge';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { DailyCheckIn } from '@/components/home/DailyCheckIn';
import { ContinueJourneyCard } from '@/components/home/ContinueJourneyCard';
import { JourneyProgressCard } from '@/components/home/JourneyProgressCard';
import { TodaysFocusCard } from '@/components/home/TodaysFocusCard';
import { TodaysScriptureCard } from '@/components/home/TodaysScriptureCard';
import { SmallStepsCard } from '@/components/home/SmallStepsCard';
import { ThisWeeksWalk } from '@/components/home/ThisWeeksWalk';
import { MilestoneShelf } from '@/components/home/MilestoneShelf';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Day1LaunchScreen } from '@/components/onboarding/Day1LaunchScreen';
import { FreeChapterUnlockedDialog } from '@/components/rewards/FreeChapterUnlockedDialog';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useProfile } from '@/hooks/useProfile';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePrayers } from '@/hooks/usePrayers';
import { useSessions } from '@/hooks/useSessions';
import { useMilestoneChecker } from '@/hooks/useMilestoneChecker';
import { useFreeChapter } from '@/hooks/useFreeChapter';
import { User, Flame, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { MilestoneStats } from '@/lib/milestonesV2';

export default function Index() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { progress, loading: progressLoading, checkStreakStatus } = useUserProgress();
  const { prayers } = usePrayers();
  const { sessions, todaySession, loading: sessionsLoading, getWeeklyData, getWeeklyVersesRead } = useSessions();
  const { checkAndAwardMilestones } = useMilestoneChecker();
  const { shouldShowUnlock, downloadChapter, closeDialog } = useFreeChapter();
  const [freeChapterOpen, setFreeChapterOpen] = useState(false);
  const [showDay1Launch, setShowDay1Launch] = useState(false);
  const [pendingOnboardingData, setPendingOnboardingData] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('home-instructions-dismissed') !== 'true';
  });
  const formattedDate = getFormattedDate();

  const dismissInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('home-instructions-dismissed', 'true');
  };

  useEffect(() => {
    if (shouldShowUnlock) {
      const timer = setTimeout(() => setFreeChapterOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowUnlock]);

  useEffect(() => {
    if (!profileLoading && !progressLoading && !sessionsLoading && profile) {
      checkStreakStatus();
      checkAndAwardMilestones();
    }
  }, [profileLoading, progressLoading, sessionsLoading, profile]);

  const handleOnboardingComplete = async (data: any) => {
    setPendingOnboardingData(data);
    if (data?.journey) {
      try { localStorage.setItem('faithfit-journey', data.journey); } catch {}
    }
    setShowDay1Launch(true);
  };

  const handleDay1LaunchComplete = async () => {
    if (pendingOnboardingData) {
      await updateProfile({
        name: pendingOnboardingData.name,
        commitment: pendingOnboardingData.commitment,
        preferred_time: pendingOnboardingData.preferredTime,
        focus_areas: pendingOnboardingData.focusAreas,
        weekly_goal: pendingOnboardingData.weeklyGoal,
      });
      setPendingOnboardingData(null);
    }
    setShowDay1Launch(false);
  };

  if (profileLoading || progressLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Flame className="h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  if (showDay1Launch && pendingOnboardingData) {
    return (
      <Day1LaunchScreen
        userName={pendingOnboardingData.name}
        journey={pendingOnboardingData.journey}
        onComplete={handleDay1LaunchComplete}
      />
    );
  }

  if (profile && !profile.name) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const userName = profile?.name || 'Friend';
  const currentStreak = progress?.current_streak || 0;
  const totalSessions = progress?.total_sessions || 0;
  const journey = (typeof window !== 'undefined' && (localStorage.getItem('faithfit-journey') as any)) || 'new';
  const isReturning = journey === 'returning' || journey === 'longtime';

  const todaySteps = [
    { name: 'Worship', icon: '🎵', completed: todaySession?.worship_completed || false, duration: '15 min' },
    { name: 'Scripture', icon: '📖', completed: todaySession?.scripture_completed || false, duration: '10 min' },
    { name: 'Prayer', icon: '🙏', completed: todaySession?.prayer_completed || false, duration: '10 min' },
    { name: 'Reflect', icon: '✍️', completed: todaySession?.reflection_completed || false, duration: '5 min' },
  ];

  // Weekly metrics
  const weeklySessions = getWeeklyData().filter((d) => d === 1).length;
  const weeklyPrayers = prayers.filter((p) => {
    const d = new Date(p.created_at);
    const w = new Date();
    w.setDate(w.getDate() - 7);
    return d >= w;
  }).length;
  const weeklyScriptures = getWeeklyVersesRead();
  const weeklyReflections = (sessions || []).filter((s) => {
    if (!s.reflection_completed) return false;
    const d = new Date(s.created_at);
    const w = new Date();
    w.setDate(w.getDate() - 7);
    return d >= w;
  }).length;

  // Days walked this month
  const daysWalkedThisMonth = (() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const days = new Set<string>();
    (sessions || []).forEach((s) => {
      const d = new Date(s.created_at);
      if (d.getMonth() === month && d.getFullYear() === year) {
        days.add(d.toISOString().slice(0, 10));
      }
    });
    return days.size;
  })();

  const milestoneStats: MilestoneStats = {
    prayersCount: prayers.length,
    sessionsCount: totalSessions,
    reflectionsCount: (sessions || []).filter((s) => s.reflection_completed).length,
    chaptersReadCount: (sessions || []).reduce((sum, s) => sum + (s.verses_read || 0), 0) / 20 | 0,
    encouragementsSent: 0,
    circlesJoined: 0,
    daysWalkedThisMonth,
    longestStreak: progress?.longest_streak || 0,
    currentStreak,
  };

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />

          <div className="relative px-4 pt-6 pb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm text-primary uppercase tracking-[0.3em] font-semibold">
                  {formattedDate}
                </p>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground leading-[1.05] tracking-tight">
                  {isReturning ? 'Welcome back,' : 'Hello,'}
                  <br />
                  <span className="text-primary">{userName}.</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  {isReturning ? "Let's continue walking with God today." : "Let's walk with God today."}
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
        </div>

        <div className="px-4 pb-28 space-y-5">
          {showInstructions && (
            <div className="relative rounded-xl border border-border bg-card p-4 border-l-2 border-l-primary">
              <button
                onClick={dismissInstructions}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-foreground">Welcome home.</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    No pressure, no streaks to defend. Just a quiet companion for your walk with God.
                    Start with how you're feeling today, and we'll meet you there.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 1. Daily Check-in */}
          <DailyCheckIn />

          {/* 2. Today's Focus */}
          <TodaysFocusCard />

          {/* 3. Today's Walk (4 steps) */}
          <WorkoutCard
            steps={todaySteps}
            allCompleted={todaySteps.every((s) => s.completed)}
          />

          {/* 4. Journey progress */}
          <JourneyProgressCard />

          {/* 5. Today's Scripture */}
          <TodaysScriptureCard />

          {/* 6. Small Steps */}
          <SmallStepsCard />

          {/* 7. Grace-based streak */}
          <GraceStreakBadge
            currentStreak={currentStreak}
            daysWalkedThisMonth={daysWalkedThisMonth}
            lastSessionDate={progress?.last_session_date}
          />

          {/* 8. This Week's Walk */}
          <ThisWeeksWalk
            sessions={weeklySessions}
            prayers={weeklyPrayers}
            reflections={weeklyReflections}
            scriptures={weeklyScriptures}
          />

          {/* 9. Milestones */}
          <MilestoneShelf stats={milestoneStats} />

          {/* Gentle footer */}
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground italic">
              One step. One day. He meets you here.
            </p>
          </div>
        </div>
      </div>

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

      <OnboardingTour />
    </PageLayout>
  );
}

function getFormattedDate() {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();
}
