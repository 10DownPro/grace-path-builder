import { Link, useLocation } from 'react-router-dom';
import { Home, Footprints, MessageSquare, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  tourId: string;
}

const navItems: NavItem[] = [
  { path: '/home', icon: Home, label: 'Home', tourId: 'nav-home' },
  { path: '/journey', icon: Footprints, label: 'Journey', tourId: 'nav-journey' },
  { path: '/bible', icon: BookOpen, label: 'Bible', tourId: 'nav-bible' },
  { path: '/community', icon: MessageSquare, label: 'Community', tourId: 'nav-community' },
  { path: '/profile', icon: User, label: 'Profile', tourId: 'nav-profile' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-2xl shadow-black/30 safe-area-pb md:hidden">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ path, icon: Icon, label, tourId }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                data-tour={tourId}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 sm:px-4 py-2 rounded-xl transition-all duration-200 min-w-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm font-medium tracking-wide truncate">
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
