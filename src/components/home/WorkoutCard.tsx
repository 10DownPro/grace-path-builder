import { Play, CheckCircle2, Music, BookOpen, Target, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SessionStep {
  name: string;
  icon: string;
  completed: boolean;
  duration: string;
}

interface WorkoutCardProps {
  steps: SessionStep[];
  allCompleted: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  '🎵': Music,
  '📖': BookOpen,
  '🙏': Target,
  '✍️': PenLine,
};

export function WorkoutCard({ steps, allCompleted }: WorkoutCardProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="gym-card overflow-hidden">
      {/* Header */}
      <div className="bg-secondary/30 px-5 py-4 border-b-2 border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-foreground uppercase tracking-wide">
            Today's Workout
          </h2>
          <div className="px-3 py-1 bg-primary/20 border border-primary/40 rounded">
            <span className="font-display text-sm text-primary">
              {completedCount}/{steps.length} SETS
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="progress-gym mt-4">
          <div 
            className="progress-gym-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {steps.map((step) => {
            const IconComponent = iconMap[step.icon] || Target;
            return (
              <div 
                key={step.name}
                className={cn(
                  "relative",
                  step.completed ? "exercise-box-complete" : "exercise-box"
                )}
              >
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    step.completed 
                      ? "bg-success/20" 
                      : "bg-muted"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-7 w-7 text-success animate-stamp" />
                    ) : (
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "font-display text-sm uppercase tracking-wide",
                      step.completed ? "text-success" : "text-foreground"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {step.duration}
                    </p>
                  </div>
                </div>
                
                {/* Completed stamp overlay */}
                {step.completed && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {!allCompleted && (
          <Link to="/session" className="block">
            <button className="btn-gym w-full flex items-center justify-center gap-3 text-lg">
              <Play className="h-5 w-5" />
              <span>Start Training</span>
            </button>
          </Link>
        )}

        {allCompleted && (
          <div className="text-center py-4 bg-success/10 rounded-lg border-2 border-success">
            <p className="font-display text-xl text-success uppercase">
              Workout Complete! 💪
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You showed up. That's what champions do.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
