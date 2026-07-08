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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Program {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  programId: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  program: { name: string };
  _count: { topics: number; questions: number };
}

const emptyForm = {
  programId: '',
  name: '',
  slug: '',
  description: '',
  iconUrl: '',
  color: '#6366f1',
  sortOrder: 0,
};

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = useCallback(async (p = page, s = search, prog = programFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (prog) params.set('programId', prog);
      const res = await fetch(`/api/admin/subjects?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubjects(data.subjects);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [page, search, programFilter]);

  useEffect(() => {
    fetchSubjects();
    fetch('/api/admin/programs?limit=100').then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  }, [fetchSubjects]);

  const openAdd = () => {
    setEditSubject(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditSubject(s);
    setForm({
      programId: s.programId,
      name: s.name,
      slug: s.slug,
      description: s.description ?? '',
      iconUrl: s.iconUrl ?? '',
      color: s.color ?? '#6366f1',
      sortOrder: s.sortOrder,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.slug) { setFormError('Name and slug are required.'); return; }
    if (!editSubject && !form.programId) { setFormError('Program is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editSubject) {
        res = await fetch(`/api/admin/subjects/${editSubject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            description: form.description || null,
            iconUrl: form.iconUrl || null,
            color: form.color,
            sortOrder: form.sortOrder,
          }),
        });
      } else {
        res = await fetch('/api/admin/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programId: form.programId,
            name: form.name,
            slug: form.slug,
            description: form.description || null,
            iconUrl: form.iconUrl || null,
            color: form.color,
            sortOrder: form.sortOrder,
          }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editSubject ? 'Subject updated' : 'Subject created');
      setModalOpen(false);
      fetchSubjects();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSubject) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/subjects/${deleteSubject.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Subject deleted');
      setDeleteSubject(null);
      fetchSubjects();
    } catch {
      toast('error', 'Failed to delete subject (may have linked topics or questions)');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Subject>[] = [
    {
      key: 'name',
      label: 'Subject',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: s.color ?? 'var(--gradient-primary)' }}
          >
            {s.iconUrl ? <span>{s.iconUrl}</span> : s.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sm">{s.name}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{s.slug}</div>
          </div>
        </div>
      ),
    },
    { key: 'program', label: 'Program', render: (s) => <span className="text-sm">{s.program.name}</span> },
    { key: 'topics', label: 'Topics', render: (s) => <span className="text-sm">{s._count.topics}</span> },
    { key: 'questions', label: 'Questions', render: (s) => <span className="text-sm">{s._count.questions}</span> },
    { key: 'sortOrder', label: 'Order', render: (s) => <span className="text-sm">{s.sortOrder}</span> },
    {
      key: 'isActive',
      label: 'Status',
      render: (s) => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={s.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}
        >
          {s.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Subjects"
        description="Manage subjects within programs (e.g. SAT → Math, Reading, Writing)"
        onAdd={openAdd}
      />

      <AdminTable
        columns={columns}
        data={subjects}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchSubjects(p); }}
        onEdit={openEdit}
        onDelete={setDeleteSubject}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchSubjects(1, v, programFilter); }}
        searchPlaceholder="Search subjects..."
        filterSlot={
          <Select
            value={programFilter || 'all'}
            onValueChange={(v) => {
              const val = v === 'all' ? '' : v;
              setProgramFilter(val);
              setPage(1);
              fetchSubjects(1, search, val);
            }}
          >
            <SelectTrigger className="h-9 w-44 text-sm"><SelectValue placeholder="All programs" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editSubject && (
              <div className="space-y-1.5">
                <Label>Program *</Label>
                <Select value={form.programId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, programId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a program</SelectItem>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mathematics" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="mathematics"
                disabled={!!editSubject}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <RichEditor value={form.description} onChange={(html) => setForm(f => ({ ...f, description: html }))} placeholder="Describe this subject..." mode="simple" minHeight={110} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon (emoji or text)</Label>
                <Input value={form.iconUrl} onChange={(e) => setForm(f => ({ ...f, iconUrl: e.target.value }))} placeholder="📐" />
              </div>
              <div className="space-y-1.5">
                <Label>Color</Label>
                <Input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} className="h-9 px-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteSubject}
        title="Delete Subject"
        description={`Delete "${deleteSubject?.name}"? This will fail if the subject has linked topics or questions.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteSubject(null)}
      />
    </div>
  );
}
