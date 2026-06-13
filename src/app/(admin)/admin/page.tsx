import type { Metadata } from 'next';
import { Users, BookOpen, TrendingUp, DollarSign, Star, Activity, UserCheck, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = { title: 'Admin Dashboard' };

const adminStats = [
  { icon: Users, label: 'Total Users', value: '251,847', change: '+1,234 this week', color: '#0891b2', positive: true },
  { icon: BookOpen, label: 'Active Courses', value: '48', change: '3 pending review', color: '#7c3aed', positive: true },
  { icon: TrendingUp, label: 'Enrollments', value: '18,432', change: '+892 this month', color: '#059669', positive: true },
  { icon: Star, label: 'Avg Rating', value: '4.91', change: '+0.02 vs last month', color: '#eab308', positive: true },
];

const recentUsers = [
  { name: 'Emma Rodriguez', email: 'emma@example.com', role: 'STUDENT', joined: '2h ago', status: 'active' },
  { name: 'Liam Chen', email: 'liam@example.com', role: 'STUDENT', joined: '5h ago', status: 'active' },
  { name: 'Olivia Patel', email: 'olivia@example.com', role: 'INSTRUCTOR', joined: '1d ago', status: 'pending' },
  { name: 'Noah Williams', email: 'noah@example.com', role: 'STUDENT', joined: '1d ago', status: 'active' },
  { name: 'Ava Thompson', email: 'ava@example.com', role: 'PARENT', joined: '2d ago', status: 'active' },
];

const topCourses = [
  { title: 'Complete SAT Prep', enrollments: 48231, rating: 4.9, revenue: 0 },
  { title: 'Python — Zero to Pro', enrollments: 67012, rating: 4.9, revenue: 0 },
  { title: 'AP Calculus AB', enrollments: 21043, rating: 4.9, revenue: 419447 },
  { title: 'ACT Masterclass', enrollments: 32456, rating: 4.8, revenue: 647783 },
  { title: 'Data Science', enrollments: 18234, rating: 4.8, revenue: 546539 },
];

const roleColors: Record<string, string> = {
  STUDENT: 'badge-sat',
  INSTRUCTOR: 'badge-coding',
  PARENT: 'badge-ap',
  ADMIN: 'badge-act',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Admin Overview</h1>
        <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Platform health at a glance. Last updated: just now.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map(({ icon: Icon, label, value, change, color, positive }) => (
          <div key={label} className="card-base p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
                <Icon className="h-5 w-5" />
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={positive
                  ? { background: 'var(--color-success-light)', color: 'var(--color-success)' }
                  : { background: 'var(--color-warning-light)', color: 'var(--color-warning)' }
                }
              >
                {positive ? '↑' : '↓'}
              </span>
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--color-foreground)' }}>{value}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Recent Sign-Ups</h2>
            <a href="/admin/users" className="text-sm text-[var(--color-accent)] hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{user.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColors[user.role] ?? ''}`}>{user.role}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{user.email}</span>
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>{user.joined}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Top Courses</h2>
            <a href="/admin/courses" className="text-sm text-[var(--color-accent)] hover:underline">Manage</a>
          </div>
          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={course.title}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-4" style={{ color: 'var(--color-muted-foreground)' }}>#{i + 1}</span>
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{course.title}</span>
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--color-primary)' }}>
                    ★ {course.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="progress-track flex-1" style={{ height: 4 }}>
                    <div className="progress-fill" style={{ width: `${(course.enrollments / 70000) * 100}%`, height: 4 }} />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>
                    {course.enrollments.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Course', href: '/admin/courses/new', icon: BookOpen, color: '#7c3aed' },
            { label: 'Add Question', href: '/admin/questions/new', icon: AlertCircle, color: '#d97706' },
            { label: 'New Blog Post', href: '/admin/blog/new', icon: Activity, color: '#059669' },
            { label: 'View Reports', href: '/admin/analytics', icon: TrendingUp, color: '#0891b2' },
          ].map(({ label, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-colors hover:opacity-90"
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
