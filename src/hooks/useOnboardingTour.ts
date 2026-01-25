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
    title: 'YOUR DAY GRIND',
    content: 'This is your streak counter. Complete a training session every day to build your streak and unlock rewards.',
    placement: 'bottom'
  },
  {
    id: 'workout',
    target: '[data-tour="workout-card"]',
    title: "TODAY'S WORKOUT",
    content: 'Your daily training has 4 sets: Worship, Scripture, Prayer, and Reflection. Complete all 4 to finish your workout.',
    placement: 'bottom'
  },
  {
    id: 'start-training',
    target: '[data-tour="start-training"]',
    title: 'START TRAINING',
    content: 'Tap here to begin your daily spiritual workout. Each session takes about 15-30 minutes.',
    placement: 'top'
  },
  {
    id: 'quick-actions',
    target: '[data-tour="quick-actions"]',
    title: 'QUICK WINS',
    content: 'Need a quick faith boost? These micro-actions take seconds and earn you points throughout the day.',
    placement: 'top'
  },
  {
    id: 'weekly-grind',
    target: '[data-tour="weekly-grind"]',
    title: 'WEEKLY PROGRESS',
    content: 'Track your weekly training stats here. See your sessions, prayers logged, and verses read.',
    placement: 'top'
  },
  {
    id: 'navigation',
    target: '[data-tour="nav-train"]',
    title: 'TRAIN TAB',
    content: 'Jump straight to your training session anytime from here.',
    placement: 'top'
  },
  {
    id: 'prayer',
    target: '[data-tour="nav-prayer"]',
    title: 'PRAYER ARMORY',
    content: 'Log your prayers using the ACTS method: Adoration, Confession, Thanksgiving, Supplication.',
    placement: 'top'
  },
  {
    id: 'squad',
    target: '[data-tour="nav-squad"]',
    title: 'YOUR SQUAD',
    content: 'Connect with friends, join squads, and compete on leaderboards. Accountability is key!',
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
      
      // Auto-start tour if not completed and user hasn't dismissed
      if (!data.tour_completed && data.current_step === 0) {
        const dismissed = localStorage.getItem('tour-dismissed');
        if (!dismissed) {
          setIsActive(true);
        }
      }
    } else if (!data) {
      // Create progress record
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
        
        // Auto-start for new users
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
      // Complete the tour
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
