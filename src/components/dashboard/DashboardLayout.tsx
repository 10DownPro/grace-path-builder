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
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <DashboardHeader />
          <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'pb-24' : ''}`}>
            {children}
          </main>
        </SidebarInset>
      </div>
      {/* Mobile bottom nav */}
      {isMobile && <Navigation />}
    </SidebarProvider>
  );
}
