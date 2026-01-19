import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface NotificationPreferences {
  id: string;
  user_id: string;
  enabled: boolean;
  preferred_time: string;
  timezone: string;
  push_subscription: object | null;
  last_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching notification preferences:', error);
    } else {
      setPreferences(data as NotificationPreferences | null);
    }

    setLoading(false);
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    return permission === 'granted';
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<Pick<NotificationPreferences, 'enabled' | 'preferred_time' | 'timezone'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // If preferences don't exist, create them
    if (!preferences) {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          ...updates
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification preferences:', error);
        return { error };
      }

      setPreferences(data as NotificationPreferences);
      return { data, error: null };
    }

    // Update existing preferences
    const { data, error } = await supabase
      .from('notification_preferences')
      .update(updates)
      .eq('id', preferences.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification preferences:', error);
      return { error };
    }

    setPreferences(data as NotificationPreferences);
    return { data, error: null };
  }, [user, preferences]);

  const scheduleNotification = useCallback(async (time: string) => {
    // Request permission first
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return { error: new Error('Notification permission denied') };
    }

    // Convert time string to 24-hour format for storage
    const timeMap: Record<string, string> = {
      '5:00 AM': '05:00:00',
      '6:00 AM': '06:00:00',
      '7:00 AM': '07:00:00',
      '8:00 AM': '08:00:00',
      '12:00 PM': '12:00:00',
      '6:00 PM': '18:00:00',
      '8:00 PM': '20:00:00',
      '9:00 PM': '21:00:00',
    };

    const preferredTime = timeMap[time] || '06:00:00';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return updatePreferences({
      enabled: true,
      preferred_time: preferredTime,
      timezone
    });
  }, [requestPermission, updatePreferences]);

  const sendTestNotification = useCallback(() => {
    if (permissionStatus !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    new Notification('Faith Training Reminder', {
      body: 'Time to train your faith! Your daily session is waiting.',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'faith-training-reminder',
      requireInteraction: false
    });
  }, [permissionStatus]);

  return {
    preferences,
    loading,
    permissionStatus,
    requestPermission,
    updatePreferences,
    scheduleNotification,
    sendTestNotification,
    refetch: fetchPreferences
  };
}
