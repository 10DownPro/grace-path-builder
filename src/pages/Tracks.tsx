import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { tracks, getRecommendedTrack, type GuidedTrack, type TrackLesson, type JourneyStage } from '@/lib/tracks';
import { Button } from '@/components/ui/button';
import { Compass, HandHeart, ChevronLeft, ChevronRight, Check, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROGRESS_KEY = 'faithfit-track-progress-v1';
const JOURNEY_KEY = 'faithfit-journey';

function getProgress(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: Record<string, string[]>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export default function Tracks() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Record<string, string[]>>(getProgress());
  const [activeTrack, setActiveTrack] = useState<GuidedTrack | null>(null);
  const [activeLesson, setActiveLesson] = useState<TrackLesson | null>(null);

  const journey = (localStorage.getItem(JOURNEY_KEY) as JourneyStage) || 'new';
  const recommended = useMemo(() => getRecommendedTrack(journey), [journey]);

  const markComplete = (trackId: string, lessonId: string) => {
    const next = { ...progress, [trackId]: Array.from(new Set([...(progress[trackId] || []), lessonId])) };
    setProgress(next);
    saveProgress(next);
  };

  // Lesson view
  if (activeTrack && activeLesson) {
    const idx = activeTrack.lessons.findIndex((l) => l.id === activeLesson.id);
    const done = (progress[activeTrack.id] || []).includes(activeLesson.id);
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setActiveLesson(null)} className="mb-4 text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to track
          </Button>

          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
            {activeTrack.name} · Lesson {idx + 1} of {activeTrack.lessons.length}
          </p>
          <h1 className="font-display text-4xl mb-6 text-balance">{activeLesson.title}</h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{activeLesson.intro}</p>

          <div className="gym-card p-6 mb-8 border-l-2 border-l-primary">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Scripture</p>
            <p className="font-display text-xl leading-relaxed text-foreground mb-3">"{activeLesson.scripture.text}"</p>
            <p className="text-sm text-muted-foreground">— {activeLesson.scripture.reference}</p>
          </div>

          <div className="gym-card p-6 mb-8 border-l-2 border-l-secondary">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-2">Reflection</p>
            <p className="text-foreground leading-relaxed">{activeLesson.reflection}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                markComplete(activeTrack.id, activeLesson.id);
                const next = activeTrack.lessons[idx + 1];
                if (next) setActiveLesson(next);
                else setActiveLesson(null);
              }}
              className="btn-gym flex-1"
            >
              {done ? 'Continue' : 'Mark complete'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Track detail
  if (activeTrack) {
    const completed = progress[activeTrack.id] || [];
    const TrackIcon = activeTrack.id === 'coming-back' ? HandHeart : Compass;
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto pb-12">
          <Button variant="ghost" onClick={() => setActiveTrack(null)} className="mb-4 text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> All tracks
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center">
              <TrackIcon className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guided Track</p>
              <h1 className="font-display text-3xl">{activeTrack.name}</h1>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">{activeTrack.tagline}</p>

          <div className="space-y-3">
            {activeTrack.lessons.map((lesson, i) => {
              const isDone = completed.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={cn(
                    "w-full p-5 rounded-xl border text-left flex items-center gap-4 transition-all",
                    isDone ? "border-secondary/40 bg-secondary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    isDone ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                  )}>
                    {isDone ? <Check className="h-5 w-5" /> : <span className="font-display">{i + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{lesson.intro}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Track list
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Guided Tracks</p>
          <h1 className="font-display text-4xl mb-2">Start where you are.</h1>
          <p className="text-muted-foreground">Short, gentle paths designed for the start — or the return.</p>
        </div>

        <div className="space-y-4">
          {tracks.map((t) => {
            const isRec = t.id === recommended.id;
            const TrackIcon = t.id === 'coming-back' ? HandHeart : Compass;
            const completed = (progress[t.id] || []).length;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTrack(t)}
                className={cn(
                  "w-full p-6 rounded-2xl border text-left transition-all",
                  isRec ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    t.id === 'coming-back' ? "bg-secondary/15" : "bg-primary/15"
                  )}>
                    <TrackIcon className={cn("h-6 w-6", t.id === 'coming-back' ? "text-secondary" : "text-primary")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display text-2xl">{t.name}</h2>
                      {isRec && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{t.tagline}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {t.lessons.length} lessons</span>
                      <span>{completed}/{t.lessons.length} complete</span>
                    </div>
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
