import { useState } from 'react';
import { useMicroActions } from '@/hooks/useMicroActions';
import { QuickPrayerDialog } from '@/components/micro-actions/QuickPrayerDialog';
import { VerseSnackDialog } from '@/components/micro-actions/VerseSnackDialog';
import { GratitudeNoteDialog } from '@/components/micro-actions/GratitudeNoteDialog';
import { EncourageFriendDialog } from '@/components/micro-actions/EncourageFriendDialog';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function SmallStepsCard() {
  const { getActionStats } = useMicroActions();
  const stats = getActionStats();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const steps = [
    { type: 'quick_prayer', emoji: '🙏', label: 'Pray for one person', done: stats.prayers.completed > 0 },
    { type: 'verse_snack', emoji: '📖', label: 'Read one verse', done: stats.verses.completed > 0 },
    { type: 'gratitude_note', emoji: '✍️', label: 'Write one sentence', done: stats.gratitude.completed > 0 },
    { type: 'encourage_friend', emoji: '❤️', label: 'Encourage one person', done: stats.encouragements.completed > 0 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Small steps</p>
        <h3 className="font-display text-2xl text-foreground">Even one step counts today.</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {steps.map((s) => (
          <button
            key={s.type}
            onClick={() => setActiveDialog(s.type)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
              s.done
                ? 'border-secondary/50 bg-secondary/5'
                : 'border-border hover:border-primary/40 hover:bg-muted/30'
            )}
          >
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <span className="text-sm text-foreground font-medium leading-tight flex-1">{s.label}</span>
            {s.done && <Check className="h-4 w-4 text-secondary shrink-0" />}
          </button>
        ))}
      </div>

      <QuickPrayerDialog open={activeDialog === 'quick_prayer'} onOpenChange={(o) => !o && setActiveDialog(null)} />
      <VerseSnackDialog open={activeDialog === 'verse_snack'} onOpenChange={(o) => !o && setActiveDialog(null)} />
      <GratitudeNoteDialog open={activeDialog === 'gratitude_note'} onOpenChange={(o) => !o && setActiveDialog(null)} />
      <EncourageFriendDialog open={activeDialog === 'encourage_friend'} onOpenChange={(o) => !o && setActiveDialog(null)} />
    </div>
  );
}
