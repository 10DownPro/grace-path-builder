import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTestimonies, TestimonyType, TESTIMONY_TYPE_CONFIG } from '@/hooks/useTestimonies';
import { toast } from 'sonner';
import { BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTestimonyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedPrayerId?: string;
  initialType?: TestimonyType;
}

export function CreateTestimonyDialog({ 
  open, 
  onOpenChange, 
  relatedPrayerId,
  initialType = 'answered_prayer'
}: CreateTestimonyDialogProps) {
  const { createTestimony } = useTestimonies();
  
  const [testimonyType, setTestimonyType] = useState<TestimonyType>(initialType);
  const [title, setTitle] = useState('');
  const [testimonyText, setTestimonyText] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [verseText, setVerseText] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'squad' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTestimonyType(initialType);
    setTitle('');
    setTestimonyText('');
    setVerseReference('');
    setVerseText('');
    setVisibility('public');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please add a title for your testimony');
      return;
    }
    if (!testimonyText.trim()) {
      toast.error('Please share your testimony');
      return;
    }

    setIsSubmitting(true);

    const { error } = await createTestimony({
      testimony_type: testimonyType,
      title: title.trim(),
      testimony_text: testimonyText.trim(),
      related_prayer_id: relatedPrayerId,
      related_verse_reference: verseReference.trim() || undefined,
      related_verse_text: verseText.trim() || undefined,
      visibility
    });

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to share testimony');
      return;
    }

    toast.success('Testimony shared! 📖');
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display uppercase tracking-wide">
            <BookOpen className="h-5 w-5 text-success" />
            Share Your Testimony
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Testimony Type */}
          <div className="space-y-2">
            <Label className="text-sm">What type of testimony?</Label>
            <Select value={testimonyType} onValueChange={(v) => setTestimonyType(v as TestimonyType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TESTIMONY_TYPE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{config.emoji}</span>
                      <span>{config.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm">Give it a title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., God Healed My Marriage"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
          </div>

          {/* Testimony Text */}
          <div className="space-y-2">
            <Label className="text-sm">Share your story</Label>
            <Textarea
              value={testimonyText}
              onChange={(e) => setTestimonyText(e.target.value)}
              placeholder="Tell what God did in your life..."
              className="min-h-[150px] resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">{testimonyText.length}/2000</p>
          </div>

          {/* Related Scripture */}
          <div className="space-y-3 p-3 rounded-lg border border-border bg-muted/30">
            <Label className="text-sm text-muted-foreground">Add a related Scripture (optional)</Label>
            <Input
              value={verseReference}
              onChange={(e) => setVerseReference(e.target.value)}
              placeholder="e.g., Philippians 4:13"
            />
            {verseReference && (
              <Textarea
                value={verseText}
                onChange={(e) => setVerseText(e.target.value)}
                placeholder="Verse text..."
                className="min-h-[60px] resize-none text-sm"
              />
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <Label className="text-sm">Share with:</Label>
            <Select value={visibility} onValueChange={(v: typeof visibility) => setVisibility(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="squad">My Squad Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !testimonyText.trim()}
              className="bg-success hover:bg-success/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Share Testimony
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
