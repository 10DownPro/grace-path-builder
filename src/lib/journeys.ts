// FaithFit Journeys — guided, grace-based pathways.
// Each journey is a sequence of small modules. Users move forward at their own pace.

export type JourneyId =
  | 'starting-faith'
  | 'coming-back'
  | 'learning-prayer'
  | 'understanding-jesus'
  | 'building-consistency'
  | 'healing-restoration';

export interface JourneyModule {
  id: string;
  title: string;
  summary: string;
  scripture: { reference: string; text: string };
  reflection: string;
  prayer: string;
}

export interface Journey {
  id: JourneyId;
  title: string;
  tagline: string;
  emoji: string;
  forStages: Array<'new' | 'curious' | 'returning' | 'longtime'>;
  modules: JourneyModule[];
}

export const journeys: Journey[] = [
  {
    id: 'starting-faith',
    title: 'Starting Faith',
    tagline: 'Begin at the beginning — one honest step.',
    emoji: '🌱',
    forStages: ['new', 'curious'],
    modules: [
      { id: 'who-is-god', title: 'Who is God?', summary: 'God is love — present, patient, personal.', scripture: { reference: '1 John 4:16', text: 'God is love. Whoever lives in love lives in God, and God in them.' }, reflection: 'What words have you used to describe God before? What changes if love is the first?', prayer: 'God, help me see you as you really are.' },
      { id: 'who-is-jesus', title: 'Who is Jesus?', summary: 'Jesus is how God came close.', scripture: { reference: 'John 1:14', text: 'The Word became flesh and made his dwelling among us.' }, reflection: 'If Jesus is God reachable, what would you say to him today?', prayer: 'Jesus, meet me where I am.' },
      { id: 'what-is-prayer', title: 'What is prayer?', summary: 'Prayer is honest conversation with God.', scripture: { reference: 'Philippians 4:6', text: 'In every situation, by prayer and petition, with thanksgiving, present your requests to God.' }, reflection: 'What is one thing on your heart you could say out loud to God right now?', prayer: 'God, I am here. Thank you for listening.' },
      { id: 'reading-bible', title: 'How do I read the Bible?', summary: 'Start small. Read slowly. Ask honest questions.', scripture: { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.' }, reflection: 'What gets in the way of reading? What is one small step you can take?', prayer: 'Lord, open my eyes as I read.' },
      { id: 'salvation', title: 'What does salvation mean?', summary: 'Rescue — a gift, not a grade.', scripture: { reference: 'Ephesians 2:8', text: 'For it is by grace you have been saved, through faith.' }, reflection: 'What would it feel like to receive something you don\'t have to earn?', prayer: 'Thank you for grace I could never earn.' },
    ],
  },
  {
    id: 'coming-back',
    title: 'Coming Back',
    tagline: 'No catching up. No condemnation. Just home.',
    emoji: '🏠',
    forStages: ['returning', 'longtime'],
    modules: [
      { id: 'starting-over', title: 'Starting over', summary: 'God isn\'t keeping score.', scripture: { reference: 'Lamentations 3:22-23', text: 'His compassions never fail. They are new every morning.' }, reflection: 'What would it mean to believe today truly is a new beginning?', prayer: 'God, thank you for new mornings.' },
      { id: 'guilt-shame', title: 'Guilt and shame', summary: 'You are not defined by either.', scripture: { reference: 'Romans 8:1', text: 'There is now no condemnation for those who are in Christ Jesus.' }, reflection: 'What have you been carrying that God may be inviting you to set down?', prayer: 'Help me lay down what isn\'t mine to carry.' },
      { id: 'trust-again', title: 'Trusting God again', summary: 'Trust is a path, not a switch.', scripture: { reference: 'Proverbs 3:5', text: 'Trust in the Lord with all your heart and lean not on your own understanding.' }, reflection: 'Where has trust been broken? Tell God honestly what makes trusting hard.', prayer: 'God, I want to trust you again. Help me.' },
      { id: 'rebuild-consistency', title: 'Rebuilding consistency', summary: 'Five minutes today beats thirty someday.', scripture: { reference: 'Zechariah 4:10', text: 'Do not despise these small beginnings.' }, reflection: 'What\'s the smallest daily rhythm you could honestly keep this week?', prayer: 'God, bless the small yes I bring today.' },
      { id: 'return-to-prayer', title: 'Returning to prayer', summary: 'A whisper is enough.', scripture: { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted.' }, reflection: 'Write or speak one sentence to God, exactly as you feel today.', prayer: 'I\'m here, God. That\'s all I have today.' },
      { id: 'hearing-god', title: 'Hearing God\'s voice', summary: 'A gentle whisper, not noise.', scripture: { reference: '1 Kings 19:12', text: 'After the fire came a gentle whisper.' }, reflection: 'When did you sense God speaking, even faintly? What might he be whispering now?', prayer: 'Quiet me enough to hear you.' },
    ],
  },
  {
    id: 'learning-prayer',
    title: 'Learning Prayer',
    tagline: 'How to actually talk with God.',
    emoji: '🙏',
    forStages: ['new', 'curious', 'returning', 'longtime'],
    modules: [
      { id: 'pray-honest', title: 'Pray honestly', summary: 'God can handle your real thoughts.', scripture: { reference: 'Psalm 62:8', text: 'Pour out your hearts to him, for God is our refuge.' }, reflection: 'What is the most honest sentence you could pray right now?', prayer: 'God, here is what is actually on my heart...' },
      { id: 'pray-acts', title: 'The ACTS pattern', summary: 'Adoration. Confession. Thanksgiving. Supplication.', scripture: { reference: 'Matthew 6:9-13', text: 'This, then, is how you should pray...' }, reflection: 'Which of the four — praise, confession, thanks, asking — feels hardest for you?', prayer: 'God, teach me to pray like Jesus.' },
      { id: 'pray-listen', title: 'Listening prayer', summary: 'Prayer is two-way.', scripture: { reference: 'Psalm 46:10', text: 'Be still, and know that I am God.' }, reflection: 'What might God want to say if you simply stopped to listen?', prayer: 'I\'m listening, Lord.' },
      { id: 'pray-others', title: 'Praying for others', summary: 'Carry someone to God today.', scripture: { reference: 'James 5:16', text: 'Pray for each other so that you may be healed.' }, reflection: 'Who needs your prayers right now?', prayer: 'Lord, I lift up [name] to you.' },
    ],
  },
  {
    id: 'understanding-jesus',
    title: 'Understanding Jesus',
    tagline: 'Get to know who he actually is.',
    emoji: '✝️',
    forStages: ['new', 'curious', 'returning', 'longtime'],
    modules: [
      { id: 'jesus-loved', title: 'How Jesus loved people', summary: 'He went to the ones everyone else avoided.', scripture: { reference: 'Luke 19:10', text: 'The Son of Man came to seek and to save the lost.' }, reflection: 'Where do you feel "lost" today? Jesus came for that part of you.', prayer: 'Jesus, thank you for coming for me.' },
      { id: 'jesus-taught', title: 'What Jesus taught', summary: 'Love God. Love people. Everything hangs on this.', scripture: { reference: 'Matthew 22:37-39', text: 'Love the Lord your God... Love your neighbor as yourself.' }, reflection: 'Which of the two feels harder for you today?', prayer: 'Teach me to love the way you love.' },
      { id: 'jesus-died', title: 'Why Jesus died', summary: 'Love that went all the way.', scripture: { reference: 'John 15:13', text: 'Greater love has no one than this: to lay down one\'s life for one\'s friends.' }, reflection: 'How does it land to know you were on his mind on the cross?', prayer: 'Thank you, Jesus.' },
      { id: 'jesus-rose', title: 'Jesus rose', summary: 'Death didn\'t win. Hope is real.', scripture: { reference: '1 Corinthians 15:20', text: 'Christ has indeed been raised from the dead.' }, reflection: 'Where do you need resurrection hope today?', prayer: 'Jesus, bring new life to the dead places in me.' },
    ],
  },
  {
    id: 'building-consistency',
    title: 'Building Consistency',
    tagline: 'Small, sustainable rhythms with God.',
    emoji: '🌿',
    forStages: ['returning', 'longtime', 'curious'],
    modules: [
      { id: 'small-yes', title: 'The small yes', summary: 'Tiny faithful steps beat heroic bursts.', scripture: { reference: 'Luke 16:10', text: 'Whoever can be trusted with very little can also be trusted with much.' }, reflection: 'What is the smallest "yes" you can give today?', prayer: 'God, I offer this small yes to you.' },
      { id: 'gentle-rhythm', title: 'Build a gentle rhythm', summary: 'Same time. Same place. Soft repetition.', scripture: { reference: 'Mark 1:35', text: 'Very early in the morning, Jesus went off to a solitary place to pray.' }, reflection: 'When and where could you meet with God this week?', prayer: 'Help me show up, however small.' },
      { id: 'grace-misses', title: 'Grace for misses', summary: 'A missed day isn\'t a failed walk.', scripture: { reference: 'Micah 7:8', text: 'Though I have fallen, I will rise.' }, reflection: 'What would it look like to begin again without shame?', prayer: 'Thank you that today is always available.' },
    ],
  },
  {
    id: 'healing-restoration',
    title: 'Healing & Restoration',
    tagline: 'For wounds, weariness, and weight.',
    emoji: '🤍',
    forStages: ['returning', 'longtime', 'curious'],
    modules: [
      { id: 'come-weary', title: 'Come as you are weary', summary: 'Rest before performance.', scripture: { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary, and I will give you rest.' }, reflection: 'What are you most tired of carrying?', prayer: 'Jesus, I bring my weariness to you.' },
      { id: 'name-pain', title: 'Name the pain', summary: 'Healing begins with honesty.', scripture: { reference: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.' }, reflection: 'Without filtering, what hurts right now?', prayer: 'God, here is the wound. Please touch it.' },
      { id: 'forgive-self', title: 'Forgiving yourself', summary: 'God already has.', scripture: { reference: '1 John 1:9', text: 'He is faithful and just to forgive us our sins.' }, reflection: 'What are you still holding against yourself that God isn\'t?', prayer: 'Help me receive your forgiveness.' },
      { id: 'restored-purpose', title: 'Restored purpose', summary: 'You are not too broken to be used.', scripture: { reference: 'Joel 2:25', text: 'I will repay you for the years the locusts have eaten.' }, reflection: 'What hope feels possible again, even just a little?', prayer: 'Restore what I cannot, Lord.' },
    ],
  },
];

export function getJourney(id: JourneyId): Journey | undefined {
  return journeys.find((j) => j.id === id);
}

export function getRecommendedJourney(stage: 'new' | 'curious' | 'returning' | 'longtime'): Journey {
  if (stage === 'returning' || stage === 'longtime') return journeys.find((j) => j.id === 'coming-back')!;
  return journeys.find((j) => j.id === 'starting-faith')!;
}
