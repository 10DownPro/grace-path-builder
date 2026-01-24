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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateStudyPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSubmit: (
    groupId: string,
    planName: string,
    book: string,
    chapterStart: number,
    chapterEnd: number,
    frequency?: string,
    studyDay?: string
  ) => Promise<{ error: Error | null }>;
}

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
];

const DAYS = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

export function CreateStudyPlanDialog({
  open,
  onOpenChange,
  groupId,
  onSubmit
}: CreateStudyPlanDialogProps) {
  const [planName, setPlanName] = useState('');
  const [book, setBook] = useState('');
  const [chapterStart, setChapterStart] = useState(1);
  const [chapterEnd, setChapterEnd] = useState(1);
  const [frequency, setFrequency] = useState('weekly');
  const [studyDay, setStudyDay] = useState('sunday');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!planName.trim() || !book) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (chapterEnd < chapterStart) {
      toast.error('End chapter must be greater than or equal to start chapter');
      return;
    }

    setCreating(true);
    const { error } = await onSubmit(
      groupId,
      planName.trim(),
      book,
      chapterStart,
      chapterEnd,
      frequency,
      studyDay
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Study plan created! First session is ready.');
      setPlanName('');
      setBook('');
      setChapterStart(1);
      setChapterEnd(1);
      onOpenChange(false);
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Study Plan</DialogTitle>
          <DialogDescription>
            Set up a multi-chapter study plan for your group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g., Journey Through Romans"
            />
          </div>

          {/* Book Selection */}
          <div className="space-y-2">
            <Label>Book of the Bible</Label>
            <Select value={book} onValueChange={setBook}>
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {BIBLE_BOOKS.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chapterStart">Start Chapter</Label>
              <Input
                id="chapterStart"
                type="number"
                min={1}
                value={chapterStart}
                onChange={(e) => setChapterStart(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapterEnd">End Chapter</Label>
              <Input
                id="chapterEnd"
                type="number"
                min={1}
                value={chapterEnd}
                onChange={(e) => setChapterEnd(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Study Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Study Day */}
          {(frequency === 'weekly' || frequency === 'biweekly') && (
            <div className="space-y-2">
              <Label>Study Day</Label>
              <Select value={studyDay} onValueChange={setStudyDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
            disabled={creating || !planName.trim() || !book}
            className="flex-1"
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Plan'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
