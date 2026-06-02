import { useDailyMood } from '@/hooks/useDailyMood';
import { moodOptions, moodContent } from '@/lib/moodContent';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export function DailyCheckIn() {
  const { mood, setMood } = useDailyMood();
  const content = mood ? moodContent[mood] : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Daily check-in</p>
      </div>
      <h3 className="font-display text-2xl text-foreground mb-4">How are you today?</h3>

      <div className="grid grid-cols-4 gap-2">
        {moodOptions.map((opt) => {
          const selected = mood === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setMood(opt.id)}
              className={cn(
                'flex flex-col items-center justify-start gap-1.5 p-2 rounded-xl border-2 transition-all min-w-0 overflow-hidden',
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/40 hover:bg-muted/40'
              )}
            >
              <span className="text-2xl leading-none">{opt.emoji}</span>
              <span className="w-full text-[11px] text-foreground font-medium text-center leading-tight break-words">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {content && (
        <div className="mt-5 pt-5 border-t border-border space-y-3">
          <p className="text-base text-foreground leading-relaxed italic">
            "{content.scripture.text}"
          </p>
          <p className="text-xs text-muted-foreground">— {content.scripture.reference}</p>
          <p className="text-sm text-secondary leading-relaxed pt-1">
            {content.encouragement}
          </p>
        </div>
      )}
    </div>
  );
}
