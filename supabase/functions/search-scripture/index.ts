import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Popular verses for daily rotation
const dailyVerses = [
  "Psalm 23:1-3",
  "Philippians 4:13",
  "Jeremiah 29:11",
  "Romans 8:28",
  "Isaiah 41:10",
  "Proverbs 3:5-6",
  "John 3:16",
  "Psalm 46:10",
  "Matthew 11:28-30",
  "Joshua 1:9",
  "Psalm 27:1",
  "Romans 12:2",
  "Philippians 4:6-7",
  "2 Timothy 1:7",
  "Psalm 119:105",
  "Isaiah 40:31",
  "Galatians 5:22-23",
  "1 Corinthians 13:4-7",
  "Hebrews 11:1",
  "Psalm 91:1-2",
  "Matthew 6:33",
  "Romans 5:8",
  "Ephesians 2:8-9",
  "1 Peter 5:7",
  "Psalm 37:4",
  "Colossians 3:23",
  "James 1:5",
  "Psalm 139:14",
  "2 Corinthians 5:17",
  "Micah 6:8"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, translation = 'kjv' } = await req.json();

    let references: string[] = [];

    if (type === 'daily') {
      // Get verse of the day based on current date
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const verseIndex = dayOfYear % dailyVerses.length;
      references = [dailyVerses[verseIndex]];
    } else if (type === 'random') {
      // Get a random selection of verses
      const shuffled = [...dailyVerses].sort(() => 0.5 - Math.random());
      references = shuffled.slice(0, 5);
    } else if (type === 'all') {
      references = dailyVerses;
    }

    // Fetch all verses
    const verses = await Promise.all(
      references.map(async (ref) => {
        try {
          const cleanRef = ref.trim().toLowerCase().replace(/\s+/g, '+');
          const response = await fetch(
            `https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=${translation}`
          );
          
          if (!response.ok) {
            console.error(`Failed to fetch ${ref}`);
            return null;
          }
          
          const data = await response.json();
          return {
            reference: data.reference || ref,
            text: data.text?.trim() || '',
            translation: translation.toUpperCase()
          };
        } catch (error) {
          console.error(`Error fetching ${ref}:`, error);
          return null;
        }
      })
    );

    const validVerses = verses.filter(v => v !== null);

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
