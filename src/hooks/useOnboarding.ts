import { useState, useEffect } from 'react';

export interface OnboardingData {
  name: string;
  commitment: 'starter' | 'committed' | 'warrior';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  focusAreas: string[];
  weeklyGoal: number;
  hasBook: boolean;
  completedAt: string;
}

const ONBOARDING_KEY = 'faith-training-onboarding';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as OnboardingData;
        setUserData(data);
        setIsComplete(true);
      } catch {
        setIsComplete(false);
      }
    } else {
      setIsComplete(false);
    }
  }, []);

  const completeOnboarding = (data: Omit<OnboardingData, 'completedAt'>) => {
    const fullData: OnboardingData = {
      ...data,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(fullData));
    setUserData(fullData);
    setIsComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setUserData(null);
    setIsComplete(false);
  };

  return {
    isComplete,
    userData,
    completeOnboarding,
    resetOnboarding,
  };
}
