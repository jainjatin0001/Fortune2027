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

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  quizType: string;
  timeLimit: number | null;
  passingScore: number;
  totalMarks: number | null;
  shuffleQuestions: boolean;
  isPublished: boolean;
  createdAt: string;
  subject: { name: string } | null;
  topic: { name: string } | null;
  _count: { questions: number; attempts: number };
}

interface Subject {
  id: string;
  name: string;
}

const QUIZ_TYPES = ['CHAPTER_TEST', 'PRACTICE', 'DAILY_QUIZ', 'MOCK_TEST'];

const emptyForm = {
  title: '',
  description: '',
  quizType: 'PRACTICE',
  subjectId: '',
  topicId: '',
  timeLimit: '',
  passingScore: '70',
  totalMarks: '',
  shuffleQuestions: false,
  isPublished: false,
};

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteQuiz, setDeleteQuiz] = useState<Quiz | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = useCallback(async (p = page, s = search, sub = subjectFilter, type = typeFilter, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (sub) params.set('subjectId', sub);
      if (type) params.set('quizType', type);
      if (pub) params.set('published', pub);
      const res = await fetch(`/api/admin/quizzes?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setQuizzes(data.quizzes);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [page, search, subjectFilter, typeFilter, publishedFilter]);

  useEffect(() => {
    fetchQuizzes();
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, [fetchQuizzes]);

  const openAdd = () => {
    setEditQuiz(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (q: Quiz) => {
    setEditQuiz(q);
    setForm({
      title: q.title,
      description: q.description ?? '',
      quizType: q.quizType,
      subjectId: '',
      topicId: '',
      timeLimit: q.timeLimit ? String(q.timeLimit) : '',
      passingScore: String(q.passingScore),
      totalMarks: q.totalMarks ? String(q.totalMarks) : '',
      shuffleQuestions: q.shuffleQuestions,
      isPublished: q.isPublished,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        quizType: form.quizType,
        subjectId: form.subjectId || null,
        topicId: form.topicId || null,
        timeLimit: form.timeLimit ? parseInt(form.timeLimit) : null,
        passingScore: parseInt(form.passingScore) || 70,
        totalMarks: form.totalMarks ? parseInt(form.totalMarks) : null,
        shuffleQuestions: form.shuffleQuestions,
        isPublished: form.isPublished,
      };

      let res: Response;
      if (editQuiz) {
        res = await fetch(`/api/admin/quizzes/${editQuiz.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editQuiz ? 'Quiz updated' : 'Quiz created');
      setModalOpen(false);
      fetchQuizzes();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteQuiz) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/quizzes/${deleteQuiz.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Quiz deleted');
      setDeleteQuiz(null);
      fetchQuizzes();
    } catch {
      toast('error', 'Failed to delete quiz');
    } finally {
      setDeleting(false);
    }
  };

  const typeColors: Record<string, { background: string; color: string }> = {
    CHAPTER_TEST: { background: '#dbeafe', color: '#1d4ed8' },
    PRACTICE: { background: '#dcfce7', color: '#16a34a' },
    DAILY_QUIZ: { background: '#fef3c7', color: '#d97706' },
    MOCK_TEST: { background: '#fee2e2', color: '#dc2626' },
  };

  const columns: Column<Quiz>[] = [
    {
      key: 'title',
      label: 'Quiz',
      render: (q) => (
        <div>
          <div className="font-medium text-sm">{q.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {q.subject?.name ?? 'No subject'}{q.topic ? ` · ${q.topic.name}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'quizType',
      label: 'Type',
      render: (q) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={typeColors[q.quizType] ?? { background: '#f3f4f6', color: '#6b7280' }}>
          {q.quizType.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'questions',
      label: 'Questions',
      render: (q) => <span className="text-sm">{q._count.questions}</span>,
    },
    {
      key: 'timeLimit',
      label: 'Time',
      render: (q) => <span className="text-sm">{q.timeLimit ? `${q.timeLimit} min` : '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (q) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={q.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {q.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Quizzes" description={`${total} quizzes`} onAdd={openAdd} addLabel="New Quiz" />

      <AdminTable
        columns={columns}
        data={quizzes}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchQuizzes(p); }}
        onEdit={openEdit}
        onDelete={setDeleteQuiz}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchQuizzes(1, v, subjectFilter, typeFilter, publishedFilter); }}
        searchPlaceholder="Search quizzes..."
        filterSlot={
          <div className="flex gap-2">
            <Select value={typeFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setTypeFilter(val); setPage(1); fetchQuizzes(1, search, subjectFilter, val, publishedFilter); }}>
              <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {QUIZ_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchQuizzes(1, search, subjectFilter, typeFilter, val); }}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editQuiz ? 'Edit Quiz' : 'New Quiz'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. SAT Math Chapter 1 Test" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Quiz Type</Label>
                <Select value={form.quizType} onValueChange={(v) => setForm(f => ({ ...f, quizType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QUIZ_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {!editQuiz && (
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
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Time Limit (min)</Label>
                <Input type="number" min="1" value={form.timeLimit} onChange={(e) => setForm(f => ({ ...f, timeLimit: e.target.value }))} placeholder="No limit" />
              </div>
              <div className="space-y-1.5">
                <Label>Passing Score (%)</Label>
                <Input type="number" min="0" max="100" value={form.passingScore} onChange={(e) => setForm(f => ({ ...f, passingScore: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Total Marks</Label>
                <Input type="number" min="0" value={form.totalMarks} onChange={(e) => setForm(f => ({ ...f, totalMarks: e.target.value }))} placeholder="Auto" />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.shuffleQuestions} onCheckedChange={(v) => setForm(f => ({ ...f, shuffleQuestions: !!v }))} />
                Shuffle questions
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
                Published
              </label>
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editQuiz ? 'Save Changes' : 'Create Quiz'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteQuiz}
        title="Delete Quiz"
        description={`Delete "${deleteQuiz?.title}"? All attempts for this quiz will also be deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteQuiz(null)}
      />
    </div>
  );
}
