import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FeedNotification {
  id: string;
  user_id: string;
  actor_id: string | null;
  actor_name?: string;
  notification_type: 'reaction' | 'comment' | 'follow' | 'mention' | 'share';
  title: string;
  message: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}

export function useFeedNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<FeedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
      return;
    }

    if (data) {
      // Fetch actor names
      const actorIds = [...new Set(data.filter(n => n.actor_id).map(n => n.actor_id!))];
      
      let actorNames: Record<string, string> = {};
      if (actorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('public_profiles')
          .select('user_id, display_name')
          .in('user_id', actorIds);
        
        actorNames = Object.fromEntries(
          profiles?.map(p => [p.user_id, p.display_name || 'Someone']) || []
        );
      }

      const enrichedNotifications: FeedNotification[] = data.map(n => ({
        ...n,
        actor_name: n.actor_id ? actorNames[n.actor_id] || 'Someone' : undefined,
        notification_type: n.notification_type as FeedNotification['notification_type']
      }));

      setNotifications(enrichedNotifications);
      setUnreadCount(enrichedNotifications.filter(n => !n.is_read).length);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Realtime subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const newNotif = payload.new as FeedNotification;
          
          // Fetch actor name if present
          if (newNotif.actor_id) {
            const { data: profile } = await supabase
              .from('public_profiles')
              .select('user_id, display_name')
              .eq('user_id', newNotif.actor_id)
              .single();
            
            newNotif.actor_name = profile?.display_name || 'Someone';
          }

          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return;

    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, [user]);

  const clearAllNotifications = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    setNotifications([]);
    setUnreadCount(0);
  }, [user]);

  // Helper function to create a notification (used by other hooks)
  const createNotification = useCallback(async (
    targetUserId: string,
    type: FeedNotification['notification_type'],
    title: string,
    message: string,
    referenceId?: string,
    referenceType?: string
  ) => {
    if (!user || targetUserId === user.id) return; // Don't notify yourself

    await supabase
      .from('notifications')
      .insert({
        user_id: targetUserId,
        actor_id: user.id,
        notification_type: type,
        title,
        message,
        reference_id: referenceId || null,
        reference_type: referenceType || null
      });
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    createNotification,
    refetch: fetchNotifications
  };
}
