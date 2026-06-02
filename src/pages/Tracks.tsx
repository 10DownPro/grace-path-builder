import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useJourney } from '@/hooks/useJourney';
import { findNextRecommendation, type Journey, type JourneyModule } from '@/lib/journeys';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Lock, BookOpen, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonViewer } from '@/components/journey/LessonViewer';

export default function Tracks() {
  const navigate = useNavigate();
  const { journeys, active, activeId, setActive, progress, completed, completedCount, totalModules, percent, markModuleComplete } = useJourney();
  const [viewing, setViewing] = useState<Journey | null>(null);
  const [openModule, setOpenModule] = useState<{ journey: Journey; module: JourneyModule } | null>(null);

  const journey = viewing || active;
  const journeyCompleted = journey ? progress[journey.id] || [] : [];

  const nextIndex = useMemo(() => {
    if (!journey) return 0;
    const i = journey.modules.findIndex((m) => !journeyCompleted.includes(m.id));
    return i === -1 ? journey.modules.length : i;
  }, [journey, journeyCompleted]);

  // ----- Lesson view (multi-section) -----
  if (openModule) {
    const recommendation = findNextRecommendation(openModule.journey.id, {
      ...progress,
      [openModule.journey.id]: Array.from(new Set([...(progress[openModule.journey.id] || []), openModule.module.id])),
    });
    return (
      <PageLayout>
        <LessonViewer
          journey={openModule.journey}
          module={openModule.module}
          nextRecommendation={recommendation && recommendation.module.id !== openModule.module.id ? recommendation : null}
          onExit={() => setOpenModule(null)}
          onComplete={() => markModuleComplete(openModule.journey.id, openModule.module.id)}
          onStartNext={(j, m) => {
            if (j.id !== activeId) setActive(j.id);
            setViewing(null);
            setOpenModule({ journey: j, module: m });
          }}
        />
      </PageLayout>
    );
  }

  // ----- Journey detail view -----
  if (journey && viewing) {
    const pct = Math.round((journeyCompleted.length / journey.modules.length) * 100);
    const reflectionsWritten = countReflections(journey.id);
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setViewing(null)} className="mb-4 text-muted-foreground -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" /> All journeys
          </Button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
              {journey.emoji}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Journey</p>
              <h1 className="font-display text-3xl sm:text-4xl">{journey.title}</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-6">{journey.tagline}</p>

          {/* Progress summary */}
          <div className="rounded-2xl border border-border bg-card p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{journeyCompleted.length} of {journey.modules.length} lessons</span>
              <span className="text-base font-semibold text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
            <div className="grid grid-cols-3 gap-3 mt-5">
              <Stat icon={<BookOpen className="h-4 w-4" />} label="Lessons" value={journeyCompleted.length} />
              <Stat icon={<Heart className="h-4 w-4" />} label="Reflections" value={reflectionsWritten} />
              <Stat icon={<MessageSquare className="h-4 w-4" />} label="Prayers" value={journeyCompleted.length} />
            </div>
          </div>

          {activeId !== journey.id && (
            <Button onClick={() => setActive(journey.id)} variant="outline" className="w-full mb-6">
              Make this my active journey
            </Button>
          )}

          <div className="space-y-3">
            {journey.modules.map((m, i) => {
              const isDone = journeyCompleted.includes(m.id);
              const isLocked = i > nextIndex;
              return (
                <button
                  key={m.id}
                  onClick={() => !isLocked && setOpenModule({ journey, module: m })}
                  disabled={isLocked}
                  className={cn(
                    'w-full p-5 rounded-xl border text-left flex items-center gap-4 transition-all',
                    isDone && 'border-secondary/40 bg-secondary/5',
                    !isDone && !isLocked && 'border-border hover:border-primary/40',
                    isLocked && 'border-border opacity-50 cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg',
                      isDone && 'bg-secondary/20 text-secondary',
                      !isDone && !isLocked && 'bg-primary/15 text-primary',
                      isLocked && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-foreground leading-tight">{m.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {isLocked
                        ? `Complete "${journey.modules[i - 1].title}" to open.`
                        : `${m.summary} · ${m.estimatedMinutes} min`}
                    </p>
                  </div>
                  {!isLocked && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </div>
      </PageLayout>
    );
  }

  // ----- Journey list -----
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-semibold">Your Journey</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-2 leading-tight">What\'s next in your walk with God?</h1>
          <p className="text-lg text-muted-foreground">Guided paths to help you grow — one honest lesson at a time.</p>
        </div>

        {active && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5 font-semibold">Continue where you left off</p>
            <h2 className="font-display text-2xl mb-1">{active.title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{completedCount} of {totalModules} lessons · {percent}%</p>
            <Progress value={percent} className="h-1.5 mb-4" />
            <Button onClick={() => setViewing(active)} className="w-full">
              Open journey <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {journeys.map((j) => {
            const isActive = activeId === j.id;
            const done = (progress[j.id] || []).length;
            const pct = Math.round((done / j.modules.length) * 100);
            return (
              <button
                key={j.id}
                onClick={() => setViewing(j)}
                className={cn(
                  'w-full p-5 rounded-2xl border text-left transition-all',
                  isActive ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-3xl">
                    {j.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-display text-xl sm:text-2xl">{j.title}</h2>
                      {isActive && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground mb-3">{j.tagline}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{done}/{j.modules.length} lessons</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 mt-1.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button variant="ghost" onClick={() => navigate('/home')} className="text-muted-foreground">
            Back to home
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/40 text-muted-foreground mb-1">
        {icon}
      </div>
      <p className="font-display text-xl text-foreground leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function countReflections(journeyId: string): number {
  try {
    const map = JSON.parse(localStorage.getItem('faithfit-lesson-reflections-v1') || '{}');
    let count = 0;
    Object.keys(map).forEach((key) => {
      if (!key.startsWith(`${journeyId}::`)) return;
      const answers = map[key] || {};
      Object.values(answers).forEach((a) => { if (typeof a === 'string' && a.trim().length > 0) count++; });
    });
    return count;
  } catch { return 0; }
}
