import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Clock, Sparkles } from 'lucide-react';
import { useFunctionalRewards, ActiveReward } from '@/hooks/useFunctionalRewards';
import { formatDistanceToNow } from 'date-fns';

interface ActiveBoostersCardProps {
  compact?: boolean;
}

export function ActiveBoostersCard({ compact = false }: ActiveBoostersCardProps) {
  const { 
    activeRewards, 
    loading, 
    hasActiveDoubleXP, 
    hasStreakFreeze,
    getDoubleXPExpiry,
    getStreakFreezeCount,
    activateReward
  } = useFunctionalRewards();

  const doubleXPExpiry = getDoubleXPExpiry();
  const streakFreezeCount = getStreakFreezeCount();

  // Filter to only functional rewards
  const functionalRewards = activeRewards.filter(r => 
    ['consumable', 'booster'].includes(r.reward_type)
  );

  if (loading || functionalRewards.length === 0) {
    return null;
  }

  const handleActivate = async (reward: ActiveReward) => {
    await activateReward(reward.id);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {hasActiveDoubleXP() && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1">
            <Zap className="h-3 w-3" />
            2x XP
            {doubleXPExpiry && (
              <span className="text-xs opacity-75">
                ({formatDistanceToNow(doubleXPExpiry, { addSuffix: false })})
              </span>
            )}
          </Badge>
        )}
        {hasStreakFreeze() && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {streakFreezeCount}x Freeze
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Active Power-Ups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Double XP Status */}
        {hasActiveDoubleXP() && doubleXPExpiry ? (
          <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="font-medium text-yellow-500">Double XP Active!</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expires {formatDistanceToNow(doubleXPExpiry, { addSuffix: true })}
                </div>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-white">2x</Badge>
          </div>
        ) : (
          functionalRewards
            .filter(r => r.effect === 'double_xp')
            .map(reward => (
              <div key={reward.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">{reward.reward_name}</div>
                    <div className="text-xs text-muted-foreground">Doubles points for 24 hours</div>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleActivate(reward)}>
                  Activate
                </Button>
              </div>
            ))
        )}

        {/* Streak Freeze Status */}
        {hasStreakFreeze() && (
          <div className="flex items-center justify-between bg-blue-500/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium text-blue-500">Streak Freeze</div>
                <div className="text-xs text-muted-foreground">
                  Protects your streak for 1 missed day
                </div>
              </div>
            </div>
            <Badge variant="secondary">{streakFreezeCount}x</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
