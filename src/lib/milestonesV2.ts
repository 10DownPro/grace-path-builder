// Grace-based milestones — celebrated, never required.

export interface MilestoneV2 {
  id: string;
  emoji: string;
  title: string;
  description: string;
  predicate: (stats: MilestoneStats) => boolean;
}

export interface MilestoneStats {
  prayersCount: number;
  sessionsCount: number;
  reflectionsCount: number;
  chaptersReadCount: number;
  encouragementsSent: number;
  circlesJoined: number;
  daysWalkedThisMonth: number;
  longestStreak: number;
  currentStreak: number;
}

export const milestonesV2: MilestoneV2[] = [
  { id: 'first-prayer', emoji: '🙏', title: 'First Prayer', description: 'You spoke to God.', predicate: (s) => s.prayersCount >= 1 },
  { id: 'first-chapter', emoji: '📖', title: 'First Chapter Read', description: 'A chapter in. Many to go.', predicate: (s) => s.chaptersReadCount >= 1 },
  { id: 'first-reflection', emoji: '✍️', title: 'First Reflection', description: 'Written from the heart.', predicate: (s) => s.reflectionsCount >= 1 },
  { id: 'seven-days-prayer', emoji: '🕊️', title: '7 Days of Prayer', description: 'A week of showing up.', predicate: (s) => s.prayersCount >= 7 },
  { id: 'first-month', emoji: '🌱', title: 'First Month Walking with God', description: '30 days, however imperfect.', predicate: (s) => s.daysWalkedThisMonth >= 15 },
  { id: 'encouraged-someone', emoji: '❤️', title: 'Encouraged Someone', description: 'You lifted a brother or sister.', predicate: (s) => s.encouragementsSent >= 1 },
  { id: 'joined-circle', emoji: '🤝', title: 'Joined a Circle', description: 'You aren\'t walking alone.', predicate: (s) => s.circlesJoined >= 1 },
  { id: 'ten-sessions', emoji: '🌿', title: '10 Sessions', description: 'Ten quiet visits.', predicate: (s) => s.sessionsCount >= 10 },
  { id: 'fifty-prayers', emoji: '🌟', title: '50 Prayers', description: 'A growing prayer life.', predicate: (s) => s.prayersCount >= 50 },
];

export function getEarnedMilestones(stats: MilestoneStats): MilestoneV2[] {
  return milestonesV2.filter((m) => m.predicate(stats));
}
