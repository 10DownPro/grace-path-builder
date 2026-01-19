import { useEncouragements } from '@/hooks/useEncouragements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function EncouragementsList() {
  const { received, unreadCount, markAsRead, markAllAsRead, loading } = useEncouragements();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (received.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No encouragements yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Encourage your training partners and they'll encourage you back!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Encouragements
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-primary">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {received.map((enc) => (
              <div 
                key={enc.id} 
                className={`p-3 rounded-lg transition-colors ${
                  enc.is_read 
                    ? 'bg-muted/50' 
                    : 'bg-primary/10 border border-primary/20'
                }`}
                onClick={() => !enc.is_read && markAsRead(enc.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {enc.from_user_name}
                    </p>
                    <p className="text-sm mt-1">{enc.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(enc.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!enc.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
