import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScriptureRequest {
  reference: string;
  translation?: string;
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

    // Clean the reference for URL encoding
    const cleanReference = reference.trim().toLowerCase().replace(/\s+/g, '+');
    
    // Fetch from bible-api.com (free, no API key required)
    const apiUrl = `https://bible-api.com/${encodeURIComponent(cleanReference)}?translation=${translation}`;
    
    console.log(`Fetching scripture: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Bible API error: ${response.status}`);
      return new Response(
        JSON.stringify({ 
          error: 'Scripture not found',
          reference,
          translation 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Format the response
    const result = {
      reference: data.reference || reference,
      text: data.text?.trim() || '',
      translation: translation.toUpperCase(),
      verses: data.verses || [],
      verseCount: data.verses?.length || 0
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching scripture:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch scripture' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
