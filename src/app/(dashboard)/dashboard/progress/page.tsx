import type { Metadata } from 'next';
import { TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = { title: 'My Progress' };

const progressData = [
  { subject: 'SAT Math', progress: 67, total: 120, completed: 80, color: '#7c3aed' },
  { subject: 'SAT Reading & Writing', progress: 45, total: 100, completed: 45, color: '#4f46e5' },
  { subject: 'AP Biology', progress: 82, total: 76, completed: 62, color: '#d97706' },
  { subject: 'Python Programming', progress: 34, total: 65, completed: 22, color: '#059669' },
];

const weeklyActivity = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 90 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 120 },
  { day: 'Fri', minutes: 75 },
  { day: 'Sat', minutes: 60 },
  { day: 'Sun', minutes: 15 },
];

const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes));

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2 mb-1" style={{ color: 'var(--color-foreground)' }}>My Progress</h1>
        <p className="text-body" style={{ color: 'var(--color-muted-foreground)' }}>Track your learning journey across all courses.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle, label: 'Lessons Completed', value: '209', color: '#059669' },
          { icon: Clock, label: 'Hours Studied', value: '48h', color: '#0891b2' },
          { icon: Target, label: 'Quizzes Passed', value: '34', color: '#7c3aed' },
          { icon: TrendingUp, label: 'Avg Quiz Score', value: '86%', color: '#d97706' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card-base p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15`, color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black" style={{ color: 'var(--color-foreground)' }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Course Progress */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>Course Progress</h2>
        <div className="space-y-6">
          {progressData.map((item) => (
            <div key={item.subject}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{item.subject}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.completed}/{item.total} lessons · {item.progress}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${item.progress}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="card-base p-6">
        <h2 className="font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>This Week's Activity</h2>
        <div className="flex items-end gap-3 h-32">
          {weeklyActivity.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(day.minutes / maxMinutes) * 100}%`,
                  background: 'var(--gradient-primary)',
                  minHeight: 4,
                }}
              />
              <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{day.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          Minutes studied per day
        </div>
      </div>
    </div>
  );
}
