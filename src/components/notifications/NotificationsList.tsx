import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Share2, AtSign, Bell, CheckCheck, Trash2 } from 'lucide-react';
import { FeedNotification } from '@/hooks/useFeedNotifications';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationsListProps {
  notifications: FeedNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  unreadCount: number;
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  reaction: <Heart className="h-4 w-4 text-rose-500" />,
  comment: <MessageCircle className="h-4 w-4 text-blue-500" />,
  follow: <UserPlus className="h-4 w-4 text-green-500" />,
  share: <Share2 className="h-4 w-4 text-purple-500" />,
  mention: <AtSign className="h-4 w-4 text-orange-500" />,
};

export function NotificationsList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  unreadCount
}: NotificationsListProps) {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: FeedNotification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate based on reference type
    if (notification.reference_type === 'post' && notification.reference_id) {
      navigate('/feed');
    } else if (notification.notification_type === 'follow') {
      navigate('/friends');
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground text-sm">No notifications yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          When someone reacts or comments on your posts, you'll see it here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header actions */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground">
            {unreadCount} unread
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        </div>
      )}

      <ScrollArea className="max-h-[400px]">
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors relative group",
                !notification.is_read && "bg-primary/5"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {NOTIFICATION_ICONS[notification.notification_type] || (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  {notification.actor_name && (
                    <span className="font-semibold">{notification.actor_name} </span>
                  )}
                  <span className="text-muted-foreground">{notification.message}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}

              {/* Delete button (shows on hover) */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-destructive"
            onClick={onClearAll}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear all notifications
          </Button>
        </div>
      )}
    </div>
  );
}
