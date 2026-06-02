import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Journey, Lesson, Module } from '@/lib/journeys';
import { ensurePrayerEnding, getAllLessons } from '@/lib/journeys';
import { useLesson, REACTIONS } from '@/hooks/useLesson';

type Step = 'intro' | 'scripture' | 'reflection' | 'application' | 'prayer' | 'community' | 'complete';

const STEPS: { key: Step; label: string }[] = [
  { key: 'intro', label: 'Teaching' },
  { key: 'scripture', label: 'Scripture' },
  { key: 'reflection', label: 'Reflection' },
  { key: 'application', label: 'Action Step' },
  { key: 'prayer', label: 'Prayer' },
  { key: 'community', label: 'Community' },
];

type PrayerMode = 'read' | 'listen' | 'own';

interface Props {
  journey: Journey;
  /** The lesson being viewed. Named `module` for backward compatibility. */
  module: Lesson;
  /** The parent Module that contains this lesson (optional during transition). */
  parentModule?: Module;
  nextRecommendation: { journey: Journey; module: Lesson } | null;
  onExit: () => void;
  onComplete: () => void; // marks complete in journey progress
  onStartNext: (journey: Journey, lesson: Lesson) => void;
}

export function LessonViewer({ journey, module, parentModule, nextRecommendation, onExit, onComplete, onStartNext }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [prayerMode, setPrayerMode] = useState<PrayerMode>('read');
  const { reflections, saveReflection, counts, userReaction, toggleReaction } = useLesson(journey.id, module.id);

  // Index within the parent module (if known) for the "Lesson Y of Z" header.
  const moduleLessons = parentModule?.lessons ?? [];
  const lessonIndexInModule = moduleLessons.findIndex((l) => l.id === module.id);
  const allLessons = useMemo(() => getAllLessons(journey), [journey]);
  const lessonIndexGlobal = allLessons.findIndex((l) => l.id === module.id);
  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const totalReactions = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  // Always render prayers with the required ending.
  const prayerText = ensurePrayerEnding(module.prayer);

  const goNext = () => {
    const i = STEPS.findIndex((s) => s.key === step);
    if (i < STEPS.length - 1) {
      setStep(STEPS[i + 1].key);
    } else {
      onComplete();
      setStep('complete');
    }
  };
  const goPrev = () => {
    const i = STEPS.findIndex((s) => s.key === step);
    if (i > 0) setStep(STEPS[i - 1].key);
  };

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto pb-12 animate-fade-in">
        <div className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/15 text-secondary mb-5">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-semibold">You completed</p>
          <h1 className="font-display text-3xl sm:text-4xl mb-3 text-balance">{module.title}</h1>
          <p className="text-muted-foreground">Take a breath. You showed up — that matters.</p>
        </div>

        {nextRecommendation ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-semibold">Next lesson</p>
            <h2 className="font-display text-2xl mb-2 text-balance">{nextRecommendation.module.title}</h2>
            <p className="text-muted-foreground mb-1">{nextRecommendation.module.summary}</p>
            <p className="text-sm text-muted-foreground mb-5">
              {nextRecommendation.journey.id !== journey.id && (
                <span className="text-primary/80">{nextRecommendation.journey.title} · </span>
              )}
              Estimated time: {nextRecommendation.module.estimatedMinutes} min
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => onStartNext(nextRecommendation.journey, nextRecommendation.module)}
            >
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 mb-4 text-center">
            <p className="font-display text-xl mb-2">You've completed this journey.</p>
            <p className="text-muted-foreground">Choose another path when you're ready — there's always more to explore.</p>
          </div>
        )}

        <Button variant="ghost" onClick={onExit} className="w-full text-muted-foreground">
          Back to journey
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onExit} className="mb-3 text-muted-foreground -ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Exit lesson
        </Button>
        <p className="text-base uppercase tracking-[0.18em] text-primary mb-2 font-semibold">
          {journey.title}
          {parentModule && (
            <> · {parentModule.title}{moduleLessons.length > 1 && <> · Lesson {lessonIndexInModule + 1} of {moduleLessons.length}</>}</>
          )}
          {!parentModule && allLessons.length > 0 && (
            <> · Lesson {lessonIndexGlobal + 1} of {allLessons.length}</>
          )}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-balance">{module.title}</h1>
        <p className="text-base text-muted-foreground mt-2">~{module.estimatedMinutes} min · {STEPS[stepIndex].label}</p>
        <Progress value={((stepIndex + 1) / STEPS.length) * 100} className="h-1.5 mt-4" />
      </div>

      {/* Section content */}
      <div className="min-h-[320px]">
        {step === 'intro' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Introduction
            </div>
            {module.introduction.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-foreground">{p}</p>
            ))}
          </section>
        )}

        {step === 'scripture' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" /> Scripture deep dive
            </div>
            <div className="rounded-xl border border-border bg-card p-6 border-l-2 border-l-primary">
              <p className="font-display text-2xl leading-relaxed text-foreground mb-3">"{module.scripture.text}"</p>
              <p className="text-sm text-muted-foreground">— {module.scripture.reference}</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5 font-semibold">Context</p>
                <p className="text-base leading-relaxed text-foreground">{module.scripture.context}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5 font-semibold">Meaning</p>
                <p className="text-base leading-relaxed text-foreground">{module.scripture.meaning}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5 font-semibold">Application</p>
                <p className="text-base leading-relaxed text-foreground">{module.scripture.application}</p>
              </div>
            </div>
          </section>
        )}

        {step === 'reflection' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Heart className="h-3.5 w-3.5" /> Reflection
            </div>
            <p className="text-base text-muted-foreground">Take your time. There are no right answers — only honest ones. Your responses are saved to your profile.</p>
            <div className="space-y-5">
              {module.reflectionQuestions.map((q) => (
                <div key={q.id}>
                  <p className="font-display text-lg mb-2 text-foreground">{q.prompt}</p>
                  <Textarea
                    value={reflections[q.id] || ''}
                    onChange={(e) => saveReflection(q.id, e.target.value)}
                    placeholder="Write your reflection..."
                    className="min-h-[110px] text-base"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 'application' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> One step today
            </div>
            <p className="text-base text-muted-foreground">Faith is meant to be lived. Here's one simple thing to carry into your day.</p>
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
              <p className="font-display text-xl leading-relaxed text-foreground">{module.applicationStep}</p>
            </div>
          </section>
        )}

        {step === 'prayer' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Heart className="h-3.5 w-3.5" /> Guided prayer
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'read', label: 'Read' },
                { key: 'listen', label: 'Listen' },
                { key: 'own', label: 'My words' },
              ] as { key: PrayerMode; label: string }[]).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setPrayerMode(m.key)}
                  className={cn(
                    'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    prayerMode === m.key
                      ? 'border-primary/60 bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {prayerMode === 'read' && (
              <div className="rounded-xl border border-border bg-card p-6 border-l-2 border-l-accent-warm">
                <p className="text-lg leading-relaxed italic text-foreground">{prayerText}</p>
              </div>
            )}
            {prayerMode === 'listen' && (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-base text-muted-foreground mb-3">Audio prayers coming soon. For now, read the prayer slowly out loud.</p>
                <p className="text-base italic text-foreground">"{prayerText}"</p>
              </div>
            )}
            {prayerMode === 'own' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-base text-muted-foreground mb-3">Talk to God in your own words. No format. No pressure. He's already listening.</p>
                <Textarea
                  placeholder="Pray here, or close your eyes and pray out loud..."
                  value={reflections['__own_prayer'] || ''}
                  onChange={(e) => saveReflection('__own_prayer', e.target.value)}
                  className="min-h-[140px] text-base"
                />
              </div>
            )}
          </section>
        )}

        {step === 'community' && (
          <section className="animate-fade-in space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" /> Community response
            </div>
            <p className="text-base text-muted-foreground">
              How did this lesson land for you? Your reaction joins {totalReactions.toLocaleString()} others walking the same path.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {REACTIONS.map((r) => {
                const selected = userReaction === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => toggleReaction(r.key)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      selected ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className="text-2xl mb-1.5">{r.emoji}</div>
                    <p className="font-medium text-sm text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{counts[r.key].toLocaleString()}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center gap-3 mt-10">
        <Button variant="ghost" onClick={goPrev} disabled={stepIndex === 0} className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Button onClick={goNext} className="flex-1" size="lg">
          {stepIndex === STEPS.length - 1 ? 'Complete lesson' : 'Continue'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
