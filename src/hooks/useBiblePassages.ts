import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BiblePassage {
  id: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  passage_name: string;
  passage_theme: string | null;
  is_popular: boolean;
  display_order: number;
}

export interface PassageLevel {
  id: string;
  passage_id: string;
  reading_level: string;
  summary: string;
  key_verse: string | null;
  discussion_questions: string[];
  activity_suggestion: string | null;
  prayer_prompt: string | null;
}

export const READING_LEVEL_INFO = [
  { value: 'picture', label: 'Picture Book', ageRange: 'Ages 3-6', emoji: '🖼️' },
  { value: 'early_reader', label: 'Early Reader', ageRange: 'Ages 7-10', emoji: '📚' },
  { value: 'intermediate', label: 'Intermediate', ageRange: 'Ages 11-13', emoji: '📖' },
  { value: 'advanced', label: 'Advanced', ageRange: 'Ages 14-17', emoji: '📕' },
  { value: 'young_adult', label: 'Young Adult', ageRange: 'Ages 18-25', emoji: '🎓' },
  { value: 'adult', label: 'Adult', ageRange: 'Ages 26+', emoji: '📘' },
  { value: 'scholarly', label: 'Scholarly', ageRange: 'Seminary+', emoji: '🎓' },
] as const;

export function useBiblePassages() {
  const [passages, setPassages] = useState<BiblePassage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPassages();
  }, []);

  const fetchPassages = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('bible_passages')
      .select('*')
      .eq('is_popular', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching passages:', error);
    } else {
      setPassages(data as BiblePassage[]);
    }

    setLoading(false);
  };

  const getPassageContent = async (passageId: string, readingLevel: string): Promise<PassageLevel | null> => {
    const { data, error } = await supabase
      .from('passage_levels')
      .select('*')
      .eq('passage_id', passageId)
      .eq('reading_level', readingLevel)
      .maybeSingle();

    if (error) {
      console.error('Error fetching passage content:', error);
      return null;
    }

    if (!data) {
      // Fallback to adult level if specific level not found
      const { data: fallback } = await supabase
        .from('passage_levels')
        .select('*')
        .eq('passage_id', passageId)
        .eq('reading_level', 'adult')
        .maybeSingle();
      
      if (fallback) {
        return {
          ...fallback,
          discussion_questions: Array.isArray(fallback.discussion_questions) 
            ? fallback.discussion_questions as string[]
            : []
        } as PassageLevel;
      }
      return null;
    }

    return {
      ...data,
      discussion_questions: Array.isArray(data.discussion_questions) 
        ? data.discussion_questions as string[]
        : []
    } as PassageLevel;
  };

  const getAvailableLevelsForPassage = async (passageId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('passage_levels')
      .select('reading_level')
      .eq('passage_id', passageId);

    if (error) {
      console.error('Error fetching available levels:', error);
      return [];
    }

    return data.map(d => d.reading_level);
  };

  const getPassagesByTheme = (theme: string): BiblePassage[] => {
    return passages.filter(p => 
      p.passage_theme?.toLowerCase().includes(theme.toLowerCase())
    );
  };

  return {
    passages,
    loading,
    getPassageContent,
    getAvailableLevelsForPassage,
    getPassagesByTheme,
    refetch: fetchPassages
  };
}
