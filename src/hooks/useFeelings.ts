import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FeelingCategory {
  id: string;
  name: string;
  emoji: string | null;
  category_type: string | null;
  is_crisis: boolean | null;
  sort_order: number | null;
  description: string | null;
}

export interface FeelingVerse {
  id: string;
  reference: string;
  text_kjv: string | null;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  relevance_score: number | null;
  is_power_verse: boolean | null;
  context_note: string | null;
  category_id: string | null;
}

export interface SupportMessage {
  id: string;
  message_text: string;
  tone: string | null;
}

export interface CrisisResource {
  id: string;
  name: string | null;
  contact_info: string | null;
  description: string | null;
  resource_type: string | null;
  is_emergency: boolean | null;
  display_order: number | null;
  country: string | null;
}

export interface CategoryVerseResponse {
  supportMessage: SupportMessage | null;
  verses: FeelingVerse[];
  crisisResources: CrisisResource[];
  category: FeelingCategory | null;
}

export function useFeelings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCategories = useCallback(async (type?: string): Promise<FeelingCategory[]> => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('feeling_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (type && type !== 'all') {
        query = query.eq('category_type', type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryVerses = useCallback(async (
    categoryId: string, 
    count: number = 7
  ): Promise<CategoryVerseResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category details
      const { data: categoryData } = await supabase
        .from('feeling_categories')
        .select('*')
        .eq('id', categoryId)
        .maybeSingle();

      // Fetch random support message for this category
      const { data: messageData } = await supabase
        .from('support_messages')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true);

      // Pick a random message
      const randomMessage = messageData && messageData.length > 0 
        ? messageData[Math.floor(Math.random() * messageData.length)]
        : null;

      // Fetch verses with weighted randomization
      const { data: versesData, error: versesError } = await supabase
        .from('feeling_verses')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('relevance_score', { ascending: false });

      if (versesError) throw versesError;

      // Shuffle and take requested count with slight bias toward power verses
      const verses = versesData || [];
      const shuffled = shuffleWithBias(verses, count);

      // Update battles challenge progress when user accesses Find By Feeling
      if (user) {
        try {
          await supabase.rpc('update_challenge_progress', {
            _user_id: user.id,
            _challenge_type: 'battles',
            _increment: 1
          });
        } catch (err) {
          console.error('Error updating battles challenge:', err);
        }
      }

      // Fetch crisis resources if category is crisis
      let crisisResources: CrisisResource[] = [];
      if (categoryData?.is_crisis) {
        const { data: resourcesData } = await supabase
          .from('crisis_resources')
          .select('*')
          .eq('category_id', categoryId)
          .order('display_order', { ascending: true });
        
        crisisResources = resourcesData || [];
      }

      return {
        supportMessage: randomMessage,
        verses: shuffled,
        crisisResources,
        category: categoryData
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch verses';
      setError(message);
      return {
        supportMessage: null,
        verses: [],
        crisisResources: [],
        category: null
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveVerse = useCallback(async (verseId: string, categoryId?: string, note?: string) => {
    if (!user) return false;

    try {
      const { error: saveError } = await supabase
        .from('user_saved_verses')
        .insert({
          user_id: user.id,
          verse_id: verseId,
          category_id: categoryId,
          personal_note: note
        });

      if (saveError) {
        // Check if already saved
        if (saveError.code === '23505') {
          return true; // Already saved
        }
        throw saveError;
      }

      return true;
    } catch (err) {
      console.error('Error saving verse:', err);
      return false;
    }
  }, [user]);

  const unsaveVerse = useCallback(async (verseId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('user_saved_verses')
        .delete()
        .eq('user_id', user.id)
        .eq('verse_id', verseId);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error unsaving verse:', err);
      return false;
    }
  }, [user]);

  const getSavedVerses = useCallback(async (): Promise<{verse: FeelingVerse; categoryId: string | null; note: string | null}[]> => {
    if (!user) return [];

    try {
      const { data, error: fetchError } = await supabase
        .from('user_saved_verses')
        .select(`
          verse_id,
          category_id,
          personal_note,
          feeling_verses (*)
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (fetchError) throw fetchError;

      return (data || [])
        .filter(item => item.feeling_verses)
        .map(item => ({
          verse: item.feeling_verses as unknown as FeelingVerse,
          categoryId: item.category_id,
          note: item.personal_note
        }));
    } catch (err) {
      console.error('Error fetching saved verses:', err);
      return [];
    }
  }, [user]);

  const isVerseSaved = useCallback(async (verseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_saved_verses')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_id', verseId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return !!data;
    } catch {
      return false;
    }
  }, [user]);

  const searchCategories = useCallback(async (query: string): Promise<FeelingCategory[]> => {
    if (!query.trim()) return [];

    try {
      const { data, error: searchError } = await supabase
        .from('feeling_categories')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('sort_order', { ascending: true });

      if (searchError) throw searchError;
      return data || [];
    } catch {
      return [];
    }
  }, []);

  return {
    loading,
    error,
    fetchCategories,
    fetchCategoryVerses,
    saveVerse,
    unsaveVerse,
    getSavedVerses,
    isVerseSaved,
    searchCategories
  };
}

// Helper function to shuffle with bias toward power verses
function shuffleWithBias(verses: FeelingVerse[], count: number): FeelingVerse[] {
  const powerVerses = verses.filter(v => v.is_power_verse);
  const regularVerses = verses.filter(v => !v.is_power_verse);

  // Shuffle both arrays
  const shuffledPower = shuffleArray([...powerVerses]);
  const shuffledRegular = shuffleArray([...regularVerses]);

  // Take ~60% power verses, ~40% regular (if available)
  const powerCount = Math.min(Math.ceil(count * 0.6), shuffledPower.length);
  const regularCount = Math.min(count - powerCount, shuffledRegular.length);

  const selected = [
    ...shuffledPower.slice(0, powerCount),
    ...shuffledRegular.slice(0, regularCount)
  ];

  // If we still need more, fill from remaining
  if (selected.length < count) {
    const remaining = [...shuffledPower.slice(powerCount), ...shuffledRegular.slice(regularCount)];
    selected.push(...shuffleArray(remaining).slice(0, count - selected.length));
  }

  // Final shuffle to mix power and regular
  return shuffleArray(selected).slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
