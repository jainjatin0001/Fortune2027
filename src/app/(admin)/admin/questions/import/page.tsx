'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, FileJson, FolderOpen, ImageIcon, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import RichEditor from '@/components/admin/RichEditor';
import { RichContent } from '@/components/shared/RichContent';
import {
  answerMismatch, hasFigure, localImageSources, optionLetter, parseImportFile, replaceImageSources, validationError,
  type ImportQuestion,
} from '@/lib/question-import';

interface NamedItem { id: string; name?: string; title?: string }

interface ReviewItem {
  key: string;
  index: number;
  q: ImportQuestion;
  rejected: boolean;
}

const DIFFICULTY = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const QUESTION_TYPES = ['SINGLE_CORRECT', 'MULTIPLE_CORRECT', 'NUMERIC', 'TEXT'];
const SOURCE_TYPES = ['MCQ', 'PYQ', 'PRACTICE', 'MOCK_TEST'];
const isTypedType = (t: string) => t === 'NUMERIC' || t === 'TEXT';
const splitList = (s: string) => s.split(',').map(a => a.trim()).filter(Boolean);
const baseName = (p: string) => p.split(/[\\/]/).pop() ?? p;
const hasText = (html: string) => /<(img|table)\b|data-type="math-/i.test(html) || html.replace(/<[^>]*>/g, '').trim() !== '';

const readDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

function flagsOf(q: ImportQuestion, figureFiles: ReadonlySet<string>) {
  const flags: { label: string; detail?: string; tone: 'danger' | 'warning' | 'info' }[] = [];
  const invalid = validationError(q, figureFiles);
  if (invalid) flags.push({ label: 'Validation error', detail: invalid, tone: 'danger' });
  const mismatch = answerMismatch(q);
  if (mismatch) flags.push({ label: 'Answer key check', detail: mismatch, tone: 'warning' });
  if (hasFigure(q)) flags.push({ label: 'Has figure', tone: 'info' });
  return flags;
}

const TONE: Record<string, { background: string; color: string }> = {
  danger: { background: '#fee2e2', color: '#dc2626' },
  warning: { background: '#fef3c7', color: '#b45309' },
  info: { background: '#dbeafe', color: '#1d4ed8' },
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-5 mb-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 text-white" style={{ background: 'var(--color-primary)' }}>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ImportQuestionsPage() {
  const [subjects, setSubjects] = useState<NamedItem[]>([]);
  const [topics, setTopics] = useState<NamedItem[]>([]);
  const [quizzes, setQuizzes] = useState<NamedItem[]>([]);
  const [questionSets, setQuestionSets] = useState<NamedItem[]>([]);
  const [batch, setBatch] = useState({
    subjectId: '',
    topicId: '',
    sourceType: 'MCQ',
    tags: '',
    points: 1,
    target: 'none' as 'none' | 'quiz' | 'set',
    targetId: '',
  });

  const [source, setSource] = useState('');
  const [items, setItems] = useState<ReviewItem[]>([]);
  // Page renders (object URLs, review only) and figures (uploaded by the API at save time)
  const [images, setImages] = useState<Map<string, string>>(new Map());
  const [figureFiles, setFigureFiles] = useState<Map<string, File>>(new Map());
  // data: URLs, because RichContent's sanitizer drops blob: sources
  const [figurePreviews, setFigurePreviews] = useState<Map<string, string>>(new Map());
  const [loadError, setLoadError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const [editKey, setEditKey] = useState<string | null>(null);
  const [form, setForm] = useState<ImportQuestion | null>(null);
  const [acceptedText, setAcceptedText] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [result, setResult] = useState<{ created: number; figuresUploaded: number; addedToQuiz: number; addedToQuestionSet: number } | null>(null);
  const figureNames = useMemo(() => new Set(figureFiles.keys()), [figureFiles]);

  useEffect(() => {
    fetch('/api/admin/subjects?limit=50').then(r => r.json()).then(d => setSubjects(d.subjects ?? []));
  }, []);

  useEffect(() => {
    if (!batch.subjectId) return;
    const subject = `subjectId=${batch.subjectId}`;
    fetch(`/api/admin/topics?${subject}&limit=100`).then(r => r.json()).then(d => setTopics(d.topics ?? []));
    fetch(`/api/admin/quizzes?${subject}&limit=50`).then(r => r.json()).then(d => setQuizzes(d.quizzes ?? []));
    fetch(`/api/admin/question-sets?${subject}&limit=50`).then(r => r.json()).then(d => setQuestionSets(d.questionSets ?? []));
  }, [batch.subjectId]);

  // Release page-image object URLs when they are replaced or the page unmounts
  useEffect(() => () => images.forEach(url => URL.revokeObjectURL(url)), [images]);

  const handleFiles = async (fileList: FileList | null) => {
    setLoadError('');
    setResult(null);
    const files = [...(fileList ?? [])];
    const jsonFiles = files.filter(f => f.name.toLowerCase().endsWith('.json'));
    if (jsonFiles.length !== 1) {
      setLoadError(jsonFiles.length ? 'Pick a folder (or files) with exactly one .json batch file.' : 'Select the batch .json file (and its images).');
      return;
    }
    const jsonFile = jsonFiles[0];
    try {
      const parsed = parseImportFile(await jsonFile.text());
      const imageFiles = new Map(files.filter(f => f.type.startsWith('image/')).map(f => [f.name, f]));

      // Figures stay local until Save — the import API uploads them only if the batch is saved.
      // Matching is by file name: <img src="fig-p2.png"> ↔ the picked fig-p2.png.
      const referenced = new Set(parsed.questions.flatMap(localImageSources));
      const figures = new Map([...imageFiles].filter(([name]) => referenced.has(name)));
      const previews = new Map(await Promise.all(
        [...figures].map(async ([name, f]) => [name, await readDataUrl(f)] as const),
      ));

      const imgMap = new Map<string, string>();
      imageFiles.forEach((f, name) => { if (!figures.has(name)) imgMap.set(name, URL.createObjectURL(f)); });
      // Flagged first (by severity), otherwise file order. Order is fixed at load so cards don't jump while editing.
      const available = new Set(figures.keys());
      const rank = (q: ImportQuestion) => {
        const tones = flagsOf(q, available).map(f => f.tone);
        return tones.includes('danger') ? 0 : tones.includes('warning') ? 1 : tones.includes('info') ? 2 : 3;
      };
      const loaded = parsed.questions
        .map((q, index) => ({ key: `${index}-${q.externalId ?? ''}`, index, q, rejected: false }))
        .sort((a, b) => rank(a.q) - rank(b.q) || a.index - b.index);
      setSource(parsed.source ?? jsonFile.name);
      setImages(imgMap);
      setFigureFiles(figures);
      setFigurePreviews(previews);
      setItems(loaded);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not read the JSON file');
    }
  };

  const pageImageUrls = (q: ImportQuestion) => {
    const refs = Array.isArray(q.pageImage) ? q.pageImage : q.pageImage ? [q.pageImage] : [];
    return refs.map(ref => ({ ref, url: /^https?:\/\//.test(ref) ? ref : images.get(baseName(ref)) }));
  };

  const approved = items.filter(i => !i.rejected);
  const invalidApproved = approved.filter(i => validationError(i.q, figureNames));
  const flaggedCount = items.filter(i => flagsOf(i.q, figureNames).some(f => f.tone !== 'info')).length;

  const openEdit = (item: ReviewItem) => {
    setEditKey(item.key);
    setForm(structuredClone(item.q));
    setAcceptedText(item.q.acceptedAnswers.join(', '));
  };

  const saveEdit = () => {
    if (!form || !editKey) return;
    const typed = isTypedType(form.questionType);
    const q: ImportQuestion = {
      ...form,
      options: typed ? [] : form.options.filter(o => hasText(o.content)),
      acceptedAnswers: typed ? splitList(acceptedText) : [],
    };
    setItems(list => list.map(i => (i.key === editKey ? { ...i, q } : i)));
    setEditKey(null);
  };

  const setOption = (i: number, patch: Partial<{ content: string; isCorrect: boolean }>) => {
    setForm(f => {
      if (!f) return f;
      const opts = patch.isCorrect && f.questionType === 'SINGLE_CORRECT'
        ? f.options.map(o => ({ ...o, isCorrect: false }))
        : [...f.options];
      opts[i] = { ...opts[i], ...patch };
      return { ...f, options: opts };
    });
  };

  const handleSave = async () => {
    setSaveError('');
    if (!batch.subjectId) { setSaveError('Choose a subject in step 1.'); return; }
    if (batch.target !== 'none' && !batch.targetId) { setSaveError(`Choose the ${batch.target === 'quiz' ? 'quiz' : 'question set'} or set "Add to" to none.`); return; }
    if (invalidApproved.length) { setSaveError(`${invalidApproved.length} approved question(s) have validation errors — edit or reject them.`); return; }

    setSaving(true);
    try {
      const ordered = [...approved].sort((a, b) => a.index - b.index);
      const body = new FormData();
      // Only the figures used by approved questions are sent (and uploaded)
      new Set(ordered.flatMap(({ q }) => localImageSources(q))).forEach(name => {
        const file = figureFiles.get(name);
        if (file) body.append('figure', file, name);
      });
      body.append('payload', JSON.stringify({
        subjectId: batch.subjectId,
        topicId: batch.topicId || undefined,
        sourceType: batch.sourceType,
        tags: splitList(batch.tags),
        points: batch.points,
        quizId: batch.target === 'quiz' ? batch.targetId : undefined,
        questionSetId: batch.target === 'set' ? batch.targetId : undefined,
        questions: ordered.map(({ q }) => ({
          statement: q.statement,
          explanation: q.explanation,
          difficulty: q.difficulty,
          questionType: q.questionType,
          options: isTypedType(q.questionType) ? [] : q.options.filter(o => hasText(o.content)),
          acceptedAnswers: isTypedType(q.questionType) ? q.acceptedAnswers : [],
          skill: q.skill,
        })),
      }));
      const res = await fetch('/api/admin/questions/import', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.errors?.map((e: { index: number; error: string }) => `#${ordered[e.index].index + 1}: ${e.error}`).join('; ');
        throw new Error(detail ? `${data.error}: ${detail}` : data.error ?? 'Import failed');
      }
      setResult(data);
      setItems([]);
      setFigureFiles(new Map());
      setFigurePreviews(new Map());
      toast('success', `Imported ${data.created} questions`);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setSaving(false);
    }
  };

  const targets = batch.target === 'quiz' ? quizzes : questionSets;
  const editingItem = useMemo(() => items.find(i => i.key === editKey), [items, editKey]);

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Import Questions"
        description="Review questions extracted from a PDF and save them to the question bank"
        actions={
          <Link href="/admin/questions" className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            <ArrowLeft className="h-4 w-4" /> Questions
          </Link>
        }
      />

      <Step n={1} title="Batch details (applied to every question)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Subject *</Label>
            <Select value={batch.subjectId || 'none'} onValueChange={(v) => setBatch(b => ({ ...b, subjectId: v === 'none' ? '' : v, topicId: '', targetId: '' }))}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select subject</SelectItem>
                {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Select value={batch.topicId || 'none'} disabled={!batch.subjectId} onValueChange={(v) => setBatch(b => ({ ...b, topicId: v === 'none' ? '' : v }))}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Source Type</Label>
            <Select value={batch.sourceType} onValueChange={(v) => setBatch(b => ({ ...b, sourceType: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tags (comma separated)</Label>
            <Input value={batch.tags} onChange={(e) => setBatch(b => ({ ...b, tags: e.target.value }))} placeholder="sat, algebra" />
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Each question&apos;s Skill is added as a tag too.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Points</Label>
            <Input type="number" min="1" value={batch.points} onChange={(e) => setBatch(b => ({ ...b, points: parseInt(e.target.value) || 1 }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Add to</Label>
            <div className="flex gap-2">
              <Select value={batch.target} disabled={!batch.subjectId} onValueChange={(v) => setBatch(b => ({ ...b, target: v as typeof b.target, targetId: '' }))}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nothing</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="set">Question set</SelectItem>
                </SelectContent>
              </Select>
              {batch.target !== 'none' && (
                <Select value={batch.targetId || 'none'} onValueChange={(v) => setBatch(b => ({ ...b, targetId: v === 'none' ? '' : v }))}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select…</SelectItem>
                    {targets.map(t => <SelectItem key={t.id} value={t.id}>{t.title ?? t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </Step>

      <Step n={2} title="Load the batch JSON">
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".json,application/json,image/*"
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        <input
          ref={folderInput}
          type="file"
          multiple
          className="hidden"
          // Non-standard attribute (all major browsers): pick a whole folder
          {...{ webkitdirectory: '' }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => folderInput.current?.click()} className="gap-2">
            <FolderOpen className="h-4 w-4" /> Choose batch folder
          </Button>
          <Button variant="outline" onClick={() => fileInput.current?.click()} className="gap-2">
            <FileJson className="h-4 w-4" /> Choose files
          </Button>
          {items.length > 0 && (
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              {source} · {items.length} questions · {images.size} page images · {figureFiles.size} figures · {flaggedCount} flagged
            </span>
          )}
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--color-muted-foreground)' }}>
          Pick the batch folder (or multi-select the .json with its page-*.png and fig-*.png). Images are matched to
          questions by file name. Figures are uploaded to storage only when you save.
        </p>
        {loadError && <p className="text-sm mt-2" style={{ color: 'var(--color-danger)' }}>{loadError}</p>}
        {result && (
          <p className="text-sm mt-3 font-medium" style={{ color: 'var(--color-success, #16a34a)' }}>
            Saved {result.created} questions
            {result.figuresUploaded ? ` · uploaded ${result.figuresUploaded} figure(s)` : ''}
            {result.addedToQuiz ? ` · added ${result.addedToQuiz} to the quiz` : ''}
            {result.addedToQuestionSet ? ` · added ${result.addedToQuestionSet} to the question set` : ''}.
          </p>
        )}
      </Step>

      {items.length > 0 && (
        <Step n={3} title={`Review (${approved.length} approved, ${items.length - approved.length} rejected)`}>
          <div className="space-y-4">
            {items.map((item) => {
              const { q } = item;
              const flags = flagsOf(q, figureNames);
              // Local figure names → data: URLs, for display only
              const view = replaceImageSources(q, figurePreviews);
              const typed = isTypedType(q.questionType);
              const pages = pageImageUrls(q);
              return (
                <article
                  key={item.key}
                  className="rounded-xl border"
                  style={{ borderColor: 'var(--color-border)', opacity: item.rejected ? 0.5 : 1 }}
                >
                  <header className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-sm font-semibold">#{item.index + 1}</span>
                    {q.externalId && <code className="text-xs">{q.externalId}</code>}
                    {q.page !== undefined && <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>p.{q.page}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)]">{q.difficulty}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)]">{q.questionType}</span>
                    {q.skill && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)]">{q.skill}</span>}
                    {flags.map(f => (
                      <span key={f.label} className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={TONE[f.tone]} title={f.detail}>
                        {f.tone === 'info' ? <ImageIcon className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {f.label}{f.detail ? `: ${f.detail}` : ''}
                      </span>
                    ))}
                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => openEdit(item)} disabled={item.rejected}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        onClick={() => setItems(list => list.map(i => (i.key === item.key ? { ...i, rejected: !i.rejected } : i)))}
                      >
                        {item.rejected ? <><RotateCcw className="h-3.5 w-3.5" /> Restore</> : <><X className="h-3.5 w-3.5" /> Reject</>}
                      </Button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-3 border-b lg:border-b-0 lg:border-r max-h-[640px] overflow-y-auto space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                      {pages.length === 0 && <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No page image</p>}
                      {pages.map(({ ref, url }) => url ? (
                        <a key={ref} href={url} target="_blank" rel="noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Source ${baseName(ref)}`} className="w-full rounded border" style={{ borderColor: 'var(--color-border)' }} />
                        </a>
                      ) : (
                        <p key={ref} className="text-xs" style={{ color: 'var(--color-warning, #b45309)' }}>{baseName(ref)} was not selected with the JSON</p>
                      ))}
                    </div>

                    <div className="p-4 space-y-4 min-w-0">
                      <RichContent html={view.statement} className="text-sm" />
                      {typed ? (
                        <div className="text-sm">
                          <span className="font-semibold">Accepted answers: </span>
                          {q.acceptedAnswers.map(a => <code key={a} className="mr-2 px-1.5 py-0.5 rounded bg-[var(--color-muted)]">{a}</code>)}
                        </div>
                      ) : (
                        <ol className="space-y-1.5">
                          {q.options.map((o, i) => (
                            <li
                              key={i}
                              className="flex gap-2 items-start rounded-lg border px-3 py-2 text-sm"
                              style={o.isCorrect ? { borderColor: '#16a34a', background: '#f0fdf4' } : { borderColor: 'var(--color-border)' }}
                            >
                              <span className="font-semibold shrink-0">{optionLetter(i)}.</span>
                              <RichContent html={view.options[i].content} className="flex-1 min-w-0" />
                              {o.isCorrect && <Check className="h-4 w-4 shrink-0" style={{ color: '#16a34a' }} />}
                            </li>
                          ))}
                        </ol>
                      )}
                      {q.pdfCorrectAnswer && (
                        <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>PDF correct answer: {q.pdfCorrectAnswer}</p>
                      )}
                      {q.explanation && (
                        <details className="text-sm">
                          <summary className="cursor-pointer font-semibold">Explanation</summary>
                          <RichContent html={view.explanation} className="mt-2" />
                        </details>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Step>
      )}

      {items.length > 0 && (
        <Step n={4} title="Save">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleSave} disabled={saving || approved.length === 0}>
              {saving ? 'Saving…' : `Save ${approved.length} approved`}
            </Button>
            {invalidApproved.length > 0 && (
              <span className="text-sm" style={{ color: 'var(--color-danger)' }}>
                {invalidApproved.length} approved question(s) have validation errors.
              </span>
            )}
          </div>
          {saveError && <p className="text-sm mt-2" style={{ color: 'var(--color-danger)' }}>{saveError}</p>}
        </Step>
      )}

      <Dialog open={!!editKey} onOpenChange={(v) => !v && setEditKey(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit question #{editingItem ? editingItem.index + 1 : ''}</DialogTitle>
          </DialogHeader>
          {form && (
            <div className="space-y-4" key={editKey}>
              <div className="space-y-1.5">
                <Label>Question Statement *</Label>
                <RichEditor value={form.statement} onChange={(html) => setForm(f => f && ({ ...f, statement: html }))} mode="full" minHeight={140} />
                {localImageSources(form).length > 0 && (
                  <div className="flex flex-wrap items-start gap-3 pt-1">
                    {localImageSources(form).map(name => (
                      <figure key={name} className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={figurePreviews.get(name)} alt={name} className="h-24 w-auto rounded border" style={{ borderColor: 'var(--color-border)' }} />
                        <figcaption>{name} — uploaded on save; keep its image in the editor</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setForm(f => f && ({ ...f, difficulty: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DIFFICULTY.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Question Type</Label>
                  <Select value={form.questionType} onValueChange={(v) => setForm(f => f && ({ ...f, questionType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{QUESTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {isTypedType(form.questionType) ? (
                <div className="space-y-1.5">
                  <Label>Accepted Answers *</Label>
                  <Input value={acceptedText} onChange={(e) => setAcceptedText(e.target.value)} placeholder={form.questionType === 'NUMERIC' ? '3/17, .1764, .1765' : 'photosynthesis'} />
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {form.questionType === 'NUMERIC'
                      ? 'Comma separated. Compared by value (6/34 matches 3/17); decimals are not rounded, so list every acceptable decimal form.'
                      : 'Comma separated. Matching ignores case and extra spaces.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Answer Options *</Label>
                    <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setForm(f => f && ({ ...f, options: [...f.options, { content: '', isCorrect: false }] }))}>
                      <Plus className="h-3 w-3" /> Add Option
                    </Button>
                  </div>
                  {form.options.map((opt, i) => (
                    <div key={i} className="rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Checkbox checked={opt.isCorrect} onCheckedChange={(v) => setOption(i, { isCorrect: !!v })} title="Mark as correct" />
                          Option {optionLetter(i)} correct
                        </div>
                        {form.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => f && ({ ...f, options: f.options.filter((_, j) => j !== i) }))}
                            className="cursor-pointer p-1 rounded-lg transition-colors hover:opacity-70"
                            style={{ color: 'var(--color-danger)' }}
                            aria-label={`Remove option ${optionLetter(i)}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <RichEditor value={opt.content} onChange={(html) => setOption(i, { content: html })} placeholder={`Option ${optionLetter(i)}`} mode="full" minHeight={80} />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Explanation</Label>
                <RichEditor value={form.explanation ?? ''} onChange={(html) => setForm(f => f && ({ ...f, explanation: html }))} mode="full" minHeight={110} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditKey(null)}>Cancel</Button>
                <Button onClick={saveEdit}>Apply changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
