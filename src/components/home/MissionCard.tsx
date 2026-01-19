import { AlertTriangle } from 'lucide-react';

interface MissionCardProps {
  mission: string;
  subtitle?: string;
}

export function MissionCard({ mission, subtitle = "The hardest reps build the most strength" }: MissionCardProps) {
  return (
    <div className="gym-card-warning p-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-display text-lg text-warning uppercase tracking-wide">
            Today's Mission
          </h3>
          <p className="text-foreground font-medium leading-relaxed">
            {mission}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
