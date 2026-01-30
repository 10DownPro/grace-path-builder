import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background gradient-dawn">
      {/* Mobile header with notifications */}
      <MobileHeader />
      {/* Main content area with responsive padding */}
      <main className="pb-24 px-4 sm:px-6 lg:px-8 pt-4 max-w-4xl mx-auto">
        {children}
      </main>
      {showNav && <Navigation />}
    </div>
  );
}
