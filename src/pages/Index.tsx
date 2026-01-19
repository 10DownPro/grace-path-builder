import { PageLayout } from '@/components/layout/PageLayout';
import { StreakBadge } from '@/components/home/StreakBadge';
import { TodayCard } from '@/components/home/TodayCard';
import { ScriptureCard } from '@/components/home/ScriptureCard';
import { EncouragementBanner } from '@/components/home/EncouragementBanner';
import { useProgress } from '@/hooks/useProgress';
import { todayScripture } from '@/lib/sampleData';
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

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6 stagger-children">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground">{greeting}</p>
            <h1 className="text-2xl font-bold text-foreground">Ready to grow today?</h1>
          </div>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
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

        {/* Encouragement */}
        <EncouragementBanner />

        {/* Today's Scripture */}
        <ScriptureCard scripture={todayScripture} />

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-3">
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
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}
