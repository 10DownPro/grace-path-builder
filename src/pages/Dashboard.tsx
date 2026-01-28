import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { GettingStartedChecklist, defaultChecklistItems } from '@/components/dashboard/GettingStartedChecklist';
import { useProfile } from '@/hooks/useProfile';
import { useProgress } from '@/hooks/useProgress';
import { useSessions } from '@/hooks/useSessions';
import { usePrayers } from '@/hooks/usePrayers';
import { useSquads } from '@/hooks/useSquads';
import { Flame, Trophy, Target, Clock, Dumbbell, BookOpen, Users, Sword } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useProfile();
  const { progress } = useProgress();
  const { sessions } = useSessions();
  const { prayers } = usePrayers();
  const { squads } = useSquads();

  // Build activity feed from recent data
  const activities = [];
  
  // Add recent sessions
  if (sessions && sessions.length > 0) {
    const recentSession = sessions[0];
    activities.push({
      id: `session-${recentSession.id}`,
      type: 'session' as const,
      title: 'Training Completed',
      description: `${recentSession.duration_minutes} minute session`,
      timestamp: new Date(recentSession.created_at),
    });
  }

  // Add recent prayers
  if (prayers && prayers.length > 0) {
    const recentPrayer = prayers[0];
    activities.push({
      id: `prayer-${recentPrayer.id}`,
      type: 'prayer' as const,
      title: 'Prayer Added',
      description: recentPrayer.content.substring(0, 50) + '...',
      timestamp: new Date(recentPrayer.created_at),
    });
  }

  // Add streak milestone if applicable
  if (progress?.currentStreak && progress.currentStreak > 0) {
    activities.push({
      id: 'streak-current',
      type: 'streak' as const,
      title: `${progress.currentStreak} Day Streak! 🔥`,
      description: 'Keep up the momentum!',
      timestamp: new Date(),
    });
  }

  // Sort activities by timestamp
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Build checklist items with actual completion status
  const checklistItems = defaultChecklistItems.map((item) => {
    switch (item.id) {
      case 'first-session':
        return { ...item, completed: sessions && sessions.length > 0 };
      case 'first-prayer':
        return { ...item, completed: prayers && prayers.length > 0 };
      case 'join-squad':
        return { ...item, completed: squads && squads.length > 0 };
      default:
        return item;
    }
  });

  const isNewUser = checklistItems.filter((item) => item.completed).length < 3;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide">
            Welcome back, {profile?.name || 'Soldier'}!
          </h1>
          <p className="text-muted-foreground">
            Ready to train your faith today?
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Streak"
            value={progress?.currentStreak || 0}
            icon={<Flame className="h-6 w-6" />}
            description="Days in a row"
            variant="primary"
          />
          <MetricCard
            title="Total Points"
            value={0}
            icon={<Trophy className="h-6 w-6" />}
            description="Earned so far"
            variant="warning"
          />
          <MetricCard
            title="Prayers"
            value={prayers?.length || 0}
            icon={<Target className="h-6 w-6" />}
            description="Active requests"
            variant="success"
          />
          <MetricCard
            title="Sessions"
            value={progress?.totalSessions || 0}
            icon={<Clock className="h-6 w-6" />}
            description="Completed"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-display text-xl uppercase tracking-wide">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Start Training"
              description="Begin your daily session"
              icon={<Dumbbell className="h-6 w-6" />}
              to="/session"
              variant="primary"
            />
            <QuickActionCard
              title="Battle Verses"
              description="Find strength for today"
              icon={<Sword className="h-6 w-6" />}
              to="/battles"
            />
            <QuickActionCard
              title="Read Scripture"
              description="Dive into the Word"
              icon={<BookOpen className="h-6 w-6" />}
              to="/scripture"
            />
            <QuickActionCard
              title="View Squad"
              description="Train with friends"
              icon={<Users className="h-6 w-6" />}
              to="/friends"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Getting Started Checklist - for new users */}
          {isNewUser && (
            <GettingStartedChecklist items={checklistItems} />
          )}

          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
