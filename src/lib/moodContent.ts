export type Mood = 'struggling' | 'distracted' | 'okay' | 'growing';

export interface MoodOption {
  id: Mood;
  emoji: string;
  label: string;
}

export const moodOptions: MoodOption[] = [
  { id: 'struggling', emoji: '😔', label: 'Struggling' },
  { id: 'distracted', emoji: '😕', label: 'Distracted' },
  { id: 'okay', emoji: '🙂', label: 'Doing Okay' },
  { id: 'growing', emoji: '🔥', label: 'Growing' },
];

export interface MoodContent {
  scripture: { reference: string; text: string };
  prayerPrompt: string;
  reflection: string;
  encouragement: string;
}

export const moodContent: Record<Mood, MoodContent> = {
  struggling: {
    scripture: { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
    prayerPrompt: 'Tell God exactly where it hurts. No filters.',
    reflection: 'What is the heaviest thing you\'re carrying today?',
    encouragement: 'You don\'t have to be okay to be loved. He is close right now.',
  },
  distracted: {
    scripture: { reference: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
    prayerPrompt: 'Take three slow breaths. Then simply say: "God, I\'m here."',
    reflection: 'What is pulling at your attention? Name it and set it down for a moment.',
    encouragement: 'A scattered mind is still a welcomed one. Begin small.',
  },
  okay: {
    scripture: { reference: 'Lamentations 3:22-23', text: 'His compassions never fail. They are new every morning.' },
    prayerPrompt: 'Thank God for one small, ordinary mercy from today.',
    reflection: 'What is one good thing you might otherwise overlook?',
    encouragement: 'Steady is sacred. Today\'s small yes matters.',
  },
  growing: {
    scripture: { reference: 'Philippians 1:6', text: 'He who began a good work in you will carry it on to completion.' },
    prayerPrompt: 'Ask God where he wants to take you deeper.',
    reflection: 'Where have you noticed growth lately, even quietly?',
    encouragement: 'Keep walking. He is in this with you.',
  },
};
