'use client';

import { Shield, User, BookOpen, HelpCircle, FileText, BarChart2, Database, Bell, Settings } from 'lucide-react';

const roles = [
  {
    name: 'SUPER_ADMIN',
    color: '#dc2626',
    bg: '#fee2e2',
    description: 'Full platform access. Can manage all entities, users, settings, and view audit logs.',
    permissions: ['All platform operations', 'User role management', 'Admin panel access', 'Audit log access', 'System configuration'],
  },
  {
    name: 'ADMIN',
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Content and user management. Cannot access sensitive system settings or promote to SUPER_ADMIN.',
    permissions: ['Manage courses, questions, blog', 'Moderate user accounts', 'View analytics', 'Manage announcements'],
  },
  {
    name: 'INSTRUCTOR',
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'Course creator. Can create and manage their own courses and question content.',
    permissions: ['Create/edit own courses', 'Create/edit questions', 'View course analytics', 'Manage course enrollments'],
  },
  {
    name: 'PARENT',
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'Parent account. Can monitor linked student accounts and their progress.',
    permissions: ['View student progress', 'Manage student enrollments', 'Access dashboard'],
  },
  {
    name: 'STUDENT',
    color: '#16a34a',
    bg: '#dcfce7',
    description: 'Default role. Full access to enrolled courses, quizzes, and learning content.',
    permissions: ['Access enrolled courses', 'Take quizzes and exams', 'Track own progress', 'Bookmark content'],
  },
];

const sections = [
  { icon: BookOpen, label: 'Courses' },
  { icon: HelpCircle, label: 'Questions' },
  { icon: User, label: 'Users' },
  { icon: FileText, label: 'Blog' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Bell, label: 'Notifications' },
  { icon: Database, label: 'Audit Logs' },
  { icon: Settings, label: 'Settings' },
  { icon: Shield, label: 'Roles' },
];

const access: Record<string, boolean[]> = {
  SUPER_ADMIN: [true, true, true, true, true, true, true, true, true],
  ADMIN:       [true, true, true, true, true, true, false, false, false],
  INSTRUCTOR:  [true, true, false, false, false, false, false, false, false],
  PARENT:      [false, false, false, false, false, false, false, false, false],
  STUDENT:     [false, false, false, false, false, false, false, false, false],
};

export default function AdminRolesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>Roles & Permissions</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
          Overview of role-based access control. Roles are assigned per user in the Users section.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div key={role.name} className="card-base p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: role.bg }}>
                <Shield className="h-5 w-5" style={{ color: role.color }} />
              </div>
              <div>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: role.bg, color: role.color }}>
                  {role.name}
                </span>
              </div>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--color-muted-foreground)' }}>{role.description}</p>
            <ul className="space-y-1">
              {role.permissions.map((p) => (
                <li key={p} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-foreground)' }}>
                  <span style={{ color: role.color }}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Access Matrix */}
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold" style={{ color: 'var(--color-foreground)' }}>Admin Panel Access Matrix</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Which roles can access each admin section</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-muted)' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--color-muted-foreground)' }}>Section</th>
                {roles.map(r => (
                  <th key={r.name} className="px-4 py-3 text-center text-xs font-semibold" style={{ color: r.color }}>{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map(({ icon: Icon, label }, i) => (
                <tr key={label} style={{ borderBottom: i < sections.length - 1 ? '1px solid var(--color-border)' : undefined }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
                      <Icon className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
                      {label}
                    </div>
                  </td>
                  {roles.map(r => {
                    const hasAccess = access[r.name]?.[i] ?? false;
                    return (
                      <td key={r.name} className="px-4 py-3 text-center">
                        <span style={{ color: hasAccess ? '#16a34a' : '#d1d5db', fontSize: 16 }}>
                          {hasAccess ? '✓' : '✕'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
