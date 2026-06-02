import { useEffect, useState, useCallback } from 'react';
import {
  journeys,
  getRecommendedJourney,
  getJourney,
  getAllLessons,
  findModuleForLesson,
  type JourneyId,
  type Journey,
  type Lesson,
  type Module,
} from '@/lib/journeys';

const ACTIVE_KEY = 'faithfit-active-journey';
const PROGRESS_KEY = 'faithfit-journey-progress-v1';
const STAGE_KEY = 'faithfit-journey'; // existing onboarding key

// Map of journeyId -> completed lesson IDs.
// Backward compatible: old data stored module IDs which were lesson IDs (1:1 rename).
type ProgressMap = Record<string, string[]>;

function readProgress(): ProgressMap {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function writeProgress(p: ProgressMap) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

export function useJourney() {
  const [activeId, setActiveId] = useState<JourneyId | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
    const stored = localStorage.getItem(ACTIVE_KEY) as JourneyId | null;
    if (stored && getJourney(stored)) {
      setActiveId(stored);
    } else {
      // Recommend based on onboarding stage
      const stage = (localStorage.getItem(STAGE_KEY) as any) || 'new';
      const rec = getRecommendedJourney(stage);
      setActiveId(rec.id);
    }
  }, []);

  const setActive = useCallback((id: JourneyId) => {
    setActiveId(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
  }, []);

  const markLessonComplete = useCallback((journeyId: JourneyId, lessonId: string) => {
    setProgress((prev) => {
      const list = Array.from(new Set([...(prev[journeyId] || []), lessonId]));
      const next = { ...prev, [journeyId]: list };
      writeProgress(next);
      return next;
    });
  }, []);

  const active: Journey | null = activeId ? getJourney(activeId) || null : null;
  const completed = active ? progress[active.id] || [] : [];

  const allLessons: Lesson[] = active ? getAllLessons(active) : [];
  const totalLessons = allLessons.length;
  const completedCount = completed.length;
  const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Next lesson in the active journey (sequential).
  const nextLesson: Lesson | null = allLessons.find((l) => !completed.includes(l.id)) || null;
  const currentModule: Module | null = active && nextLesson
    ? findModuleForLesson(active, nextLesson.id) || null
    : null;

  // Estimated minutes left across remaining lessons.
  const estimatedMinutesRemaining = allLessons
    .filter((l) => !completed.includes(l.id))
    .reduce((sum, l) => sum + (l.estimatedMinutes || 0), 0);

  const recentlyUnlocked: Lesson[] = allLessons.filter((l) => completed.includes(l.id)).slice(-2);

  return {
    journeys,
    active,
    activeId,
    setActive,
    progress,
    completed,
    completedCount,
    /** Total lessons in the active journey. */
    totalLessons,
    /** Back-compat alias for older consumers that called this totalModules. */
    totalModules: totalLessons,
    percent,
    /** The next lesson the user should open. */
    nextLesson,
    /** Back-compat alias — previously named nextModule. Same shape (a Lesson). */
    nextModule: nextLesson,
    /** The module containing the next lesson. */
    currentModule,
    estimatedMinutesRemaining,
    recentlyUnlocked,
    /** Mark a lesson as complete. */
    markLessonComplete,
    /** Back-compat alias — previously named markModuleComplete. */
    markModuleComplete: markLessonComplete,
  };
}
