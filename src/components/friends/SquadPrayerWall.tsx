import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Plus, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PrayerRequest {
  id: string;
  squad_id: string;
  user_id: string;
  prayer_request: string;
  is_answered: boolean;
  answered_testimony: string | null;
  prayed_by: string[];
  prayer_count: number;
  created_at: string;
  answered_at: string | null;
  user_name?: string;
}

interface SquadPrayerWallProps {
  squadId: string;
  squadName: string;
  memberProfiles: Record<string, string>;
}

export function SquadPrayerWall({ squadId, squadName, memberProfiles }: SquadPrayerWallProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPrayerRequests();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`squad-prayers-${squadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'squad_prayer_requests',
          filter: `squad_id=eq.${squadId}`
        },
        () => {
          fetchPrayerRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [squadId]);

  const fetchPrayerRequests = async () => {
    const { data } = await supabase
      .from('squad_prayer_requests')
      .select('*')
      .eq('squad_id', squadId)
      .order('created_at', { ascending: false });

    if (data) {
      const enriched: PrayerRequest[] = data.map(req => ({
        ...req,
        answered_at: req.answered_at || null,
        answered_testimony: req.answered_testimony || null,
        prayed_by: Array.isArray(req.prayed_by) ? (req.prayed_by as string[]) : [],
        user_name: memberProfiles[req.user_id] || 'Squad Member'
      }));
      setRequests(enriched);
    }
    setLoading(false);
  };

  const handleSubmitRequest = async () => {
    if (!user || !newRequest.trim()) return;
    
    setSubmitting(true);
    const { error } = await supabase
      .from('squad_prayer_requests')
      .insert({
        squad_id: squadId,
        user_id: user.id,
        prayer_request: newRequest.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit prayer request",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Prayer Request Shared",
        description: "Your squad will be praying for you 🙏"
      });
      setNewRequest('');
      setDialogOpen(false);
    }
    setSubmitting(false);
  };

  const handlePray = async (requestId: string, currentPrayedBy: string[]) => {
    if (!user) return;
    
    if (currentPrayedBy.includes(user.id)) {
      toast({
        title: "Already Praying",
        description: "You're already praying for this request"
      });
      return;
    }

    const newPrayedBy = [...currentPrayedBy, user.id];
    
    const { error } = await supabase
      .from('squad_prayer_requests')
      .update({
        prayed_by: newPrayedBy,
        prayer_count: newPrayedBy.length
      })
      .eq('id', requestId);

    if (!error) {
      toast({
        title: "🙏 Praying",
        description: "You're now praying for this request"
      });
    }
  };

  const handleMarkAnswered = async (requestId: string) => {
    const { error } = await supabase
      .from('squad_prayer_requests')
      .update({
        is_answered: true,
        answered_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (!error) {
      toast({
        title: "GOD CAME THROUGH! 🎉",
        description: "Praise God for answered prayer!"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Prayer Wall
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Request Prayer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Prayer Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="What would you like your squad to pray for?"
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
                rows={4}
              />
              <Button 
                onClick={handleSubmitRequest} 
                disabled={submitting || !newRequest.trim()}
                className="w-full"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Heart className="h-4 w-4 mr-2" />
                )}
                Share with Squad
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prayer Requests */}
      {requests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold mb-1">No Prayer Requests Yet</h3>
            <p className="text-sm text-muted-foreground">
              Share a prayer request and let your squad support you
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {requests.map((request) => {
              const hasPrayed = user ? request.prayed_by.includes(user.id) : false;
              const isOwner = user?.id === request.user_id;

              return (
                <Card 
                  key={request.id} 
                  className={request.is_answered ? 'border-green-500/30 bg-green-500/5' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {request.user_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-sm">{request.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </span>
                          {request.is_answered && (
                            <Badge className="bg-green-500 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Answered!
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{request.prayer_request}</p>
                        {request.answered_testimony && (
                          <p className="text-sm text-green-600 mt-2 italic">
                            "{request.answered_testimony}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        {request.prayer_count} {request.prayer_count === 1 ? 'person' : 'people'} praying
                      </span>
                      <div className="flex gap-2">
                        {!request.is_answered && isOwner && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAnswered(request.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Answered
                          </Button>
                        )}
                        {!request.is_answered && !isOwner && (
                          <Button
                            variant={hasPrayed ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handlePray(request.id, request.prayed_by)}
                            disabled={hasPrayed}
                          >
                            🙏 {hasPrayed ? "Praying" : "I'm Praying"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
