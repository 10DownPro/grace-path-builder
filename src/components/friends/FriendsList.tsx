import { useState } from 'react';
import { Friend } from '@/hooks/useFriends';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Flame, Trophy, UserMinus, Users, MessageCircle } from 'lucide-react';
import { DirectMessageDialog } from './DirectMessageDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FriendsListProps {
  friends: Friend[];
  loading: boolean;
  onChallenge: (friendId: string) => void;
  onRemove: (friendshipId: string) => Promise<{ error: Error | null }>;
}

export function FriendsList({ friends, loading, onChallenge, onRemove }: FriendsListProps) {
  const [dmOpen, setDmOpen] = useState(false);
  const [selectedDmFriend, setSelectedDmFriend] = useState<{ id: string; name: string } | null>(null);

  const openDm = (friendId: string, friendName: string) => {
    setSelectedDmFriend({ id: friendId, name: friendName });
    setDmOpen(true);
  };
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No Friends Yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Share your friend code to start building your squad. Iron sharpens iron!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <Card key={friend.id} className="hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                {friend.name.charAt(0).toUpperCase()}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{friend.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {friend.current_streak}d
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {friend.total_sessions}
                  </span>
                  {friend.current_streak >= 7 && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 text-[10px] px-1.5 py-0">
                      🔥
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions - cleaner layout */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => openDm(friend.user_id, friend.name)}
                  title="Message"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => onChallenge(friend.user_id)}
                  title="Challenge"
                >
                  <Swords className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground/50 hover:text-destructive"
                      title="Remove Friend"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Friend?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {friend.name} from your friends? You can always add them back later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemove(friend.friendship_id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedDmFriend && (
        <DirectMessageDialog
          open={dmOpen}
          onOpenChange={setDmOpen}
          friendId={selectedDmFriend.id}
          friendName={selectedDmFriend.name}
        />
      )}
    </div>
  );
}
