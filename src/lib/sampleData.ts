import { Scripture, WorshipResource, Milestone, PrayerEntry, ReflectionEntry } from '@/types/faith';

export const todayScripture: Scripture = {
  reference: "Psalm 23:1-3",
  text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
  translation: "KJV"
};

export const dailyVerses: Scripture[] = [
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
    translation: "KJV"
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    translation: "KJV"
  },
  {
    reference: "Romans 8:28",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    translation: "KJV"
  },
  {
    reference: "Isaiah 41:10",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    translation: "KJV"
  }
];

// Curated worship playlist with YouTube video IDs
export interface WorshipVideo {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  duration: string;
  category: 'acoustic' | 'anthem' | 'instrumental' | 'urban' | 'spanish';
  thumbnailUrl: string;
}

export const worshipPlaylist: WorshipVideo[] = [
  {
    id: '1',
    videoId: '-mEjUReUuT8',
    title: 'Spirit Breakout',
    artist: 'William McDowell / Trinity Anderson',
    duration: '4:20',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/-mEjUReUuT8/mqdefault.jpg'
  },
  {
    id: '2',
    videoId: 'xcRFg57Dky0',
    title: 'We Want Revival',
    artist: 'Red Worship / Lizzie Morgan / Jonathan Stamper',
    duration: '8:35',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/xcRFg57Dky0/mqdefault.jpg'
  },
  {
    id: '3',
    videoId: 'BZT8jqsc8lQ',
    title: 'Your Spirit',
    artist: 'Tasha Cobbs Leonard ft. Kierra Sheard',
    duration: '7:40',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/BZT8jqsc8lQ/mqdefault.jpg'
  },
  {
    id: '4',
    videoId: 'Bq8PzU2W8VI',
    title: 'Everlasting God',
    artist: 'William Murphy ft. Bishop James Morton',
    duration: '5:00',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/Bq8PzU2W8VI/mqdefault.jpg'
  },
  {
    id: '5',
    videoId: 'kOfbomJQZQw',
    title: 'Greater Is Coming',
    artist: 'Jekalyn Carr',
    duration: '5:30',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/kOfbomJQZQw/mqdefault.jpg'
  },
  {
    id: '6',
    videoId: 'YbGFYaA0SbY',
    title: "God I'm Just Grateful",
    artist: 'Elevation Worship & Chandler Moore',
    duration: '4:50',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/YbGFYaA0SbY/mqdefault.jpg'
  },
  {
    id: '7',
    videoId: 'WS4qWFvGJN8',
    title: 'The Kadosh',
    artist: 'Joe Mettle ft. Nathaniel Bassey',
    duration: '9:05',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/WS4qWFvGJN8/mqdefault.jpg'
  },
  {
    id: '8',
    videoId: 'uOP4s8fOEm0',
    title: 'Firm Foundation (He Won\'t)',
    artist: 'TRIBL / Maverick City Music ft. Chandler Moore & Cody Carnes',
    duration: '8:35',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/uOP4s8fOEm0/mqdefault.jpg'
  },
];

// Daily missions for the app
export const dailyMissions = [
  "Pray for someone who wronged you",
  "Share an encouraging word with 3 people today",
  "Spend 5 extra minutes in silent prayer",
  "Write down 10 things you're grateful for",
  "Reach out to someone you haven't talked to in a while",
  "Fast from social media for 2 hours and spend that time with God",
  "Memorize one verse from today's reading",
];

export const worshipResources: WorshipResource[] = [
  {
    id: '1',
    title: 'Goodness of God',
    artist: 'Bethel Music',
    type: 'song',
    url: 'https://www.youtube.com/watch?v=Fo4RlXs-mGI',
    platform: 'youtube',
    category: 'worship'
  },
  {
    id: '2',
    title: 'Way Maker',
    artist: 'Sinach',
    type: 'song',
    url: 'https://www.youtube.com/watch?v=n4XwEqnKsxs',
    platform: 'youtube',
    category: 'praise'
  },
  {
    id: '3',
    title: 'Great Are You Lord',
    artist: 'All Sons & Daughters',
    type: 'song',
    url: 'https://www.youtube.com/watch?v=qc0I7oQrxMY',
    platform: 'youtube',
    category: 'worship'
  },
  {
    id: '4',
    title: 'Amazing Grace',
    artist: 'Chris Tomlin',
    type: 'song',
    url: 'https://www.youtube.com/watch?v=PIPVyf0tH_I',
    platform: 'youtube',
    category: 'hymn'
  }
];

export const milestones: Milestone[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first devotional session',
    scripture: '"For we walk by faith, not by sight." - 2 Corinthians 5:7',
    achieved: true,
    achievedDate: '2024-01-15',
    icon: '🌱'
  },
  {
    id: '2',
    name: 'Week of Faith',
    description: 'Complete 7 consecutive days',
    scripture: '"But they that wait upon the LORD shall renew their strength." - Isaiah 40:31',
    achieved: true,
    achievedDate: '2024-01-22',
    icon: '🌿'
  },
  {
    id: '3',
    name: 'Prayer Warrior',
    description: 'Write 30 prayer entries',
    scripture: '"Pray without ceasing." - 1 Thessalonians 5:17',
    achieved: false,
    icon: '🙏'
  },
  {
    id: '4',
    name: 'Scripture Scholar',
    description: 'Save 50 verses',
    scripture: '"Thy word is a lamp unto my feet, and a light unto my path." - Psalm 119:105',
    achieved: false,
    icon: '📖'
  },
  {
    id: '5',
    name: 'Month of Devotion',
    description: 'Complete 30 consecutive days',
    scripture: '"Be still, and know that I am God." - Psalm 46:10',
    achieved: false,
    icon: '🌳'
  }
];

export const samplePrayers: PrayerEntry[] = [
  {
    id: '1',
    date: '2024-01-19',
    type: 'thanksgiving',
    content: 'Thank you Lord for this new day and the breath in my lungs. Thank you for your faithfulness and mercy.',
    answered: false
  },
  {
    id: '2',
    date: '2024-01-18',
    type: 'supplication',
    content: 'Lord, please guide me in my career decisions. Give me wisdom and clarity.',
    answered: true,
    answeredDate: '2024-01-20',
    answeredNote: 'Received peace about staying in current role and focusing on growth.'
  },
  {
    id: '3',
    date: '2024-01-17',
    type: 'adoration',
    content: 'Lord, you are worthy of all praise. Your love is everlasting and your mercy endures forever.',
    answered: false
  }
];

export const sampleReflections: ReflectionEntry[] = [
  {
    id: '1',
    date: '2024-01-19',
    prompt: 'How did you see God at work in your life today?',
    content: 'Today I noticed God\'s provision in the small things - a kind word from a stranger, unexpected help at work, and peace during a stressful meeting.',
    scripture: 'Romans 8:28'
  },
  {
    id: '2',
    date: '2024-01-18',
    prompt: 'What area of your life needs God\'s guidance right now?',
    content: 'I need guidance in balancing work and family time. I want to be more present with my loved ones while still honoring my responsibilities.',
    scripture: 'Proverbs 3:5-6'
  }
];

export const dailyPrompts = [
  "How did you see God at work in your life today?",
  "What are you grateful for this moment?",
  "What Scripture spoke to your heart today and why?",
  "How can you show God's love to someone tomorrow?",
  "What is God teaching you in this season of life?",
  "Where do you need to trust God more?",
  "How has prayer changed your perspective today?"
];
