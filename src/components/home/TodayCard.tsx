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
    <div className="spiritual-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Today's Session</h2>
          <p className="text-sm text-muted-foreground">
            {allCompleted ? 'Completed! 🎉' : `${completedCount} of ${steps.length} completed`}
          </p>
        </div>
        {!allCompleted && (
          <Link to="/session">
            <Button 
              size="lg" 
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold"
            >
              <Play className="h-4 w-4" />
              Continue
            </Button>
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-4">
        {steps.map((step) => (
          <div 
            key={step.name}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200",
              step.completed 
                ? "bg-sage/10 border border-sage/30" 
                : "bg-muted/30 border border-transparent"
            )}
          >
            <div className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center text-lg",
              step.completed 
                ? "bg-sage/20" 
                : "bg-muted/50"
            )}>
              {step.completed ? (
                <Check className="h-5 w-5 text-sage" />
              ) : (
                step.icon
              )}
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-foreground">{step.name}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{step.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
