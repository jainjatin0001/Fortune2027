'use client';

import { useCallback, useEffect, useState } from 'react';
import { ListChecks, X } from 'lucide-react';
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

interface BankQuestion {
  id: string;
  statement: string;
  difficulty: string;
  questionType: string;
  sourceType: string;
  subject: { name: string } | null;
  options: { id: string; content: string; isCorrect: boolean }[];
}

interface QuizQuestion {
  id: string;
  sortOrder: number;
  points: number;
  question: BankQuestion;
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
  const [typeFilter, setTypeFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteQuiz, setDeleteQuiz] = useState<Quiz | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Manage Questions panel
  const [manageQuiz, setManageQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubject, setBankSubject] = useState('');
  const [bankResults, setBankResults] = useState<BankQuestion[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async (p = page, s = search, type = typeFilter, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
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
  }, [page, search, typeFilter, publishedFilter]);

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

  // ── Manage Questions ──────────────────────────────────────────────────────

  const openManage = async (q: Quiz) => {
    setManageQuiz(q);
    setBankSearch('');
    setBankSubject('');
    setBankResults([]);
    const res = await fetch(`/api/admin/quizzes/${q.id}/questions`);
    const data = await res.json();
    setQuizQuestions(data.questions ?? []);
  };

  const searchBank = useCallback(async (s = bankSearch, sub = bankSubject) => {
    setBankLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20', page: '1' });
      if (s) params.set('search', s);
      if (sub) params.set('subjectId', sub);
      const res = await fetch(`/api/admin/questions?${params}`);
      const data = await res.json();
      setBankResults(data.questions ?? []);
    } finally {
      setBankLoading(false);
    }
  }, [bankSearch, bankSubject]);

  useEffect(() => {
    if (manageQuiz) searchBank();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageQuiz]);

  const addQuestion = async (questionId: string) => {
    if (!manageQuiz) return;
    setAddingId(questionId);
    try {
      const res = await fetch(`/api/admin/quizzes/${manageQuiz.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast('error', err.error ?? 'Failed to add');
        return;
      }
      const refreshed = await fetch(`/api/admin/quizzes/${manageQuiz.id}/questions`);
      const data = await refreshed.json();
      setQuizQuestions(data.questions ?? []);
      fetchQuizzes();
    } finally {
      setAddingId(null);
    }
  };

  const removeQuestion = async (questionId: string) => {
    if (!manageQuiz) return;
    setRemovingId(questionId);
    try {
      await fetch(`/api/admin/quizzes/${manageQuiz.id}/questions/${questionId}`, { method: 'DELETE' });
      setQuizQuestions(q => q.filter(qq => qq.question.id !== questionId));
      fetchQuizzes();
    } finally {
      setRemovingId(null);
    }
  };

  const assignedIds = new Set(quizQuestions.map(qq => qq.question.id));

  const typeColors: Record<string, { background: string; color: string }> = {
    CHAPTER_TEST: { background: '#dbeafe', color: '#1d4ed8' },
    PRACTICE: { background: '#dcfce7', color: '#16a34a' },
    DAILY_QUIZ: { background: '#fef3c7', color: '#d97706' },
    MOCK_TEST: { background: '#fee2e2', color: '#dc2626' },
  };

  const diffColors: Record<string, { background: string; color: string }> = {
    EASY: { background: '#dcfce7', color: '#16a34a' },
    MEDIUM: { background: '#fef3c7', color: '#d97706' },
    HARD: { background: '#fee2e2', color: '#dc2626' },
    EXPERT: { background: '#ede9fe', color: '#7c3aed' },
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
      key: 'manage',
      label: 'Manage',
      render: (q) => (
        <button
          onClick={(e) => { e.stopPropagation(); openManage(q); }}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
          style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', color: 'var(--color-primary)' }}
        >
          <ListChecks className="h-3.5 w-3.5" />
          Questions
        </button>
      ),
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
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchQuizzes(1, v, typeFilter, publishedFilter); }}
        searchPlaceholder="Search quizzes..."
        filterSlot={
          <div className="flex gap-2">
            <Select value={typeFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setTypeFilter(val); setPage(1); fetchQuizzes(1, search, val, publishedFilter); }}>
              <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {QUIZ_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchQuizzes(1, search, typeFilter, val); }}>
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

      {/* Create / Edit Modal */}
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

      {/* Manage Questions Modal */}
      <Dialog open={!!manageQuiz} onOpenChange={(v) => !v && setManageQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Questions — {manageQuiz?.title}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Current questions */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
                In this quiz ({quizQuestions.length})
              </p>
              {quizQuestions.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No questions added yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {quizQuestions.map((qq, i) => (
                    <div key={qq.id} className="flex items-start gap-3 p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
                      <span className="text-xs font-mono mt-0.5 w-5 text-right shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{qq.question.statement}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[qq.question.difficulty] ?? {}}>{qq.question.difficulty}</span>
                          <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{qq.question.subject?.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(qq.question.id)}
                        disabled={removingId === qq.question.id}
                        className="shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search question bank */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Add from Question Bank</p>
              <div className="flex gap-2 mb-3">
                <Input
                  className="flex-1"
                  placeholder="Search questions..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchBank(bankSearch, bankSubject)}
                />
                <Select value={bankSubject || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setBankSubject(val); searchBank(bankSearch, val); }}>
                  <SelectTrigger className="w-36 shrink-0"><SelectValue placeholder="Subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>
                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => searchBank(bankSearch, bankSubject)} disabled={bankLoading}>
                  {bankLoading ? '...' : 'Search'}
                </Button>
              </div>

              {bankResults.length === 0 && !bankLoading && (
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No questions found.</p>
              )}
              <div className="space-y-1.5">
                {bankResults.map(q => {
                  const already = assignedIds.has(q.id);
                  return (
                    <div key={q.id} className="flex items-start gap-3 p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: already ? 'var(--color-primary-light)' : 'var(--color-background)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{q.statement}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[q.difficulty] ?? {}}>{q.difficulty}</span>
                          <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{q.subject?.name} · {q.sourceType}</span>
                        </div>
                      </div>
                      {already ? (
                        <span className="text-xs shrink-0 mt-1" style={{ color: 'var(--color-primary)' }}>Added</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => addQuestion(q.id)}
                          disabled={addingId === q.id}
                        >
                          {addingId === q.id ? '...' : 'Add'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="outline" onClick={() => setManageQuiz(null)}>Done</Button>
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
