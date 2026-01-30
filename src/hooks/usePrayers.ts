import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { POINT_VALUES } from './usePoints';
import { toast } from 'sonner';

export interface Prayer {
  id: string;
  user_id: string;
  type: 'adoration' | 'confession' | 'thanksgiving' | 'supplication';
  content: string;
  answered: boolean;
  answered_date: string | null;
  answered_note: string | null;
  created_at: string;
  updated_at: string;
}

export function usePrayers() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPrayers();
    } else {
      setPrayers([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPrayers = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prayers:', error);
    } else {
      setPrayers(data as Prayer[]);
    }
    setLoading(false);
  };

  const addPrayer = async (prayer: { type: Prayer['type']; content: string }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('prayers')
      .insert({
        user_id: user.id,
        type: prayer.type,
        content: prayer.content
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding prayer:', error);
      return { error };
    }
    
    setPrayers([data as Prayer, ...prayers]);
    
    // Award points for prayer
    try {
      await supabase.rpc('award_points', {
        _user_id: user.id,
        _points: POINT_VALUES.PRAYER_LOGGED,
        _reason: 'prayer_logged'
      });
      toast.success(`+${POINT_VALUES.PRAYER_LOGGED} points!`, { description: 'Prayer logged' });
      
      // Update prayer challenge progress
      await supabase.rpc('update_challenge_progress', {
        _user_id: user.id,
        _challenge_type: 'prayer',
        _increment: 1
      });
    } catch (err) {
      console.error('Error awarding prayer points:', err);
    }
    
    return { data, error: null };
  };

  const markAnswered = async (id: string, note?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('prayers')
      .update({
        answered: true,
        answered_date: today,
        answered_note: note || null
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error marking prayer answered:', error);
      return { error };
    }
    
    setPrayers(prayers.map(p => p.id === id ? data as Prayer : p));
    return { data, error: null };
  };

  const deletePrayer = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('prayers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting prayer:', error);
      return { error };
    }
    
    setPrayers(prayers.filter(p => p.id !== id));
    return { error: null };
  };

  return {
    prayers,
    loading,
    addPrayer,
    markAnswered,
    deletePrayer,
    refetch: fetchPrayers
  };
}
