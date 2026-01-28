import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  variant?: 'default' | 'primary';
}

export function QuickActionCard({
  title,
  description,
  icon,
  to,
  variant = 'default',
}: QuickActionCardProps) {
  return (
    <Link to={to}>
      <Card className={cn(
        'gym-card transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 cursor-pointer group',
        variant === 'primary' && 'border-primary/50 bg-primary/5'
      )}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={cn(
            'p-3 rounded-lg',
            variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg uppercase tracking-wide truncate">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}
