import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScriptureRequest {
  reference: string;
  translation?: string;
}

// Fallback verses database for when API fails
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
