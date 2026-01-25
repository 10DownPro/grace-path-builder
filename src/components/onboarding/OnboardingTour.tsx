import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboardingTour, TOUR_STEPS } from '@/hooks/useOnboardingTour';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OnboardingTour() {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    nextStep,
    prevStep,
    skipTour
  } = useOnboardingTour();

  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    const targetElement = document.querySelector(currentStep.target);
    if (targetElement && spotlightRef.current) {
      const rect = targetElement.getBoundingClientRect();
      spotlightRef.current.style.top = `${rect.top - 8}px`;
      spotlightRef.current.style.left = `${rect.left - 8}px`;
      spotlightRef.current.style.width = `${rect.width + 16}px`;
      spotlightRef.current.style.height = `${rect.height + 16}px`;
    }
  }, [isActive, currentStep, currentStepIndex]);

  if (!isActive || !currentStep) return null;

  const targetElement = document.querySelector(currentStep.target);
  const rect = targetElement?.getBoundingClientRect();

  const getTooltipPosition = () => {
    if (!rect) return { top: '50%', left: '50%' };
    
    switch (currentStep.placement) {
      case 'bottom':
        return { top: rect.bottom + 16, left: rect.left + rect.width / 2 };
      case 'top':
        return { top: rect.top - 16, left: rect.left + rect.width / 2 };
      case 'left':
        return { top: rect.top + rect.height / 2, left: rect.left - 16 };
      case 'right':
        return { top: rect.top + rect.height / 2, left: rect.right + 16 };
      default:
        return { top: rect.bottom + 16, left: rect.left + rect.width / 2 };
    }
  };

  const pos = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-[100]" onClick={skipTour} />

      {/* Spotlight */}
      <div
        ref={spotlightRef}
        className="fixed z-[101] rounded-lg transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          border: '2px solid hsl(var(--primary))'
        }}
      />

      {/* Tooltip */}
      <Card
        className={cn(
          "fixed z-[102] w-72 border-2 border-primary bg-card shadow-xl",
          currentStep.placement === 'top' && "-translate-x-1/2 -translate-y-full",
          currentStep.placement === 'bottom' && "-translate-x-1/2",
          currentStep.placement === 'left' && "-translate-x-full -translate-y-1/2",
          currentStep.placement === 'right' && "-translate-y-1/2"
        )}
        style={{ top: pos.top, left: pos.left }}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary uppercase tracking-wide text-sm">
              {currentStep.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={skipTour}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground">
            {currentStep.content}
          </p>

          {/* Progress & Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentStepIndex ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStepIndex > 0 && (
                <Button size="sm" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {currentStepIndex + 1} of {totalSteps}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
