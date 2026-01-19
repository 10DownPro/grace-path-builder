import { useProfile } from '@/hooks/useProfile';

export interface PremiumStatus {
  isPremium: boolean;
  premiumSource: string | null;
  bookCodeUsed: string | null;
  premiumActivatedAt: string | null;
  hasBook: boolean;
  hideBookPromos: boolean;
}

export function usePremium() {
  const { profile, updateProfile, loading } = useProfile();

  const premiumStatus: PremiumStatus = {
    isPremium: profile?.is_premium ?? false,
    premiumSource: profile?.premium_source ?? null,
    bookCodeUsed: profile?.book_code_used ?? null,
    premiumActivatedAt: profile?.premium_activated_at ?? null,
    hasBook: profile?.has_book ?? false,
    hideBookPromos: profile?.hide_book_promos ?? false,
  };

  const setHasBook = async (hasBook: boolean) => {
    return updateProfile({ has_book: hasBook });
  };

  const setHideBookPromos = async (hide: boolean) => {
    return updateProfile({ hide_book_promos: hide });
  };

  return {
    ...premiumStatus,
    loading,
    setHasBook,
    setHideBookPromos,
  };
}
