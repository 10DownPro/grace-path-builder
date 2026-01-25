import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'premium_monthly' | 'premium_annual' | 'lifetime_premium';
  subscription_status: 'active' | 'cancelled' | 'expired' | 'trialing';
  premium_source: 'subscription' | 'book_code' | 'promo' | 'admin_grant' | null;
  started_at: string | null;
  expires_at: string | null;
  auto_renew: boolean;
  book_code_used: string | null;
}

export interface FeatureAccess {
  has_access: boolean;
  reason: 'free_feature' | 'premium_user' | 'within_free_limit' | 'limit_reached' | 'premium_required';
  remaining?: number;
  limit?: number;
  current_usage?: number;
}

export function useSubscription() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setSubscription(data as Subscription | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Check if user has premium (from subscription or profile)
  const isPremium = useCallback(() => {
    // Check profile-based premium (from book code redemption)
    if (profile?.is_premium) return true;
    
    // Check subscription-based premium
    if (!subscription) return false;
    if (subscription.subscription_status !== 'active') return false;
    if (subscription.subscription_type === 'free') return false;
    
    // Check expiration for non-lifetime
    if (subscription.subscription_type !== 'lifetime_premium' && subscription.expires_at) {
      if (new Date(subscription.expires_at) < new Date()) return false;
    }
    
    return true;
  }, [subscription, profile]);

  const getSubscriptionType = useCallback(() => {
    if (profile?.is_premium && profile?.premium_source === 'book_code') {
      return 'lifetime_premium';
    }
    return subscription?.subscription_type || 'free';
  }, [subscription, profile]);

  const getPremiumSource = useCallback(() => {
    if (profile?.is_premium) {
      return profile.premium_source || 'book_code';
    }
    return subscription?.premium_source || null;
  }, [subscription, profile]);

  // Check access to a specific feature
  const checkFeatureAccess = useCallback(async (featureName: string): Promise<FeatureAccess> => {
    if (!user) {
      return { has_access: false, reason: 'premium_required' };
    }

    const { data, error } = await supabase.rpc('check_feature_access', {
      p_user_id: user.id,
      p_feature_name: featureName
    });

    if (error) {
      console.error('Error checking feature access:', error);
      return { has_access: false, reason: 'premium_required' };
    }

    const result = data as unknown as FeatureAccess;
    return result;
  }, [user]);

  // Increment feature usage after using a limited feature
  const incrementFeatureUsage = useCallback(async (featureName: string) => {
    if (!user) return;

    await supabase.rpc('increment_feature_usage', {
      p_user_id: user.id,
      p_feature_name: featureName
    });
  }, [user]);

  return {
    subscription,
    loading,
    isPremium: isPremium(),
    subscriptionType: getSubscriptionType(),
    premiumSource: getPremiumSource(),
    checkFeatureAccess,
    incrementFeatureUsage,
    refetch: fetchSubscription
  };
}
