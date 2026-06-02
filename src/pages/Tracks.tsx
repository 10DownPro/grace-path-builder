import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useJourney } from '@/hooks/useJourney';
import { findNextRecommendation, getAllLessons, type Journey, type Lesson, type Module } from '@/lib/journeys';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Lock, BookOpen, Heart, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonViewer } from '@/components/journey/LessonViewer';

export default function Tracks() {
  const navigate = useNavigate();
  const {
    journeys,
    active,
    activeId,
    setActive,
    progress,
    completedCount,
    totalLessons,
    percent,
    nextLesson,
    currentModule,
    estimatedMinutesRemaining,
    markLessonComplete,
  } = useJourney();
  const [viewing, setViewing] = useState<Journey | null>(null);
  const [openLesson, setOpenLesson] = useState<{ journey: Journey; module: Module; lesson: Lesson } | null>(null);

  const journey = viewing || active;
  const journeyCompleted = journey ? progress[journey.id] || [] : [];

  // Flat sequential order for unlocking logic.
  const sequentialLessons = useMemo(
    () => (journey ? getAllLessons(journey) : []),
    [journey],
  );
  const nextLessonIndex = useMemo(() => {
    const i = sequentialLessons.findIndex((l) => !journeyCompleted.includes(l.id));
    return i === -1 ? sequentialLessons.length : i;
  }, [sequentialLessons, journeyCompleted]);

  // ----- Lesson view (multi-section) -----
  if (openLesson) {
    const recommendation = findNextRecommendation(openLesson.journey.id, {
      ...progress,
      [openLesson.journey.id]: Array.from(new Set([...(progress[openLesson.journey.id] || []), openLesson.lesson.id])),
    });
    return (
      <PageLayout>
        <LessonViewer
          journey={openLesson.journey}
          module={openLesson.lesson}
          parentModule={openLesson.module}
          nextRecommendation={recommendation && recommendation.module.id !== openLesson.lesson.id ? recommendation : null}
          onExit={() => setOpenLesson(null)}
          onComplete={() => markLessonComplete(openLesson.journey.id, openLesson.lesson.id)}
          onStartNext={(j, lesson) => {
            if (j.id !== activeId) setActive(j.id);
            setViewing(null);
            // Find the module for the recommended lesson within its journey.
            const mod = j.modules.find((m) => m.lessons.some((l) => l.id === lesson.id));
            if (mod) setOpenLesson({ journey: j, module: mod, lesson });
          }}
        />
      </PageLayout>
    );
  }

  // ----- Journey detail view -----
  if (journey && viewing) {
    const allLessons = sequentialLessons;
    const pct = allLessons.length ? Math.round((journeyCompleted.length / allLessons.length) * 100) : 0;
    const reflectionsWritten = countReflections(journey.id);
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setViewing(null)} className="mb-4 text-muted-foreground -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" /> All tracks
          </Button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl">
              {journey.emoji}
            </div>
            <div>
              <p className="text-base uppercase tracking-[0.2em] text-muted-foreground font-semibold">Track</p>
              <h1 className="font-display text-3xl sm:text-4xl">{journey.title}</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-5">{journey.tagline}</p>

          <TrackMeta
            modules={journey.modules.length}
            lessons={allLessons.length}
            weeks={estimateWeeks(allLessons.length)}
            className="mb-6"
          />

          {(() => {
            const hasStarted = journeyCompleted.length > 0;
            if (!hasStarted) return null;
            const currentModIdx = journey.modules.findIndex((m) => m.lessons.some((l) => !journeyCompleted.includes(l.id)));
            const currentLessonIdx = sequentialLessons.findIndex((l) => !journeyCompleted.includes(l.id));
            return (
              <div className="rounded-2xl border border-border bg-card p-5 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base text-muted-foreground">
                    Module {Math.max(1, currentModIdx + 1)} of {journey.modules.length} · Lesson {Math.max(1, currentLessonIdx + 1)} of {allLessons.length}
                  </span>
                  <span className="text-base font-semibold text-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <Stat icon={<BookOpen className="h-4 w-4" />} label="Lessons" value={journeyCompleted.length} />
                  <Stat icon={<Heart className="h-4 w-4" />} label="Reflections" value={reflectionsWritten} />
                  <Stat icon={<MessageSquare className="h-4 w-4" />} label="Prayers" value={journeyCompleted.length} />
                </div>
              </div>
            );
          })()}

          {(() => {
            const hasStarted = journeyCompleted.length > 0;
            const label = hasStarted ? 'Continue Journey' : 'Start Journey';
            const onClick = () => {
              if (activeId !== journey.id) setActive(journey.id);
              const target = sequentialLessons.find((l) => !journeyCompleted.includes(l.id)) || sequentialLessons[0];
              if (!target) return;
              const mod = journey.modules.find((m) => m.lessons.some((l) => l.id === target.id));
              if (mod) setOpenLesson({ journey, module: mod, lesson: target });
            };
            return (
              <Button onClick={onClick} size="lg" className="w-full mb-6">
                {label} <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            );
          })()}

          {/* Modules → Lessons */}
          <div className="space-y-6">
            {journey.modules.map((mod, mIdx) => {
              const modLessonIds = mod.lessons.map((l) => l.id);
              const modCompleted = modLessonIds.filter((id) => journeyCompleted.includes(id)).length;
              const modPct = mod.lessons.length ? Math.round((modCompleted / mod.lessons.length) * 100) : 0;
              return (
                <section key={mod.id}>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-base uppercase tracking-[0.18em] text-primary font-semibold">
                        Module {mIdx + 1}
                      </p>
                      <h2 className="font-display text-2xl text-foreground leading-tight">{mod.title}</h2>
                    </div>
                    <span className="text-base text-muted-foreground whitespace-nowrap">
                      {modCompleted}/{mod.lessons.length}
                    </span>
                  </div>
                  <Progress value={modPct} className="h-1.5 mb-3" />
                  <div className="space-y-3">
                    {mod.lessons.map((lesson) => {
                      const globalIndex = sequentialLessons.findIndex((l) => l.id === lesson.id);
                      const isDone = journeyCompleted.includes(lesson.id);
                      const isLocked = globalIndex > nextLessonIndex;
                      const localIndex = mod.lessons.findIndex((l) => l.id === lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !isLocked && setOpenLesson({ journey, module: mod, lesson })}
                          disabled={isLocked}
                          className={cn(
                            'w-full p-5 rounded-xl border text-left flex items-center gap-4 transition-all',
                            isDone && 'border-secondary/40 bg-secondary/5',
                            !isDone && !isLocked && 'border-border hover:border-primary/40',
                            isLocked && 'border-border opacity-50 cursor-not-allowed',
                          )}
                        >
                          <div
                            className={cn(
                              'w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg',
                              isDone && 'bg-secondary/20 text-secondary',
                              !isDone && !isLocked && 'bg-primary/15 text-primary',
                              isLocked && 'bg-muted text-muted-foreground',
                            )}
                          >
                            {isDone ? <Check className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : localIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-lg text-foreground leading-tight">{lesson.title}</p>
                            <p className="text-base text-muted-foreground line-clamp-1 mt-0.5">
                              {isLocked
                                ? 'Complete the previous lesson to open.'
                                : `${lesson.summary} · ${lesson.estimatedMinutes} min`}
                            </p>
                          </div>
                          {!isLocked && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </PageLayout>
    );
  }

  // ----- Track list -----
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-base uppercase tracking-[0.2em] text-primary mb-2 font-semibold">Your Journey</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-2 leading-tight">
            What's next in your walk with Jesus?
          </h1>
          <p className="text-lg text-muted-foreground">
            Guided tracks to help you grow — one honest lesson at a time.
          </p>
        </div>

        {active && completedCount > 0 && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 mb-6">
            <p className="text-base uppercase tracking-[0.2em] text-primary mb-1.5 font-semibold">
              Continue Journey
            </p>
            <h2 className="font-display text-2xl mb-2">{active.title}</h2>
            <div className="space-y-1 mb-3">
              {currentModule && (
                <p className="text-base text-foreground/90">
                  Module {Math.max(1, active.modules.findIndex(m => m.id === currentModule.id) + 1)} of {active.modules.length} — <span className="font-semibold">{currentModule.title}</span>
                </p>
              )}
              {nextLesson && (
                <p className="text-base text-foreground/90">
                  Lesson {completedCount + 1} of {totalLessons} — <span className="font-semibold">{nextLesson.title}</span>
                </p>
              )}
            </div>
            <Progress value={percent} className="h-1.5 mb-3" />
            <Button onClick={() => setViewing(active)} className="w-full">
              Continue Journey <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {journeys.map((j) => {
            const isActive = activeId === j.id;
            const lessonsInJ = getAllLessons(j);
            const done = (progress[j.id] || []).length;
            const hasStarted = done > 0;
            const pct = lessonsInJ.length ? Math.round((done / lessonsInJ.length) * 100) : 0;
            const weeks = estimateWeeks(lessonsInJ.length);
            return (
              <button
                key={j.id}
                onClick={() => setViewing(j)}
                className={cn(
                  'w-full p-5 rounded-2xl border text-left transition-all',
                  isActive ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30',
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-3xl">
                    {j.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h2 className="font-display text-2xl leading-tight">{j.title}</h2>
                      {isActive && (
                        <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-base text-muted-foreground mb-3 leading-snug">{j.tagline}</p>
                    <TrackMeta modules={j.modules.length} lessons={lessonsInJ.length} weeks={weeks} />
                    {hasStarted && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                          <span>{done} of {lessonsInJ.length} lessons</span>
                          <span>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    )}
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
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function estimateWeeks(lessonCount: number): number {
  // ~5 lessons per week of guided pace; minimum 1 week.
  return Math.max(1, Math.round(lessonCount / 5));
}

function TrackMeta({
  modules,
  lessons,
  weeks,
  className,
}: { modules: number; lessons: number; weeks: number; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm', className)}>
      <MetaItem value={modules} label={modules === 1 ? 'Module' : 'Modules'} />
      <Dot />
      <MetaItem value={lessons} label={lessons === 1 ? 'Lesson' : 'Lessons'} />
      <Dot />
      <MetaItem value={`~${weeks}`} label={weeks === 1 ? 'Week' : 'Weeks'} />
    </div>
  );
}

function MetaItem({ value, label }: { value: number | string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-display text-lg text-foreground leading-none">{value}</span>
      <span className="text-sm text-muted-foreground uppercase tracking-wide">{label}</span>
    </span>
  );
}

function Dot() {
  return <span className="text-muted-foreground/40">·</span>;
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
