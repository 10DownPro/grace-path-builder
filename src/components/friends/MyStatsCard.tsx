import { Card, CardContent } from '@/components/ui/card';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useSessions } from '@/hooks/useSessions';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { Friend } from '@/hooks/useFriends';

interface MyStatsCardProps {
  friends: Friend[];
}

export function MyStatsCard({ friends }: MyStatsCardProps) {
  const { progress } = useUserProgress();
  const { sessions } = useSessions();

  // Calculate actual stats from sessions
  const completedSessions = sessions.filter(s => s.completed_at !== null);
  const totalSessions = completedSessions.length;
  
  // Calculate streak
  const calculateStreak = () => {
    if (completedSessions.length === 0) return 0;
    
    const sortedDates = completedSessions
      .map(s => s.session_date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentDate = new Date(sortedDates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    const isActiveStreak = mostRecentDate.getTime() === today.getTime() || 
                           mostRecentDate.getTime() === yesterday.getTime();
    
    if (!isActiveStreak) return 0;
    
    let currentStreak = 1;
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
    
    return currentStreak;
  };
  
  const currentStreak = calculateStreak();

  // Calculate rank among friends
  const allEntries = [
    { current_streak: currentStreak, total_sessions: totalSessions, isMe: true },
    ...friends.map(f => ({
      current_streak: f.current_streak,
      total_sessions: f.total_sessions,
      isMe: false
    }))
  ];

  const streakRanked = [...allEntries].sort((a, b) => b.current_streak - a.current_streak);
  const sessionsRanked = [...allEntries].sort((a, b) => b.total_sessions - a.total_sessions);
  
  const myStreakRank = streakRanked.findIndex(e => e.isMe) + 1;
  const mySessionsRank = sessionsRanked.findIndex(e => e.isMe) + 1;

  const stats = [
    { 
      label: 'Streak', 
      value: currentStreak, 
      suffix: 'd',
      icon: Flame, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    { 
      label: 'Sessions', 
      value: totalSessions, 
      suffix: '',
      icon: Target, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Streak Rank', 
      value: `#${myStreakRank}`, 
      suffix: '',
      icon: Trophy, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      label: 'Session Rank', 
      value: `#${mySessionsRank}`, 
      suffix: '',
      icon: TrendingUp, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <h3 className="font-semibold text-sm uppercase tracking-wide">Your Position</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`w-8 h-8 mx-auto rounded-lg ${stat.bgColor} flex items-center justify-center mb-1`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="font-bold text-lg">
                {stat.value}{stat.suffix}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
