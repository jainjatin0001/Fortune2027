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

interface Exam {
  id: string;
  name: string;
  description: string | null;
  examYear: number;
  examMonth: number | null;
  session: string | null;
  isPublished: boolean;
  createdAt: string;
  program: { name: string };
  _count: { questions: number };
}

interface Program {
  id: string;
  name: string;
}

const MONTHS = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
  { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => String(currentYear - i));

const emptyForm = {
  programId: '',
  name: '',
  description: '',
  examYear: String(currentYear),
  examMonth: '',
  session: '',
  isPublished: false,
};

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteExam, setDeleteExam] = useState<Exam | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExams = useCallback(async (p = page, s = search, prog = programFilter, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (prog) params.set('programId', prog);
      if (pub) params.set('published', pub);
      const res = await fetch(`/api/admin/exams?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setExams(data.exams);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  }, [page, search, programFilter, publishedFilter]);

  useEffect(() => {
    fetchExams();
    fetch('/api/admin/programs?limit=50').then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  }, [fetchExams]);

  const openAdd = () => {
    setEditExam(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (e: Exam) => {
    setEditExam(e);
    setForm({
      programId: '',
      name: e.name,
      description: e.description ?? '',
      examYear: String(e.examYear),
      examMonth: e.examMonth ? String(e.examMonth) : '',
      session: e.session ?? '',
      isPublished: e.isPublished,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.examYear) { setFormError('Name and exam year are required.'); return; }
    if (!editExam && !form.programId) { setFormError('Program is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editExam) {
        res = await fetch(`/api/admin/exams/${editExam.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            description: form.description || null,
            examYear: parseInt(form.examYear),
            examMonth: form.examMonth ? parseInt(form.examMonth) : null,
            session: form.session || null,
            isPublished: form.isPublished,
          }),
        });
      } else {
        res = await fetch('/api/admin/exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            programId: form.programId,
            name: form.name,
            description: form.description || null,
            examYear: parseInt(form.examYear),
            examMonth: form.examMonth ? parseInt(form.examMonth) : null,
            session: form.session || null,
            isPublished: form.isPublished,
          }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editExam ? 'Exam updated' : 'Exam created');
      setModalOpen(false);
      fetchExams();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteExam) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/exams/${deleteExam.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Exam deleted');
      setDeleteExam(null);
      fetchExams();
    } catch {
      toast('error', 'Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Exam>[] = [
    {
      key: 'name',
      label: 'Exam',
      render: (e) => (
        <div>
          <div className="font-medium text-sm">{e.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {e.program.name} · {e.examYear}{e.examMonth ? ` · ${MONTHS.find(m => m.value === String(e.examMonth))?.label ?? e.examMonth}` : ''}{e.session ? ` · ${e.session}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'questions',
      label: 'Questions',
      render: (e) => <span className="text-sm">{e._count.questions}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (e) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={e.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {e.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Exams" description={`${total} official exams`} onAdd={openAdd} addLabel="New Exam" />

      <AdminTable
        columns={columns}
        data={exams}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchExams(p); }}
        onEdit={openEdit}
        onDelete={setDeleteExam}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchExams(1, v, programFilter, publishedFilter); }}
        searchPlaceholder="Search exams..."
        filterSlot={
          <div className="flex gap-2">
            <Select value={programFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setProgramFilter(val); setPage(1); fetchExams(1, search, val, publishedFilter); }}>
              <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="All programs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchExams(1, search, programFilter, val); }}>
              <SelectTrigger className="h-9 w-32 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editExam ? 'Edit Exam' : 'New Official Exam'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editExam && (
              <div className="space-y-1.5">
                <Label>Program *</Label>
                <Select value={form.programId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, programId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select program</SelectItem>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {editExam && (
              <div className="space-y-1.5">
                <Label>Program</Label>
                <Input value={editExam.program.name} disabled />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Exam Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. SAT May 2024" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Year *</Label>
                <Select value={form.examYear} onValueChange={(v) => setForm(f => ({ ...f, examYear: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Month</Label>
                <Select value={form.examMonth || 'none'} onValueChange={(v) => setForm(f => ({ ...f, examMonth: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Any month" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Session</Label>
              <Input value={form.session} onChange={(e) => setForm(f => ({ ...f, session: e.target.value }))} placeholder="e.g. Morning, Digital" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
              Published
            </label>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editExam ? 'Save Changes' : 'Create Exam'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteExam}
        title="Delete Exam"
        description={`Delete "${deleteExam?.name}"? Questions linked to this exam will be unlinked but not deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteExam(null)}
      />
    </div>
  );
}
