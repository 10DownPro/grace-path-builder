import { useMemo } from 'react';
import { useDailyMood } from '@/hooks/useDailyMood';
import { moodContent } from '@/lib/moodContent';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTodaysBread } from '@/lib/dailyBread';

/**
 * Home card — surfaces today's Daily Bread (passage-based reading) along
 * with the mood-adapted Jesus-centered nudge. Tapping opens /scripture for
 * the full Quick/Daily/Deep reader.
 */
export function TodaysScriptureCard() {
  const { mood } = useDailyMood();
  const bread = useMemo(() => getTodaysBread(), []);
  const moodNudge = mood ? moodContent[mood].aboutJesus : null;

  return (
    <Link
      to="/scripture"
      className="block rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-5 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
          Today's Daily Bread
        </p>
      </div>

      <h3 className="font-display text-2xl text-foreground leading-tight mb-1">
        {bread.theme}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 italic">{bread.oneLine}</p>

      <div className="rounded-xl bg-background/40 border border-border p-3 mb-4">
        <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">
          {bread.passageTitle}
        </p>
        <p className="text-sm text-foreground/90">
          {bread.passageRef} · {bread.verses.length} verses
        </p>
      </div>

      {moodNudge && (
        <div className="border-t border-border pt-4 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">
              Points us to Jesus
            </p>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{moodNudge}</p>
        </div>
      )}

      <Button variant="default" size="sm" className="w-full justify-between" asChild={false}>
        <span className="flex items-center justify-between w-full">
          Open today's reading
          <ChevronRight className="h-4 w-4" />
        </span>
      </Button>
    </Link>
  );
}
