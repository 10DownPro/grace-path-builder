import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Complete verses database with full text (KJV)
const versesDatabase: Record<string, { text: string; reference: string }> = {
  'Psalm 23:1-3': {
    text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
    reference: 'Psalm 23:1-3'
  },
  'Philippians 4:13': {
    text: 'I can do all things through Christ which strengtheneth me.',
    reference: 'Philippians 4:13'
  },
  'Jeremiah 29:11': {
    text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    reference: 'Jeremiah 29:11'
  },
  'Romans 8:28': {
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    reference: 'Romans 8:28'
  },
  'Isaiah 41:10': {
    text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
    reference: 'Isaiah 41:10'
  },
  'Proverbs 3:5-6': {
    text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    reference: 'Proverbs 3:5-6'
  },
  'John 3:16': {
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    reference: 'John 3:16'
  },
  'Psalm 46:10': {
    text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
    reference: 'Psalm 46:10'
  },
  'Matthew 11:28-30': {
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.',
    reference: 'Matthew 11:28-30'
  },
  'Joshua 1:9': {
    text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    reference: 'Joshua 1:9'
  },
  'Psalm 27:1': {
    text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?',
    reference: 'Psalm 27:1'
  },
  'Romans 12:2': {
    text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
    reference: 'Romans 12:2'
  },
  'Philippians 4:6-7': {
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    reference: 'Philippians 4:6-7'
  },
  '2 Timothy 1:7': {
    text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    reference: '2 Timothy 1:7'
  },
  'Psalm 119:105': {
    text: 'Thy word is a lamp unto my feet, and a light unto my path.',
    reference: 'Psalm 119:105'
  },
  'Isaiah 40:31': {
    text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    reference: 'Isaiah 40:31'
  },
  'Galatians 5:22-23': {
    text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.',
    reference: 'Galatians 5:22-23'
  },
  '1 Corinthians 13:4-7': {
    text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.',
    reference: '1 Corinthians 13:4-7'
  },
  'Hebrews 11:1': {
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    reference: 'Hebrews 11:1'
  },
  'Psalm 91:1-2': {
    text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
    reference: 'Psalm 91:1-2'
  },
  'Matthew 6:33': {
    text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
    reference: 'Matthew 6:33'
  },
  'Romans 5:8': {
    text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
    reference: 'Romans 5:8'
  },
  'Ephesians 2:8-9': {
    text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.',
    reference: 'Ephesians 2:8-9'
  },
  '1 Peter 5:7': {
    text: 'Casting all your care upon him; for he careth for you.',
    reference: '1 Peter 5:7'
  },
  'Psalm 37:4': {
    text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.',
    reference: 'Psalm 37:4'
  },
  'Colossians 3:23': {
    text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.',
    reference: 'Colossians 3:23'
  },
  'James 1:5': {
    text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
    reference: 'James 1:5'
  },
  'Psalm 139:14': {
    text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.',
    reference: 'Psalm 139:14'
  },
  '2 Corinthians 5:17': {
    text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
    reference: '2 Corinthians 5:17'
  },
  'Micah 6:8': {
    text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
    reference: 'Micah 6:8'
  }
};

// List of verse references for rotation
const dailyVerseRefs = Object.keys(versesDatabase);

// Try to fetch from external API with timeout
async function tryFetchVerse(reference: string, translation: string): Promise<{ text: string; reference: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`;
    const response = await fetch(apiUrl, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'FaithFit-App/1.0',
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference || reference
        };
      }
    }
    console.log(`API returned ${response.status} for ${reference}`);
  } catch (e) {
    console.log(`Failed to fetch ${reference}: ${e}`);
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, translation = 'kjv' } = await req.json();

    let selectedRefs: string[] = [];

    if (type === 'daily') {
      // Get verse of the day based on current date
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const verseIndex = dayOfYear % dailyVerseRefs.length;
      selectedRefs = [dailyVerseRefs[verseIndex]];
    } else if (type === 'random') {
      // Get a random selection of 5 verses
      const shuffled = [...dailyVerseRefs].sort(() => 0.5 - Math.random());
      selectedRefs = shuffled.slice(0, 5);
    } else if (type === 'all') {
      selectedRefs = dailyVerseRefs;
    }

    console.log(`Fetching ${type} verses: ${selectedRefs.join(', ')}`);

    // First try API, then fallback to local database
    const verses = await Promise.all(
      selectedRefs.map(async (ref) => {
        // Try API first (with short timeout)
        const apiResult = await tryFetchVerse(ref, translation);
        if (apiResult) {
          return {
            reference: apiResult.reference,
            text: apiResult.text,
            translation: translation.toUpperCase()
          };
        }
        
        // Fallback to local database
        const localVerse = versesDatabase[ref];
        if (localVerse) {
          console.log(`Using local verse for: ${ref}`);
          return {
            reference: localVerse.reference,
            text: localVerse.text,
            translation: translation.toUpperCase()
          };
        }
        
        return null;
      })
    );

    const validVerses = verses.filter(v => v !== null);
    console.log(`Returning ${validVerses.length} verses`);

    return new Response(
      JSON.stringify({ verses: validVerses }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search scripture' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
