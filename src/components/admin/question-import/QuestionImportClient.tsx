'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Edit3, FileText, RefreshCw, Save, Search, Trash2, UploadCloud, XCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import RichEditor, { htmlToText } from '@/components/admin/RichEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ImportedQuestionPreview, ImportOption, ImportSession } from '@/services/question-import/types';

interface Program {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  programId: string;
}

interface Topic {
  id: string;
  name: string;
  subjectId: string;
}

type SafeSession = Omit<ImportSession, 'questionText' | 'answerText' | 'explanationText'>;

const DIFFICULTY = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const SOURCE_TYPES = ['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST'];
const QUESTION_TYPES = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERIC', 'TEXT'];
const PAGE_SIZE = 10;

const blankOption = (): ImportOption => ({ label: '', content: '' });

export default function QuestionImportClient() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [form, setForm] = useState({
    programId: '',
    subjectId: '',
    topicId: '',
    chunkSize: 5,
    difficulty: 'MEDIUM',
    sourceType: 'MCQ',
    points: 1,
    tags: '',
  });
  const [questionPdf, setQuestionPdf] = useState<File | null>(null);
  const [answerPdf, setAnswerPdf] = useState<File | null>(null);
  const [explanationPdf, setExplanationPdf] = useState<File | null>(null);
  const [session, setSession] = useState<SafeSession | null>(null);
  const [preview, setPreview] = useState<ImportedQuestionPreview[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editQuestion, setEditQuestion] = useState<ImportedQuestionPreview | null>(null);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/programs?limit=50').then((res) => res.json()).then((data) => setPrograms(data.programs ?? [])).catch(() => toast('error', 'Failed to load programs'));
    fetch('/api/admin/subjects?limit=100').then((res) => res.json()).then((data) => setSubjects(data.subjects ?? [])).catch(() => toast('error', 'Failed to load subjects'));
  }, []);

  useEffect(() => {
    if (!form.subjectId) {
      return;
    }
    fetch(`/api/admin/topics?limit=100&subjectId=${form.subjectId}`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics ?? []))
      .catch(() => toast('error', 'Failed to load topics'));
  }, [form.subjectId]);

  const syncSession = useCallback((next: SafeSession) => {
    setSession(next);
    setPreview(next.questions ?? []);
    if (next.status === 'preview_ready' || next.status === 'failed' || next.status === 'saved') {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = null;
      setBusy(false);
    }
  }, []);

  const pollSession = useCallback((sessionId: string) => {
    if (pollingRef.current) window.clearInterval(pollingRef.current);
    pollingRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/question-import/status?sessionId=${sessionId}`);
        const data = await readJsonResponse<{ session: SafeSession; error?: string }>(res);
        if (!res.ok) throw new Error(data.error ?? 'Polling failed');
        syncSession(data.session);
      } catch (error) {
        if (pollingRef.current) window.clearInterval(pollingRef.current);
        pollingRef.current = null;
        setBusy(false);
        toast('error', error instanceof Error ? error.message : 'Lost import session progress');
      }
    }, 1500);
  }, [syncSession]);

  useEffect(() => () => {
    if (pollingRef.current) window.clearInterval(pollingRef.current);
  }, []);

  const filteredSubjects = useMemo(
    () => subjects.filter((subject) => !form.programId || subject.programId === form.programId),
    [subjects, form.programId],
  );

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return preview.filter((question) => {
      const matchesSearch = !query
        || question.questionNumber.toLowerCase().includes(query)
        || htmlToText(question.question).toLowerCase().includes(query)
        || (question.correctAnswer ?? '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [preview, search, statusFilter]);

  const pagedQuestions = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const selectedCount = selected.size;

  const startImport = async () => {
    if (!questionPdf) { toast('error', 'Question PDF is required'); return; }
    if (!form.programId || !form.subjectId) { toast('error', 'Program and subject are required'); return; }

    setBusy(true);
    setSelected(new Set());
    setPreview([]);
    try {
      const payload = new FormData();
      payload.set('questionPdf', questionPdf);
      if (answerPdf) payload.set('answerPdf', answerPdf);
      if (explanationPdf) payload.set('explanationPdf', explanationPdf);
      for (const [key, value] of Object.entries(form)) payload.set(key, String(value));

      const res = await fetch('/api/admin/question-import/start', { method: 'POST', body: payload });
      const data = await readJsonResponse<{ session?: SafeSession; error?: string }>(res);
      if (!res.ok || !data.session) throw new Error(data.error ?? 'Failed to start import');
      syncSession(data.session);
      pollSession(data.session.id);
    } catch (error) {
      setBusy(false);
      toast('error', error instanceof Error ? error.message : 'Failed to start import');
    }
  };

  const retryChunk = async (chunkIndex: number) => {
    if (!session) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/question-import/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, chunkIndex }),
      });
      const data = await readJsonResponse<{ session?: SafeSession; error?: string }>(res);
      if (!res.ok || !data.session) throw new Error(data.error ?? 'Retry failed');
      syncSession(data.session);
      pollSession(session.id);
    } catch (error) {
      setBusy(false);
      toast('error', error instanceof Error ? error.message : 'Retry failed');
    }
  };

  const pushPreviewUpdate = async (nextPreview: ImportedQuestionPreview[]) => {
    if (!session) return;
    setPreview(nextPreview);
    const res = await fetch('/api/admin/question-import/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, questions: nextPreview }),
    });
    const data = await readJsonResponse<{ session?: SafeSession; error?: string }>(res);
    if (!res.ok || !data.session) throw new Error(data.error ?? 'Failed to update preview');
    syncSession(data.session);
  };

  const deleteQuestion = async (questionNumber: string) => {
    try {
      await pushPreviewUpdate(preview.filter((question) => question.questionNumber !== questionNumber));
      setSelected((current) => {
        const next = new Set(current);
        next.delete(questionNumber);
        return next;
      });
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    try {
      await pushPreviewUpdate(preview.filter((question) => !selected.has(question.questionNumber)));
      setSelected(new Set());
      toast('success', 'Selected questions removed from preview');
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Bulk delete failed');
    }
  };

  const bulkSetAnswer = async (answer: string) => {
    if (!answer.trim() || selected.size === 0) return;
    try {
      await pushPreviewUpdate(preview.map((question) => selected.has(question.questionNumber) ? { ...question, correctAnswer: answer.trim().toUpperCase() } : question));
      toast('success', 'Bulk answer update applied');
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Bulk edit failed');
    }
  };

  const saveEdit = async (updated: ImportedQuestionPreview) => {
    try {
      await pushPreviewUpdate(preview.map((question) => question.questionNumber === updated.questionNumber ? updated : question));
      setEditQuestion(null);
      toast('success', 'Question updated in preview');
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Update failed');
    }
  };

  const saveAll = async () => {
    if (!session) return;
    setSaving(true);
    try {
      await pushPreviewUpdate(preview);
      const res = await fetch('/api/admin/question-import/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await readJsonResponse<{ count?: number; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      toast('success', `Saved ${data.count ?? 0} draft questions`);
      setSession(null);
      setPreview([]);
      setSelected(new Set());
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const allPagedSelected = pagedQuestions.length > 0 && pagedQuestions.every((question) => selected.has(question.questionNumber));

  return (
    <div className="space-y-6">
      <AdminToastContainer />
      <AdminPageHeader title="AI Question Import" description="Import searchable PDFs through local Ollama and save results as draft questions." />

      <section className="rounded-lg border bg-[var(--color-card)] p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="grid gap-4 xl:grid-cols-3">
          <FileInput label="Question PDF" file={questionPdf} required onChange={setQuestionPdf} />
          <FileInput label="Answer Key PDF" file={answerPdf} onChange={setAnswerPdf} />
          <FileInput label="Explanation PDF" file={explanationPdf} onChange={setExplanationPdf} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Program</Label>
            <Select value={form.programId || 'none'} onValueChange={(value) => setForm((current) => ({ ...current, programId: value === 'none' ? '' : value, subjectId: '', topicId: '' }))}>
              <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select program</SelectItem>
                {programs.map((program) => <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectId || 'none'} onValueChange={(value) => setForm((current) => ({ ...current, subjectId: value === 'none' ? '' : value, topicId: '' }))}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select subject</SelectItem>
                {filteredSubjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Select value={form.topicId || 'none'} onValueChange={(value) => setForm((current) => ({ ...current, topicId: value === 'none' ? '' : value }))}>
              <SelectTrigger><SelectValue placeholder="Optional topic" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No topic</SelectItem>
                {topics.map((topic) => <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Chunk Size</Label>
            <Input type="number" min={1} max={25} value={form.chunkSize} onChange={(event) => setForm((current) => ({ ...current, chunkSize: Number.parseInt(event.target.value, 10) || 5 }))} />
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Use 1 for question-by-question extraction; 5 is safer for local Qwen.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(value) => setForm((current) => ({ ...current, difficulty: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DIFFICULTY.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Source Type</Label>
            <Select value={form.sourceType} onValueChange={(value) => setForm((current) => ({ ...current, sourceType: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCE_TYPES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Points</Label>
            <Input type="number" min={1} value={form.points} onChange={(event) => setForm((current) => ({ ...current, points: Number.parseInt(event.target.value, 10) || 1 }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <Input value={form.tags} placeholder="sat, algebra" onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={startImport} disabled={busy || saving} className="gap-2">
            <UploadCloud className="h-4 w-4" />
            {busy ? 'Extracting...' : 'Extract Questions'}
          </Button>
        </div>
      </section>

      {session && (
        <section className="rounded-lg border bg-[var(--color-card)] p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{session.progress.message}</p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {session.progress.completedChunks} completed · {session.progress.failedChunks} failed · {session.progress.totalQuestions} questions
              </p>
            </div>
            <StatusBadge status={session.status} />
          </div>
          <Progress value={session.progress.percent} className="mt-4 h-3" />
          {session.chunks.some((chunk) => chunk.status === 'failed') && (
            <div className="mt-4 space-y-2">
              {session.chunks.filter((chunk) => chunk.status === 'failed').map((chunk) => (
                <div key={chunk.id} className="flex items-center justify-between gap-3 rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm">Chunk {chunk.index + 1} failed: {chunk.error}</p>
                  <Button size="sm" variant="outline" onClick={() => retryChunk(chunk.index)} disabled={busy}>
                    <RefreshCw className="h-4 w-4" /> Retry Chunk
                  </Button>
                </div>
              ))}
            </div>
          )}
          {session.errors.length > 0 && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {session.errors.map((error) => <p key={error}>{error}</p>)}
            </div>
          )}
        </section>
      )}

      {preview.length > 0 && (
        <section className="rounded-lg border bg-[var(--color-card)]" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <Input className="w-72 pl-9" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search preview" />
              </div>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Input className="w-24" placeholder="A" onKeyDown={(event) => {
                if (event.key === 'Enter') void bulkSetAnswer(event.currentTarget.value);
              }} />
              <Button variant="outline" disabled={selectedCount === 0} onClick={bulkDelete}><Trash2 className="h-4 w-4" /> Bulk Delete</Button>
              <Button disabled={saving || busy || session?.status !== 'preview_ready'} onClick={saveAll}><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save All as Draft'}</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="w-10 p-3">
                    <Checkbox checked={allPagedSelected} onCheckedChange={(value) => {
                      setSelected((current) => {
                        const next = new Set(current);
                        for (const question of pagedQuestions) {
                          if (value) next.add(question.questionNumber);
                          else next.delete(question.questionNumber);
                        }
                        return next;
                      });
                    }} />
                  </th>
                  <th className="p-3">Question Number</th>
                  <th className="p-3">Question</th>
                  <th className="p-3">Options</th>
                  <th className="p-3">Correct Answer</th>
                  <th className="p-3">Explanation</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedQuestions.map((question) => (
                  <tr key={question.questionNumber} className="border-b align-top" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="p-3">
                      <Checkbox checked={selected.has(question.questionNumber)} onCheckedChange={(value) => {
                        setSelected((current) => {
                          const next = new Set(current);
                          if (value) next.add(question.questionNumber);
                          else next.delete(question.questionNumber);
                          return next;
                        });
                      }} />
                    </td>
                    <td className="p-3 font-semibold">{question.questionNumber}</td>
                    <td className="max-w-sm p-3">{htmlToText(question.question, 180)}</td>
                    <td className="max-w-xs p-3">{question.options.map((option) => `${option.label}. ${htmlToText(option.content, 55)}`).join(' | ')}</td>
                    <td className="p-3">{question.correctAnswer ?? <span className="text-[var(--color-muted-foreground)]">Missing</span>}</td>
                    <td className="max-w-xs p-3">{question.explanation ? htmlToText(question.explanation, 90) : <span className="text-[var(--color-muted-foreground)]">Missing</span>}</td>
                    <td className="p-3"><QuestionStatus question={question} /></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditQuestion(question)}><Edit3 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => deleteQuestion(question.questionNumber)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4">
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{filteredQuestions.length} matching questions</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button>
            </div>
          </div>
        </section>
      )}

      <EditQuestionDialog question={editQuestion} onClose={() => setEditQuestion(null)} onSave={saveEdit} />
    </div>
  );
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return await response.json() as T;
  }

  const text = await response.text();
  const message = text.includes('<!DOCTYPE')
    ? `Server returned an HTML error page (${response.status}). Check the Next.js terminal logs.`
    : text || `Request failed with status ${response.status}.`;
  throw new Error(message);
}

function FileInput({ label, file, required, onChange }: { label: string; file: File | null; required?: boolean; onChange: (file: File | null) => void }) {
  return (
    <label className="block rounded-lg border border-dashed p-4 transition-colors hover:bg-[var(--color-muted)]" style={{ borderColor: 'var(--color-border)' }}>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" /> {label}{required ? ' *' : ''}</span>
      <Input type="file" accept="application/pdf" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
      <span className="mt-2 block truncate text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{file?.name ?? 'No file selected'}</span>
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const ready = status === 'preview_ready' || status === 'saved';
  const failed = status === 'failed';
  return <Badge variant={failed ? 'destructive' : ready ? 'default' : 'secondary'}>{status.replace(/_/g, ' ')}</Badge>;
}

function QuestionStatus({ question }: { question: ImportedQuestionPreview }) {
  if (question.status === 'error') return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Error</Badge>;
  if (question.status === 'warning') return (
    <div className="space-y-1">
      <Badge variant="secondary">Warnings</Badge>
      {question.warnings.map((warning) => <p key={`${warning.code}-${warning.message}`} className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{warning.message}</p>)}
    </div>
  );
  return <Badge><CheckCircle2 className="mr-1 h-3 w-3" /> Ready</Badge>;
}

function EditQuestionDialog({ question, onClose, onSave }: { question: ImportedQuestionPreview | null; onClose: () => void; onSave: (question: ImportedQuestionPreview) => void }) {
  if (!question) return null;
  return <EditQuestionDialogInner key={question.questionNumber} question={question} onClose={onClose} onSave={onSave} />;
}

function EditQuestionDialogInner({ question, onClose, onSave }: { question: ImportedQuestionPreview; onClose: () => void; onSave: (question: ImportedQuestionPreview) => void }) {
  const [draft, setDraft] = useState<ImportedQuestionPreview | null>(question);

  if (!draft) return null;

  const setOption = (index: number, patch: Partial<ImportOption>) => {
    setDraft((current) => {
      if (!current) return current;
      const options = [...current.options];
      options[index] = { ...options[index], ...patch };
      return { ...current, options };
    });
  };

  const setListField = (field: 'images' | 'tables' | 'math', value: string) => {
    setDraft((current) => current ? { ...current, [field]: value.split('\n').map((item) => item.trim()).filter(Boolean) } : current);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Imported Question {draft.questionNumber}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Question Number</Label>
              <Input value={draft.questionNumber} onChange={(event) => setDraft({ ...draft, questionNumber: event.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Question Type</Label>
              <Select value={draft.questionType} onValueChange={(value) => setDraft({ ...draft, questionType: value as ImportedQuestionPreview['questionType'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{QUESTION_TYPES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Correct Answer</Label>
              <Input value={draft.correctAnswer ?? ''} onChange={(event) => setDraft({ ...draft, correctAnswer: event.target.value.toUpperCase() })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Question</Label>
            <RichEditor value={draft.question} onChange={(value) => setDraft({ ...draft, question: value })} mode="full" minHeight={140} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setDraft({ ...draft, options: [...draft.options, blankOption()] })}>Add Option</Button>
            </div>
            {draft.options.map((option, index) => (
              <div key={`${option.label}-${index}`} className="rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
                <div className="mb-2 grid gap-2 md:grid-cols-[100px_1fr_120px]">
                  <Input value={option.label} placeholder="A" onChange={(event) => setOption(index, { label: event.target.value.toUpperCase() })} />
                  <Input value={option.imageUrl ?? ''} placeholder="Image URL or source note" onChange={(event) => setOption(index, { imageUrl: event.target.value })} />
                  <Button type="button" variant="ghost" disabled={draft.options.length <= 2} onClick={() => setDraft({ ...draft, options: draft.options.filter((_, i) => i !== index) })}>Remove</Button>
                </div>
                <RichEditor value={option.content} onChange={(value) => setOption(index, { content: value })} mode="full" minHeight={90} />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label>Explanation</Label>
            <RichEditor value={draft.explanation ?? ''} onChange={(value) => setDraft({ ...draft, explanation: value })} mode="full" minHeight={120} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ListEditor label="Images" value={draft.images} onChange={(value) => setListField('images', value)} />
            <ListEditor label="Tables" value={draft.tables} onChange={(value) => setListField('tables', value)} />
            <ListEditor label="Math" value={draft.math} onChange={(value) => setListField('math', value)} />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave({ ...draft, warnings: draft.warnings ?? [] })}>Save Preview Edit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ListEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea value={value.join('\n')} onChange={(event) => onChange(event.target.value)} rows={5} />
    </div>
  );
}
