import { getDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardSidebarProvider } from '@/components/layout/DashboardSidebarProvider';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { TimeZoneSync } from '@/components/layout/TimeZoneSync';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getDbUser();

  let isPurchased = false;
  if (user) {
    const count = await prisma.enrollment.count({ where: { userId: user.id, status: 'ACTIVE' } });
    isPurchased = count > 0;
  }

  return (
    <DashboardSidebarProvider>
      {user && <TimeZoneSync />}
      <div className="min-h-screen flex print:block" style={{ background: 'var(--color-background)' }}>
        <DashboardSidebar role={user?.role} isPurchased={isPurchased} isGuest={!user} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader isSignedIn={!!user} />
          <main className="flex-1 p-6 overflow-auto print:p-0 print:overflow-visible">
            {children}
          </main>
        </div>
      </div>
    </DashboardSidebarProvider>
  );
}
