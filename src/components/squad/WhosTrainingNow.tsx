import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, Flame, Play, Music, BookOpen, Heart, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActiveUser {
  user_id: string;
  user_name: string;
  current_activity: string;
  is_online: boolean;
  last_active_at: string;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  worship: { icon: Music, label: 'Worship', color: 'text-purple-500' },
  scripture: { icon: BookOpen, label: 'Scripture', color: 'text-blue-500' },
  prayer: { icon: Heart, label: 'Prayer', color: 'text-pink-500' },
  reflection: { icon: PenLine, label: 'Reflection', color: 'text-green-500' },
  idle: { icon: Users, label: 'Online', color: 'text-muted-foreground' },
};

export function WhosTrainingNow({ squadId }: { squadId?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPresence = async () => {
      setLoading(true);

      let query = supabase
        .from('squad_presence')
        .select('*')
        .eq('is_online', true)
        .neq('user_id', user.id)
        .order('last_active_at', { ascending: false });

      if (squadId) {
        query = query.eq('squad_id', squadId);
      }

      const { data } = await query;

      if (data) {
        const userIds = data.map(d => d.user_id);
        const { data: profiles } = await supabase
          .from('public_profiles')
          .select('user_id, display_name')
          .in('user_id', userIds);

        const enriched: ActiveUser[] = data.map(presence => ({
          user_id: presence.user_id,
          user_name: profiles?.find(p => p.user_id === presence.user_id)?.display_name || 'Anonymous',
          current_activity: presence.current_activity || 'idle',
          is_online: presence.is_online || false,
          last_active_at: presence.last_active_at || '',
        }));

        setActiveUsers(enriched);
      }
      setLoading(false);
    };

    fetchPresence();

    // Subscribe to realtime presence updates
    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'squad_presence' },
        () => {
          fetchPresence();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, squadId]);

  const trainingUsers = activeUsers.filter(u => 
    u.current_activity && u.current_activity !== 'idle'
  );

  const handleJoinTraining = () => {
    navigate('/session');
  };

  if (loading) {
    return (
      <Card className="border-dashed animate-pulse">
        <CardContent className="p-4">
          <div className="h-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-2 transition-all",
      trainingUsers.length > 0 
        ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent" 
        : "border-border"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              trainingUsers.length > 0 ? "bg-success animate-pulse" : "bg-muted-foreground"
            )} />
            <span className="font-display uppercase tracking-wide">
              Who's Training Now
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {trainingUsers.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {trainingUsers.length === 0 ? (
          <div className="text-center py-4">
            <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No one is training right now
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to start today!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {trainingUsers.slice(0, 5).map((u) => {
                const config = ACTIVITY_CONFIG[u.current_activity] || ACTIVITY_CONFIG.idle;
                const Icon = config.icon;
                
                return (
                  <div
                    key={u.user_id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {u.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.user_name}</p>
                      <div className={cn("flex items-center gap-1 text-xs", config.color)}>
                        <Icon className="h-3 w-3" />
                        <span>{config.label}</span>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  </div>
                );
              })}
            </div>

            {trainingUsers.length > 0 && (
              <Button 
                onClick={handleJoinTraining} 
                className="w-full btn-gym"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Join Them - Start Training
              </Button>
            )}
          </>
        )}

        {activeUsers.length > 0 && trainingUsers.length === 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {activeUsers.length} squad member{activeUsers.length > 1 ? 's' : ''} online
            </p>
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 6).map((u) => (
                <div
                  key={u.user_id}
                  className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium"
                  title={u.user_name}
                >
                  {u.user_name.charAt(0).toUpperCase()}
                </div>
              ))}
              {activeUsers.length > 6 && (
                <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs">
                  +{activeUsers.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
