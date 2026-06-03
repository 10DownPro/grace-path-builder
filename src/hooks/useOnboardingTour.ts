import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="streak-badge"]',
    title: 'Your Walk With God',
    content: 'A simple marker of the days you spend with God. Keep walking — He is at work in you.',
    placement: 'bottom'
  },
  {
    id: 'workout',
    target: '[data-tour="workout-card"]',
    title: "Today's Walk",
    content: 'A clear rhythm: Worship, Scripture, Prayer, and Reflection. Take your next step — He meets you here.',
    placement: 'bottom'
  },
  {
    id: 'start-training',
    target: '[data-tour="start-training"]',
    title: 'Begin Today',
    content: 'Tap here to spend time with God. Most days take 15–30 minutes — start where you are.',
    placement: 'top'
  },
  {
    id: 'quick-actions',
    target: '[data-tour="quick-actions"]',
    title: 'Small Steps',
    content: 'Quick ways to turn toward God during the day — a verse, a prayer, a word of thanks.',
    placement: 'top'
  },
  {
    id: 'weekly-grind',
    target: '[data-tour="weekly-grind"]',
    title: "This Week's Walk",
    content: 'See your week — sessions, prayers, and Scripture read. Growth, not perfection.',
    placement: 'top'
  },
  {
    id: 'navigation',
    target: '[data-tour="nav-train"]',
    title: 'Your Journey',
    content: 'Jump back into your time with God anytime from here.',
    placement: 'top'
  },
  {
    id: 'prayer',
    target: '[data-tour="nav-prayer"]',
    title: 'Prayer Journal',
    content: 'A quiet place to talk with God using the ACTS rhythm: Adoration, Confession, Thanksgiving, Supplication.',
    placement: 'top'
  },
  {
    id: 'squad',
    target: '[data-tour="nav-squad"]',
    title: 'Walking Together',
    content: 'Connect with friends and faith circles. You aren\'t walking alone.',
    placement: 'top'
  }
];

export function useOnboardingTour() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<{
    tour_completed: boolean;
    current_step: number;
    steps_completed: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProgress({
        tour_completed: data.tour_completed,
        current_step: data.current_step,
        steps_completed: (data.steps_completed as string[]) || []
      });
      
      if (!data.tour_completed && data.current_step === 0) {
        const dismissed = localStorage.getItem('tour-dismissed');
        if (!dismissed) {
          setIsActive(true);
        }
      }
    } else if (!data) {
      const { data: newProgress, error: createError } = await supabase
        .from('user_onboarding_progress')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!createError && newProgress) {
        setProgress({
          tour_completed: false,
          current_step: 0,
          steps_completed: []
        });
        
        const dismissed = localStorage.getItem('tour-dismissed');
        if (!dismissed) {
          setIsActive(true);
        }
      }
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user, fetchProgress]);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const totalSteps = TOUR_STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const nextStep = useCallback(async () => {
    if (!user || !progress) return;

    const completedSteps = [...progress.steps_completed, currentStep.id];

    if (isLastStep) {
      await supabase
        .from('user_onboarding_progress')
        .update({
          tour_completed: true,
          current_step: totalSteps,
          steps_completed: completedSteps,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setProgress({
        tour_completed: true,
        current_step: totalSteps,
        steps_completed: completedSteps
      });
      setIsActive(false);
    } else {
      const nextIndex = currentStepIndex + 1;
      await supabase
        .from('user_onboarding_progress')
        .update({
          current_step: nextIndex,
          steps_completed: completedSteps
        })
        .eq('user_id', user.id);

      setCurrentStepIndex(nextIndex);
      setProgress({
        ...progress,
        current_step: nextIndex,
        steps_completed: completedSteps
      });
    }
  }, [user, progress, currentStep, currentStepIndex, isLastStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(async () => {
    if (!user) return;

    localStorage.setItem('tour-dismissed', 'true');
    setIsActive(false);

    await supabase
      .from('user_onboarding_progress')
      .update({ tour_completed: true, completed_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }, [user]);

  const startTour = useCallback(() => {
    localStorage.removeItem('tour-dismissed');
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStepIndex(stepIndex);
    }
  }, [totalSteps]);

  return {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    progress,
    loading,
    nextStep,
    prevStep,
    skipTour,
    startTour,
    goToStep,
    setIsActive
  };
}
