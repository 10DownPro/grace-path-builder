import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Flame, Target, BookOpen, Music, Heart, 
  ChevronRight, ChevronLeft, Check, Zap,
  Sunrise, Sun, Moon, Clock
} from 'lucide-react';

interface OnboardingData {
  name: string;
  commitment: 'starter' | 'committed' | 'warrior';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  focusAreas: string[];
  weeklyGoal: number;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const commitmentLevels = [
  {
    id: 'starter',
    label: 'Starter',
    duration: '5-10 min/day',
    description: 'Building the habit',
    icon: Flame,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    borderColor: 'border-emerald-500',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'committed',
    label: 'Committed',
    duration: '15-20 min/day',
    description: 'Growing deeper',
    icon: Target,
    gradient: 'from-primary/20 to-orange-600/20',
    borderColor: 'border-primary',
    iconColor: 'text-primary',
  },
  {
    id: 'warrior',
    label: 'Warrior',
    duration: '30+ min/day',
    description: 'All in for God',
    icon: Zap,
    gradient: 'from-warning/20 to-yellow-600/20',
    borderColor: 'border-warning',
    iconColor: 'text-warning',
  },
];

const timeSlots = [
  { id: 'morning', label: 'Morning', icon: Sunrise, description: 'Start the day with God' },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, description: 'Midday reset' },
  { id: 'evening', label: 'Evening', icon: Moon, description: 'End with reflection' },
  { id: 'flexible', label: 'Flexible', icon: Clock, description: 'Whenever works' },
];

const focusOptions = [
  { id: 'scripture', label: 'Scripture Study', icon: BookOpen },
  { id: 'worship', label: 'Worship', icon: Music },
  { id: 'prayer', label: 'Prayer Life', icon: Heart },
  { id: 'discipline', label: 'Spiritual Discipline', icon: Target },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    commitment: 'committed',
    preferredTime: 'morning',
    focusAreas: [],
    weeklyGoal: 5,
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return data.name.trim().length > 0;
      case 2: return data.commitment;
      case 3: return data.preferredTime;
      case 4: return true; // Focus areas optional
      default: return true;
    }
  };

  const toggleFocusArea = (id: string) => {
    setData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(id)
        ? prev.focusAreas.filter(a => a !== id)
        : [...prev.focusAreas, id]
    }));
  };

  return (
    <div className="min-h-screen gradient-dawn flex flex-col">
      {/* Progress Bar */}
      <div className="px-4 pt-6">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-warning rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 flex flex-col">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
            <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
              <Flame className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-4xl uppercase tracking-wider text-foreground">
                Faith Training
              </h1>
              <p className="text-lg text-muted-foreground max-w-xs">
                Your spiritual gym for building unshakeable faith
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>No excuses. Just growth.</span>
            </div>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
                What's Your Name, Soldier?
              </h2>
              <p className="text-muted-foreground">
                Let's personalize your training
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
                className={cn(
                  "w-full px-4 py-4 rounded-xl text-lg text-center",
                  "bg-card border-2 border-border",
                  "focus:border-primary focus:outline-none transition-colors",
                  "font-display uppercase tracking-wider placeholder:normal-case placeholder:font-body"
                )}
                autoFocus
              />
              {data.name && (
                <p className="text-center text-primary font-display text-lg uppercase tracking-wider animate-fade-in">
                  Welcome, {data.name}! 💪
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Commitment Level */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
                Choose Your Intensity
              </h2>
              <p className="text-muted-foreground">
                How hard do you want to train?
              </p>
            </div>
            <div className="space-y-3">
              {commitmentLevels.map((level) => {
                const Icon = level.icon;
                const isSelected = data.commitment === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setData({ ...data, commitment: level.id as OnboardingData['commitment'] })}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 border-l-4 transition-all duration-200 text-left",
                      "relative overflow-hidden",
                      isSelected
                        ? `${level.borderColor} bg-gradient-to-r ${level.gradient}`
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isSelected ? `bg-gradient-to-br ${level.gradient}` : "bg-muted"
                      )}>
                        <Icon className={cn("h-6 w-6", isSelected ? level.iconColor : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-display text-lg uppercase tracking-wider",
                          isSelected ? level.iconColor : "text-foreground"
                        )}>
                          {level.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-sm font-bold",
                          isSelected ? level.iconColor : "text-foreground"
                        )}>
                          {level.duration}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className={cn("h-5 w-5", level.iconColor)} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Preferred Time */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
                When Do You Train?
              </h2>
              <p className="text-muted-foreground">
                Pick your prime devotional time
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const Icon = slot.icon;
                const isSelected = data.preferredTime === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setData({ ...data, preferredTime: slot.id as OnboardingData['preferredTime'] })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-8 w-8 mx-auto mb-2",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className={cn(
                      "font-display uppercase tracking-wider text-sm",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {slot.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{slot.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Focus Areas & Goal */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-2xl uppercase tracking-wider text-foreground">
                Set Your Focus
              </h2>
              <p className="text-muted-foreground">
                What areas do you want to strengthen?
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {focusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = data.focusAreas.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleFocusArea(option.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-6 w-6 mx-auto mb-2",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Weekly training goal
              </p>
              <div className="flex items-center justify-center gap-4">
                {[3, 5, 7].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setData({ ...data, weeklyGoal: goal })}
                    className={cn(
                      "w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
                      data.weeklyGoal === goal
                        ? "border-warning bg-warning/10"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <span className={cn(
                      "font-display text-2xl",
                      data.weeklyGoal === goal ? "text-warning" : "text-foreground"
                    )}>
                      {goal}
                    </span>
                    <span className="text-xs text-muted-foreground">days</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8 space-y-3">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full btn-gym"
          size="lg"
        >
          <span className="font-display uppercase tracking-wider">
            {step === totalSteps - 1 ? "Let's Go!" : "Continue"}
          </span>
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
        
        {step > 0 && (
          <Button
            onClick={handleBack}
            variant="ghost"
            className="w-full"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
