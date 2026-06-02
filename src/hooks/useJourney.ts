import { useEffect, useState, useCallback } from 'react';
import { journeys, getRecommendedJourney, getJourney, type JourneyId, type Journey, type JourneyModule } from '@/lib/journeys';

const ACTIVE_KEY = 'faithfit-active-journey';
const PROGRESS_KEY = 'faithfit-journey-progress-v1';
const STAGE_KEY = 'faithfit-journey'; // existing onboarding key

type ProgressMap = Record<string, string[]>; // journeyId -> completed module IDs

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

  const markModuleComplete = useCallback((journeyId: JourneyId, moduleId: string) => {
    setProgress((prev) => {
      const list = Array.from(new Set([...(prev[journeyId] || []), moduleId]));
      const next = { ...prev, [journeyId]: list };
      writeProgress(next);
      return next;
    });
  }, []);

  const active: Journey | null = activeId ? getJourney(activeId) || null : null;
  const completed = active ? progress[active.id] || [] : [];
  const totalModules = active?.modules.length || 0;
  const completedCount = completed.length;
  const percent = totalModules ? Math.round((completedCount / totalModules) * 100) : 0;

  const nextModule: JourneyModule | null = active
    ? active.modules.find((m) => !completed.includes(m.id)) || null
    : null;

  const recentlyUnlocked: JourneyModule[] = active
    ? active.modules.filter((m) => completed.includes(m.id)).slice(-2)
    : [];

  return {
    journeys,
    active,
    activeId,
    setActive,
    progress,
    completed,
    completedCount,
    totalModules,
    percent,
    nextModule,
    recentlyUnlocked,
    markModuleComplete,
  };
}
