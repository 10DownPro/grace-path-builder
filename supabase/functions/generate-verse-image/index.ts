// Supabase Edge Function for generating verse background images

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Gritty theme prompts for battle verse backgrounds
const themePrompts: Record<string, string> = {
  strength: "Dark gritty concrete gym wall texture, industrial metal, dramatic orange lighting from side, raw power aesthetic, weight plates and iron, 16:9 aspect ratio, ultra high resolution",
  warfare: "Ancient warrior armor pieces laying on stone floor, dramatic shadows, battle-worn metal shield, helmet with scratches, epic fantasy lighting, gritty texture, 16:9 aspect ratio, ultra high resolution",
  mountain: "Rugged mountain peak at dawn, dramatic storm clouds, raw rocky terrain, epic landscape, moody atmospheric lighting, dark and powerful, 16:9 aspect ratio, ultra high resolution",
  fire: "Burning forge with orange flames, industrial blacksmith aesthetic, molten metal glow, dark smoky atmosphere, raw power, dramatic lighting, 16:9 aspect ratio, ultra high resolution",
  iron: "Heavy iron chains on concrete floor, gym equipment silhouette, dramatic rim lighting, gritty industrial texture, raw power aesthetic, dark moody atmosphere, 16:9 aspect ratio, ultra high resolution",
  shield: "Ancient battle shield with cross emblem on stone altar, dramatic cathedral lighting, dust particles in air, epic fantasy atmosphere, worn metal texture, 16:9 aspect ratio, ultra high resolution",
  storm: "Dramatic thunderstorm over rocky coastline, powerful waves crashing, lightning in distance, epic moody atmosphere, raw nature power, dark and intense, 16:9 aspect ratio, ultra high resolution",
};

// Select theme based on verse content keywords
function selectTheme(verseText: string): string {
  const text = verseText.toLowerCase();
  
  if (text.includes('armor') || text.includes('sword') || text.includes('battle') || text.includes('fight') || text.includes('war')) {
    return 'warfare';
  }
  if (text.includes('mountain') || text.includes('rock') || text.includes('high') || text.includes('lift')) {
    return 'mountain';
  }
  if (text.includes('fire') || text.includes('refine') || text.includes('purify') || text.includes('burn')) {
    return 'fire';
  }
  if (text.includes('shield') || text.includes('protect') || text.includes('defend') || text.includes('refuge')) {
    return 'shield';
  }
  if (text.includes('storm') || text.includes('wind') || text.includes('waves') || text.includes('sea')) {
    return 'storm';
  }
  if (text.includes('strong') || text.includes('strength') || text.includes('power') || text.includes('mighty')) {
    return 'strength';
  }
  
  // Default to iron/gym theme
  return 'iron';
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verseText, reference, theme: customTheme } = await req.json();

    if (!verseText || !reference) {
      return new Response(
        JSON.stringify({ error: "Missing verseText or reference" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Select theme based on verse content or use custom theme
    const theme = customTheme || selectTheme(verseText);
    const prompt = themePrompts[theme] || themePrompts.iron;

    console.log(`Generating image for theme: ${theme}`);
    console.log(`Prompt: ${prompt}`);

    // Generate image using Lovable AI Gateway
    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the image URL from the response
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: imageData,
        theme,
        reference,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error generating verse image:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate image" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
