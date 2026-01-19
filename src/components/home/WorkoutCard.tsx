import { Play, CheckCircle2, Music, BookOpen, Target, PenLine, Clock, Dumbbell } from 'lucide-react';
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
  const totalDuration = steps.reduce((acc, s) => acc + parseInt(s.duration), 0);

  return (
    <div className="rounded-xl border-2 border-border overflow-hidden bg-gradient-to-b from-card via-card to-background shadow-lg">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/40 px-5 py-4 border-b-2 border-border">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground uppercase tracking-wide">
                Today's Workout
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~{totalDuration} min total</span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-primary/20 border-2 border-primary/40 rounded-lg">
            <span className="font-display text-lg text-primary">
              {completedCount}/{steps.length}
            </span>
            <span className="font-display text-xs text-primary/70 ml-1">SETS</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative mt-4">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary via-warning to-primary transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
          {/* Progress markers */}
          <div className="absolute top-0 left-0 right-0 h-3 flex items-center justify-between px-1">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < completedCount ? "bg-background" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Target;
            return (
              <div 
                key={step.name}
                className={cn(
                  "relative rounded-xl p-4 transition-all duration-300",
                  step.completed 
                    ? "bg-gradient-to-br from-success/20 to-success/5 border-2 border-success shadow-lg shadow-success/10" 
                    : "bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-border hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Icon with background */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                    step.completed 
                      ? "bg-success/30 shadow-inner" 
                      : "bg-muted shadow-inner"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    ) : (
                      <IconComponent className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="text-center">
                    <p className={cn(
                      "font-display text-sm uppercase tracking-wide",
                      step.completed ? "text-success" : "text-foreground"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase mt-0.5">
                      {step.duration}
                    </p>
                  </div>
                </div>
                
                {/* Step number badge */}
                <div className={cn(
                  "absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  step.completed 
                    ? "bg-success text-success-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                
                {/* Completed check badge */}
                {step.completed && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {!allCompleted && (
          <Link to="/session" className="block">
            <button className="w-full py-4 px-6 rounded-xl font-display uppercase tracking-wider text-lg text-background bg-gradient-to-r from-primary via-primary to-warning border-b-4 border-primary/60 hover:scale-[1.02] active:scale-[0.98] active:border-b-2 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3">
              <Play className="h-6 w-6" />
              <span>Start Training</span>
            </button>
          </Link>
        )}

        {allCompleted && (
          <div className="relative overflow-hidden text-center py-5 bg-gradient-to-r from-success/20 via-success/10 to-success/20 rounded-xl border-2 border-success">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--success)/0.3)_0%,_transparent_70%)]" />
            <div className="relative">
              <p className="font-display text-2xl text-success uppercase">
                Workout Complete! 💪
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You showed up. That's what champions do.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
