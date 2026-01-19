import { Music, BookOpen, PenLine, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const actions = [
  { path: '/session', icon: Heart, label: 'Worship', color: 'text-primary', bg: 'bg-primary/10' },
  { path: '/scripture', icon: BookOpen, label: 'Scripture', color: 'text-accent', bg: 'bg-accent/10' },
  { path: '/prayer', icon: PenLine, label: 'Prayer', color: 'text-sage', bg: 'bg-sage/10' },
  { path: '/progress', icon: Music, label: 'Worship', color: 'text-navy', bg: 'bg-navy/10' },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map(({ path, icon: Icon, label, color, bg }) => (
        <Link
          key={path + label}
          to={path}
          className="group flex flex-col items-center gap-2 p-4 rounded-xl spiritual-card hover:shadow-soft transition-all duration-200"
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110",
            bg
          )}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
