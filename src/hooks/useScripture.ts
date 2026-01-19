import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scripture } from '@/types/faith';

// Note: NLT, CSB, and AMP are not available in bible-api.com
// Using KJV as primary, with WEB as alternative for readability
export type BibleTranslation = 'kjv' | 'nlt' | 'csb' | 'amp';

export const translationNames: Record<BibleTranslation, string> = {
  kjv: 'King James Version',
  nlt: 'New Living Translation',
  csb: 'Christian Standard Bible',
  amp: 'Amplified Bible'
};

// Map translations to available API translations (fallback for unavailable ones)
export const translationApiMap: Record<BibleTranslation, string> = {
  kjv: 'kjv',
  nlt: 'web', // Fallback to WEB (closest readable alternative)
  csb: 'web', // Fallback to WEB
  amp: 'kjv', // Fallback to KJV (comprehensive style)
};

export function useScripture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useCallback(async (
    reference: string, 
    translation: BibleTranslation = 'kjv'
  ): Promise<Scripture | null> => {
    setLoading(true);
    setError(null);

    // Use API translation mapping
    const apiTranslation = translationApiMap[translation];

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-scripture', {
        body: { reference, translation: apiTranslation }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        setError(data.error);
        return null;
      }

      return {
        reference: data.reference,
        text: data.text,
        translation: data.translation
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch scripture';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyVerse = useCallback(async (
    translation: BibleTranslation = 'kjv'
  ): Promise<Scripture | null> => {
    setLoading(true);
    setError(null);

    // Use API translation mapping
    const apiTranslation = translationApiMap[translation];

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-scripture', {
        body: { type: 'daily', translation: apiTranslation }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.verses && data.verses.length > 0) {
        return data.verses[0];
      }

      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch daily verse';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMultipleVerses = useCallback(async (
    type: 'random' | 'all' = 'random',
    translation: BibleTranslation = 'kjv'
  ): Promise<Scripture[]> => {
    setLoading(true);
    setError(null);

    // Use API translation mapping
    const apiTranslation = translationApiMap[translation];

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-scripture', {
        body: { type, translation: apiTranslation }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data.verses || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch verses';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchVerse,
    fetchDailyVerse,
    fetchMultipleVerses,
    loading,
    error
  };
}
