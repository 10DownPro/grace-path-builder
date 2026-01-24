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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GROUP_TYPES } from '@/hooks/useStudyGroups';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    name: string,
    groupType: string,
    description?: string,
    emoji?: string
  ) => Promise<{ error: Error | null }>;
}

const EMOJI_OPTIONS = ['📖', '⛪', '🙏', '✝️', '🕊️', '💒', '🌟', '🔥', '❤️', '👨‍👩‍👧‍👦', '🤝', '🎓'];

export function CreateGroupDialog({ open, onOpenChange, onSubmit }: CreateGroupDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState('family');
  const [emoji, setEmoji] = useState('📖');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setCreating(true);
    const { error } = await onSubmit(name.trim(), groupType, description.trim() || undefined, emoji);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Group created! Share your code with members.');
      setName('');
      setDescription('');
      setGroupType('family');
      setEmoji('📖');
      onOpenChange(false);
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Study Group</DialogTitle>
          <DialogDescription>
            Start a Bible study group for family, friends, or community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Smith Family"
              maxLength={100}
            />
          </div>

          {/* Group Type */}
          <div className="space-y-2">
            <Label>Group Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {GROUP_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setGroupType(type.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    groupType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.emoji}</span>
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Icon */}
          <div className="space-y-2">
            <Label>Group Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                    emoji === e
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will your group study together?"
              maxLength={500}
              rows={3}
            />
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
            disabled={creating || !name.trim()}
            className="flex-1"
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Group'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
