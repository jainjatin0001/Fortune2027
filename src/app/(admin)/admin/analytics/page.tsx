'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, TrendingUp, BarChart2, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalQuizAttempts: number;
  pendingContactMessages: number;
  recentUsers: { id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }[];
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-muted-foreground)' }} />
      </div>
    );
  }

  const cards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers ?? 0, color: '#0891b2', description: 'Registered accounts' },
    { icon: BookOpen, label: 'Published Courses', value: stats?.totalCourses ?? 0, color: '#7c3aed', description: 'Live on platform' },
    { icon: TrendingUp, label: 'Active Enrollments', value: stats?.totalEnrollments ?? 0, color: '#059669', description: 'Currently enrolled' },
    { icon: CheckCircle, label: 'Quiz Completions', value: stats?.totalQuizAttempts ?? 0, color: '#eab308', description: 'Completed attempts' },
    { icon: MessageSquare, label: 'Unread Messages', value: stats?.pendingContactMessages ?? 0, color: '#dc2626', description: 'Contact form submissions' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Platform-wide statistics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ icon: Icon, label, value, color, description }) => (
          <div key={label} className="card-base p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15`, color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--color-foreground)' }}>
              {value.toLocaleString()}
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</div>
          </div>
        ))}
      </div>

      {/* Recent signups */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>Recent Signups</h2>
        <div className="space-y-3">
          {(stats?.recentUsers ?? []).map((user) => (
            <div key={user.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                {user.firstName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{user.firstName} {user.lastName}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{user.email}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium" style={{ color: 'var(--color-foreground)' }}>{user.role}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
