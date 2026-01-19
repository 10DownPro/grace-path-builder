import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Shield, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/session', icon: Heart, label: 'Train' },
  { path: '/battles', icon: Shield, label: 'Battles' },
  { path: '/friends', icon: Users, label: 'Squad' },
  { path: '/prayer', icon: Target, label: 'Prayer' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-card shadow-2xl shadow-black/50 safe-area-pb">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 min-w-0",
                  isActive 
                    ? "bg-primary text-background" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide truncate">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
