import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEncouragements } from '@/hooks/useEncouragements';
import { toast } from '@/hooks/use-toast';

interface SendEncouragementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendId: string;
  friendName: string;
}

export function SendEncouragementDialog({ 
  open, 
  onOpenChange, 
  friendId, 
  friendName 
}: SendEncouragementDialogProps) {
  const { sendEncouragement, quickEncouragements } = useEncouragements();
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleQuickSend = async (message: string) => {
    setSending(true);
    const { error } = await sendEncouragement(friendId, message, 'quick');
    setSending(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send encouragement",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sent! 🔥",
        description: `Your encouragement was sent to ${friendName}`
      });
      onOpenChange(false);
    }
  };

  const handleCustomSend = async () => {
    if (!customMessage.trim()) return;
    
    setSending(true);
    const { error } = await sendEncouragement(friendId, customMessage.trim(), 'custom');
    setSending(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send encouragement",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sent! 🔥",
        description: `Your encouragement was sent to ${friendName}`
      });
      setCustomMessage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💪 Encourage {friendName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick encouragements */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Quick send:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickEncouragements.map((enc, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleQuickSend(enc.message)}
                  disabled={sending}
                >
                  <span className="text-lg mr-2">{enc.emoji}</span>
                  <span className="text-sm truncate">{enc.message}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom message */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or write your own:</p>
            <Textarea
              placeholder="Type your encouragement..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={280}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {customMessage.length}/280
              </span>
              <Button 
                onClick={handleCustomSend}
                disabled={sending || !customMessage.trim()}
              >
                Send 🚀
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
