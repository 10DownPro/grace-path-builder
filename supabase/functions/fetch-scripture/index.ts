import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScriptureRequest {
  reference: string;
  translation?: string;
}

// Comprehensive fallback verses database for when API fails
const fallbackVerses: Record<string, { text: string; reference: string }> = {
  'psalm 23:1-3': {
    text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
    reference: 'Psalm 23:1-3'
  },
  'philippians 4:13': {
    text: 'I can do all things through Christ which strengtheneth me.',
    reference: 'Philippians 4:13'
  },
  'jeremiah 29:11': {
    text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    reference: 'Jeremiah 29:11'
  },
  'romans 8:28': {
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    reference: 'Romans 8:28'
  },
  'isaiah 41:10': {
    text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
    reference: 'Isaiah 41:10'
  },
  'proverbs 3:5-6': {
    text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    reference: 'Proverbs 3:5-6'
  },
  'john 3:16': {
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    reference: 'John 3:16'
  },
  'psalm 46:10': {
    text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
    reference: 'Psalm 46:10'
  },
  'matthew 11:28-30': {
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.',
    reference: 'Matthew 11:28-30'
  },
  'joshua 1:9': {
    text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    reference: 'Joshua 1:9'
  },
  'psalm 27:1': {
    text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?',
    reference: 'Psalm 27:1'
  },
  'romans 12:2': {
    text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
    reference: 'Romans 12:2'
  },
  'philippians 4:6-7': {
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    reference: 'Philippians 4:6-7'
  },
  '2 timothy 1:7': {
    text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    reference: '2 Timothy 1:7'
  },
  'psalm 119:105': {
    text: 'Thy word is a lamp unto my feet, and a light unto my path.',
    reference: 'Psalm 119:105'
  },
  'isaiah 40:31': {
    text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    reference: 'Isaiah 40:31'
  },
  'galatians 5:22-23': {
    text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.',
    reference: 'Galatians 5:22-23'
  },
  '1 corinthians 13:4-7': {
    text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.',
    reference: '1 Corinthians 13:4-7'
  },
  'hebrews 11:1': {
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    reference: 'Hebrews 11:1'
  },
  'psalm 91:1-2': {
    text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
    reference: 'Psalm 91:1-2'
  },
  'matthew 6:33': {
    text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
    reference: 'Matthew 6:33'
  },
  'romans 5:8': {
    text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
    reference: 'Romans 5:8'
  },
  'ephesians 2:8-9': {
    text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.',
    reference: 'Ephesians 2:8-9'
  },
  '1 peter 5:7': {
    text: 'Casting all your care upon him; for he careth for you.',
    reference: '1 Peter 5:7'
  },
  'psalm 37:4': {
    text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.',
    reference: 'Psalm 37:4'
  },
  'colossians 3:23': {
    text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.',
    reference: 'Colossians 3:23'
  },
  'james 1:5': {
    text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
    reference: 'James 1:5'
  },
  'psalm 139:14': {
    text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.',
    reference: 'Psalm 139:14'
  },
  '2 corinthians 5:17': {
    text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
    reference: '2 Corinthians 5:17'
  },
  'micah 6:8': {
    text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?',
    reference: 'Micah 6:8'
  },
  'ephesians 6:10-11': {
    text: 'Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
    reference: 'Ephesians 6:10-11'
  },
  '1 john 4:4': {
    text: 'Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.',
    reference: '1 John 4:4'
  },
  'deuteronomy 31:6': {
    text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.',
    reference: 'Deuteronomy 31:6'
  },
  'psalm 34:17-18': {
    text: 'The righteous cry, and the LORD heareth, and delivereth them out of all their troubles. The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.',
    reference: 'Psalm 34:17-18'
  }
};

// Try multiple Bible APIs with fallback
async function fetchFromBibleAPIs(reference: string, translation: string): Promise<{ text: string; reference: string } | null> {
  // Clean reference for API calls
  const cleanRef = reference.trim();
  
  // Try Bible API first (bible-api.com)
  try {
    const bibleApiUrl = `https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=${translation}`;
    console.log(`Trying bible-api.com: ${bibleApiUrl}`);
    
    const response = await fetch(bibleApiUrl, {
      headers: {
        'User-Agent': 'FaithFit-App/1.0',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text.trim(),
          reference: data.reference || cleanRef
        };
      }
    }
    console.log(`bible-api.com returned status: ${response.status}`);
  } catch (e) {
    console.log(`bible-api.com error: ${e}`);
  }

  // Try API.Bible with free tier (no key needed for some endpoints)
  try {
    // Format reference for API.Bible (e.g., "JHN.3.16" for John 3:16)
    const apiBibleRef = formatForApiBible(cleanRef);
    if (apiBibleRef) {
      const apiBibleUrl = `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/verses/${apiBibleRef}`;
      console.log(`Reference formatted for API.Bible: ${apiBibleRef}`);
      // Note: This would require an API key, so we skip it
    }
  } catch (e) {
    console.log(`API.Bible error: ${e}`);
  }

  return null;
}

function formatForApiBible(reference: string): string | null {
  // This would convert "John 3:16" to "JHN.3.16"
  // For now, return null as we don't have API key
  return null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference, translation = 'kjv' } = await req.json() as ScriptureRequest;

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching scripture: ${reference} (${translation})`);

    // Try APIs first
    const apiResult = await fetchFromBibleAPIs(reference, translation);
    
    if (apiResult) {
      return new Response(
        JSON.stringify({
          reference: apiResult.reference,
          text: apiResult.text,
          translation: translation.toUpperCase(),
          source: 'api'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to local database
    const normalizedRef = reference.toLowerCase().trim();
    const fallback = fallbackVerses[normalizedRef];
    
    if (fallback) {
      console.log(`Using fallback verse for: ${reference}`);
      return new Response(
        JSON.stringify({
          reference: fallback.reference,
          text: fallback.text,
          translation: translation.toUpperCase(),
          source: 'fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No verse found
    console.error(`No verse found for: ${reference}`);
    return new Response(
      JSON.stringify({ 
        error: 'Scripture not found',
        reference,
        translation 
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching scripture:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch scripture' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
