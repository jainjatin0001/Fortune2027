'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

interface QuestionOption {
  id?: string;
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  statement: string;
  difficulty: string;
  questionType: string;
  sourceType: string;
  points: number;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  subject: { name: string } | null;
  options: QuestionOption[];
}

interface Subject {
  id: string;
  name: string;
}

const DIFFICULTY = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const QUESTION_TYPES = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERIC', 'TEXT'];
const SOURCE_TYPES = ['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST'];

const emptyOption = (): QuestionOption => ({ content: '', isCorrect: false });

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState({
    statement: '',
    explanation: '',
    difficulty: 'MEDIUM',
    questionType: 'SINGLE_CORRECT',
    sourceType: 'MCQ',
    subjectId: '',
    topicId: '',
    points: 1,
    tags: '',
    options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuestions = useCallback(async (p = page, diff = difficultyFilter, subj = subjectFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (diff) params.set('difficulty', diff);
      if (subj) params.set('subjectId', subj);
      const res = await fetch(`/api/admin/questions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setQuestions(data.questions);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [page, difficultyFilter, subjectFilter]);

  useEffect(() => {
    fetchQuestions();
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, [fetchQuestions]);

  const resetForm = () => setForm({
    statement: '',
    explanation: '',
    difficulty: 'MEDIUM',
    questionType: 'SINGLE_CORRECT',
    sourceType: 'MCQ',
    subjectId: '',
    topicId: '',
    points: 1,
    tags: '',
    options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  });

  const openAdd = () => {
    setEditQuestion(null);
    resetForm();
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditQuestion(q);
    setForm({
      statement: q.statement,
      explanation: '',
      difficulty: q.difficulty,
      questionType: q.questionType,
      sourceType: q.sourceType,
      subjectId: '',
      topicId: '',
      points: q.points,
      tags: q.tags.join(', '),
      options: q.options.length > 0
        ? q.options.map(o => ({ content: o.content, isCorrect: o.isCorrect }))
        : [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
    });
    setFormError('');
    setModalOpen(true);
  };

  const setOption = (i: number, field: keyof QuestionOption, value: string | boolean) => {
    setForm(f => {
      const opts = [...f.options];
      opts[i] = { ...opts[i], [field]: value };
      return { ...f, options: opts };
    });
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.statement.trim()) { setFormError('Question statement is required.'); return; }
    const filledOptions = form.options.filter(o => o.content.trim());
    if (filledOptions.length < 2) { setFormError('At least 2 options are required.'); return; }
    if (!filledOptions.some(o => o.isCorrect)) { setFormError('At least one correct answer must be selected.'); return; }

    setSaving(true);
    try {
      const payload = {
        statement: form.statement,
        explanation: form.explanation || undefined,
        difficulty: form.difficulty,
        questionType: form.questionType,
        sourceType: form.sourceType,
        subjectId: form.subjectId || undefined,
        points: form.points,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        options: filledOptions,
      };

      let res: Response;
      if (editQuestion) {
        res = await fetch(`/api/admin/questions/${editQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }

      toast('success', editQuestion ? 'Question updated' : 'Question created');
      setModalOpen(false);
      fetchQuestions();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteQuestion) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/questions/${deleteQuestion.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Question deleted');
      setDeleteQuestion(null);
      fetchQuestions();
    } catch {
      toast('error', 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Question>[] = [
    {
      key: 'statement',
      label: 'Question',
      render: (q) => (
        <div className="max-w-sm">
          <div className="text-sm font-medium line-clamp-2">{q.statement}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
            {q.subject?.name ?? 'No subject'} · {q.questionType}
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (q) => {
        const colors: Record<string, { background: string; color: string }> = {
          EASY: { background: '#dcfce7', color: '#16a34a' },
          MEDIUM: { background: '#fef3c7', color: '#d97706' },
          HARD: { background: '#fee2e2', color: '#dc2626' },
          EXPERT: { background: '#ede9fe', color: '#7c3aed' },
        };
        const s = colors[q.difficulty] ?? { background: '#f3f4f6', color: '#6b7280' };
        return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={s}>{q.difficulty}</span>;
      },
    },
    {
      key: 'sourceType',
      label: 'Source',
      render: (q) => <span className="text-xs">{q.sourceType}</span>,
    },
    {
      key: 'points',
      label: 'Points',
      render: (q) => <span className="text-sm">{q.points}</span>,
    },
    {
      key: 'options',
      label: 'Options',
      render: (q) => <span className="text-sm">{q.options.length}</span>,
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Questions" description={`${total} questions in bank`} onAdd={openAdd} />

      <AdminTable
        columns={columns}
        data={questions}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchQuestions(p); }}
        onEdit={openEdit}
        onDelete={setDeleteQuestion}
        searchPlaceholder="Filter by subject ID..."
        filterSlot={
          <div className="flex gap-2">
            <Select value={difficultyFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setDifficultyFilter(val); setPage(1); fetchQuestions(1, val, subjectFilter); }}>
              <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {DIFFICULTY.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subjectFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setSubjectFilter(val); setPage(1); fetchQuestions(1, difficultyFilter, val); }}>
              <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Question Statement *</Label>
              <Textarea value={form.statement} onChange={(e) => setForm(f => ({ ...f, statement: e.target.value }))} rows={3} placeholder="Enter the question text..." />
            </div>

            <div className="space-y-1.5">
              <Label>Explanation (shown after attempt)</Label>
              <Textarea value={form.explanation} onChange={(e) => setForm(f => ({ ...f, explanation: e.target.value }))} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm(f => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DIFFICULTY.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Question Type</Label>
                <Select value={form.questionType} onValueChange={(v) => setForm(f => ({ ...f, questionType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QUESTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source Type</Label>
                <Select value={form.sourceType} onValueChange={(v) => setForm(f => ({ ...f, sourceType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Points</Label>
                <Input type="number" min="1" value={form.points} onChange={(e) => setForm(f => ({ ...f, points: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="algebra, linear, sat" />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, options: [...f.options, emptyOption()] }))} className="h-7 gap-1 text-xs">
                  <Plus className="h-3 w-3" /> Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Checkbox
                      checked={opt.isCorrect}
                      onCheckedChange={(v) => setOption(i, 'isCorrect', !!v)}
                      title="Mark as correct"
                    />
                    <Input
                      className="flex-1"
                      placeholder={`Option ${i + 1}`}
                      value={opt.content}
                      onChange={(e) => setOption(i, 'content', e.target.value)}
                    />
                    {form.options.length > 2 && (
                      <button
                        onClick={() => setForm(f => ({ ...f, options: f.options.filter((_, j) => j !== i) }))}
                        className="cursor-pointer p-1 rounded-lg transition-colors hover:opacity-70"
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Check the box next to the correct answer(s).</p>
            </div>

            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editQuestion ? 'Save Changes' : 'Create Question'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteQuestion}
        title="Delete Question"
        description="Delete this question? It will be removed from all quizzes and question sets."
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteQuestion(null)}
      />
    </div>
  );
}
