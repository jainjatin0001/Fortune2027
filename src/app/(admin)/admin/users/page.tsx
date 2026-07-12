'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl: string | null;
  _count: { enrollments: number; quizAttempts: number };
}

interface EnrollmentCourse {
  id: string;
  title: string;
  price: string | number;
  isPublished: boolean;
  isFree: boolean;
  programName: string;
  enrollment: { id: string; status: string; enrolledAt: string } | null;
}

const ROLES = ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN', 'SUPER_ADMIN'];

const roleBadgeStyle: Record<string, { background: string; color: string }> = {
  SUPER_ADMIN: { background: '#fee2e2', color: '#dc2626' },
  ADMIN: { background: '#fef3c7', color: '#d97706' },
  INSTRUCTOR: { background: '#ede9fe', color: '#7c3aed' },
  PARENT: { background: '#dbeafe', color: '#2563eb' },
  STUDENT: { background: '#dcfce7', color: '#16a34a' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [enrollUser, setEnrollUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<EnrollmentCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [recordPayment, setRecordPayment] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async (p = page, s = search, r = roleFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (r) params.set('role', r);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchUsers(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setPage(1); fetchUsers(1, v, roleFilter); }, 400);
  };

  const handleRoleFilter = (v: string) => {
    const val = v === 'all' ? '' : v;
    setRoleFilter(val);
    setPage(1);
    fetchUsers(1, search, val);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditActive(user.isActive);
  };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editUser.id, role: editRole, isActive: editActive }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to update');
      }
      toast('success', 'User updated successfully');
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to deactivate user');
      toast('success', 'User deactivated');
      setDeleteUser(null);
      fetchUsers();
    } catch {
      toast('error', 'Failed to deactivate user');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const value = Number(price);
    if (!Number.isFinite(value) || value === 0) return 'Free';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const handleOpenEnroll = async (user: User) => {
    setEnrollUser(user);
    setSelectedCourseId('');
    setRecordPayment(true);
    setCourses([]);
    setCoursesLoading(true);
    try {
      const res = await fetch(`/api/admin/users/enrollments?userId=${user.id}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to load courses');
      }
      const data = await res.json();
      setCourses(data.courses);
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!enrollUser || !selectedCourseId) return;
    setEnrolling(true);
    try {
      const res = await fetch('/api/admin/users/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrollUser.id,
          courseId: selectedCourseId,
          recordPayment,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to enroll user');
      }
      const data = await res.json();
      const paymentNote = data.paymentCreated
        ? ' and payment marked paid'
        : data.paymentAlreadyRecorded
          ? ' with existing paid record'
          : '';
      toast('success', `User enrolled${paymentNote}`);
      setEnrollUser(null);
      fetchUsers();
    } catch (e) {
      toast('error', e instanceof Error ? e.message : 'Failed to enroll user');
    } finally {
      setEnrolling(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
            {u.firstName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sm">{u.firstName} {u.lastName}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (u) => {
        const s = roleBadgeStyle[u.role] ?? { background: '#f3f4f6', color: '#6b7280' };
        return (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={s}>
            {u.role}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (u) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={u.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}>
          {u.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'enrollments',
      label: 'Enrollments',
      render: (u) => <span className="text-sm">{u._count.enrollments}</span>,
    },
    {
      key: 'courseAccess',
      label: 'Course Access',
      render: (u) => (
        <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => handleOpenEnroll(u)}>
          <UserPlus className="h-3.5 w-3.5" />
          Enroll
        </Button>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (u) => <span className="text-sm text-[var(--color-muted-foreground)]">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Users"
        description={`${total} total users`}
      />

      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchUsers(p); }}
        onEdit={handleEdit}
        onDelete={(u) => setDeleteUser(u)}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or email..."
        filterSlot={
          <Select value={roleFilter || 'all'} onValueChange={handleRoleFilter}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      {/* Edit Modal */}
      <Dialog open={!!editUser} onOpenChange={(v) => !v && setEditUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <div className="font-medium text-sm">{editUser.firstName} {editUser.lastName}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{editUser.email}</div>
              </div>

              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editActive ? 'active' : 'inactive'} onValueChange={(v) => setEditActive(v === 'active')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditUser(null)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enrollment Modal */}
      <Dialog open={!!enrollUser} onOpenChange={(v) => !v && setEnrollUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enroll User in Course</DialogTitle>
          </DialogHeader>
          {enrollUser && (
            <div className="space-y-4">
              <div>
                <div className="font-medium text-sm">{enrollUser.firstName} {enrollUser.lastName}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{enrollUser.email}</div>
              </div>

              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={coursesLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={coursesLoading ? 'Loading courses...' : 'Select course'} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id}
                        disabled={course.enrollment?.status === 'ACTIVE'}
                      >
                        {course.title} · {course.programName} · {formatPrice(course.price)}
                        {course.enrollment?.status === 'ACTIVE' ? ' · Already enrolled' : ''}
                        {!course.isPublished ? ' · Draft' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-start gap-3 rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--color-border)' }}>
                <Checkbox
                  checked={recordPayment}
                  onCheckedChange={(checked) => setRecordPayment(checked === true)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium">Mark payment as paid</span>
                  <span className="block text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    Creates a confirmed order and completed manual payment for the selected course.
                  </span>
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEnrollUser(null)} disabled={enrolling}>Cancel</Button>
                <Button onClick={handleEnroll} disabled={enrolling || !selectedCourseId}>
                  {enrolling ? 'Enrolling...' : 'Enroll User'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteUser}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${deleteUser?.firstName} ${deleteUser?.lastName}? They will lose access to the platform.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteUser(null)}
      />
    </div>
  );
}
