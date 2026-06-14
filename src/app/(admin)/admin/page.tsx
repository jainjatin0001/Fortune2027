import type { Metadata } from 'next';
import { Users, BookOpen, TrendingUp, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getStats() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalQuizAttempts,
    recentUsers,
    pendingMessages,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.quizAttempt.count({ where: { status: 'COMPLETED' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return { totalUsers, totalCourses, totalEnrollments, totalQuizAttempts, recentUsers, pendingMessages };
}

async function getTopCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { enrollments: { _count: 'desc' } },
    take: 5,
    select: {
      id: true,
      title: true,
      _count: { select: { enrollments: true } },
    },
  });
}

const roleBadgeStyle: Record<string, { background: string; color: string }> = {
  SUPER_ADMIN: { background: '#fee2e2', color: '#dc2626' },
  ADMIN: { background: '#fef3c7', color: '#d97706' },
  INSTRUCTOR: { background: '#ede9fe', color: '#7c3aed' },
  PARENT: { background: '#dbeafe', color: '#2563eb' },
  STUDENT: { background: '#dcfce7', color: '#16a34a' },
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminDashboardPage() {
  const [stats, topCourses] = await Promise.all([getStats(), getTopCourses()]);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), description: 'Registered accounts', color: '#0891b2' },
    { icon: BookOpen, label: 'Live Courses', value: stats.totalCourses.toLocaleString(), description: 'Published courses', color: '#7c3aed' },
    { icon: TrendingUp, label: 'Enrollments', value: stats.totalEnrollments.toLocaleString(), description: 'Active enrollments', color: '#059669' },
    { icon: CheckCircle, label: 'Quiz Attempts', value: stats.totalQuizAttempts.toLocaleString(), description: 'Completed attempts', color: '#eab308' },
  ];

  const maxEnrollments = Math.max(...topCourses.map(c => c._count.enrollments), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Admin Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Platform health at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, description, color }) => (
          <div key={label} className="card-base p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15`, color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--color-foreground)' }}>{value}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Recent Sign-Ups</h2>
            <a href="/admin/users" className="text-sm hover:underline" style={{ color: 'var(--color-accent)' }}>View all</a>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => {
              const s = roleBadgeStyle[user.role] ?? { background: '#f3f4f6', color: '#6b7280' };
              return (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    {user.firstName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={s}>{user.role}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{user.email}</span>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>
                    {timeAgo(new Date(user.createdAt))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Top Courses</h2>
            <a href="/admin/courses" className="text-sm hover:underline" style={{ color: 'var(--color-accent)' }}>Manage</a>
          </div>
          {topCourses.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No published courses yet.</p>
          ) : (
            <div className="space-y-4">
              {topCourses.map((course, i) => (
                <div key={course.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-4" style={{ color: 'var(--color-muted-foreground)' }}>#{i + 1}</span>
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{course.title}</span>
                    </div>
                    <span className="text-xs font-medium shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>
                      {course._count.enrollments.toLocaleString()} enrolled
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 4 }}>
                    <div className="progress-fill" style={{ width: `${(course._count.enrollments / maxEnrollments) * 100}%`, height: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Quick Actions</h2>
          {stats.pendingMessages > 0 && (
            <a href="/admin/notifications" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <AlertCircle className="h-3 w-3" />
              {stats.pendingMessages} unread message{stats.pendingMessages > 1 ? 's' : ''}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Course', href: '/admin/courses', icon: BookOpen, color: '#7c3aed' },
            { label: 'Add Question', href: '/admin/questions', icon: AlertCircle, color: '#d97706' },
            { label: 'New Blog Post', href: '/admin/blog', icon: Activity, color: '#059669' },
            { label: 'View Analytics', href: '/admin/analytics', icon: TrendingUp, color: '#0891b2' },
          ].map(({ label, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:scale-105"
              style={{ background: `${color}15` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
