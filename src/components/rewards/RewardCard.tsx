import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reward } from '@/hooks/useRewards';
import { Lock, Check, Crown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  isOwned: boolean;
  isEquipped?: boolean;
  isRedeeming: boolean;
  isPremium: boolean;
  onRedeem: (rewardId: string) => void;
  onEquip?: (rewardId: string, equip: boolean) => void;
}

export function RewardCard({
  reward,
  userPoints,
  isOwned,
  isEquipped,
  isRedeeming,
  isPremium,
  onRedeem,
  onEquip
}: RewardCardProps) {
  const canAfford = userPoints >= reward.point_cost;
  const isPremiumLocked = reward.is_premium_only && !isPremium;
  const isSoldOut = reward.stock_limit !== null && reward.times_redeemed >= reward.stock_limit;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cosmetic': return 'bg-primary/20 text-primary border-primary/30';
      case 'functional': return 'bg-success/20 text-success border-success/30';
      case 'exclusive': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'badge': return 'Badge';
      case 'theme': return 'Theme';
      case 'streak_freeze': return 'Item';
      case 'xp_boost': return 'Boost';
      case 'frame': return 'Frame';
      default: return 'Reward';
    }
  };

  return (
    <div className={cn(
      "gym-card p-4 relative overflow-hidden transition-all duration-300",
      isOwned && "border-success/50 bg-success/5",
      !isOwned && canAfford && !isPremiumLocked && "hover:border-primary/50 hover:bg-primary/5",
      isPremiumLocked && "opacity-75"
    )}>
      {/* Premium lock overlay */}
      {isPremiumLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="text-center">
            <Crown className="h-6 w-6 text-warning mx-auto mb-1" />
            <p className="text-xs text-warning font-medium">PREMIUM ONLY</p>
          </div>
        </div>
      )}

      {/* Sold out overlay */}
      {isSoldOut && !isOwned && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <p className="text-sm text-muted-foreground font-display uppercase">SOLD OUT</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl">
            {reward.icon_emoji}
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-foreground">
              {reward.name}
            </h3>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getCategoryColor(reward.category))}>
              {getRewardTypeLabel(reward.reward_type)}
            </Badge>
          </div>
        </div>
        {isOwned && (
          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
            <Check className="h-4 w-4 text-success-foreground" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
        {reward.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-lg">💎</span>
          <span className={cn(
            "font-display text-lg",
            canAfford || isOwned ? "text-foreground" : "text-destructive"
          )}>
            {reward.point_cost.toLocaleString()}
          </span>
        </div>

        {isOwned ? (
          onEquip && (
            <Button
              variant={isEquipped ? "default" : "outline"}
              size="sm"
              onClick={() => onEquip(reward.id, !isEquipped)}
              className="text-xs"
            >
              {isEquipped ? 'Equipped' : 'Equip'}
            </Button>
          )
        ) : (
          <Button
            variant="default"
            size="sm"
            disabled={!canAfford || isPremiumLocked || isSoldOut || isRedeeming}
            onClick={() => onRedeem(reward.id)}
            className="text-xs"
          >
            {isRedeeming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !canAfford ? (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Need {(reward.point_cost - userPoints).toLocaleString()}
              </>
            ) : (
              'Redeem'
            )}
          </Button>
        )}
      </div>

      {/* Stock indicator */}
      {reward.stock_limit && !isOwned && !isSoldOut && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            {reward.stock_limit - reward.times_redeemed} remaining
          </p>
        </div>
      )}
    </div>
  );
}
