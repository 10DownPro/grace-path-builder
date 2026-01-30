import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navigation } from '@/components/layout/Navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar - hidden on mobile, collapsible on tablet, full on desktop */}
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <DashboardHeader />
          <main className={`flex-1 p-4 md:p-6 lg:p-8 ${isMobile ? 'pb-24' : ''}`}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
      {/* Mobile bottom nav - shown only on mobile */}
      {isMobile && <Navigation />}
    </SidebarProvider>
  );
}
