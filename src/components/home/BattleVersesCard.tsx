import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BattleVersesCard() {
  return (
    <Link to="/battles" className="block">
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 border-border",
        "bg-card hover:border-primary/50 transition-all duration-300",
        "group cursor-pointer"
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--primary)) 10px, hsl(var(--primary)) 11px)',
          }} />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent to-warning/10" />
        
        <div className="relative p-5 flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Swords className="h-7 w-7 text-destructive" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-foreground uppercase tracking-wide flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" />
              Struggling Today?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Find strength in Scripture for whatever you're facing
            </p>
          </div>
          
          {/* Arrow */}
          <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        
        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-destructive via-warning to-destructive" />
      </div>
    </Link>
  );
}