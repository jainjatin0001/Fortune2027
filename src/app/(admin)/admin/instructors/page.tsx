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

interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  title: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { courses: number };
}

const emptyForm = {
  name: '',
  bio: '',
  title: '',
  linkedin: '',
  twitter: '',
  website: '',
};

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteInstructor, setDeleteInstructor] = useState<Instructor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInstructors = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      const res = await fetch(`/api/admin/instructors?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setInstructors(data.instructors);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

  const openAdd = () => {
    setEditInstructor(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (i: Instructor) => {
    setEditInstructor(i);
    setForm({
      name: i.name,
      bio: i.bio ?? '',
      title: i.title ?? '',
      linkedin: i.linkedin ?? '',
      twitter: i.twitter ?? '',
      website: i.website ?? '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name) { setFormError('Name is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editInstructor) {
        res = await fetch(`/api/admin/instructors/${editInstructor.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            bio: form.bio || null,
            title: form.title || null,
            linkedin: form.linkedin || null,
            twitter: form.twitter || null,
            website: form.website || null,
          }),
        });
      } else {
        res = await fetch('/api/admin/instructors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            bio: form.bio || null,
            title: form.title || null,
            linkedin: form.linkedin || null,
            twitter: form.twitter || null,
            website: form.website || null,
          }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editInstructor ? 'Instructor updated' : 'Instructor created');
      setModalOpen(false);
      fetchInstructors();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save instructor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteInstructor) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/instructors/${deleteInstructor.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Instructor deleted');
      setDeleteInstructor(null);
      fetchInstructors();
    } catch {
      toast('error', 'Failed to delete instructor');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Instructor>[] = [
    {
      key: 'name',
      label: 'Instructor',
      render: (i) => (
        <div>
          <div className="font-medium text-sm">{i.name}</div>
          {i.title && <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{i.title}</div>}
        </div>
      ),
    },
    {
      key: 'courses',
      label: 'Courses',
      render: (i) => <span className="text-sm">{i._count.courses}</span>,
    },
    {
      key: 'links',
      label: 'Links',
      render: (i) => (
        <div className="flex gap-2 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          {i.linkedin && <span>LinkedIn</span>}
          {i.twitter && <span>Twitter</span>}
          {i.website && <span>Website</span>}
          {!i.linkedin && !i.twitter && !i.website && '—'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (i) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={i.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}>
          {i.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Instructors" description={`${total} instructors`} onAdd={openAdd} addLabel="New Instructor" />

      <AdminTable
        columns={columns}
        data={instructors}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchInstructors(p); }}
        onEdit={openEdit}
        onDelete={setDeleteInstructor}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchInstructors(1, v); }}
        searchPlaceholder="Search instructors..."
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editInstructor ? 'Edit Instructor' : 'New Instructor'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Sarah Johnson" />
            </div>
            <div className="space-y-1.5">
              <Label>Title / Role</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. SAT Math Expert" />
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Brief instructor bio..." />
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedin} onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Twitter URL</Label>
              <Input value={form.twitter} onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Website URL</Label>
              <Input value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editInstructor ? 'Save Changes' : 'Create Instructor'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteInstructor}
        title="Delete Instructor"
        description={`Delete "${deleteInstructor?.name}"? They will be removed from all course assignments.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteInstructor(null)}
      />
    </div>
  );
}
