import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PassageRequest {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  translation?: string;
}

// Book name normalization
const bookAbbreviations: Record<string, string> = {
  'gen': 'Genesis', 'genesis': 'Genesis',
  'exod': 'Exodus', 'exodus': 'Exodus',
  'lev': 'Leviticus', 'leviticus': 'Leviticus',
  'num': 'Numbers', 'numbers': 'Numbers',
  'deut': 'Deuteronomy', 'deuteronomy': 'Deuteronomy',
  'josh': 'Joshua', 'joshua': 'Joshua',
  'judg': 'Judges', 'judges': 'Judges',
  'ruth': 'Ruth',
  '1sam': '1 Samuel', '1 samuel': '1 Samuel',
  '2sam': '2 Samuel', '2 samuel': '2 Samuel',
  '1kgs': '1 Kings', '1 kings': '1 Kings',
  '2kgs': '2 Kings', '2 kings': '2 Kings',
  '1chr': '1 Chronicles', '1 chronicles': '1 Chronicles',
  '2chr': '2 Chronicles', '2 chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'neh': 'Nehemiah', 'nehemiah': 'Nehemiah',
  'esth': 'Esther', 'esther': 'Esther',
  'job': 'Job',
  'ps': 'Psalms', 'psalm': 'Psalms', 'psalms': 'Psalms',
  'prov': 'Proverbs', 'proverbs': 'Proverbs',
  'eccl': 'Ecclesiastes', 'ecclesiastes': 'Ecclesiastes',
  'song': 'Song of Solomon', 'song of solomon': 'Song of Solomon',
  'isa': 'Isaiah', 'isaiah': 'Isaiah',
  'jer': 'Jeremiah', 'jeremiah': 'Jeremiah',
  'lam': 'Lamentations', 'lamentations': 'Lamentations',
  'ezek': 'Ezekiel', 'ezekiel': 'Ezekiel',
  'dan': 'Daniel', 'daniel': 'Daniel',
  'hos': 'Hosea', 'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obad': 'Obadiah', 'obadiah': 'Obadiah',
  'jonah': 'Jonah',
  'mic': 'Micah', 'micah': 'Micah',
  'nah': 'Nahum', 'nahum': 'Nahum',
  'hab': 'Habakkuk', 'habakkuk': 'Habakkuk',
  'zeph': 'Zephaniah', 'zephaniah': 'Zephaniah',
  'hag': 'Haggai', 'haggai': 'Haggai',
  'zech': 'Zechariah', 'zechariah': 'Zechariah',
  'mal': 'Malachi', 'malachi': 'Malachi',
  'matt': 'Matthew', 'matthew': 'Matthew',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'rom': 'Romans', 'romans': 'Romans',
  '1cor': '1 Corinthians', '1 corinthians': '1 Corinthians',
  '2cor': '2 Corinthians', '2 corinthians': '2 Corinthians',
  'gal': 'Galatians', 'galatians': 'Galatians',
  'eph': 'Ephesians', 'ephesians': 'Ephesians',
  'phil': 'Philippians', 'philippians': 'Philippians',
  'col': 'Colossians', 'colossians': 'Colossians',
  '1thess': '1 Thessalonians', '1 thessalonians': '1 Thessalonians',
  '2thess': '2 Thessalonians', '2 thessalonians': '2 Thessalonians',
  '1tim': '1 Timothy', '1 timothy': '1 Timothy',
  '2tim': '2 Timothy', '2 timothy': '2 Timothy',
  'titus': 'Titus',
  'phlm': 'Philemon', 'philemon': 'Philemon',
  'heb': 'Hebrews', 'hebrews': 'Hebrews',
  'jas': 'James', 'james': 'James',
  '1pet': '1 Peter', '1 peter': '1 Peter',
  '2pet': '2 Peter', '2 peter': '2 Peter',
  '1john': '1 John', '1 john': '1 John',
  '2john': '2 John', '2 john': '2 John',
  '3john': '3 John', '3 john': '3 John',
  'jude': 'Jude',
  'rev': 'Revelation', 'revelation': 'Revelation'
};

function normalizeBookName(book: string): string {
  const lower = book.toLowerCase().trim();
  return bookAbbreviations[lower] || book;
}

function buildReference(book: string, chapter: number, verseStart?: number, verseEnd?: number): string {
  const normalizedBook = normalizeBookName(book);
  
  if (verseStart && verseEnd && verseStart !== verseEnd) {
    return `${normalizedBook} ${chapter}:${verseStart}-${verseEnd}`;
  } else if (verseStart) {
    return `${normalizedBook} ${chapter}:${verseStart}`;
  } else {
    return `${normalizedBook} ${chapter}`;
  }
}

// Try to fetch from Bible API
async function fetchPassage(reference: string, translation: string): Promise<{ text: string; reference: string; verses: any[] } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    // Format for bible-api.com (lowercase, spaces to +)
    const formattedRef = reference.toLowerCase().replace(/\s+/g, '+');
    const apiUrl = `https://bible-api.com/${encodeURIComponent(formattedRef)}?translation=${translation}`;
    
    console.log(`Fetching passage: ${apiUrl}`);
    
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
          reference: data.reference || reference,
          verses: data.verses || []
        };
      }
    }
    
    console.log(`API returned ${response.status} for ${reference}`);
    return null;
  } catch (e) {
    console.error(`Error fetching passage: ${e}`);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verseStart, verseEnd, translation = 'kjv' } = await req.json() as PassageRequest;

    if (!book || !chapter) {
      return new Response(
        JSON.stringify({ error: 'Book and chapter are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reference = buildReference(book, chapter, verseStart, verseEnd);
    console.log(`Built reference: ${reference}`);

    const result = await fetchPassage(reference, translation);

    if (result) {
      return new Response(
        JSON.stringify({
          reference: result.reference,
          text: result.text,
          verses: result.verses,
          verseCount: result.verses.length,
          translation: translation.toUpperCase(),
          book: normalizeBookName(book),
          chapter
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If full chapter fails, return an error with helpful message
    return new Response(
      JSON.stringify({ 
        error: 'Unable to fetch passage. Please try again later.',
        reference,
        book: normalizeBookName(book),
        chapter
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch passage' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});