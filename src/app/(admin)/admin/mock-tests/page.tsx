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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Edit2, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import RichEditor from '@/components/admin/RichEditor';

interface Program { id: string; name: string; slug: string }
interface Subject { id: string; name: string }

interface BankQuestion {
  id: string; statement: string; difficulty: string;
  subject: { name: string }; topic: { name: string } | null;
}

interface SectionQuestion {
  id: string; questionId: string; sortOrder: number; points: number;
  question: {
    id: string; statement: string; difficulty: string;
    subject: { name: string }; topic: { name: string } | null;
  };
}

interface MockTestSection {
  id: string; name: string; shortName: string; sortOrder: number;
  timeLimit: number; hasCalculator: boolean; instructions: string | null;
  totalMarks: number;
  _count: { questions: number };
  questions?: SectionQuestion[];
}

interface MockTest {
  id: string; title: string; description: string | null; instructions: string | null;
  programId: string | null; passingScore: number; isPublished: boolean;
  createdAt: string;
  program: { name: string; slug: string } | null;
  _count: { sections: number; attempts: number };
}

const emptyForm = {
  title: '', description: '', instructions: '',
  programId: '', passingScore: '70', isPublished: false,
};

const emptySectionForm = {
  name: '', shortName: '', timeLimit: '', hasCalculator: false,
  instructions: '', totalMarks: '', sortOrder: '',
};

export default function AdminMockTestsPage() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMockTest, setEditMockTest] = useState<MockTest | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<MockTest | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Section management modal
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [selectedMockTest, setSelectedMockTest] = useState<MockTest | null>(null);
  const [sections, setSections] = useState<MockTestSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);
  const [editSection, setEditSection] = useState<MockTestSection | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [sectionError, setSectionError] = useState('');
  const [deletingSection, setDeletingSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Question picker
  const [questionSearch, setQuestionSearch] = useState('');
  const [bankSubject, setBankSubject] = useState('');
  const [allQuestions, setAllQuestions] = useState<BankQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchMockTests = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      const res = await fetch(`/api/admin/mock-tests?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMockTests(data.mockTests);
      setTotal(data.total);
    } catch { toast('error', 'Failed to load mock tests'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => {
    fetchMockTests();
    fetch('/api/admin/programs?limit=100').then(r => r.json()).then(d => setPrograms(d.programs ?? []));
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, [fetchMockTests]);

  const openAdd = () => { setEditMockTest(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit = (mt: MockTest) => {
    setEditMockTest(mt);
    setForm({
      title: mt.title, description: mt.description ?? '',
      instructions: mt.instructions ?? '',
      programId: mt.programId ?? '', passingScore: String(mt.passingScore),
      isPublished: mt.isPublished,
    });
    setFormError(''); setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description || null,
        instructions: form.instructions || null,
        programId: form.programId || null,
        passingScore: form.passingScore,
        isPublished: form.isPublished,
      };
      const res = editMockTest
        ? await fetch(`/api/admin/mock-tests/${editMockTest.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/admin/mock-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast('success', editMockTest ? 'Mock test updated' : 'Mock test created');
      setModalOpen(false);
      fetchMockTests();
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast('success', 'Mock test deleted');
      setDeleteTarget(null);
      fetchMockTests();
    } catch { toast('error', 'Failed to delete'); }
    finally { setDeleting(false); }
  };

  // ── Section management ───────────────────────────────────────────
  const openSections = async (mt: MockTest) => {
    setSelectedMockTest(mt);
    setSectionForm(emptySectionForm);
    setEditSection(null);
    setSectionError('');
    setExpandedSection(null);
    setSectionModalOpen(true);
    await loadSections(mt.id);
  };

  const loadSections = async (mockTestId: string) => {
    setSectionsLoading(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${mockTestId}`);
      const data = await res.json();
      setSections(data.mockTest?.sections ?? []);
    } catch { toast('error', 'Failed to load sections'); }
    finally { setSectionsLoading(false); }
  };

  const handleSaveSection = async () => {
    if (!selectedMockTest) return;
    setSectionError('');
    if (!sectionForm.name) { setSectionError('Name is required.'); return; }
    if (!sectionForm.shortName) { setSectionError('Short name is required.'); return; }
    if (!sectionForm.timeLimit) { setSectionError('Time limit is required.'); return; }
    setSavingSection(true);
    try {
      const payload = {
        name: sectionForm.name, shortName: sectionForm.shortName,
        timeLimit: sectionForm.timeLimit, hasCalculator: sectionForm.hasCalculator,
        instructions: sectionForm.instructions || null,
        totalMarks: sectionForm.totalMarks || '0',
        sortOrder: sectionForm.sortOrder || undefined,
      };
      const res = editSection
        ? await fetch(`/api/admin/mock-tests/${selectedMockTest.id}/sections/${editSection.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`/api/admin/mock-tests/${selectedMockTest.id}/sections`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast('success', editSection ? 'Section updated' : 'Section added');
      setSectionForm(emptySectionForm);
      setEditSection(null);
      await loadSections(selectedMockTest.id);
    } catch (e) { setSectionError(e instanceof Error ? e.message : 'Failed to save section'); }
    finally { setSavingSection(false); }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!selectedMockTest) return;
    setDeletingSection(sectionId);
    try {
      await fetch(`/api/admin/mock-tests/${selectedMockTest.id}/sections/${sectionId}`, { method: 'DELETE' });
      await loadSections(selectedMockTest.id);
    } catch { toast('error', 'Failed to delete section'); }
    finally { setDeletingSection(null); }
  };

  // ── Question picker ──────────────────────────────────────────────
  const loadQuestions = async (s = questionSearch, sub = bankSubject) => {
    setQuestionsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '30', page: '1' });
      if (s) params.set('search', s);
      if (sub) params.set('subjectId', sub);
      const res = await fetch(`/api/admin/questions?${params}`);
      const data = await res.json();
      setAllQuestions(data.questions ?? []);
    } catch { /* silent */ }
    finally { setQuestionsLoading(false); }
  };

  useEffect(() => {
    if (expandedSection) loadQuestions(questionSearch, bankSubject);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedSection, questionSearch, bankSubject]);

  const addQuestionToSection = async (sectionId: string, questionId: string) => {
    if (!selectedMockTest) return;
    setAddingId(questionId);
    try {
      const res = await fetch(`/api/admin/mock-tests/${selectedMockTest.id}/sections/${sectionId}/questions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) { const e = await res.json(); toast('error', e.error ?? 'Failed to add'); return; }
      await loadSections(selectedMockTest.id);
    } finally { setAddingId(null); }
  };

  const removeQuestionFromSection = async (sectionId: string, questionId: string) => {
    if (!selectedMockTest) return;
    setRemovingId(questionId);
    try {
      await fetch(`/api/admin/mock-tests/${selectedMockTest.id}/sections/${sectionId}/questions/${questionId}`, {
        method: 'DELETE',
      });
      await loadSections(selectedMockTest.id);
    } catch { toast('error', 'Failed to remove question'); }
    finally { setRemovingId(null); }
  };

  const diffColors: Record<string, { background: string; color: string }> = {
    EASY:   { background: '#dcfce7', color: '#16a34a' },
    MEDIUM: { background: '#fef3c7', color: '#d97706' },
    HARD:   { background: '#fee2e2', color: '#dc2626' },
    EXPERT: { background: '#ede9fe', color: '#7c3aed' },
  };

  const columns: Column<MockTest>[] = [
    {
      key: 'title', label: 'Mock Test',
      render: (mt) => (
        <div>
          <div className="font-medium text-sm">{mt.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {mt.program?.name ?? 'No program'} · {mt._count.sections} section{mt._count.sections !== 1 ? 's' : ''} · {mt._count.attempts} attempt{mt._count.attempts !== 1 ? 's' : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'passing', label: 'Passing',
      render: (mt) => <span className="text-sm">{mt.passingScore}%</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (mt) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={mt.isPublished
            ? { background: '#dcfce7', color: '#16a34a' }
            : { background: '#fef3c7', color: '#d97706' }}>
          {mt.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'manage', label: '',
      render: (mt) => (
        <Button
          size="sm" variant="outline"
          onClick={(e) => { e.stopPropagation(); openSections(mt); }}
          style={{ fontSize: 12 }}
        >
          Manage Sections
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Mock Tests"
        description={`${total} full-length mock exam${total !== 1 ? 's' : ''}`}
        onAdd={openAdd}
        addLabel="New Mock Test"
      />

      <AdminTable
        columns={columns}
        data={mockTests}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchMockTests(p); }}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchMockTests(1, v); }}
        searchPlaceholder="Search mock tests..."
      />

      {/* ── Create / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMockTest ? 'Edit Mock Test' : 'New Mock Test'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. SAT Mock Test 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <RichEditor value={form.description} onChange={(html) => setForm(f => ({ ...f, description: html }))} placeholder="Describe this mock test..." mode="simple" minHeight={110} />
            </div>
            <div className="space-y-1.5">
              <Label>Instructions</Label>
              <RichEditor value={form.instructions} onChange={(html) => setForm(f => ({ ...f, instructions: html }))} placeholder="Shown to student before starting the exam" mode="full" minHeight={140} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Program</Label>
                <Select
                  value={form.programId || 'none'}
                  onValueChange={v => setForm(f => ({ ...f, programId: v === 'none' ? '' : v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Passing Score (%)</Label>
                <Input
                  type="number" min="0" max="100"
                  value={form.passingScore}
                  onChange={e => setForm(f => ({ ...f, passingScore: e.target.value }))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={form.isPublished}
                onCheckedChange={v => setForm(f => ({ ...f, isPublished: !!v }))}
              />
              Published (visible to enrolled students)
            </label>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editMockTest ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Section Management Modal ── */}
      <Dialog open={sectionModalOpen} onOpenChange={(v) => !v && setSectionModalOpen(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sections — {selectedMockTest?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Section form */}
            <div
              className="p-4 rounded-xl border space-y-3"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
            >
              <p className="text-sm font-semibold">{editSection ? 'Edit Section' : 'Add Section'}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Section Name *</Label>
                  <Input
                    value={sectionForm.name}
                    onChange={e => setSectionForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Reading & Writing Module 1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Short Name *</Label>
                  <Input
                    value={sectionForm.shortName}
                    onChange={e => setSectionForm(f => ({ ...f, shortName: e.target.value }))}
                    placeholder="e.g. RW1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Time Limit (secs) *</Label>
                  <Input
                    type="number" min="60"
                    value={sectionForm.timeLimit}
                    onChange={e => setSectionForm(f => ({ ...f, timeLimit: e.target.value }))}
                    placeholder="e.g. 1920"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Total Marks</Label>
                  <Input
                    type="number" min="0"
                    value={sectionForm.totalMarks}
                    onChange={e => setSectionForm(f => ({ ...f, totalMarks: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input
                    type="number" min="0"
                    value={sectionForm.sortOrder}
                    onChange={e => setSectionForm(f => ({ ...f, sortOrder: e.target.value }))}
                    placeholder="Auto"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Instructions</Label>
                <RichEditor value={sectionForm.instructions} onChange={(html) => setSectionForm(f => ({ ...f, instructions: html }))} placeholder="Shown to student at the start of this section" mode="simple" minHeight={110} />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={sectionForm.hasCalculator}
                  onCheckedChange={v => setSectionForm(f => ({ ...f, hasCalculator: !!v }))}
                />
                Calculator allowed
              </label>
              {sectionError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{sectionError}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveSection} disabled={savingSection}>
                  {savingSection ? 'Saving...' : editSection ? 'Update Section' : 'Add Section'}
                </Button>
                {editSection && (
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditSection(null);
                    setSectionForm(emptySectionForm);
                    setSectionError('');
                  }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Existing sections list */}
            {sectionsLoading ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-muted-foreground)' }}>Loading…</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-muted-foreground)' }}>
                No sections yet. Add one above.
              </p>
            ) : (
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                    {/* Section row */}
                    <div className="flex items-center gap-3 p-3" style={{ background: 'var(--color-card)' }}>
                      <GripVertical className="h-4 w-4 shrink-0" style={{ color: 'var(--color-muted-foreground)' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{section.name}</span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
                          >
                            {section.shortName}
                          </span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                          {Math.floor(section.timeLimit / 60)}m · {section._count.questions} question{section._count.questions !== 1 ? 's' : ''}
                          {section.hasCalculator ? ' · Calculator' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          className="p-1.5 rounded hover:bg-slate-100"
                          onClick={() => {
                            setEditSection(section);
                            setSectionForm({
                              name: section.name, shortName: section.shortName,
                              timeLimit: String(section.timeLimit),
                              hasCalculator: section.hasCalculator,
                              instructions: section.instructions ?? '',
                              totalMarks: String(section.totalMarks),
                              sortOrder: String(section.sortOrder),
                            });
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5" style={{ color: 'var(--color-muted-foreground)' }} />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-red-50"
                          onClick={() => handleDeleteSection(section.id)}
                          disabled={deletingSection === section.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" style={{ color: '#dc2626' }} />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-slate-100"
                          onClick={() => {
                            const next = expandedSection === section.id ? null : section.id;
                            setExpandedSection(next);
                            if (next) { setQuestionSearch(''); setBankSubject(''); }
                          }}
                        >
                          {expandedSection === section.id
                            ? <ChevronDown className="h-3.5 w-3.5" />
                            : <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable question management panel */}
                    {expandedSection === section.id && (() => {
                      const assignedIds = new Set((section.questions ?? []).map(sq => sq.question.id));
                      return (
                        <div
                          className="p-4 border-t space-y-5"
                          style={{ borderColor: 'var(--color-border)', background: 'var(--color-muted)' }}
                        >
                          {/* ── Assigned questions list ── */}
                          <div>
                            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                              In this section ({section.questions?.length ?? 0})
                            </p>
                            {(section.questions ?? []).length === 0 ? (
                              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No questions added yet.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {(section.questions ?? []).map((sq, i) => (
                                  <div
                                    key={sq.id}
                                    className="flex items-start gap-2.5 p-2.5 rounded-lg border"
                                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
                                  >
                                    <span className="text-xs font-mono mt-0.5 w-5 text-right shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>
                                      {i + 1}.
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs line-clamp-2">{sq.question.statement}</p>
                                      <div className="flex gap-2 mt-1">
                                        <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[sq.question.difficulty] ?? {}}>
                                          {sq.question.difficulty}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                                          {sq.question.subject.name}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeQuestionFromSection(section.id, sq.question.id)}
                                      disabled={removingId === sq.question.id}
                                      className="shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
                                      style={{ color: 'var(--color-danger)' }}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ── Add from question bank ── */}
                          <div>
                            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                              Add from Question Bank
                            </p>
                            <div className="flex gap-2 mb-3">
                              <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--color-muted-foreground)' }} />
                                <Input
                                  className="pl-8 h-8 text-sm"
                                  placeholder="Search questions…"
                                  value={questionSearch}
                                  onChange={e => setQuestionSearch(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && loadQuestions(questionSearch, bankSubject)}
                                />
                              </div>
                              <Select
                                value={bankSubject || 'all'}
                                onValueChange={v => { const val = v === 'all' ? '' : v; setBankSubject(val); loadQuestions(questionSearch, val); }}
                              >
                                <SelectTrigger className="w-36 h-8 shrink-0 text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All subjects</SelectItem>
                                  {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="sm" className="h-8" onClick={() => loadQuestions(questionSearch, bankSubject)} disabled={questionsLoading}>
                                {questionsLoading ? '…' : 'Search'}
                              </Button>
                            </div>
                            <div className="max-h-52 overflow-y-auto space-y-1.5">
                              {questionsLoading ? (
                                <p className="text-xs py-2 text-center" style={{ color: 'var(--color-muted-foreground)' }}>Loading…</p>
                              ) : allQuestions.length === 0 ? (
                                <p className="text-xs py-2 text-center" style={{ color: 'var(--color-muted-foreground)' }}>No questions found.</p>
                              ) : allQuestions.map(q => {
                                const already = assignedIds.has(q.id);
                                return (
                                  <div
                                    key={q.id}
                                    className="flex items-start gap-2.5 p-2.5 rounded-lg border"
                                    style={{
                                      borderColor: 'var(--color-border)',
                                      background: already ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-card))' : 'var(--color-card)',
                                    }}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs line-clamp-2">{q.statement}</p>
                                      <div className="flex gap-2 mt-1">
                                        <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[q.difficulty] ?? {}}>
                                          {q.difficulty}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                                          {q.subject.name}
                                        </span>
                                      </div>
                                    </div>
                                    {already ? (
                                      <span className="text-xs shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }}>Added</span>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 h-7 text-xs"
                                        onClick={() => addQuestionToSection(section.id, q.id)}
                                        disabled={addingId === q.id}
                                      >
                                        {addingId === q.id ? '…' : <><Plus className="h-3 w-3 mr-1" />Add</>}
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Delete Mock Test"
        description={`Delete "${deleteTarget?.title}"? All sections, questions, and attempts will also be deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
