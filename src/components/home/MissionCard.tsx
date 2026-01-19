import { AlertTriangle, Target, Heart, Users, Shield, Swords, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  mission: string;
  subtitle?: string;
  category?: 'prayer' | 'forgiveness' | 'service' | 'courage' | 'love' | 'witness';
}

const categoryConfig = {
  prayer: { 
    icon: Target, 
    gradient: 'from-primary/30 to-primary/10',
    iconBg: 'bg-primary/20'
  },
  forgiveness: { 
    icon: Heart, 
    gradient: 'from-warning/30 to-warning/10',
    iconBg: 'bg-warning/20'
  },
  service: { 
    icon: Users, 
    gradient: 'from-success/30 to-success/10',
    iconBg: 'bg-success/20'
  },
  courage: { 
    icon: Shield, 
    gradient: 'from-primary/30 to-secondary/10',
    iconBg: 'bg-primary/20'
  },
  love: { 
    icon: Heart, 
    gradient: 'from-destructive/20 to-primary/10',
    iconBg: 'bg-destructive/20'
  },
  witness: { 
    icon: Flame, 
    gradient: 'from-warning/30 to-primary/10',
    iconBg: 'bg-warning/20'
  },
};

// Detect category from mission text
function detectCategory(mission: string): 'prayer' | 'forgiveness' | 'service' | 'courage' | 'love' | 'witness' {
  const text = mission.toLowerCase();
  if (text.includes('forgive') || text.includes('wronged') || text.includes('hurt')) return 'forgiveness';
  if (text.includes('serve') || text.includes('help') || text.includes('volunteer')) return 'service';
  if (text.includes('brave') || text.includes('courage') || text.includes('bold') || text.includes('fear')) return 'courage';
  if (text.includes('love') || text.includes('kind') || text.includes('compassion')) return 'love';
  if (text.includes('share') || text.includes('witness') || text.includes('tell') || text.includes('gospel')) return 'witness';
  return 'prayer';
}

export function MissionCard({ mission, subtitle = "The hardest reps build the most strength", category }: MissionCardProps) {
  const detectedCategory = category || detectCategory(mission);
  const config = categoryConfig[detectedCategory];
  const IconComponent = config.icon;

  return (
    <div className="gym-card-warning overflow-hidden">
      {/* Visual Header with gradient */}
      <div className={cn(
        "relative h-16 bg-gradient-to-r",
        config.gradient
      )}>
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            <pattern id="mission-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#mission-pattern)" />
          </svg>
        </div>
        
        {/* Large Icon in background */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
          <Swords className="h-12 w-12 text-warning" />
        </div>
        
        {/* Alert Badge */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.iconBg)}>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <span className="font-display text-lg text-warning uppercase tracking-wide drop-shadow-sm">
            Today's Mission
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
            config.iconBg
          )}>
            <IconComponent className="h-6 w-6 text-warning" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-lg text-foreground font-bold leading-relaxed">
              {mission}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
