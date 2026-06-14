import { redirect } from 'next/navigation';
import { getDbUser } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getDbUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
