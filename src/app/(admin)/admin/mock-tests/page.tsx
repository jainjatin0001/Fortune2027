'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Copy, Layers } from 'lucide-react';
import RichEditor from '@/components/admin/RichEditor';
import { EXAM_PRESETS } from '@/lib/mock-test/presets';
import { EXAM_KIND_META, examKindOf } from '@/lib/mock-test/exam-kind';

interface Program { id: string; name: string; slug: string }

interface MockTest {
  id: string; title: string; description: string | null; instructions: string | null;
  programId: string | null; passingScore: number; isPublished: boolean; isDemo: boolean;
  createdAt: string;
  program: { name: string; slug: string } | null;
  _count: { sections: number; attempts: number };
}

const emptyForm = {
  title: '', description: '', instructions: '',
  programId: '', passingScore: '70', isPublished: false, isDemo: false,
  preset: '',
};

export default function AdminMockTestsPage() {
  const router = useRouter();
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
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

  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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

  // Initial load only — page/search handlers call fetchMockTests with explicit args
  useEffect(() => {
    fetchMockTests();
    fetch('/api/admin/programs?limit=100').then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => { setEditMockTest(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit = (mt: MockTest) => {
    setEditMockTest(mt);
    setForm({
      title: mt.title, description: mt.description ?? '',
      instructions: mt.instructions ?? '',
      programId: mt.programId ?? '', passingScore: String(mt.passingScore),
      isPublished: mt.isPublished, isDemo: mt.isDemo, preset: '',
    });
    setFormError(''); setModalOpen(true);
  };

  const selectedProgram = programs.find(p => p.id === form.programId);
  const formExamKind = examKindOf(selectedProgram);

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    if (form.isDemo && !form.programId) {
      setFormError('A free practice test needs a program — students filter the Mock Test page by program.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description || null,
        instructions: form.instructions || null,
        programId: form.programId || null,
        passingScore: form.passingScore,
        isPublished: form.isPublished,
        isDemo: form.isDemo,
        ...(!editMockTest && form.preset && { preset: form.preset }),
      };
      const res = editMockTest
        ? await fetch(`/api/admin/mock-tests/${editMockTest.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/admin/mock-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      toast('success', editMockTest ? 'Mock test updated' : 'Mock test created');
      setModalOpen(false);
      // New tests go straight to the builder to add sections & questions
      if (!editMockTest) router.push(`/admin/mock-tests/${data.mockTest.id}`);
      else fetchMockTests();
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

  const handleDuplicate = async (mt: MockTest) => {
    setDuplicatingId(mt.id);
    try {
      const res = await fetch(`/api/admin/mock-tests/${mt.id}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error();
      toast('success', 'Copied as a draft');
      fetchMockTests();
    } catch { toast('error', 'Failed to duplicate'); }
    finally { setDuplicatingId(null); }
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
      render: (mt) => {
        const kind = examKindOf(mt.program);
        return (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={mt.isPublished
                ? { background: '#dcfce7', color: '#16a34a' }
                : { background: '#fef3c7', color: '#d97706' }}>
              {mt.isPublished ? 'Published' : 'Draft'}
            </span>
            {mt.isDemo && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={!mt.program
                  ? { background: '#fee2e2', color: '#dc2626' }
                  : kind
                    ? { background: `${EXAM_KIND_META[kind].color}18`, color: EXAM_KIND_META[kind].color }
                    : { background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
                title={mt.program ? `Free on the Mock Test page under ${mt.program.name}` : 'No program — students can’t find it'}
              >
                Free{mt.program ? '' : ' · no program'}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'manage', label: '',
      render: (mt) => (
        <div className="flex items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/mock-tests/${mt.id}`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium hover:bg-(--color-muted)"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Layers className="h-3.5 w-3.5" /> Sections & Questions
          </Link>
          <Button
            size="sm" variant="ghost" title="Duplicate"
            onClick={() => handleDuplicate(mt)}
            disabled={duplicatingId === mt.id}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Program</Label>
                <Select
                  value={form.programId || 'none'}
                  onValueChange={v => {
                    const programId = v === 'none' ? '' : v;
                    // Suggest the matching exam template for a new test
                    const kind = examKindOf(programs.find(p => p.id === programId));
                    setForm(f => ({
                      ...f, programId,
                      preset: !editMockTest && !f.preset && kind ? (kind === 'SAT' ? 'digital-sat' : 'act') : f.preset,
                    }));
                  }}
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

            {!editMockTest && (
              <div className="space-y-1.5">
                <Label>Section structure</Label>
                <Select value={form.preset || 'blank'} onValueChange={v => setForm(f => ({ ...f, preset: v === 'blank' ? '' : v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Start blank (add sections yourself)</SelectItem>
                    {EXAM_PRESETS.map(p => <SelectItem key={p.key} value={p.key}>{p.label} — {p.description}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Templates create all sections with real timing, calculator rules and breaks. Everything stays editable.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Free practice test?</Label>
              <div role="radiogroup" className="flex gap-2">
                {[{ v: true, label: 'Yes' }, { v: false, label: 'No' }].map(opt => (
                  <label
                    key={opt.label}
                    className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer"
                    style={{
                      borderColor: form.isDemo === opt.v ? 'var(--color-primary)' : 'var(--color-border)',
                      background: form.isDemo === opt.v ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="isDemo"
                      checked={form.isDemo === opt.v}
                      onChange={() => setForm(f => ({ ...f, isDemo: opt.v }))}
                      className="accent-(--color-primary)"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <p className="text-xs" style={{ color: form.isDemo && !selectedProgram ? 'var(--color-danger)' : 'var(--color-muted-foreground)' }}>
                {form.isDemo
                  ? selectedProgram
                    ? `Every signed-in student can take it from the Mock Test page under ${selectedProgram.name} (once published)${formExamKind ? `, in the ${EXAM_KIND_META[formExamKind].label} test interface` : ''}.`
                    : 'Pick a program above — students filter the Mock Test page by program.'
                  : 'Only available inside courses that include it.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <RichEditor value={form.description} onChange={(html) => setForm(f => ({ ...f, description: html }))} placeholder="Describe this mock test..." mode="simple" minHeight={110} />
            </div>
            <div className="space-y-1.5">
              <Label>Instructions</Label>
              <RichEditor value={form.instructions} onChange={(html) => setForm(f => ({ ...f, instructions: html }))} placeholder="Shown to student before starting the exam" mode="full" minHeight={140} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={form.isPublished}
                onCheckedChange={v => setForm(f => ({ ...f, isPublished: !!v }))}
              />
              Published (visible to students)
            </label>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editMockTest ? 'Save Changes' : 'Create & Add Questions'}
              </Button>
            </div>
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
