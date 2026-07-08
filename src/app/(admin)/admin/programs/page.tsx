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
import RichEditor from '@/components/admin/RichEditor';

interface Program {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: { subjects: number; courses: number };
}

const emptyForm = { name: '', slug: '', description: '', icon: '', color: '#6366f1', sortOrder: 0 };

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editProgram, setEditProgram] = useState<Program | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteProgram, setDeleteProgram] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPrograms = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      const res = await fetch(`/api/admin/programs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPrograms(data.programs);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const openAdd = () => {
    setEditProgram(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (p: Program) => {
    setEditProgram(p);
    setForm({ name: p.name, slug: p.slug, description: p.description ?? '', icon: p.icon ?? '', color: p.color ?? '#6366f1', sortOrder: p.sortOrder });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.slug) { setFormError('Name and slug are required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editProgram) {
        res = await fetch(`/api/admin/programs/${editProgram.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, description: form.description, icon: form.icon, color: form.color, sortOrder: form.sortOrder }),
        });
      } else {
        res = await fetch('/api/admin/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editProgram ? 'Program updated' : 'Program created');
      setModalOpen(false);
      fetchPrograms();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProgram) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/programs/${deleteProgram.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Program deleted');
      setDeleteProgram(null);
      fetchPrograms();
    } catch {
      toast('error', 'Failed to delete program (may have linked subjects or courses)');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Program>[] = [
    {
      key: 'name',
      label: 'Program',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: p.color ?? 'var(--gradient-primary)' }}>
            {p.icon ?? p.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sm">{p.name}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{p.slug}</div>
          </div>
        </div>
      ),
    },
    { key: 'subjects', label: 'Subjects', render: (p) => <span className="text-sm">{p._count.subjects}</span> },
    { key: 'courses', label: 'Courses', render: (p) => <span className="text-sm">{p._count.courses}</span> },
    { key: 'sortOrder', label: 'Order', render: (p) => <span className="text-sm">{p.sortOrder}</span> },
    {
      key: 'isActive', label: 'Status',
      render: (p) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={p.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}>
          {p.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Programs" description="Manage top-level programs (SAT, ACT, AP, Coding...)" onAdd={openAdd} />

      <AdminTable
        columns={columns}
        data={programs}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchPrograms(p); }}
        onEdit={openEdit}
        onDelete={setDeleteProgram}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchPrograms(1, v); }}
        searchPlaceholder="Search programs..."
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editProgram ? 'Edit Program' : 'Add Program'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="SAT Preparation" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="sat-preparation" disabled={!!editProgram} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <RichEditor value={form.description} onChange={(html) => setForm(f => ({ ...f, description: html }))} placeholder="Describe this program..." mode="simple" minHeight={110} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon (emoji or text)</Label>
                <Input value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="📚" />
              </div>
              <div className="space-y-1.5">
                <Label>Color</Label>
                <Input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} className="h-9 px-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editProgram ? 'Save Changes' : 'Create Program'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteProgram}
        title="Delete Program"
        description={`Delete "${deleteProgram?.name}"? This will fail if the program has linked subjects or courses.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteProgram(null)}
      />
    </div>
  );
}
