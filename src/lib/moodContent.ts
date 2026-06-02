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
  /** A short Jesus-centered note on how this passage points us to Christ. */
  aboutJesus: string;
  prayerPrompt: string;
  reflection: string;
  encouragement: string;
}

// All prayer prompts intentionally invoke Jesus and end with the required closing.
const AMEN = "In Jesus' name, Amen. 🙏🏽";

export const moodContent: Record<Mood, MoodContent> = {
  struggling: {
    scripture: { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
    aboutJesus: 'Jesus is the clearest picture of this nearness — He wept with Mary, touched the leper, and carried the cross for you.',
    prayerPrompt: `Jesus, here is where it hurts. I don't have it together — meet me here. ${AMEN}`,
    reflection: "What is the heaviest thing you're carrying today? What would it look like to hand it to Jesus right now?",
    encouragement: "You don't have to be okay to be loved. Jesus is close to you right now.",
  },
  distracted: {
    scripture: { reference: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
    aboutJesus: 'Jesus often slipped away to quiet places to be with the Father (Mark 1:35). He shows us stillness is not wasted time — it is where we know God.',
    prayerPrompt: `Jesus, quiet me. I want to hear You over the noise today. ${AMEN}`,
    reflection: 'What is pulling at your attention? Could you set it down and turn toward Jesus for one minute?',
    encouragement: 'A scattered mind is still a welcomed one. Begin small — Jesus is patient.',
  },
  okay: {
    scripture: { reference: 'Lamentations 3:22-23', text: 'His compassions never fail. They are new every morning.' },
    aboutJesus: "Every fresh mercy in your life is purchased by Jesus' faithfulness. He is the reason today gets to be new.",
    prayerPrompt: `Jesus, thank You for the small mercies I would have missed. I see Your hand. ${AMEN}`,
    reflection: 'What is one ordinary good thing today that points to Jesus caring for you?',
    encouragement: "Steady is sacred. Today's small yes to Jesus matters.",
  },
  growing: {
    scripture: { reference: 'Philippians 1:6', text: 'He who began a good work in you will carry it on to completion.' },
    aboutJesus: 'The "good work" is Christ being formed in you (Galatians 4:19). Jesus is both the author and the finisher of your faith.',
    prayerPrompt: `Jesus, keep forming me. Take me deeper into who You are. ${AMEN}`,
    reflection: 'Where have you noticed Jesus shaping you lately, even quietly?',
    encouragement: 'Keep walking. Jesus is in this with you, every step.',
  },
};
