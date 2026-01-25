import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useFollows } from '@/hooks/useFollows';
import { PaywallModal } from '@/components/paywall/PaywallModal';

interface FollowButtonProps {
  userId: string;
  userName?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FollowButton({ userId, userName, size = 'sm', variant = 'outline' }: FollowButtonProps) {
  const { isFollowing, followUser, unfollowUser } = useFollows();
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallData, setPaywallData] = useState<{ limit?: number; current_usage?: number } | null>(null);

  const following = isFollowing(userId);

  const handleClick = async () => {
    setLoading(true);
    
    if (following) {
      await unfollowUser(userId);
    } else {
      const result = await followUser(userId);
      if (result.error?.message === 'limit_reached' && result.paywallData) {
        const data = result.paywallData as { limit?: number; current_usage?: number };
        setPaywallData(data);
        setShowPaywall(true);
      }
    }
    
    setLoading(false);
  };

  return (
    <>
      <Button
        size={size}
        variant={following ? 'outline' : 'default'}
        onClick={handleClick}
        disabled={loading}
        className={following ? 'border-muted-foreground/30' : ''}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : following ? (
          <>
            <UserMinus className="h-4 w-4 mr-1" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Follow
          </>
        )}
      </Button>

      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        feature="unlimited_follows"
        currentUsage={paywallData?.current_usage}
        limit={paywallData?.limit}
        title="FOLLOW LIMIT REACHED"
        message={`You're following ${paywallData?.current_usage || 0}/${paywallData?.limit || 25} users (free limit). Upgrade to Premium to follow unlimited training partners.`}
      />
    </>
  );
}
