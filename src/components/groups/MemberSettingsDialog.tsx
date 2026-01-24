import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { GroupMember, AGE_GROUPS, READING_LEVELS } from '@/hooks/useStudyGroups';

interface MemberSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  currentMember: GroupMember | undefined;
  onSubmit: (
    groupId: string,
    ageGroup: string,
    readingLevel: string,
    displayName?: string
  ) => Promise<{ error: Error | null }>;
}

export function MemberSettingsDialog({
  open,
  onOpenChange,
  groupId,
  currentMember,
  onSubmit
}: MemberSettingsDialogProps) {
  const [displayName, setDisplayName] = useState('');
  const [ageGroup, setAgeGroup] = useState('adult');
  const [readingLevel, setReadingLevel] = useState('adult');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentMember) {
      setDisplayName(currentMember.display_name || '');
      setAgeGroup(currentMember.age_group || 'adult');
      setReadingLevel(currentMember.reading_level || 'adult');
    }
  }, [currentMember]);

  // Auto-suggest reading level based on age group
  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value);
    const ageInfo = AGE_GROUPS.find(a => a.value === value);
    if (ageInfo) {
      setReadingLevel(ageInfo.defaultLevel);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { error } = await onSubmit(
      groupId,
      ageGroup,
      readingLevel,
      displayName.trim() || undefined
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Settings updated!');
      onOpenChange(false);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Group Settings
          </DialogTitle>
          <DialogDescription>
            Customize how you study with this group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name in Group (Optional)</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Leave blank to use your profile name"
            />
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select value={ageGroup} onValueChange={handleAgeGroupChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map(ag => (
                  <SelectItem key={ag.value} value={ag.value}>
                    {ag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This helps us suggest appropriate content
            </p>
          </div>

          {/* Reading Level */}
          <div className="space-y-2">
            <Label>Reading Level</Label>
            <Select value={readingLevel} onValueChange={setReadingLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {READING_LEVELS.map(rl => (
                  <SelectItem key={rl.value} value={rl.value}>
                    {rl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Study content will be adapted to this level
            </p>
          </div>

          {/* Level Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">What to expect:</h4>
            {readingLevel === 'picture' && (
              <p className="text-sm text-muted-foreground">
                Very simple language with pictures. 50-100 words per session.
                Great for young children learning about God's love.
              </p>
            )}
            {readingLevel === 'early_reader' && (
              <p className="text-sm text-muted-foreground">
                Simple sentences with illustrations. 200-400 words per session.
                Clear moral lessons and basic theology.
              </p>
            )}
            {readingLevel === 'intermediate' && (
              <p className="text-sm text-muted-foreground">
                Multiple paragraphs with context. 400-600 words per session.
                Deeper meaning and life application.
              </p>
            )}
            {readingLevel === 'advanced' && (
              <p className="text-sm text-muted-foreground">
                Full passages with theological depth. 600-1000 words per session.
                Critical thinking and cultural relevance.
              </p>
            )}
            {readingLevel === 'adult' && (
              <p className="text-sm text-muted-foreground">
                Complete text with commentary. 1000-1500 words per session.
                Cross-references, historical context, and deep study.
              </p>
            )}
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
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
