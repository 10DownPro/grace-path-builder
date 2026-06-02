import { useEffect, useState } from 'react';
import type { Mood } from '@/lib/moodContent';

const todayKey = () => `faithfit-mood-${new Date().toISOString().slice(0, 10)}`;

export function useDailyMood() {
  const [mood, setMoodState] = useState<Mood | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(todayKey());
      if (stored) setMoodState(stored as Mood);
    } catch {}
  }, []);

  const setMood = (m: Mood) => {
    setMoodState(m);
    try { localStorage.setItem(todayKey(), m); } catch {}
  };

  const clearMood = () => {
    setMoodState(null);
    try { localStorage.removeItem(todayKey()); } catch {}
  };

  return { mood, setMood, clearMood, hasCheckedInToday: mood !== null };
}
