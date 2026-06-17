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

interface QuestionSet {
  id: string;
  title: string;
  description: string | null;
  sourceType: string | null;
  isPublished: boolean;
  createdAt: string;
  subject: { name: string } | null;
  topic: { name: string } | null;
  _count: { items: number };
}

interface Subject {
  id: string;
  name: string;
}

const SOURCE_TYPES = ['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST'];

const emptyForm = {
  title: '',
  description: '',
  subjectId: '',
  topicId: '',
  sourceType: '',
  isPublished: false,
};

export default function AdminQuestionSetsPage() {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editSet, setEditSet] = useState<QuestionSet | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteSet, setDeleteSet] = useState<QuestionSet | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSets = useCallback(async (p = page, s = search, sub = subjectFilter, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (sub) params.set('subjectId', sub);
      if (pub) params.set('published', pub);
      const res = await fetch(`/api/admin/question-sets?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setQuestionSets(data.questionSets);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load question sets');
    } finally {
      setLoading(false);
    }
  }, [page, search, subjectFilter, publishedFilter]);

  useEffect(() => {
    fetchSets();
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, [fetchSets]);

  const openAdd = () => {
    setEditSet(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (qs: QuestionSet) => {
    setEditSet(qs);
    setForm({
      title: qs.title,
      description: qs.description ?? '',
      subjectId: '',
      topicId: '',
      sourceType: qs.sourceType ?? '',
      isPublished: qs.isPublished,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editSet) {
        res = await fetch(`/api/admin/question-sets/${editSet.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: form.title, description: form.description, sourceType: form.sourceType || null, isPublished: form.isPublished }),
        });
      } else {
        res = await fetch('/api/admin/question-sets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, subjectId: form.subjectId || null, topicId: form.topicId || null, sourceType: form.sourceType || null }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editSet ? 'Question set updated' : 'Question set created');
      setModalOpen(false);
      fetchSets();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save question set');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSet) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/question-sets/${deleteSet.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Question set deleted');
      setDeleteSet(null);
      fetchSets();
    } catch {
      toast('error', 'Failed to delete question set');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<QuestionSet>[] = [
    {
      key: 'title',
      label: 'Question Set',
      render: (qs) => (
        <div>
          <div className="font-medium text-sm">{qs.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {qs.subject?.name ?? 'No subject'}{qs.topic ? ` · ${qs.topic.name}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'sourceType',
      label: 'Type',
      render: (qs) => <span className="text-xs">{qs.sourceType ?? '—'}</span>,
    },
    {
      key: 'questions',
      label: 'Questions',
      render: (qs) => <span className="text-sm">{qs._count.items}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (qs) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={qs.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {qs.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Question Sets" description={`${total} question sets`} onAdd={openAdd} addLabel="New Set" />

      <AdminTable
        columns={columns}
        data={questionSets}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchSets(p); }}
        onEdit={openEdit}
        onDelete={setDeleteSet}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchSets(1, v, subjectFilter, publishedFilter); }}
        searchPlaceholder="Search question sets..."
        filterSlot={
          <div className="flex gap-2">
            <Select value={subjectFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setSubjectFilter(val); setPage(1); fetchSets(1, search, val, publishedFilter); }}>
              <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="All subjects" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchSets(1, search, subjectFilter, val); }}>
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
            <DialogTitle>{editSet ? 'Edit Question Set' : 'New Question Set'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. SAT Algebra PYQs Top 100" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            {!editSet && (
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select value={form.subjectId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, subjectId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Source Type</Label>
              <Select value={form.sourceType || 'none'} onValueChange={(v) => setForm(f => ({ ...f, sourceType: v === 'none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
              Published
            </label>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editSet ? 'Save Changes' : 'Create Set'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteSet}
        title="Delete Question Set"
        description={`Delete "${deleteSet?.title}"? Questions inside won't be deleted but will be removed from this set.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteSet(null)}
      />
    </div>
  );
}
