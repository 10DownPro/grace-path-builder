import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VerseImageResult {
  imageUrl: string;
  theme: string;
  reference: string;
}

// Pre-generated fallback backgrounds (base64 gradients won't work, so we use CSS gradients)
const fallbackGradients: Record<string, string> = {
  strength: 'linear-gradient(135deg, hsl(0, 0%, 12%) 0%, hsl(25, 85%, 20%) 50%, hsl(0, 0%, 8%) 100%)',
  warfare: 'linear-gradient(135deg, hsl(0, 0%, 10%) 0%, hsl(220, 13%, 25%) 50%, hsl(0, 0%, 8%) 100%)',
  steadfast: 'linear-gradient(135deg, hsl(220, 20%, 15%) 0%, hsl(200, 15%, 20%) 50%, hsl(0, 0%, 10%) 100%)',
  fire: 'linear-gradient(135deg, hsl(25, 85%, 15%) 0%, hsl(35, 90%, 25%) 50%, hsl(0, 0%, 10%) 100%)',
  iron: 'linear-gradient(135deg, hsl(0, 0%, 15%) 0%, hsl(0, 0%, 25%) 50%, hsl(0, 0%, 10%) 100%)',
  shield: 'linear-gradient(135deg, hsl(45, 50%, 15%) 0%, hsl(25, 60%, 20%) 50%, hsl(0, 0%, 10%) 100%)',
  storm: 'linear-gradient(135deg, hsl(220, 30%, 15%) 0%, hsl(200, 40%, 20%) 50%, hsl(0, 0%, 8%) 100%)',
};

export function useVerseImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageData, setImageData] = useState<VerseImageResult | null>(null);

  const generateImage = useCallback(async (
    verseText: string,
    reference: string,
    theme?: string
  ): Promise<VerseImageResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-verse-image', {
        body: { verseText, reference, theme }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        setError(data.error);
        return null;
      }

      const result: VerseImageResult = {
        imageUrl: data.imageUrl,
        theme: data.theme,
        reference: data.reference
      };

      setImageData(result);
      return result;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      setError(message);
      console.error('Verse image generation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFallbackGradient = useCallback((theme: string = 'iron'): string => {
    return fallbackGradients[theme] || fallbackGradients.iron;
  }, []);

  const selectThemeFromVerse = useCallback((verseText: string): string => {
    const text = verseText.toLowerCase();
    
    if (text.includes('armor') || text.includes('sword') || text.includes('battle') || text.includes('fight') || text.includes('war')) {
      return 'warfare';
    }
    if (text.includes('mountain') || text.includes('rock') || text.includes('high') || text.includes('lift') || text.includes('stand')) {
      return 'steadfast';
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
    
    return 'iron';
  }, []);

  return {
    generateImage,
    getFallbackGradient,
    selectThemeFromVerse,
    loading,
    error,
    imageData
  };
}
