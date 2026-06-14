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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  subjectId: string;
  parentTopicId: string | null;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  subject: { name: string };
  parentTopic: { name: string } | null;
  _count: { questions: number; childTopics: number };
}

const emptyForm = {
  subjectId: '',
  parentTopicId: '',
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
};

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topicsForParent, setTopicsForParent] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTopic, setDeleteTopic] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTopics = useCallback(async (p = page, s = search, subj = subjectFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (subj) params.set('subjectId', subj);
      const res = await fetch(`/api/admin/topics?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTopics(data.topics);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, [page, search, subjectFilter]);

  useEffect(() => {
    fetchTopics();
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
    fetch('/api/admin/topics?limit=200').then(r => r.json()).then(d => setTopicsForParent(d.topics ?? []));
  }, [fetchTopics]);

  const openAdd = () => {
    setEditTopic(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (t: Topic) => {
    setEditTopic(t);
    setForm({
      subjectId: t.subjectId,
      parentTopicId: t.parentTopicId ?? '',
      name: t.name,
      slug: t.slug,
      description: t.description ?? '',
      sortOrder: t.sortOrder,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.slug) { setFormError('Name and slug are required.'); return; }
    if (!editTopic && !form.subjectId) { setFormError('Subject is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editTopic) {
        res = await fetch(`/api/admin/topics/${editTopic.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            description: form.description || null,
            sortOrder: form.sortOrder,
            parentTopicId: form.parentTopicId || null,
          }),
        });
      } else {
        res = await fetch('/api/admin/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectId: form.subjectId,
            name: form.name,
            slug: form.slug,
            description: form.description || null,
            parentTopicId: form.parentTopicId || null,
            sortOrder: form.sortOrder,
          }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editTopic ? 'Topic updated' : 'Topic created');
      setModalOpen(false);
      fetchTopics();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save topic');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTopic) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/topics/${deleteTopic.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Topic deleted');
      setDeleteTopic(null);
      fetchTopics();
    } catch {
      toast('error', 'Failed to delete topic (may have linked questions or child topics)');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Topic>[] = [
    {
      key: 'name',
      label: 'Topic',
      render: (t) => (
        <div>
          <div className="font-medium text-sm">{t.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{t.slug}</div>
        </div>
      ),
    },
    { key: 'subject', label: 'Subject', render: (t) => <span className="text-sm">{t.subject.name}</span> },
    {
      key: 'parentTopic',
      label: 'Parent Topic',
      render: (t) => (
        <span className="text-sm" style={{ color: t.parentTopic ? 'inherit' : 'var(--color-muted-foreground)' }}>
          {t.parentTopic?.name ?? '—'}
        </span>
      ),
    },
    { key: 'childTopics', label: 'Sub-topics', render: (t) => <span className="text-sm">{t._count.childTopics}</span> },
    { key: 'questions', label: 'Questions', render: (t) => <span className="text-sm">{t._count.questions}</span> },
    {
      key: 'isActive',
      label: 'Status',
      render: (t) => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={t.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}
        >
          {t.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Topics"
        description="Manage topics within subjects — supports nested sub-topics"
        onAdd={openAdd}
      />

      <AdminTable
        columns={columns}
        data={topics}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchTopics(p); }}
        onEdit={openEdit}
        onDelete={setDeleteTopic}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchTopics(1, v, subjectFilter); }}
        searchPlaceholder="Search topics..."
        filterSlot={
          <Select
            value={subjectFilter || 'all'}
            onValueChange={(v) => {
              const val = v === 'all' ? '' : v;
              setSubjectFilter(val);
              setPage(1);
              fetchTopics(1, search, val);
            }}
          >
            <SelectTrigger className="h-9 w-44 text-sm"><SelectValue placeholder="All subjects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTopic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editTopic && (
              <div className="space-y-1.5">
                <Label>Subject *</Label>
                <Select value={form.subjectId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, subjectId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a subject</SelectItem>
                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Algebra" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="algebra"
                disabled={!!editTopic}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Parent Topic (optional)</Label>
              <Select
                value={form.parentTopicId || 'none'}
                onValueChange={(v) => setForm(f => ({ ...f, parentTopicId: v === 'none' ? '' : v }))}
              >
                <SelectTrigger><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {topicsForParent
                    .filter(t => !editTopic || t.id !== editTopic.id)
                    .map(t => <SelectItem key={t.id} value={t.id}>{t.subject.name} → {t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
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
                {saving ? 'Saving...' : editTopic ? 'Save Changes' : 'Create Topic'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTopic}
        title="Delete Topic"
        description={`Delete "${deleteTopic?.name}"? This will fail if the topic has linked questions or sub-topics.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTopic(null)}
      />
    </div>
  );
}
