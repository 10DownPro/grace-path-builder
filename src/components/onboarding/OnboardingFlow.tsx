import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Compass, HandHeart, Sparkles, BookOpen, Heart, Sunrise,
  ChevronRight, ChevronLeft, Check, Clock,
} from 'lucide-react';

export type JourneyStage = 'new' | 'curious' | 'returning' | 'longtime';
export type NeedArea =
  | 'guidance' | 'consistency' | 'healing' | 'purpose' | 'prayer' | 'understanding';
export type DailyTime = 5 | 10 | 15 | 20;

interface OnboardingData {
  name: string;
  // legacy fields kept for compatibility with existing profile schema
  commitment: 'starter' | 'committed' | 'warrior';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  focusAreas: string[];
  weeklyGoal: number;
  hasBook: boolean;
  // new mission-aligned fields
  journey: JourneyStage;
  needs: NeedArea[];
  dailyMinutes: DailyTime;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const journeyOptions: { id: JourneyStage; label: string; description: string; icon: typeof Compass }[] = [
  { id: 'new', label: "I'm new to faith", description: "I want to start following God.", icon: Sunrise },
  { id: 'curious', label: "I'm curious about God", description: "I'm exploring with an open heart.", icon: Sparkles },
  { id: 'returning', label: "I'm returning after being away", description: "I want to come back to God.", icon: HandHeart },
  { id: 'longtime', label: "I've been following God for years", description: "I want a steadier daily rhythm.", icon: Compass },
];

const needsOptions: { id: NeedArea; label: string; icon: typeof Heart }[] = [
  { id: 'guidance', label: 'Guidance', icon: Compass },
  { id: 'consistency', label: 'Consistency', icon: Clock },
  { id: 'healing', label: 'Healing', icon: HandHeart },
  { id: 'purpose', label: 'Purpose', icon: Sunrise },
  { id: 'prayer', label: 'Prayer', icon: Heart },
  { id: 'understanding', label: 'Understanding the Bible', icon: BookOpen },
];

const timeOptions: { id: DailyTime; label: string; description: string }[] = [
  { id: 5, label: '5 minutes', description: 'A simple start' },
  { id: 10, label: '10 minutes', description: 'A steady rhythm' },
  { id: 15, label: '15 minutes', description: 'Going a little deeper' },
  { id: 20, label: '20+ minutes', description: 'Time to truly settle in' },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    commitment: 'committed',
    preferredTime: 'flexible',
    focusAreas: [],
    weeklyGoal: 5,
    hasBook: false,
    journey: 'new',
    needs: [],
    dailyMinutes: 10,
  });

  // Steps: 0=Welcome, 1=Name, 2=Journey, 3=Needs, 4=Time
  const totalSteps = 5;

  const finish = (d: OnboardingData) => {
    // Map new answers to legacy fields the profile expects
    const commitment: OnboardingData['commitment'] =
      d.dailyMinutes <= 5 ? 'starter' : d.dailyMinutes >= 20 ? 'warrior' : 'committed';
    const weeklyGoal = d.dailyMinutes <= 5 ? 3 : d.dailyMinutes >= 20 ? 7 : 5;
    const focusAreas = d.needs.map((n) =>
      n === 'understanding' ? 'scripture' : n === 'prayer' ? 'prayer' : 'discipline'
    );
    onComplete({ ...d, commitment, weeklyGoal, focusAreas });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else finish(data);
  };
  const handleBack = () => step > 0 && setStep(step - 1);

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return data.name.trim().length > 0;
      case 2: return !!data.journey;
      case 3: return data.needs.length > 0;
      case 4: return !!data.dailyMinutes;
      default: return true;
    }
  };

  const toggleNeed = (id: NeedArea) => {
    setData((prev) => ({
      ...prev,
      needs: prev.needs.includes(id) ? prev.needs.filter((n) => n !== id) : [...prev.needs, id],
    }));
  };

  return (
    <div className="min-h-screen gradient-dawn flex flex-col">
      <div className="px-4 pt-6">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      <div className="flex-1 px-4 py-8 flex flex-col max-w-md mx-auto w-full">
        {/* Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Sunrise className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h1 className="font-display text-4xl text-foreground text-balance">
                Welcome to FaithFit.
              </h1>
              <p className="text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Whether you're just beginning or finding your way back, you're in the right place.
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic">No experience needed. No judgment.</p>
          </div>
        )}

        {/* Name */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center space-y-8 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-3xl text-foreground">What can we call you?</h2>
              <p className="text-muted-foreground">First name is fine.</p>
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Your name"
              className={cn(
                "w-full px-4 py-4 rounded-xl text-lg text-center",
                "bg-card border border-border",
                "focus:border-primary focus:outline-none transition-colors"
              )}
              autoFocus
            />
            {data.name && (
              <p className="text-center text-primary text-base animate-fade-in">
                Glad you're here, {data.name}.
              </p>
            )}
          </div>
        )}

        {/* Journey */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-3xl text-foreground">Where are you in your journey?</h2>
              <p className="text-muted-foreground">There's no wrong answer.</p>
            </div>
            <div className="space-y-3">
              {journeyOptions.map(({ id, label, description, icon: Icon }) => {
                const selected = data.journey === id;
                return (
                  <button
                    key={id}
                    onClick={() => setData({ ...data, journey: id })}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4",
                      selected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      selected ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-medium", selected ? "text-primary" : "text-foreground")}>{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {selected && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Needs */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-3xl text-foreground">What do you need most right now?</h2>
              <p className="text-muted-foreground">Choose any that feel true.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {needsOptions.map(({ id, label, icon: Icon }) => {
                const selected = data.needs.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleNeed(id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all text-center",
                      selected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon className={cn("h-6 w-6 mx-auto mb-2", selected ? "text-primary" : "text-muted-foreground")} />
                    <p className={cn("text-sm font-medium", selected ? "text-primary" : "text-foreground")}>{label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Time */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2 text-center">
              <h2 className="font-display text-3xl text-foreground">How much time can you give God each day?</h2>
              <p className="text-muted-foreground">Be honest — small is beautiful.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(({ id, label, description }) => {
                const selected = data.dailyMinutes === id;
                return (
                  <button
                    key={id}
                    onClick={() => setData({ ...data, dailyMinutes: id })}
                    className={cn(
                      "p-4 rounded-xl border transition-all text-center",
                      selected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <p className={cn("font-display text-2xl", selected ? "text-primary" : "text-foreground")}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 space-y-3 max-w-md mx-auto w-full">
        <Button onClick={handleNext} disabled={!canProceed()} className="w-full btn-gym" size="lg">
          {step === totalSteps - 1 ? "Begin my walk" : "Continue"}
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
        {step > 0 && (
          <Button onClick={handleBack} variant="ghost" className="w-full text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
