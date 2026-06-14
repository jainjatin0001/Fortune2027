'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  difficulty: string;
  price: string;
  isFree: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  program: { name: string; slug: string };
  _count: { enrollments: number; modules: number };
}

interface Program {
  id: string;
  name: string;
}

const DIFFICULTY = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

const emptyForm = {
  programId: '',
  title: '',
  slug: '',
  description: '',
  shortDesc: '',
  difficulty: 'MEDIUM',
  price: '0',
  isFree: false,
  isPublished: false,
  isFeatured: false,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCourses = useCallback(async (p = page, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (pub) params.set('published', pub);
      const res = await fetch(`/api/admin/courses?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCourses(data.courses);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [page, publishedFilter]);

  useEffect(() => {
    fetchCourses();
    fetch('/api/admin/programs?limit=50').then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  }, [fetchCourses]);

  const openAdd = () => {
    setEditCourse(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditCourse(c);
    setForm({
      programId: '',
      title: c.title,
      slug: c.slug,
      description: c.description,
      shortDesc: c.shortDesc ?? '',
      difficulty: c.difficulty,
      price: String(c.price),
      isFree: c.isFree,
      isPublished: c.isPublished,
      isFeatured: c.isFeatured,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title || !form.slug || !form.description) {
      setFormError('Title, slug, and description are required.');
      return;
    }
    setSaving(true);
    try {
      let res: Response;
      if (editCourse) {
        res = await fetch('/api/admin/courses', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editCourse.id, ...form, price: parseFloat(form.price) }),
        });
      } else {
        if (!form.programId) { setFormError('Program is required.'); setSaving(false); return; }
        res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }

      toast('success', editCourse ? 'Course updated' : 'Course created');
      setModalOpen(false);
      fetchCourses();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCourse) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${deleteCourse.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Course deleted');
      setDeleteCourse(null);
      fetchCourses();
    } catch {
      toast('error', 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Course>[] = [
    {
      key: 'title',
      label: 'Course',
      render: (c) => (
        <div>
          <div className="font-medium text-sm">{c.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{c.program.name} · {c.slug}</div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      label: 'Level',
      render: (c) => <span className="text-xs font-medium">{c.difficulty}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (c) => <span className="text-sm">{c.isFree ? 'Free' : `$${Number(c.price).toFixed(2)}`}</span>,
    },
    {
      key: 'enrollments',
      label: 'Enrolled',
      render: (c) => <span className="text-sm">{c._count.enrollments}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (c) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={c.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {c.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Courses" description={`${total} courses`} onAdd={openAdd} />

      <AdminTable
        columns={columns}
        data={courses}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchCourses(p); }}
        onEdit={openEdit}
        onDelete={setDeleteCourse}
        filterSlot={
          <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchCourses(1, val); }}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Drafts</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editCourse && (
              <div className="space-y-1.5">
                <Label>Program *</Label>
                <Select value={form.programId} onValueChange={(v) => setForm(f => ({ ...f, programId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Complete SAT Prep 2025" />
            </div>

            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="complete-sat-prep-2025" />
            </div>

            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Input value={form.shortDesc} onChange={(e) => setForm(f => ({ ...f, shortDesc: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isFree} onCheckedChange={(v) => setForm(f => ({ ...f, isFree: !!v }))} />
                Free course
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isFeatured} onCheckedChange={(v) => setForm(f => ({ ...f, isFeatured: !!v }))} />
                Featured
              </label>
            </div>

            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editCourse ? 'Save Changes' : 'Create Course'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteCourse}
        title="Delete Course"
        description={`Delete "${deleteCourse?.title}"? This will remove all associated data.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteCourse(null)}
      />
    </div>
  );
}
