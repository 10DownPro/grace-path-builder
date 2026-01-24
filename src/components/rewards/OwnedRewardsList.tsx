import { UserReward } from '@/hooks/useRewards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OwnedRewardsListProps {
  userRewards: UserReward[];
  onEquip: (userRewardId: string, equip: boolean) => void;
}

export function OwnedRewardsList({ userRewards, onEquip }: OwnedRewardsListProps) {
  if (userRewards.length === 0) {
    return (
      <div className="gym-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎁</span>
        </div>
        <h3 className="font-display text-lg text-foreground uppercase mb-2">No Rewards Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start earning points and redeem your first reward!
        </p>
      </div>
    );
  }

  const equippedRewards = userRewards.filter(ur => ur.is_equipped);
  const unequippedRewards = userRewards.filter(ur => !ur.is_equipped);

  return (
    <div className="space-y-4">
      {/* Equipped section */}
      {equippedRewards.length > 0 && (
        <div>
          <h3 className="font-display text-sm text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Equipped ({equippedRewards.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {equippedRewards.map((ur) => (
              <div
                key={ur.id}
                className="gym-card p-3 border-primary/50 bg-primary/5 relative"
              >
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-[10px] px-1">
                    <Check className="h-3 w-3" />
                  </Badge>
                </div>
                <div className="text-center">
                  <span className="text-2xl">{ur.reward?.icon_emoji || '🎁'}</span>
                  <p className="font-display text-xs text-foreground uppercase mt-1 truncate">
                    {ur.reward?.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs h-7"
                  onClick={() => onEquip(ur.id, false)}
                >
                  Unequip
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection section */}
      {unequippedRewards.length > 0 && (
        <div>
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Collection ({unequippedRewards.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unequippedRewards.map((ur) => (
              <div
                key={ur.id}
                className="gym-card p-3 hover:border-primary/30 transition-colors"
              >
                <div className="text-center">
                  <span className="text-2xl">{ur.reward?.icon_emoji || '🎁'}</span>
                  <p className="font-display text-xs text-foreground uppercase mt-1 truncate">
                    {ur.reward?.name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs h-7"
                  onClick={() => onEquip(ur.id, true)}
                >
                  Equip
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
