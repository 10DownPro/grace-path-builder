export interface DailySession {
  id: string;
  date: string;
  worship: SessionStep;
  scripture: SessionStep;
  prayer: SessionStep;
  reflection: SessionStep;
  completed: boolean;
}

export interface SessionStep {
  completed: boolean;
  duration?: number;
  notes?: string;
}

export interface Scripture {
  reference: string;
  text: string;
  translation: string;
}

export interface PrayerEntry {
  id: string;
  date: string;
  type: 'adoration' | 'confession' | 'thanksgiving' | 'supplication';
  content: string;
  answered?: boolean;
  answeredDate?: string;
  answeredNote?: string;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  scripture?: string;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionDate: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  scripture: string;
  achieved: boolean;
  achievedDate?: string;
  icon: string;
}

export interface WorshipResource {
  id: string;
  title: string;
  artist?: string;
  type: 'song' | 'video' | 'playlist';
  url: string;
  platform: 'youtube' | 'spotify' | 'apple';
  category: 'praise' | 'worship' | 'meditation' | 'hymn';
}
