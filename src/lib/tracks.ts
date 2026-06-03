export type JourneyStage = 'new' | 'curious' | 'returning' | 'longtime';

export interface TrackLesson {
  id: string;
  title: string;
  intro: string;
  scripture: { reference: string; text: string };
  reflection: string;
}

export interface GuidedTrack {
  id: 'starting-faith' | 'coming-back';
  name: string;
  tagline: string;
  forJourneys: JourneyStage[];
  lessons: TrackLesson[];
}

export const tracks: GuidedTrack[] = [
  {
    id: 'starting-faith',
    name: 'Starting Faith',
    tagline: "Begin at the beginning — no Bible college required.",
    forJourneys: ['new', 'curious'],
    lessons: [
      {
        id: 'who-is-god',
        title: 'Who is God?',
        intro: "Before anything else, God is love — present, patient, and personal. He isn't a distant idea; He's a Father who knows you by name.",
        scripture: { reference: '1 John 4:16', text: 'God is love. Whoever lives in love lives in God, and God in them.' },
        reflection: "What words have you used to describe God in the past? What would change if 'love' was the first one?",
      },
      {
        id: 'who-is-jesus',
        title: 'Who is Jesus?',
        intro: "Jesus is how God came close. He stepped into our world to show us what love looks like in a person.",
        scripture: { reference: 'John 1:14', text: 'The Word became flesh and made his dwelling among us.' },
        reflection: 'If Jesus is God making Himself reachable, what would you like to say to Him today?',
      },
      {
        id: 'what-is-prayer',
        title: 'What is prayer?',
        intro: "Prayer is just talking with God — honestly, with no script. You don't have to sound spiritual. He already knows you.",
        scripture: { reference: 'Philippians 4:6', text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
        reflection: 'What is one thing on your heart you could simply say out loud to God right now?',
      },
      {
        id: 'reading-bible',
        title: 'How do I read the Bible?',
        intro: "Start small. A few verses with a quiet mind go further than rushing through chapters. Ask: what does this say about God? About me?",
        scripture: { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.' },
        reflection: 'When you read the Bible, what gets in your way? What would help you take one small step today?',
      },
      {
        id: 'salvation',
        title: 'What does salvation mean?',
        intro: "Salvation is being rescued — from shame, from separation, from trying to be enough on your own. It's a gift, not a grade.",
        scripture: { reference: 'Ephesians 2:8', text: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.' },
        reflection: 'What would it feel like to receive something you don\'t have to earn?',
      },
    ],
  },
  {
    id: 'coming-back',
    name: 'Coming Back',
    tagline: 'No catching up. No condemnation. Just home.',
    forJourneys: ['returning', 'longtime'],
    lessons: [
      {
        id: 'starting-over',
        title: 'Starting over',
        intro: "However long you've been away, God isn't keeping score. He's been waiting — not with disappointment, but with open arms.",
        scripture: { reference: 'Lamentations 3:22-23', text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning." },
        reflection: 'What would it mean to believe that today truly is a new beginning?',
      },
      {
        id: 'guilt-shame',
        title: 'Guilt and shame',
        intro: "Guilt says 'I did wrong.' Shame says 'I am wrong.' God deals with both — and He doesn't define you by either.",
        scripture: { reference: 'Romans 8:1', text: 'Therefore, there is now no condemnation for those who are in Christ Jesus.' },
        reflection: 'What have you been carrying that God may be inviting you to set down?',
      },
      {
        id: 'trust-again',
        title: 'Trusting God again',
        intro: "If trust feels hard, that's okay. Trust isn't a switch — it's a path you walk gently, one honest conversation at a time.",
        scripture: { reference: 'Proverbs 3:5', text: 'Trust in the Lord with all your heart and lean not on your own understanding.' },
        reflection: 'Where has trust been broken — by people, by life? Tell God honestly what makes trusting Him hard right now.',
      },
      {
        id: 'rebuild-consistency',
        title: 'Rebuilding consistency',
        intro: "You don't need a perfect streak. You need one small, sustainable yes. Five minutes today matters more than thirty minutes someday.",
        scripture: { reference: 'Zechariah 4:10', text: 'Do not despise these small beginnings, for the Lord rejoices to see the work begin.' },
        reflection: 'What is the smallest daily rhythm you could honestly keep this week?',
      },
      {
        id: 'return-to-prayer',
        title: 'Returning to prayer',
        intro: "You don't need eloquent words. A whisper of 'I'm here' is enough. God isn't grading your prayer.",
        scripture: { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
        reflection: "Write or speak one sentence to God — exactly as you feel today.",
      },
      {
        id: 'hearing-god',
        title: "Hearing God's voice",
        intro: "God still speaks — through Scripture, through His Spirit, through His people. Learning to listen is part of following Jesus.",
        scripture: { reference: '1 Kings 19:12', text: 'After the fire came a gentle whisper.' },
        reflection: 'When was a time you sensed God speaking, even faintly? What might He be whispering now?',
      },
    ],
  },
];

export function getRecommendedTrack(journey: JourneyStage): GuidedTrack {
  return tracks.find((t) => t.forJourneys.includes(journey)) ?? tracks[0];
}
