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

interface Subject {
  id: string;
  name: string;
}

interface BankQuestion {
  id: string;
  statement: string;
  difficulty: string;
  sourceType: string;
  subject: { name: string } | null;
}

interface ExamQuestion {
  id: string;
  sortOrder: number;
  points: number;
  sectionName: string | null;
  question: BankQuestion;
}

const MONTHS = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
  { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => String(currentYear - i));

const diffColors: Record<string, { background: string; color: string }> = {
  EASY: { background: '#dcfce7', color: '#16a34a' },
  MEDIUM: { background: '#fef3c7', color: '#d97706' },
  HARD: { background: '#fee2e2', color: '#dc2626' },
  EXPERT: { background: '#ede9fe', color: '#7c3aed' },
};

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
  const [subjects, setSubjects] = useState<Subject[]>([]);
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

  // Map Questions panel
  const [manageExam, setManageExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubject, setBankSubject] = useState('');
  const [bankResults, setBankResults] = useState<BankQuestion[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

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
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
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

  // ── Map Questions ─────────────────────────────────────────────────────────

  const openManage = async (exam: Exam) => {
    setManageExam(exam);
    setBankSearch('');
    setBankSubject('');
    setBankResults([]);
    const res = await fetch(`/api/admin/exams/${exam.id}/questions`);
    const data = await res.json();
    setExamQuestions(data.questions ?? []);
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
    if (manageExam) searchBank();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageExam]);

  const addQuestion = async (questionId: string) => {
    if (!manageExam) return;
    setAddingId(questionId);
    try {
      const res = await fetch(`/api/admin/exams/${manageExam.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast('error', err.error ?? 'Failed to add');
        return;
      }
      const refreshed = await fetch(`/api/admin/exams/${manageExam.id}/questions`);
      const data = await refreshed.json();
      setExamQuestions(data.questions ?? []);
      fetchExams();
    } finally {
      setAddingId(null);
    }
  };

  const removeQuestion = async (questionId: string) => {
    if (!manageExam) return;
    setRemovingId(questionId);
    try {
      await fetch(`/api/admin/exams/${manageExam.id}/questions/${questionId}`, { method: 'DELETE' });
      setExamQuestions(q => q.filter(eq => eq.question.id !== questionId));
      fetchExams();
    } finally {
      setRemovingId(null);
    }
  };

  const assignedIds = new Set(examQuestions.map(eq => eq.question.id));

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
      render: (e) => <span className="text-sm">{e._count.questions} mapped</span>,
    },
    {
      key: 'map',
      label: 'Map Questions',
      render: (e) => (
        <button
          onClick={(ev) => { ev.stopPropagation(); openManage(e); }}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
          style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', color: 'var(--color-primary)' }}
        >
          <ListChecks className="h-3.5 w-3.5" />
          Map Questions
        </button>
      ),
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

      {/* Create / Edit Modal */}
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

      {/* Map Questions Modal */}
      <Dialog open={!!manageExam} onOpenChange={(v) => !v && setManageExam(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Map Questions — {manageExam?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Mapped questions */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
                Mapped to this exam ({examQuestions.length})
              </p>
              {examQuestions.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No questions mapped yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {examQuestions.map((eq, i) => (
                    <div key={eq.id} className="flex items-start gap-3 p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
                      <span className="text-xs font-mono mt-0.5 w-5 text-right shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{eq.question.statement}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[eq.question.difficulty] ?? {}}>{eq.question.difficulty}</span>
                          <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{eq.question.subject?.name} · {eq.question.sourceType}</span>
                          {eq.sectionName && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{eq.sectionName}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(eq.question.id)}
                        disabled={removingId === eq.question.id}
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
                        <span className="text-xs shrink-0 mt-1" style={{ color: 'var(--color-primary)' }}>Mapped</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => addQuestion(q.id)}
                          disabled={addingId === q.id}
                        >
                          {addingId === q.id ? '...' : 'Map'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Button variant="outline" onClick={() => setManageExam(null)}>Done</Button>
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
