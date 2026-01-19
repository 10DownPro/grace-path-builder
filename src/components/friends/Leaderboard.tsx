import { Friend } from '@/hooks/useFriends';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Crown, Medal } from 'lucide-react';

interface LeaderboardProps {
  friends: Friend[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  current_streak: number;
  total_sessions: number;
  isMe: boolean;
}

export function Leaderboard({ friends }: LeaderboardProps) {
  const { progress } = useUserProgress();
  const { profile } = useProfile();

  // Combine friends with current user
  const allEntries: LeaderboardEntry[] = [
    ...(progress && profile ? [{
      id: 'me',
      name: profile.name || 'You',
      current_streak: progress.current_streak,
      total_sessions: progress.total_sessions,
      isMe: true
    }] : []),
    ...friends.map(f => ({
      id: f.id,
      name: f.name,
      current_streak: f.current_streak,
      total_sessions: f.total_sessions,
      isMe: false
    }))
  ];

  // Sort by streak, then by total sessions
  const streakLeaderboard = [...allEntries].sort((a, b) => {
    if (b.current_streak !== a.current_streak) {
      return b.current_streak - a.current_streak;
    }
    return b.total_sessions - a.total_sessions;
  });

  const sessionsLeaderboard = [...allEntries].sort((a, b) => {
    return b.total_sessions - a.total_sessions;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground w-5 text-center">{rank + 1}</span>;
    }
  };

  const getRankBackground = (rank: number, isMe: boolean) => {
    if (isMe) {
      return 'bg-primary/10 border-primary/30';
    }
    switch (rank) {
      case 0:
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 1:
        return 'bg-gray-300/10 border-gray-400/30';
      case 2:
        return 'bg-amber-600/10 border-amber-700/30';
      default:
        return '';
    }
  };

  if (allEntries.length <= 1) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">Add Friends to See Rankings</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            The leaderboard shows how you stack up against your squad
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Streak Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {streakLeaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBackground(index, entry.isMe)}`}
              >
                <div className="w-6 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${entry.isMe ? 'text-primary' : ''}`}>
                      {entry.isMe ? `${entry.name} (You)` : entry.name}
                    </span>
                    {index === 0 && entry.current_streak >= 7 && (
                      <Badge className="bg-orange-500 text-xs">On Fire!</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-bold text-orange-500">
                  <Flame className="h-4 w-4" />
                  {entry.current_streak}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Total Sessions Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Session Champions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessionsLeaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBackground(index, entry.isMe)}`}
              >
                <div className="w-6 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-medium truncate ${entry.isMe ? 'text-primary' : ''}`}>
                    {entry.isMe ? `${entry.name} (You)` : entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-yellow-600">
                  <Trophy className="h-4 w-4" />
                  {entry.total_sessions}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
