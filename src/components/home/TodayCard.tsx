import { Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SessionStep {
  name: string;
  icon: string;
  completed: boolean;
  duration: string;
}

interface TodayCardProps {
  steps: SessionStep[];
  allCompleted: boolean;
}

export function TodayCard({ steps, allCompleted }: TodayCardProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="spiritual-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today's Session</h2>
          <p className="text-sm text-muted-foreground">
            {allCompleted ? 'Completed! 🎉' : `${completedCount} of ${steps.length} completed`}
          </p>
        </div>
        {!allCompleted && (
          <Link to="/session">
            <Button variant="golden" size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Continue
            </Button>
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 gradient-golden rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => (
          <div 
            key={step.name}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
              step.completed 
                ? "bg-sage/10 border border-sage/30" 
                : "bg-muted/50 border border-transparent"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
              step.completed 
                ? "bg-sage/20" 
                : "bg-muted"
            )}>
              {step.completed ? (
                <Check className="h-5 w-5 text-sage" />
              ) : (
                step.icon
              )}
            </div>
            <span className="text-xs font-medium text-center">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
