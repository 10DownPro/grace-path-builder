import { Link } from 'react-router-dom';
import { useJourney } from '@/hooks/useJourney';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Clock } from 'lucide-react';

interface ContinueJourneyCardProps {
  lastSessionDate?: string | null;
}

type Mode = 'active' | 'gap-3-7' | 'gap-7-30' | 'gap-30';

function daysSince(dateStr?: string | null): number {
  if (!dateStr) return 9999;
  const last = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getMode(days: number): Mode {
  if (days <= 3) return 'active';
  if (days < 7) return 'gap-3-7';
  if (days < 30) return 'gap-7-30';
  return 'gap-30';
}

export function ContinueJourneyCard({ lastSessionDate }: ContinueJourneyCardProps) {
  const { active, percent, completedCount, totalModules, nextModule } = useJourney();
  if (!active) return null;

  const mode = getMode(daysSince(lastSessionDate));
  const lesson = nextModule;

  // Copy variants
  const copy = (() => {
    switch (mode) {
      case 'active':
        return {
          eyebrow: 'Continue your journey',
          heading: active.title,
          subline: null as string | null,
          cta: 'Continue',
        };
      case 'gap-3-7':
        return {
          eyebrow: 'Welcome back',
          heading: "Let's pick up where you left off.",
          subline: null,
          cta: 'Continue Journey',
        };
      case 'gap-7-30':
        return {
          eyebrow: 'We\'ve saved your place',
          heading: 'No catching up needed.',
          subline: 'Continue where you left off whenever you\'re ready.',
          cta: 'Continue Journey',
        };
      case 'gap-30':
        return {
          eyebrow: 'Welcome back',
          heading: "God hasn't gone anywhere.",
          subline: "Let's take the next step together.",
          cta: 'Resume Journey',
        };
    }
  })();

  return (
    <Link to="/journey" className="block group">
      <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 hover:border-primary transition-colors shadow-lg shadow-primary/5">
        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
          {copy.eyebrow}
        </p>

        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-1">
          {copy.heading}
        </h2>

        {/* Subline for gap modes */}
        {copy.subline && (
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            {copy.subline}
          </p>
        )}

        {/* Track + lesson details */}
        <div className="mt-4 space-y-3 pt-4 border-t border-border">
          {mode !== 'active' && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Track</p>
              <p className="text-base text-foreground font-semibold">{active.title}</p>
            </div>
          )}

          {lesson ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Current lesson</p>
              <p className="text-lg text-foreground font-semibold leading-tight">{lesson.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{lesson.summary}</p>
            </div>
          ) : (
            <p className="text-sm text-secondary font-medium">Journey complete. Beautifully done. 🌿</p>
          )}

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completedCount} of {totalModules} lessons complete</span>
              <span className="text-foreground font-semibold">{percent}%</span>
            </div>
            <Progress value={percent} className="h-2" />
          </div>

          {/* Estimated time */}
          {lesson && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>About {lesson.estimatedMinutes} min</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-primary-foreground group-hover:bg-primary/90 transition-colors">
          <span className="font-semibold text-base tracking-wide">{copy.cta}</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
