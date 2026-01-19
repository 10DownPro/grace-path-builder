import { PageLayout } from '@/components/layout/PageLayout';
import { StreakBadge } from '@/components/home/StreakBadge';
import { TodayCard } from '@/components/home/TodayCard';
import { ScriptureCard } from '@/components/home/ScriptureCard';
import { EncouragementBanner } from '@/components/home/EncouragementBanner';
import { ThisWeekCard } from '@/components/home/ThisWeekCard';
import { useProgress } from '@/hooks/useProgress';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const todaySteps = [
  { name: 'Worship', icon: '🎵', completed: true, duration: '5 min' },
  { name: 'Scripture', icon: '📖', completed: true, duration: '10 min' },
  { name: 'Prayer', icon: '🙏', completed: false, duration: '10 min' },
  { name: 'Reflect', icon: '✍️', completed: false, duration: '5 min' },
];

export default function Index() {
  const { progress } = useProgress();
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  return (
    <PageLayout>
      <div className="px-5 pt-14 pb-8 space-y-8 stagger-children">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <h1 className="text-2xl font-semibold text-foreground">{greeting}</h1>
            <p className="text-muted-foreground">Ready to grow today?</p>
          </div>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Streak */}
        <StreakBadge streak={progress.currentStreak} />

        {/* Today's Session */}
        <TodayCard 
          steps={todaySteps} 
          allCompleted={todaySteps.every(s => s.completed)} 
        />

        {/* This Week Stats */}
        <ThisWeekCard prayersLogged={12} versesRead={28} />

        {/* Encouragement */}
        <EncouragementBanner />

        {/* Today's Scripture */}
        <ScriptureCard />

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Sessions" value={progress.totalSessions} />
          <StatCard label="Minutes" value={progress.totalMinutes} />
          <StatCard label="Best Streak" value={progress.longestStreak} />
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="spiritual-card p-4 text-center">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}
