import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMicroActions } from '@/hooks/useMicroActions';
import { useFriends } from '@/hooks/useFriends';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface EncourageFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ENCOURAGEMENT_MESSAGES = [
  { text: "Keep pushing! 🔥", emoji: "🔥" },
  { text: "You got this! 💪", emoji: "💪" },
  { text: "Don't quit on me! 🎯", emoji: "🎯" },
  { text: "I'm praying for you 🙏", emoji: "🙏" },
  { text: "Stay strong! ⚔️", emoji: "⚔️" },
  { text: "Proud of you! 🌟", emoji: "🌟" }
];

export function EncourageFriendDialog({ open, onOpenChange }: EncourageFriendDialogProps) {
  const { completeMicroAction } = useMicroActions();
  const { friends, loading: friendsLoading } = useFriends();
  const { successPattern } = useHapticFeedback();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedFriend(null);
      setSelectedMessage(null);
      setCompleted(false);
    }
  }, [open]);

  const handleSend = async () => {
    if (!selectedFriend || !selectedMessage) return;

    setLoading(true);

    const friend = friends.find(f => f.user_id === selectedFriend);

    // Send the encouragement
    const { error: encouragementError } = await supabase
      .from('encouragements')
      .insert([{
        from_user_id: (await supabase.auth.getUser()).data.user?.id,
        to_user_id: selectedFriend,
        message: selectedMessage,
        encouragement_type: 'quick'
      }]);

    if (encouragementError) {
      setLoading(false);
      return;
    }

    // Complete micro action
    const { error } = await completeMicroAction('encourage_friend', {
      friend_id: selectedFriend,
      friend_name: friend?.name,
      message: selectedMessage
    });

    setLoading(false);

    if (!error) {
      setCompleted(true);
      successPattern();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setCompleted(false);
        onOpenChange(false);
      }, 1500);
    }
  };

  const selectedFriendData = friends.find(f => f.user_id === selectedFriend);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            💪 Encourage Friend
            <span className="text-sm text-primary font-normal">+5 pts</span>
          </DialogTitle>
        </DialogHeader>

        {completed ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center animate-scale-in">
              <Check className="h-8 w-8 text-success" />
            </div>
            <p className="text-lg font-bold text-success">Encouragement Sent!</p>
            <p className="text-sm text-muted-foreground text-center">
              {selectedFriendData?.name} will be notified
            </p>
          </div>
        ) : friendsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Users className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Add friends to send encouragements
            </p>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Select Friend */}
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Choose a friend:</p>
              <div className="grid grid-cols-3 gap-2">
                {friends.slice(0, 6).map((friend) => (
                  <button
                    key={friend.user_id}
                    onClick={() => setSelectedFriend(friend.user_id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                      "hover:bg-accent",
                      selectedFriend === friend.user_id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate w-full text-center">
                      {friend.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Message */}
            {selectedFriend && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm font-medium">2. Pick a message:</p>
                <div className="grid grid-cols-2 gap-2">
                  {ENCOURAGEMENT_MESSAGES.map((msg) => (
                    <Button
                      key={msg.text}
                      variant={selectedMessage === msg.text ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-auto py-2"
                      onClick={() => setSelectedMessage(msg.text)}
                    >
                      {msg.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Send Button */}
            {selectedFriend && selectedMessage && (
              <Button
                className="w-full animate-fade-in"
                disabled={loading}
                onClick={handleSend}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Send to {selectedFriendData?.name} 💪
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
