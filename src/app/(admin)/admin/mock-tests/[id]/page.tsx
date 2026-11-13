'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ArrowUp, ArrowDown, Copy, Trash2, Plus, X, Clock, Calculator, Coffee, LayoutTemplate, Layers, Eye,
} from 'lucide-react';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichEditor, { htmlToText } from '@/components/admin/RichEditor';
import { QuestionBankPicker, diffColors, type BankQuestion } from '@/components/admin/QuestionBankPicker';
import { EXAM_PRESETS, targetQuestionsFor } from '@/lib/mock-test/presets';
import { EXAM_KIND_META, examKindOf } from '@/lib/mock-test/exam-kind';
import { MOCK_TESTS_PATH, mockTestPlayHref } from '@/lib/mock-test/paths';

interface Subject { id: string; name: string }

interface SectionQuestion {
  id: string; questionId: string; sortOrder: number; points: number;
  question: BankQuestion;
}

interface Section {
  id: string; name: string; shortName: string; sortOrder: number;
  timeLimit: number; hasCalculator: boolean; instructions: string | null;
  totalMarks: number; breakAfter: number;
  _count: { questions: number };
  questions: SectionQuestion[];
}

interface MockTestDetail {
  id: string; title: string; isPublished: boolean; isDemo: boolean;
  program: { id: string; name: string; slug: string } | null;
  sections: Section[];
  _count: { attempts: number };
}

interface SectionForm {
  name: string; shortName: string; minutes: string; breakMinutes: string;
  hasCalculator: boolean; instructions: string;
}

const toForm = (s: Section): SectionForm => ({
  name: s.name,
  shortName: s.shortName,
  minutes: String(Math.round(s.timeLimit / 60)),
  breakMinutes: s.breakAfter ? String(Math.round(s.breakAfter / 60)) : '',
  hasCalculator: s.hasCalculator,
  instructions: s.instructions ?? '',
});

// "Reading and Writing" → "RW"; falls back to S<n>
const deriveShortName = (name: string, n: number) =>
  name.split(/[^A-Za-z0-9]+/).filter(Boolean).filter(w => !/^(and|of|the|module|section)$/i.test(w))
    .map(w => (/^\d+$/.test(w) ? w : w[0].toUpperCase())).join('').slice(0, 6) || `S${n}`;

const json = (method: string, body?: unknown): RequestInit => ({
  method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body),
});

export default function MockTestBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<MockTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<SectionForm | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  // Only the first load shows the page loader; refreshes keep the builder mounted
  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTest(data.mockTest);
      return data.mockTest as MockTestDetail;
    } catch {
      toast('error', 'Failed to load mock test');
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const selectSection = (s: Section) => {
    setSelectedId(s.id);
    setForm(toForm(s));
    setShowDirections(false);
  };

  useEffect(() => {
    load().then(t => { if (t?.sections[0]) selectSection(t.sections[0]); });
    fetch('/api/admin/subjects?limit=100').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, [load]);

  const sections = useMemo(() => test?.sections ?? [], [test]);
  const selected = sections.find(s => s.id === selectedId) ?? null;
  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const totalMinutes = Math.round(sections.reduce((acc, s) => acc + s.timeLimit, 0) / 60);
  const examKind = examKindOf(test?.program);

  const formDirty = !!selected && !!form && JSON.stringify(form) !== JSON.stringify(toForm(selected));

  // ── Test-level toggles ────────────────────────────────────────────
  const patchTest = async (data: Partial<Pick<MockTestDetail, 'isPublished' | 'isDemo'>>) => {
    if (!test) return;
    setTest({ ...test, ...data });
    const res = await fetch(`/api/admin/mock-tests/${id}`, json('PATCH', data));
    if (!res.ok) { toast('error', 'Failed to update'); load(); return; }
    toast('success', 'Updated');
  };

  // ── Sections ──────────────────────────────────────────────────────
  const addBlankSection = async () => {
    const n = sections.length + 1;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}/sections`, json('POST', {
        name: `Section ${n}`, shortName: `S${n}`, timeLimit: '1800',
      }));
      if (!res.ok) throw new Error();
      const { section } = await res.json();
      const t = await load();
      const fresh = t?.sections.find(s => s.id === section.id);
      if (fresh) selectSection(fresh);
    } catch { toast('error', 'Failed to add section'); }
    finally { setBusy(false); }
  };

  const applyPreset = async (key: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}/sections`, json('POST', { preset: key }));
      if (!res.ok) throw new Error();
      const { added } = await res.json();
      toast('success', `Added ${added} sections`);
      const t = await load();
      const first = t?.sections[sections.length];
      if (first) selectSection(first);
    } catch { toast('error', 'Failed to apply template'); }
    finally { setBusy(false); }
  };

  const duplicateSection = async (s: Section) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}/sections`, json('POST', {
        name: `${s.name} (copy)`, shortName: s.shortName, timeLimit: String(s.timeLimit),
        hasCalculator: s.hasCalculator, instructions: s.instructions, breakAfter: String(s.breakAfter),
      }));
      if (!res.ok) throw new Error();
      const { section } = await res.json();
      // Place the copy right after the original
      const ids = sections.map(x => x.id);
      ids.splice(ids.indexOf(s.id) + 1, 0, section.id);
      await fetch(`/api/admin/mock-tests/${id}/sections`, json('PATCH', { order: ids.map((sid, i) => ({ id: sid, sortOrder: i })) }));
      const t = await load();
      const fresh = t?.sections.find(x => x.id === section.id);
      if (fresh) selectSection(fresh);
      toast('success', 'Section duplicated (without questions)');
    } catch { toast('error', 'Failed to duplicate'); }
    finally { setBusy(false); }
  };

  const moveSection = async (index: number, dir: -1 | 1) => {
    if (!test) return;
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setTest({ ...test, sections: next });
    const res = await fetch(`/api/admin/mock-tests/${id}/sections`, json('PATCH', {
      order: next.map((s, i) => ({ id: s.id, sortOrder: i })),
    }));
    if (!res.ok) { toast('error', 'Failed to reorder'); load(); }
  };

  const saveSection = async () => {
    if (!selected || !form) return;
    if (!form.name.trim()) { toast('error', 'Section name is required'); return; }
    const minutes = parseFloat(form.minutes);
    if (!minutes || minutes <= 0) { toast('error', 'Time must be more than 0 minutes'); return; }
    setSavingSection(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}/sections/${selected.id}`, json('PATCH', {
        name: form.name.trim(),
        shortName: form.shortName.trim() || deriveShortName(form.name, sections.indexOf(selected) + 1),
        timeLimit: String(Math.round(minutes * 60)),
        breakAfter: String(Math.round((parseFloat(form.breakMinutes) || 0) * 60)),
        hasCalculator: form.hasCalculator,
        instructions: form.instructions || null,
      }));
      if (!res.ok) throw new Error();
      const t = await load();
      const fresh = t?.sections.find(s => s.id === selected.id);
      if (fresh) setForm(toForm(fresh));
      toast('success', 'Section saved');
    } catch { toast('error', 'Failed to save section'); }
    finally { setSavingSection(false); }
  };

  const deleteSection = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}/sections/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      const t = await load();
      if (selectedId === deleteTarget.id) {
        const first = t?.sections[0];
        if (first) selectSection(first); else { setSelectedId(null); setForm(null); }
      }
      setDeleteTarget(null);
      toast('success', 'Section deleted');
    } catch { toast('error', 'Failed to delete section'); }
    finally { setBusy(false); }
  };

  // ── Questions in the selected section ─────────────────────────────
  const updateSelectedQuestions = (fn: (qs: SectionQuestion[]) => SectionQuestion[]) => {
    setTest(t => t && {
      ...t,
      sections: t.sections.map(s => {
        if (s.id !== selectedId) return s;
        const questions = fn(s.questions);
        return { ...s, questions, _count: { questions: questions.length } };
      }),
    });
  };

  const addQuestions = async (qs: BankQuestion[]) => {
    if (!selected) return;
    const res = await fetch(`/api/admin/mock-tests/${id}/sections/${selected.id}/questions`, json('POST', {
      questions: qs.map(q => ({ questionId: q.id })),
    }));
    if (!res.ok) { const e = await res.json().catch(() => ({})); toast('error', e.error ?? 'Failed to add'); return; }
    // Show them immediately, then sync real ids/sort order in the background
    updateSelectedQuestions(list => [
      ...list,
      ...qs.map((q, i) => ({ id: `pending-${q.id}`, questionId: q.id, sortOrder: list.length + i, points: 1, question: q })),
    ]);
    if (qs.length > 1) toast('success', `Added ${qs.length} questions`);
    load();
  };

  const removeQuestion = async (questionId: string) => {
    if (!selected) return;
    updateSelectedQuestions(list => list.filter(q => q.question.id !== questionId));
    const res = await fetch(`/api/admin/mock-tests/${id}/sections/${selected.id}/questions/${questionId}`, { method: 'DELETE' });
    if (!res.ok) { toast('error', 'Failed to remove question'); load(); }
  };

  const moveQuestion = async (index: number, dir: -1 | 1) => {
    if (!selected) return;
    const target = index + dir;
    if (target < 0 || target >= selected.questions.length) return;
    const next = [...selected.questions];
    [next[index], next[target]] = [next[target], next[index]];
    updateSelectedQuestions(() => next);
    const res = await fetch(`/api/admin/mock-tests/${id}/sections/${selected.id}/questions`, json('PATCH', {
      order: next.map((q, i) => ({ questionId: q.question.id, sortOrder: i })),
    }));
    if (!res.ok) { toast('error', 'Failed to reorder'); load(); }
  };

  if (loading) {
    return <p className="text-sm py-12 text-center" style={{ color: 'var(--color-muted-foreground)' }}>Loading…</p>;
  }
  if (!test) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Mock test not found.</p>
        <Link href="/admin/mock-tests" className="text-sm underline">Back to mock tests</Link>
      </div>
    );
  }

  const target = selected ? targetQuestionsFor(selected.shortName) : undefined;
  const assignedIds = new Set(selected?.questions.map(q => q.question.id) ?? []);

  return (
    <div className="space-y-5">
      <AdminToastContainer />

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
        <div className="min-w-0">
          <Link href="/admin/mock-tests" className="inline-flex items-center gap-1 text-xs mb-2 hover:underline" style={{ color: 'var(--color-muted-foreground)' }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Mock Tests
          </Link>
          <h1 className="text-xl font-bold truncate">{test.title}</h1>
          <p className="text-xs mt-1 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ color: 'var(--color-muted-foreground)' }}>
            <span>{test.program?.name ?? 'No program'}</span>
            <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{sections.length} sections</span>
            <span>{totalQuestions} questions</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{totalMinutes} min</span>
            <span>{test._count.attempts} attempts</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={test.isPublished} onCheckedChange={v => patchTest({ isPublished: !!v })} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={test.isDemo} onCheckedChange={v => patchTest({ isDemo: !!v })} />
            Free practice test
          </label>
          {test.isDemo && test.isPublished && test.program && (
            <Link
              href={mockTestPlayHref(test.id)}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Eye className="h-3.5 w-3.5" /> Open as student
            </Link>
          )}
        </div>
      </div>

      {test.isDemo && (
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={test.program
            ? { background: 'color-mix(in srgb, var(--color-primary) 8%, var(--color-card))', color: 'var(--color-foreground)' }
            : { background: '#fef3c7', color: '#92400e' }}
        >
          {test.program
            ? <>Free practice test — {test.isPublished ? 'listed' : 'will be listed once published'} on the student <Link href={MOCK_TESTS_PATH} className="font-semibold underline" target="_blank">Mock Test</Link> page under <strong>{test.program.name}</strong>
                {examKind ? <>, with the {EXAM_KIND_META[examKind].label} test interface and scaled scores.</> : '.'}</>
            : <>Marked as free practice, but it has no program, so students can&apos;t find it. Set the program from the Mock Tests list.</>}
        </div>
      )}

      <div className="grid lg:grid-cols-[340px_1fr] gap-5 items-start">
        {/* ── Sections column ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>Sections</p>
          </div>

          {sections.length === 0 && (
            <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
              <p className="text-sm font-semibold">Start from a template</p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Creates every section with the real exam&apos;s names, timing, calculator rules and breaks. You can change anything afterwards.
              </p>
              {EXAM_PRESETS.map(p => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  disabled={busy}
                  className="w-full text-left p-3 rounded-lg border transition-colors hover:bg-(--color-muted)"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="text-sm font-semibold flex items-center gap-2"><LayoutTemplate className="h-4 w-4" />{p.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{p.description}</div>
                </button>
              ))}
            </div>
          )}

          {sections.map((s, i) => {
            const active = s.id === selectedId;
            const goal = targetQuestionsFor(s.shortName);
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => selectSection(s)}
                onKeyDown={e => { if (e.key === 'Enter') selectSection(s); }}
                className="group p-3 rounded-xl border cursor-pointer transition-colors"
                style={{
                  borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                  background: active ? 'color-mix(in srgb, var(--color-primary) 6%, var(--color-card))' : 'var(--color-card)',
                  boxShadow: active ? '0 0 0 1px var(--color-primary)' : undefined,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--color-muted)' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold truncate">{s.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0" style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                        {s.shortName}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5 flex flex-wrap items-center gap-x-2" style={{ color: 'var(--color-muted-foreground)' }}>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{Math.round(s.timeLimit / 60)}m</span>
                      <span style={goal && s.questions.length < goal ? { color: '#d97706' } : undefined}>
                        {s.questions.length}{goal ? `/${goal}` : ''} Qs
                      </span>
                      {s.hasCalculator && <span className="flex items-center gap-0.5"><Calculator className="h-3 w-3" />Calc</span>}
                      {s.breakAfter > 0 && <span className="flex items-center gap-0.5"><Coffee className="h-3 w-3" />{Math.round(s.breakAfter / 60)}m break</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mt-2 -mb-1 opacity-60 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                  <IconBtn label="Move up" onClick={() => moveSection(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Move down" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Duplicate settings" onClick={() => duplicateSection(s)} disabled={busy}><Copy className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn label="Delete section" onClick={() => setDeleteTarget(s)} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                </div>
              </div>
            );
          })}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={addBlankSection} disabled={busy}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add section
            </Button>
            {sections.length > 0 && (
              <Select value="" onValueChange={applyPreset} disabled={busy}>
                <SelectTrigger className="h-8 w-auto text-xs"><SelectValue placeholder="Add template…" /></SelectTrigger>
                <SelectContent>
                  {EXAM_PRESETS.map(p => <SelectItem key={p.key} value={p.key}>{p.label} ({p.sections.length})</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* ── Selected section ── */}
        {selected && form ? (
          <div className="space-y-5 min-w-0">
            <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
              <div className="grid sm:grid-cols-[1fr_120px] gap-3">
                <div className="space-y-1.5">
                  <Label>Section name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Reading and Writing — Module 1" />
                </div>
                <div className="space-y-1.5">
                  <Label>Short name</Label>
                  <Input
                    value={form.shortName}
                    onChange={e => setForm({ ...form, shortName: e.target.value })}
                    placeholder={deriveShortName(form.name, sections.indexOf(selected) + 1)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label>Time (minutes)</Label>
                  <Input type="number" min="1" value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Break after (minutes)</Label>
                  <Input type="number" min="0" value={form.breakMinutes} onChange={e => setForm({ ...form, breakMinutes: e.target.value })} placeholder="None" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer h-9">
                  <Checkbox checked={form.hasCalculator} onCheckedChange={v => setForm({ ...form, hasCalculator: !!v })} />
                  Calculator allowed
                </label>
              </div>
              <div>
                <button className="text-xs font-semibold underline" onClick={() => setShowDirections(v => !v)}>
                  {showDirections ? 'Hide directions' : form.instructions ? 'Edit directions' : 'Add directions'}
                </button>
                {!showDirections && form.instructions && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-muted-foreground)' }}>{htmlToText(form.instructions, 200)}</p>
                )}
                {showDirections && (
                  <div className="mt-2">
                    <RichEditor value={form.instructions} onChange={html => setForm({ ...form, instructions: html })} placeholder="Shown to students when the section opens" mode="simple" minHeight={110} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveSection} disabled={!formDirty || savingSection}>
                  {savingSection ? 'Saving…' : 'Save section'}
                </Button>
                {formDirty && (
                  <Button size="sm" variant="ghost" onClick={() => setForm(toForm(selected))}>Discard</Button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border space-y-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                  In this section ({selected.questions.length}{target ? ` of ${target}` : ''})
                </p>
                {selected.questions.length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No questions yet — tick questions below and press “Add selected”.</p>
                ) : (
                  <div className="space-y-1.5 max-h-105 overflow-y-auto pr-1">
                    {selected.questions.map((sq, i) => (
                      <div key={sq.id} className="flex items-start gap-2 p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-background)' }}>
                        <span className="text-xs font-mono mt-0.5 w-6 text-right shrink-0" style={{ color: 'var(--color-muted-foreground)' }}>{i + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs line-clamp-2">{htmlToText(sq.question.statement, 200)}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs px-1.5 py-0.5 rounded" style={diffColors[sq.question.difficulty] ?? {}}>{sq.question.difficulty}</span>
                            <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{sq.question.subject?.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center shrink-0">
                          <IconBtn label="Move up" onClick={() => moveQuestion(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                          <IconBtn label="Move down" onClick={() => moveQuestion(i, 1)} disabled={i === selected.questions.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                          <IconBtn label="Remove" onClick={() => removeQuestion(sq.question.id)} danger><X className="h-3.5 w-3.5" /></IconBtn>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                  Add from Question Bank
                </p>
                <QuestionBankPicker
                  key={selected.id}
                  subjects={subjects}
                  assignedIds={assignedIds}
                  onAdd={q => addQuestions([q])}
                  onAddMany={addQuestions}
                  pageSize={25}
                  listClassName="max-h-96"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 rounded-xl border text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}>
            {sections.length === 0 ? 'Pick a template or add a section to get started.' : 'Select a section to edit it.'}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title="Delete Section"
        description={`Delete "${deleteTarget?.name}"? Its question links and any attempt data for this section will be removed.`}
        loading={busy}
        onConfirm={deleteSection}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function IconBtn({
  label, onClick, disabled, danger, children,
}: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded hover:bg-(--color-muted) disabled:opacity-30 disabled:pointer-events-none"
      style={{ color: danger ? 'var(--color-danger)' : 'var(--color-muted-foreground)' }}
    >
      {children}
    </button>
  );
}
