import { PageLayout } from '@/components/layout/PageLayout';
import { StreakBadge } from '@/components/home/StreakBadge';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { WeeklyGrind } from '@/components/home/WeeklyGrind';
import { MissionCard } from '@/components/home/MissionCard';
import { BattleVerse } from '@/components/home/BattleVerse';
import { useProgress } from '@/hooks/useProgress';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const todaySteps = [
  { name: 'Worship', icon: '🎵', completed: true, duration: '15 min' },
  { name: 'Scripture', icon: '📖', completed: true, duration: '10 min' },
  { name: 'Prayer', icon: '🙏', completed: false, duration: '10 min' },
  { name: 'Reflect', icon: '✍️', completed: false, duration: '5 min' },
];

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
  const { progress } = useProgress();
  const formattedDate = getFormattedDate();
  
  // Get consistent daily mission
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayMission = dailyMissions[dayOfYear % dailyMissions.length];

  return (
    <PageLayout>
      <div className="min-h-screen texture-noise">
        <div className="px-4 pt-6 pb-28 space-y-6 stagger-children">
          {/* Header */}
          <div className="flex items-start justify-between border-b-4 border-primary pb-5">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                {formattedDate}
              </p>
              <h1 className="font-display text-4xl text-foreground uppercase tracking-wide">
                Time to Train
              </h1>
              <p className="text-sm text-primary uppercase tracking-wide font-medium">
                No days off. No excuses.
              </p>
            </div>
            <Link to="/settings">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Streak Badge */}
          <StreakBadge streak={progress.currentStreak} />

          {/* Today's Workout */}
          <WorkoutCard 
            steps={todaySteps} 
            allCompleted={todaySteps.every(s => s.completed)} 
          />

          {/* Weekly Stats */}
          <WeeklyGrind 
            sessions={progress.totalSessions} 
            prayers={12} 
            verses={18} 
          />

          {/* Daily Mission */}
          <MissionCard mission={todayMission} />

          {/* Battle Verse */}
          <BattleVerse />

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Sessions" value={progress.totalSessions} />
            <StatCard label="Total Minutes" value={progress.totalMinutes} />
            <StatCard label="Best Streak" value={progress.longestStreak} />
          </div>

          {/* Motivational Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Faith won't build itself. Put in the work.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="gym-card p-4 text-center">
      <p className="stat-number text-3xl">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
        {label}
      </p>
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
