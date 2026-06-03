import { Link } from 'react-router-dom';
import { useJourney } from '@/hooks/useJourney';
import { useDailyMood } from '@/hooks/useDailyMood';
import { moodContent } from '@/lib/moodContent';
import { Target } from 'lucide-react';

export function TodaysFocusCard() {
  const { active, nextModule } = useJourney();
  const { mood } = useDailyMood();

  const focusText = nextModule
    ? nextModule.title
    : mood
    ? moodContent[mood].reflection
    : 'Spend time with God today.';

  const subText = nextModule
    ? nextModule.summary
    : mood
    ? moodContent[mood].prayerPrompt
    : 'Take your next step. He is at work in you.';

  return (
    <Link to={nextModule ? '/journey' : '/session'} className="block">
      <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 hover:border-secondary/60 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-secondary" />
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold">Today's focus</p>
        </div>
        <h3 className="font-display text-2xl text-foreground mb-1 leading-tight">{focusText}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{subText}</p>
        {active && nextModule && (
          <p className="text-xs text-muted-foreground mt-3">From your {active.title} journey</p>
        )}
      </div>
    </Link>
  );
}
