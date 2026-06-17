'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
  courseId: string;
  createdAt: string;
  course: { title: string; slug: string };
  _count: { assets: number };
}

interface Course {
  id: string;
  title: string;
}

const emptyForm = {
  courseId: '',
  title: '',
  description: '',
  sortOrder: 0,
  isPublished: false,
};

export default function AdminModulesPage() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editModule, setEditModule] = useState<CourseModule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteModule, setDeleteModule] = useState<CourseModule | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchModules = useCallback(async (p = page, s = search, cId = courseFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (cId) params.set('courseId', cId);
      const res = await fetch(`/api/admin/modules?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setModules(data.modules);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [page, search, courseFilter]);

  useEffect(() => {
    fetchModules();
    fetch('/api/admin/courses?limit=100').then(r => r.json()).then(d => setCourses(d.courses ?? []));
  }, [fetchModules]);

  const openAdd = () => {
    setEditModule(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (m: CourseModule) => {
    setEditModule(m);
    setForm({
      courseId: m.courseId,
      title: m.title,
      description: m.description ?? '',
      sortOrder: m.sortOrder,
      isPublished: m.isPublished,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    if (!editModule && !form.courseId) { setFormError('Course is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editModule) {
        res = await fetch(`/api/admin/modules/${editModule.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, description: form.description || null, sortOrder: form.sortOrder, isPublished: form.isPublished }),
        });
      } else {
        res = await fetch('/api/admin/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: form.courseId, title: form.title, description: form.description || null, sortOrder: form.sortOrder, isPublished: form.isPublished }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editModule ? 'Module updated' : 'Module created');
      setModalOpen(false);
      fetchModules();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save module');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModule) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/modules/${deleteModule.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Module deleted');
      setDeleteModule(null);
      fetchModules();
    } catch {
      toast('error', 'Failed to delete module');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<CourseModule>[] = [
    {
      key: 'title',
      label: 'Module',
      render: (m) => (
        <div>
          <div className="font-medium text-sm">{m.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{m.course.title}</div>
        </div>
      ),
    },
    {
      key: 'sortOrder',
      label: 'Order',
      render: (m) => <span className="text-sm">{m.sortOrder + 1}</span>,
    },
    {
      key: 'assets',
      label: 'Assets',
      render: (m) => <span className="text-sm">{m._count.assets}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (m) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={m.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {m.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Modules" description={`${total} modules`} onAdd={openAdd} addLabel="New Module" />

      <AdminTable
        columns={columns}
        data={modules}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchModules(p); }}
        onEdit={openEdit}
        onDelete={setDeleteModule}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchModules(1, v, courseFilter); }}
        searchPlaceholder="Search modules..."
        filterSlot={
          <Select value={courseFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setCourseFilter(val); setPage(1); fetchModules(1, search, val); }}>
            <SelectTrigger className="h-9 w-48 text-sm"><SelectValue placeholder="All courses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editModule ? 'Edit Module' : 'New Module'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editModule && (
              <div className="space-y-1.5">
                <Label>Course *</Label>
                <Select value={form.courseId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, courseId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a course</SelectItem>
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {editModule && (
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Input value={editModule.course.title} disabled />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to Algebra" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
              Published
            </label>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editModule ? 'Save Changes' : 'Create Module'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteModule}
        title="Delete Module"
        description={`Delete "${deleteModule?.title}"? All assets inside this module will also be deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModule(null)}
      />
    </div>
  );
}
