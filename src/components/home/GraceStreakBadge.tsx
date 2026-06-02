import { Sunrise, Sparkles } from 'lucide-react';

interface GraceStreakBadgeProps {
  currentStreak: number;
  daysWalkedThisMonth: number;
  lastSessionDate?: string | null;
}

export function GraceStreakBadge({ currentStreak, daysWalkedThisMonth, lastSessionDate }: GraceStreakBadgeProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isBackAfterGap = lastSessionDate && lastSessionDate !== today && currentStreak === 0;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/10 via-card to-card p-5">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0">
          {isBackAfterGap ? (
            <Sunrise className="h-7 w-7 text-secondary" />
          ) : (
            <Sparkles className="h-7 w-7 text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isBackAfterGap ? (
            <>
              <h3 className="font-display text-2xl text-foreground leading-tight">We've saved your place.</h3>
              <p className="text-base text-muted-foreground mt-1">Welcome back. No catching up needed.</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-foreground">{currentStreak}</span>
                <span className="text-base text-muted-foreground">day{currentStreak === 1 ? '' : 's'} in a row</span>
              </div>
              <p className="text-base text-muted-foreground mt-1">
                You've walked with God <span className="text-foreground font-semibold">{daysWalkedThisMonth}</span> day{daysWalkedThisMonth === 1 ? '' : 's'} this month.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
