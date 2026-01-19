import { useState, useEffect } from 'react';
import { UserProgress } from '@/types/faith';
import { milestones } from '@/lib/sampleData';

const STORAGE_KEY = 'faith-training-progress';

const defaultProgress: UserProgress = {
  currentStreak: 7,
  longestStreak: 14,
  totalSessions: 23,
  totalMinutes: 345,
  lastSessionDate: new Date().toISOString().split('T')[0],
  milestones: milestones
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved progress');
      }
    }
  }, []);

  const updateProgress = (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const incrementStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const newStreak = progress.currentStreak + 1;
    updateProgress({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      totalSessions: progress.totalSessions + 1,
      lastSessionDate: today
    });
  };

  const addMinutes = (minutes: number) => {
    updateProgress({
      totalMinutes: progress.totalMinutes + minutes
    });
  };

  return {
    progress,
    updateProgress,
    incrementStreak,
    addMinutes
  };
}
