import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PassageResult {
  reference: string;
  text: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  verseCount: number;
  translation: string;
  book: string;
  chapter: number;
}

export function useGroupScripture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPassage = useCallback(async (
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number,
    translation: string = 'kjv'
  ): Promise<PassageResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-passage', {
        body: { book, chapter, verseStart, verseEnd, translation }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        setError(data.error);
        return null;
      }

      return data as PassageResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch passage';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChapter = useCallback(async (
    book: string,
    chapter: number,
    translation: string = 'kjv'
  ): Promise<PassageResult | null> => {
    return fetchPassage(book, chapter, undefined, undefined, translation);
  }, [fetchPassage]);

  return {
    fetchPassage,
    fetchChapter,
    loading,
    error
  };
}