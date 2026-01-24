import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => Promise<{ error: Error | null }>;
}

export function JoinGroupDialog({ open, onOpenChange, onSubmit }: JoinGroupDialogProps) {
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter a group code');
      return;
    }

    setJoining(true);
    const { error } = await onSubmit(code.trim());

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Successfully joined the squad!');
      setCode('');
      onOpenChange(false);
    }
    setJoining(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Join Training Squad
          </DialogTitle>
          <DialogDescription>
            Enter the squad code shared by the squad leader.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Squad Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC12345"
              maxLength={20}
              className="text-center text-lg font-mono tracking-wider uppercase"
            />
            <p className="text-xs text-muted-foreground text-center">
              Ask your squad leader for the invite code
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={joining || !code.trim()}
            className="flex-1"
          >
            {joining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Group'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
