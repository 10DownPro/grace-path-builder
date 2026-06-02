import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useJourney } from '@/hooks/useJourney';
import type { Journey, JourneyModule } from '@/lib/journeys';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Tracks() {
  const navigate = useNavigate();
  const { journeys, active, activeId, setActive, progress, markModuleComplete } = useJourney();
  const [viewing, setViewing] = useState<Journey | null>(null);
  const [openModule, setOpenModule] = useState<JourneyModule | null>(null);

  const journey = viewing || active;
  const completed = journey ? progress[journey.id] || [] : [];

  const nextIndex = useMemo(() => {
    if (!journey) return 0;
    const i = journey.modules.findIndex((m) => !completed.includes(m.id));
    return i === -1 ? journey.modules.length : i;
  }, [journey, completed]);

  // Module view
  if (journey && openModule) {
    const idx = journey.modules.findIndex((m) => m.id === openModule.id);
    const done = completed.includes(openModule.id);
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setOpenModule(null)} className="mb-4 text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
            {journey.title} · Module {idx + 1} of {journey.modules.length}
          </p>
          <h1 className="font-display text-4xl mb-3 text-balance">{openModule.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{openModule.summary}</p>

          <div className="rounded-xl border border-border bg-card p-6 mb-6 border-l-2 border-l-primary">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Scripture</p>
            <p className="font-display text-xl leading-relaxed text-foreground mb-3">
              "{openModule.scripture.text}"
            </p>
            <p className="text-sm text-muted-foreground">— {openModule.scripture.reference}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 mb-6 border-l-2 border-l-secondary">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-2">Reflection</p>
            <p className="text-foreground leading-relaxed">{openModule.reflection}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 mb-8 border-l-2 border-l-accent-warm">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-warm mb-2">Prayer</p>
            <p className="text-foreground leading-relaxed italic">{openModule.prayer}</p>
          </div>

          <Button
            onClick={() => {
              markModuleComplete(journey.id, openModule.id);
              const next = journey.modules[idx + 1];
              if (next) setOpenModule(next);
              else setOpenModule(null);
            }}
            className="w-full"
            size="lg"
          >
            {done ? 'Continue' : 'Mark complete'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Journey detail view
  if (journey && viewing) {
    const pct = Math.round((completed.length / journey.modules.length) * 100);
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setViewing(null)} className="mb-4 text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> All journeys
          </Button>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center text-3xl">
              {journey.emoji}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Journey</p>
              <h1 className="font-display text-3xl">{journey.title}</h1>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{journey.tagline}</p>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{completed.length} of {journey.modules.length} complete</span>
              <span className="text-foreground font-semibold">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>

          {activeId !== journey.id && (
            <Button onClick={() => setActive(journey.id)} variant="outline" className="w-full mb-6">
              Make this my active journey
            </Button>
          )}

          <div className="space-y-3">
            {journey.modules.map((m, i) => {
              const isDone = completed.includes(m.id);
              const isLocked = i > nextIndex;
              return (
                <button
                  key={m.id}
                  onClick={() => !isLocked && setOpenModule(m)}
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
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      isDone && 'bg-secondary/20 text-secondary',
                      !isDone && !isLocked && 'bg-primary/15 text-primary',
                      isLocked && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : <span className="font-display">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{m.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {isLocked ? `Complete "${journey.modules[i - 1].title}" to open.` : m.summary}
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

  // Journey list
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2 font-semibold">Journeys</p>
          <h1 className="font-display text-4xl mb-2">Pick your path.</h1>
          <p className="text-muted-foreground">Gentle, guided pathways — go at your own pace.</p>
        </div>

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
                      <h2 className="font-display text-2xl">{j.title}</h2>
                      {isActive && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{j.tagline}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{done}/{j.modules.length} modules</span>
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
