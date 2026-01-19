import { Challenge } from '@/hooks/useFriends';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface ChallengesListProps {
  challenges: Challenge[];
  loading: boolean;
  onAccept: (challengeId: string) => Promise<{ error: Error | null }>;
  onDecline: (challengeId: string) => Promise<{ error: Error | null }>;
}

export function ChallengesList({ challenges, loading, onAccept, onDecline }: ChallengesListProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Swords className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No Active Challenges</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Challenge a friend to push each other toward greater faithfulness!
          </p>
        </CardContent>
      </Card>
    );
  }

  const pendingChallenges = challenges.filter(c => c.status === 'pending');
  const activeChallenges = challenges.filter(c => c.status === 'active');

  return (
    <div className="space-y-4">
      {/* Pending Challenges */}
      {pendingChallenges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Pending Challenges
          </h3>
          {pendingChallenges.map((challenge) => {
            const isChallenger = challenge.challenger_id === user?.id;
            const opponentName = isChallenger ? challenge.challenged_name : challenge.challenger_name;
            
            return (
              <Card key={challenge.id} className="border-orange-500/30 bg-orange-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-orange-500/20 border-orange-500/30 text-orange-600">
                          {isChallenger ? 'Sent' : 'Incoming'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {isChallenger ? `to ${opponentName}` : `from ${opponentName}`}
                        </span>
                      </div>
                      <h4 className="font-semibold">{challenge.challenge_name}</h4>
                      {challenge.description && (
                        <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Ends {format(new Date(challenge.end_date), 'MMM d')}
                      </div>
                    </div>
                    
                    {!isChallenger && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onAccept(challenge.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDecline(challenge.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Active Challenges
          </h3>
          {activeChallenges.map((challenge) => {
            const isChallenger = challenge.challenger_id === user?.id;
            const opponentName = isChallenger ? challenge.challenged_name : challenge.challenger_name;
            const myProgress = (challenge.my_progress / challenge.target_value) * 100;
            const theirProgress = (challenge.their_progress / challenge.target_value) * 100;
            const daysLeft = differenceInDays(new Date(challenge.end_date), new Date());
            const isWinning = challenge.my_progress > challenge.their_progress;
            
            return (
              <Card key={challenge.id} className={isWinning ? 'border-green-500/30' : 'border-red-500/30'}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{challenge.challenge_name}</h4>
                        <p className="text-sm text-muted-foreground">vs {opponentName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={isWinning ? 'default' : 'secondary'} className={isWinning ? 'bg-green-500' : ''}>
                          {isWinning ? 'Winning!' : 'Keep going!'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {daysLeft} days left
                        </p>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">You</span>
                          <span>{challenge.my_progress} / {challenge.target_value}</span>
                        </div>
                        <Progress value={myProgress} className="h-2 bg-muted" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{opponentName}</span>
                          <span>{challenge.their_progress} / {challenge.target_value}</span>
                        </div>
                        <Progress value={theirProgress} className="h-2 bg-muted" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
