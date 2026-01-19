import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateSquadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description?: string, emoji?: string) => Promise<{ error: Error | null }>;
}

const SQUAD_EMOJIS = ['⚔️', '🔥', '💪', '🛡️', '👑', '🎯', '⭐', '🦁', '🏆', '💎'];

export function CreateSquadDialog({ open, onOpenChange, onSubmit }: CreateSquadDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('⚔️');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setCreating(true);
    const { error } = await onSubmit(name.trim(), description.trim() || undefined, selectedEmoji);
    setCreating(false);

    if (!error) {
      setName('');
      setDescription('');
      setSelectedEmoji('⚔️');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Squad</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Squad Icon</Label>
            <div className="flex flex-wrap gap-2">
              {SQUAD_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="icon"
                  className="text-xl"
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Squad Name</Label>
            <Input
              id="name"
              placeholder="e.g., The Warriors, Faith Grinders"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's your squad about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || creating}>
            {creating ? 'Creating...' : 'Create Squad'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
