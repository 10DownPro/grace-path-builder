import { Link } from 'react-router-dom';
import { useJourney } from '@/hooks/useJourney';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, MapPin } from 'lucide-react';

export function JourneyProgressCard() {
  const { active, percent, completedCount, totalModules, nextModule } = useJourney();
  if (!active) return null;

  return (
    <Link to="/tracks" className="block">
      <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl">
              {active.emoji}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Your journey
              </p>
              <h3 className="font-display text-2xl text-foreground leading-tight">{active.title}</h3>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{completedCount} of {totalModules} modules</span>
            <span className="text-foreground font-semibold">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        {nextModule ? (
          <div className="pt-3 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Next up</p>
            <p className="text-base text-foreground font-medium">{nextModule.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{nextModule.summary}</p>
          </div>
        ) : (
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-secondary font-medium">Journey complete. Beautifully done. 🌿</p>
          </div>
        )}
      </div>
    </Link>
  );
}
