import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scripture } from '@/types/faith';

export type BibleTranslation = 'kjv' | 'web' | 'bbe' | 'asv';

export const translationNames: Record<BibleTranslation, string> = {
  kjv: 'King James Version',
  web: 'World English Bible',
  bbe: 'Bible in Basic English',
  asv: 'American Standard Version'
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

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-scripture', {
        body: { reference, translation }
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

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-scripture', {
        body: { type: 'daily', translation }
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

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-scripture', {
        body: { type, translation }
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
