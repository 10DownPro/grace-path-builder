import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background gradient-dawn">
      <main className="pb-24 px-4 pt-4">
        {children}
      </main>
      {showNav && <Navigation />}
    </div>
  );
}
