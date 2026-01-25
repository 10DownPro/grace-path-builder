import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  currentUsage?: number;
  limit?: number;
  title?: string;
  message?: string;
  showBookOption?: boolean;
}

const FEATURE_BENEFITS: Record<string, string> = {
  unlimited_follows: 'Follow unlimited training partners',
  unlimited_posts: 'Create unlimited posts each week',
  unlimited_testimonies: 'Share unlimited testimonies',
  unlimited_squads: 'Join unlimited training squads',
  unlimited_friends: 'Add unlimited training partners',
  unlimited_saved_verses: 'Save unlimited Battle Verses',
  unlimited_prayer_support: 'Support unlimited prayers',
};

export function PaywallModal({
  open,
  onOpenChange,
  feature,
  currentUsage,
  limit,
  title,
  message,
  showBookOption = true
}: PaywallModalProps) {
  const navigate = useNavigate();

  const defaultTitle = limit 
    ? 'LIMIT REACHED' 
    : 'UPGRADE TO PREMIUM';
  
  const defaultMessage = limit
    ? `You've used ${currentUsage}/${limit} ${feature.replace('unlimited_', '').replace(/_/g, ' ')} this period. Upgrade to Premium for unlimited access.`
    : 'This feature requires Premium. Upgrade to unlock all features.';

  const handleUpgrade = (plan: 'monthly' | 'annual') => {
    onOpenChange(false);
    navigate('/settings', { state: { openPremium: true, plan } });
  };

  const handleBookOption = () => {
    onOpenChange(false);
    navigate('/settings', { state: { openBookCode: true } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-primary">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="font-display text-2xl uppercase tracking-wide text-center">
            {title || defaultTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            {message || defaultMessage}
          </p>

          {/* Benefits */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{FEATURE_BENEFITS[feature] || 'Unlimited access to this feature'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Ad-free experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>All premium features unlocked</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Priority support</span>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3">
            {/* Annual - Best Value */}
            <button
              onClick={() => handleUpgrade('annual')}
              className="w-full p-4 rounded-lg border-2 border-primary bg-primary/10 text-left transition-all hover:bg-primary/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase">Best Value</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">Annual Premium</div>
                  <div className="text-sm text-muted-foreground">$3.25/month • Save 35%</div>
                </div>
                <div className="text-2xl font-bold text-primary">$39/yr</div>
              </div>
            </button>

            {/* Monthly */}
            <button
              onClick={() => handleUpgrade('monthly')}
              className="w-full p-4 rounded-lg border-2 border-border bg-background text-left transition-all hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-foreground">Monthly Premium</div>
                  <div className="text-sm text-muted-foreground">Cancel anytime</div>
                </div>
                <div className="text-2xl font-bold text-foreground">$4.99/mo</div>
              </div>
            </button>

            {/* Book Option */}
            {showBookOption && (
              <button
                onClick={handleBookOption}
                className="w-full p-4 rounded-lg border-2 border-green-600 bg-green-600/10 text-left transition-all hover:bg-green-600/20"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-green-500 uppercase">Lifetime Premium</div>
                    <div className="text-foreground font-bold">Have the Book? Redeem Code</div>
                    <div className="text-xs text-muted-foreground">Unlock forever with your book code</div>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Dismiss */}
          <div className="text-center pt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
