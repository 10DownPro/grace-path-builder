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
    videoId: 'Fo4RlXs-mGI',
    title: 'Goodness of God',
    artist: 'Bethel Music',
    duration: '5:24',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/Fo4RlXs-mGI/mqdefault.jpg'
  },
  {
    id: '2',
    videoId: 'n4XwEqnKsxs',
    title: 'Way Maker',
    artist: 'Sinach',
    duration: '6:11',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/n4XwEqnKsxs/mqdefault.jpg'
  },
  {
    id: '3',
    videoId: 'qc0I7oQrxMY',
    title: 'Great Are You Lord',
    artist: 'All Sons & Daughters',
    duration: '5:45',
    category: 'acoustic',
    thumbnailUrl: 'https://img.youtube.com/vi/qc0I7oQrxMY/mqdefault.jpg'
  },
  {
    id: '4',
    videoId: 'aWxBrI0g1kE',
    title: 'Reckless Love',
    artist: 'Cory Asbury',
    duration: '5:37',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/aWxBrI0g1kE/mqdefault.jpg'
  },
  {
    id: '5',
    videoId: 'nQWFzMvCfLE',
    title: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    duration: '5:42',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/nQWFzMvCfLE/mqdefault.jpg'
  },
  {
    id: '6',
    videoId: 'dy9nwe9_xzw',
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    duration: '8:56',
    category: 'acoustic',
    thumbnailUrl: 'https://img.youtube.com/vi/dy9nwe9_xzw/mqdefault.jpg'
  },
  {
    id: '7',
    videoId: 'ixCuGGm-r6g',
    title: 'Good Good Father',
    artist: 'Housefires',
    duration: '5:12',
    category: 'acoustic',
    thumbnailUrl: 'https://img.youtube.com/vi/ixCuGGm-r6g/mqdefault.jpg'
  },
  {
    id: '8',
    videoId: 'qyUPz6_TciY',
    title: 'King of Kings',
    artist: 'Hillsong Worship',
    duration: '6:26',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/qyUPz6_TciY/mqdefault.jpg'
  },
  {
    id: '9',
    videoId: 'Gqrli3Lkf58',
    title: 'Yes I Will',
    artist: 'Vertical Worship',
    duration: '5:08',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/Gqrli3Lkf58/mqdefault.jpg'
  },
  {
    id: '10',
    videoId: 'Zp6aygmvzM4',
    title: 'The Blessing',
    artist: 'Elevation Worship',
    duration: '6:22',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/Zp6aygmvzM4/mqdefault.jpg'
  },
  {
    id: '11',
    videoId: 'mQvpCNk6iDI',
    title: 'Build My Life',
    artist: 'Passion',
    duration: '5:54',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/mQvpCNk6iDI/mqdefault.jpg'
  },
  {
    id: '12',
    videoId: 'o_K0PJXAFPw',
    title: 'Graves Into Gardens',
    artist: 'Elevation Worship',
    duration: '6:18',
    category: 'anthem',
    thumbnailUrl: 'https://img.youtube.com/vi/o_K0PJXAFPw/mqdefault.jpg'
  },
  {
    id: '13',
    videoId: '2L3M5gnslfQ',
    title: 'Jireh',
    artist: 'Elevation Worship & Maverick City',
    duration: '5:22',
    category: 'urban',
    thumbnailUrl: 'https://img.youtube.com/vi/2L3M5gnslfQ/mqdefault.jpg'
  },
  {
    id: '14',
    videoId: 'FNyPTeIe7BE',
    title: 'Gratitude',
    artist: 'Brandon Lake',
    duration: '4:47',
    category: 'urban',
    thumbnailUrl: 'https://img.youtube.com/vi/FNyPTeIe7BE/mqdefault.jpg'
  },
  {
    id: '15',
    videoId: 'y4Nh9aXmP4c',
    title: 'Peace Be Still',
    artist: 'The Belonging Co',
    duration: '7:12',
    category: 'acoustic',
    thumbnailUrl: 'https://img.youtube.com/vi/y4Nh9aXmP4c/mqdefault.jpg'
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
