import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PointsBalance } from '@/components/rewards/PointsBalance';
import { RewardCard } from '@/components/rewards/RewardCard';
import { OwnedRewardsList } from '@/components/rewards/OwnedRewardsList';
import { useRewards } from '@/hooks/useRewards';
import { useProfile } from '@/hooks/useProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Sparkles, Wrench, Crown, Package, Loader2 } from 'lucide-react';

export default function Rewards() {
  const { 
    rewards, 
    userRewards, 
    userPoints, 
    loading, 
    redeeming,
    redeemReward, 
    equipReward,
    hasReward,
    getRewardsByCategory 
  } = useRewards();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('shop');

  const isPremium = profile?.is_premium || false;

  const handleRedeem = async (rewardId: string) => {
    await redeemReward(rewardId);
  };

  const handleEquip = async (rewardIdOrUserRewardId: string, equip: boolean) => {
    // Find the user reward by reward_id first
    const userReward = userRewards.find(ur => ur.reward_id === rewardIdOrUserRewardId || ur.id === rewardIdOrUserRewardId);
    if (userReward) {
      await equipReward(userReward.id, equip);
    }
  };

  const cosmeticRewards = getRewardsByCategory('cosmetic');
  const functionalRewards = getRewardsByCategory('functional');
  const exclusiveRewards = getRewardsByCategory('exclusive');

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/20 via-background to-background" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(hsl(var(--warning)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--warning)) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative px-4 pt-6 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-foreground uppercase tracking-wide">
                  Rewards Shop
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Earn. Collect. Equip.
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-warning via-primary to-warning" />
        </div>

        <div className="px-4 pb-28 space-y-5 mt-4">
          {/* Points Balance */}
          <PointsBalance points={userPoints} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="shop" className="font-display uppercase text-xs tracking-wide">
                <Gift className="h-4 w-4 mr-2" />
                Shop
              </TabsTrigger>
              <TabsTrigger value="owned" className="font-display uppercase text-xs tracking-wide">
                <Package className="h-4 w-4 mr-2" />
                My Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="mt-4 space-y-6">
              {/* Cosmetic Rewards */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-sm text-primary uppercase tracking-wide">
                    Cosmetics
                  </h2>
                  <span className="text-xs text-muted-foreground">({cosmeticRewards.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cosmeticRewards.map(reward => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userPoints={userPoints}
                      isOwned={hasReward(reward.id)}
                      isEquipped={userRewards.find(ur => ur.reward_id === reward.id)?.is_equipped}
                      isRedeeming={redeeming === reward.id}
                      isPremium={isPremium}
                      onRedeem={handleRedeem}
                      onEquip={handleEquip}
                    />
                  ))}
                </div>
              </div>

              {/* Functional Rewards */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-success" />
                  <h2 className="font-display text-sm text-success uppercase tracking-wide">
                    Functional
                  </h2>
                  <span className="text-xs text-muted-foreground">({functionalRewards.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {functionalRewards.map(reward => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userPoints={userPoints}
                      isOwned={hasReward(reward.id)}
                      isEquipped={userRewards.find(ur => ur.reward_id === reward.id)?.is_equipped}
                      isRedeeming={redeeming === reward.id}
                      isPremium={isPremium}
                      onRedeem={handleRedeem}
                      onEquip={handleEquip}
                    />
                  ))}
                </div>
              </div>

              {/* Exclusive Rewards */}
              {exclusiveRewards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-4 w-4 text-warning" />
                    <h2 className="font-display text-sm text-warning uppercase tracking-wide">
                      Premium Exclusive
                    </h2>
                    <span className="text-xs text-muted-foreground">({exclusiveRewards.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exclusiveRewards.map(reward => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        userPoints={userPoints}
                        isOwned={hasReward(reward.id)}
                        isEquipped={userRewards.find(ur => ur.reward_id === reward.id)?.is_equipped}
                        isRedeeming={redeeming === reward.id}
                        isPremium={isPremium}
                        onRedeem={handleRedeem}
                        onEquip={handleEquip}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="owned" className="mt-4">
              <OwnedRewardsList 
                userRewards={userRewards} 
                onEquip={(id, equip) => equipReward(id, equip)} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
