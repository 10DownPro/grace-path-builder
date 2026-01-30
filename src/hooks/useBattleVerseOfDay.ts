import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BattleVerseOfDay {
  id: string;
  verse_date: string;
  verse_reference: string;
  verse_text_kjv: string;
  verse_text_niv: string | null;
  verse_text_esv: string | null;
  verse_text_nlt: string | null;
  theme: string;
  background_image_url: string | null;
}

export function useBattleVerseOfDay() {
  const { user } = useAuth();
  const [verse, setVerse] = useState<BattleVerseOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const fetchTodaysVerse = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Use type assertion since table is newly created
      const { data, error } = await (supabase
        .from('battle_verses_daily' as any)
        .select('*')
        .eq('verse_date', today)
        .maybeSingle()) as { data: BattleVerseOfDay | null; error: any };

      if (error) throw error;
      
      if (data) {
        setVerse(data);
        
        // Check if saved
        if (user) {
          const { data: savedData } = await (supabase
            .from('user_saved_verses' as any)
            .select('id')
            .eq('user_id', user.id)
            .eq('verse_reference', data.verse_reference)
            .maybeSingle()) as { data: any; error: any };
          
          setIsSaved(!!savedData);
        }
      }
    } catch (err) {
      console.error('Error fetching battle verse of day:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodaysVerse();
  }, [fetchTodaysVerse]);

  const saveVerse = async () => {
    if (!user || !verse) return;

    try {
      const { error } = await (supabase
        .from('user_saved_verses' as any)
        .insert({
          user_id: user.id,
          verse_reference: verse.verse_reference,
          verse_text: verse.verse_text_kjv,
          collection_name: 'favorites',
          saved_from: 'battle_verse'
        })) as { error: any };

      if (error) {
        if (error.code === '23505') {
          toast.info('Verse already saved');
          setIsSaved(true);
          return;
        }
        throw error;
      }

      setIsSaved(true);
      toast.success('Verse saved to collection!');
    } catch (err) {
      console.error('Error saving verse:', err);
      toast.error('Failed to save verse');
    }
  };

  const getVerseText = (translation: 'kjv' | 'niv' | 'esv' | 'nlt' = 'kjv') => {
    if (!verse) return '';
    
    switch (translation) {
      case 'niv':
        return verse.verse_text_niv || verse.verse_text_kjv;
      case 'esv':
        return verse.verse_text_esv || verse.verse_text_kjv;
      case 'nlt':
        return verse.verse_text_nlt || verse.verse_text_kjv;
      default:
        return verse.verse_text_kjv;
    }
  };

  return {
    verse,
    loading,
    isSaved,
    saveVerse,
    getVerseText,
    refetch: fetchTodaysVerse
  };
}
