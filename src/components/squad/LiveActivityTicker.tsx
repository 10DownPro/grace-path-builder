import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Flame, BookOpen, Heart, PenLine, Music, Trophy, CheckCircle } from 'lucide-react';

interface LiveActivity {
  id: string;
  user_id: string;
  user_name: string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  started_at: string;
  is_active: boolean;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; label: string; emoji: string }> = {
  training_started: { icon: Flame, label: 'started training', emoji: '🔥' },
  training_completed: { icon: CheckCircle, label: 'finished training', emoji: '💪' },
  worship: { icon: Music, label: 'is in worship', emoji: '🎵' },
  scripture: { icon: BookOpen, label: 'is reading Scripture', emoji: '📖' },
  prayer: { icon: Heart, label: 'is praying', emoji: '🙏' },
  reflection: { icon: PenLine, label: 'is reflecting', emoji: '✍️' },
  milestone: { icon: Trophy, label: 'earned a milestone', emoji: '🏆' },
  prayer_answered: { icon: Heart, label: 'had a prayer answered', emoji: '✨' },
};

export function LiveActivityTicker({ squadId }: { squadId?: string }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch recent activities
  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      let query = supabase
        .from('live_squad_activity')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);

      if (squadId) {
        query = query.eq('squad_id', squadId);
      }

      const { data } = await query;

      if (data) {
        // Fetch user names
        const userIds = [...new Set(data.map(a => a.user_id))];
        const { data: profiles } = await supabase
          .from('public_profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);

        const enriched: LiveActivity[] = data.map(activity => ({
          ...activity,
          user_name: profiles?.find(p => p.user_id === activity.user_id)?.display_name || 'Someone',
          activity_data: activity.activity_data as Record<string, unknown>,
        }));

        setActivities(enriched);
      }
    };

    fetchActivities();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('live-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_squad_activity' },
        async (payload) => {
          const newActivity = payload.new as LiveActivity;
          
          // Fetch user name
          const { data: profile } = await supabase
            .from('public_profiles')
            .select('user_id, display_name')
            .eq('user_id', newActivity.user_id)
            .single();

          setActivities(prev => [{
            ...newActivity,
            user_name: profile?.display_name || 'Someone',
            activity_data: newActivity.activity_data as Record<string, unknown>,
          }, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, squadId]);

  // Auto-scroll ticker
  useEffect(() => {
    if (activities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (activities.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg px-4 py-2 text-center text-sm text-muted-foreground">
        <Flame className="inline h-4 w-4 mr-2" />
        No recent activity. Be the first to train today!
      </div>
    );
  }

  const currentActivity = activities[currentIndex];
  const config = ACTIVITY_CONFIG[currentActivity?.activity_type] || ACTIVITY_CONFIG.training_started;
  const Icon = config.icon;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-lg border border-primary/20">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent z-10" />
      
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg">{config.emoji}</span>
        </div>
        
        <div 
          key={currentActivity.id}
          className="flex-1 animate-fade-in text-sm"
        >
          <span className="font-semibold text-primary">{currentActivity.user_name}</span>
          <span className="text-muted-foreground"> {config.label}</span>
          {currentActivity.activity_data?.milestone_name && (
            <span className="text-foreground font-medium">
              : {String(currentActivity.activity_data.milestone_name)}
            </span>
          )}
        </div>

        <div className="flex-shrink-0 text-xs text-muted-foreground">
          {getTimeAgo(currentActivity.started_at)}
        </div>
      </div>

      {/* Dots indicator */}
      {activities.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {activities.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === currentIndex % 5 ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
}
