import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Encouragement {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  encouragement_type: string;
  is_read: boolean;
  created_at: string;
  from_user_name?: string;
}

const QUICK_ENCOURAGEMENTS = [
  { emoji: '🔥', message: 'Keep pushing!' },
  { emoji: '💪', message: 'You got this, warrior!' },
  { emoji: '🙏', message: 'Praying for you!' },
  { emoji: '⚔️', message: 'Stay in the fight!' },
  { emoji: '👑', message: 'You\'re royalty. Act like it.' },
  { emoji: '🎯', message: 'Stay locked in!' },
];

export function useEncouragements() {
  const { user } = useAuth();
  const [received, setReceived] = useState<Encouragement[]>([]);
  const [sent, setSent] = useState<Encouragement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEncouragements();
    }
  }, [user]);

  const fetchEncouragements = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch received encouragements
    const { data: receivedData } = await supabase
      .from('encouragements')
      .select('*')
      .eq('to_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch sent encouragements
    const { data: sentData } = await supabase
      .from('encouragements')
      .select('*')
      .eq('from_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (receivedData) {
      // Get sender names from profiles
      const senderIds = [...new Set(receivedData.map(e => e.from_user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.name]) || []);
      
      const enriched = receivedData.map(e => ({
        ...e,
        from_user_name: profileMap.get(e.from_user_id) || 'A friend'
      }));
      
      setReceived(enriched);
      setUnreadCount(enriched.filter(e => !e.is_read).length);
    }

    if (sentData) {
      setSent(sentData);
    }

    setLoading(false);
  };

  const sendEncouragement = async (toUserId: string, message: string, type: string = 'custom') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('encouragements')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        message,
        encouragement_type: type
      })
      .select()
      .single();

    if (!error) {
      await fetchEncouragements();
    }

    return { data, error };
  };

  const markAsRead = async (encouragementId: string) => {
    if (!user) return;

    await supabase
      .from('encouragements')
      .update({ is_read: true })
      .eq('id', encouragementId);

    await fetchEncouragements();
  };

  const markAllAsRead = async () => {
    if (!user) return;

    await supabase
      .from('encouragements')
      .update({ is_read: true })
      .eq('to_user_id', user.id)
      .eq('is_read', false);

    await fetchEncouragements();
  };

  return {
    received,
    sent,
    unreadCount,
    loading,
    sendEncouragement,
    markAsRead,
    markAllAsRead,
    quickEncouragements: QUICK_ENCOURAGEMENTS,
    refetch: fetchEncouragements
  };
}
