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

interface LearningAsset {
  id: string;
  title: string;
  description: string | null;
  assetType: string;
  sortOrder: number;
  isFree: boolean;
  isPublished: boolean;
  videoUrl: string | null;
  videoDuration: number | null;
  videoProvider: string | null;
  pdfUrl: string | null;
  articleContent: string | null;
  quizId: string | null;
  questionSetId: string | null;
  mockTestId: string | null;
  createdAt: string;
  module: { title: string; course: { title: string } };
  quiz: { title: string } | null;
  questionSet: { title: string } | null;
  mockTest: { title: string } | null;
}

interface CourseModule {
  id: string;
  title: string;
  course: { title: string };
}

interface Quiz {
  id: string;
  title: string;
}

interface QuestionSet {
  id: string;
  title: string;
}

interface MockTestOption {
  id: string;
  title: string;
}

const ASSET_TYPES = ['VIDEO', 'PDF', 'ARTICLE', 'QUIZ', 'QUESTION_SET', 'MOCK_TEST'] as const;
type AssetType = typeof ASSET_TYPES[number];

const assetTypeColors: Record<string, { background: string; color: string }> = {
  VIDEO:        { background: '#dbeafe', color: '#1d4ed8' },
  PDF:          { background: '#fee2e2', color: '#dc2626' },
  ARTICLE:      { background: '#dcfce7', color: '#16a34a' },
  QUIZ:         { background: '#fef3c7', color: '#d97706' },
  QUESTION_SET: { background: '#ede9fe', color: '#7c3aed' },
  MOCK_TEST:    { background: '#fce7f3', color: '#9d174d' },
};

const emptyForm = {
  moduleId: '',
  title: '',
  description: '',
  assetType: 'VIDEO' as AssetType,
  sortOrder: '',
  isFree: false,
  isPublished: false,
  // VIDEO
  videoUrl: '',
  videoDuration: '',
  videoProvider: '',
  // PDF
  pdfUrl: '',
  // ARTICLE
  articleContent: '',
  // QUIZ
  quizId: '',
  // QUESTION_SET
  questionSetId: '',
  // MOCK_TEST
  mockTestId: '',
};

export default function AdminLearningAssetsPage() {
  const [assets, setAssets] = useState<LearningAsset[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [mockTests, setMockTests] = useState<MockTestOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<LearningAsset | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteAsset, setDeleteAsset] = useState<LearningAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAssets = useCallback(async (p = page, s = search, mod = moduleFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (mod) params.set('moduleId', mod);
      const res = await fetch(`/api/admin/learning-assets?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAssets(data.assets);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load learning assets');
    } finally {
      setLoading(false);
    }
  }, [page, search, moduleFilter]);

  useEffect(() => {
    fetchAssets();
    // Load modules with their course name for display
    fetch('/api/admin/modules?limit=200').then(r => r.json()).then(d => setModules(d.modules ?? []));
    fetch('/api/admin/quizzes?limit=200&published=true').then(r => r.json()).then(d => setQuizzes(d.quizzes ?? []));
    fetch('/api/admin/question-sets?limit=200&published=true').then(r => r.json()).then(d => setQuestionSets(d.questionSets ?? []));
    fetch('/api/admin/mock-tests?limit=200').then(r => r.json()).then(d => setMockTests(d.mockTests ?? []));
  }, [fetchAssets]);

  const openAdd = () => {
    setEditAsset(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (a: LearningAsset) => {
    setEditAsset(a);
    setForm({
      moduleId: a.module ? '' : '',
      title: a.title,
      description: a.description ?? '',
      assetType: a.assetType as AssetType,
      sortOrder: String(a.sortOrder),
      isFree: a.isFree,
      isPublished: a.isPublished,
      videoUrl: a.videoUrl ?? '',
      videoDuration: a.videoDuration ? String(a.videoDuration) : '',
      videoProvider: a.videoProvider ?? '',
      pdfUrl: a.pdfUrl ?? '',
      articleContent: a.articleContent ?? '',
      quizId: a.quizId ?? '',
      questionSetId: a.questionSetId ?? '',
      mockTestId: a.mockTestId ?? '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const buildPayload = () => {
    const base = {
      title: form.title,
      description: form.description || null,
      assetType: form.assetType,
      sortOrder: form.sortOrder !== '' ? parseInt(form.sortOrder) : undefined,
      isFree: form.isFree,
      isPublished: form.isPublished,
      videoUrl: null as string | null,
      videoDuration: null as number | null,
      videoProvider: null as string | null,
      pdfUrl: null as string | null,
      articleContent: null as string | null,
      quizId: null as string | null,
      questionSetId: null as string | null,
      mockTestId: null as string | null,
    };
    if (form.assetType === 'VIDEO') {
      base.videoUrl = form.videoUrl || null;
      base.videoDuration = form.videoDuration ? parseInt(form.videoDuration) : null;
      base.videoProvider = form.videoProvider || null;
    } else if (form.assetType === 'PDF') {
      base.pdfUrl = form.pdfUrl || null;
    } else if (form.assetType === 'ARTICLE') {
      base.articleContent = form.articleContent || null;
    } else if (form.assetType === 'QUIZ') {
      base.quizId = form.quizId || null;
    } else if (form.assetType === 'QUESTION_SET') {
      base.questionSetId = form.questionSetId || null;
    } else if (form.assetType === 'MOCK_TEST') {
      base.mockTestId = form.mockTestId || null;
    }
    return base;
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title) { setFormError('Title is required.'); return; }
    if (!editAsset && !form.moduleId) { setFormError('Module is required.'); return; }
    setSaving(true);
    try {
      const payload = buildPayload();
      let res: Response;
      if (editAsset) {
        res = await fetch(`/api/admin/learning-assets/${editAsset.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/learning-assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, moduleId: form.moduleId }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editAsset ? 'Asset updated' : 'Asset created');
      setModalOpen(false);
      fetchAssets();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAsset) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/learning-assets/${deleteAsset.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Asset deleted');
      setDeleteAsset(null);
      fetchAssets();
    } catch {
      toast('error', 'Failed to delete asset');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<LearningAsset>[] = [
    {
      key: 'title',
      label: 'Asset',
      render: (a) => (
        <div>
          <div className="font-medium text-sm">{a.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {a.module.course.title} › {a.module.title}
          </div>
        </div>
      ),
    },
    {
      key: 'assetType',
      label: 'Type',
      render: (a) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={assetTypeColors[a.assetType] ?? {}}>
          {a.assetType === 'QUESTION_SET' ? 'Q. SET' : a.assetType}
        </span>
      ),
    },
    {
      key: 'linked',
      label: 'Linked To',
      render: (a) => (
        <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          {a.quiz?.title ?? a.questionSet?.title ?? a.mockTest?.title ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit" style={a.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
            {a.isPublished ? 'Published' : 'Draft'}
          </span>
          {a.isFree && <span className="text-xs px-2 py-0.5 rounded-full w-fit" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Free</span>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Learning Assets" description={`${total} assets across all modules`} onAdd={openAdd} addLabel="New Asset" />

      <AdminTable
        columns={columns}
        data={assets}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchAssets(p); }}
        onEdit={openEdit}
        onDelete={setDeleteAsset}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchAssets(1, v, moduleFilter); }}
        searchPlaceholder="Search assets..."
        filterSlot={
          <Select value={moduleFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setModuleFilter(val); setPage(1); fetchAssets(1, search, val); }}>
            <SelectTrigger className="h-9 w-52 text-sm"><SelectValue placeholder="All modules" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.course.title} › {m.title}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editAsset ? 'Edit Asset' : 'New Learning Asset'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Module — only on create */}
            {!editAsset && (
              <div className="space-y-1.5">
                <Label>Module *</Label>
                <Select value={form.moduleId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, moduleId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a module</SelectItem>
                    {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.course.title} › {m.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {editAsset && (
              <div className="space-y-1.5">
                <Label>Module</Label>
                <Input value={`${editAsset.module.course.title} › ${editAsset.module.title}`} disabled />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to Algebra" />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Asset Type *</Label>
                <Select value={form.assetType} onValueChange={(v) => setForm(f => ({ ...f, assetType: v as AssetType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: e.target.value }))} placeholder="Auto" />
              </div>
            </div>

            {/* Type-specific fields */}
            {form.assetType === 'VIDEO' && (
              <div className="space-y-3 p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="space-y-1.5">
                  <Label>Video URL</Label>
                  <Input value={form.videoUrl} onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Duration (seconds)</Label>
                    <Input type="number" min="0" value={form.videoDuration} onChange={(e) => setForm(f => ({ ...f, videoDuration: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Provider</Label>
                    <Input value={form.videoProvider} onChange={(e) => setForm(f => ({ ...f, videoProvider: e.target.value }))} placeholder="youtube, vimeo..." />
                  </div>
                </div>
              </div>
            )}

            {form.assetType === 'PDF' && (
              <div className="space-y-1.5">
                <Label>PDF URL</Label>
                <Input value={form.pdfUrl} onChange={(e) => setForm(f => ({ ...f, pdfUrl: e.target.value }))} placeholder="https://..." />
              </div>
            )}

            {form.assetType === 'ARTICLE' && (
              <div className="space-y-1.5">
                <Label>Article Content</Label>
                <Textarea value={form.articleContent} onChange={(e) => setForm(f => ({ ...f, articleContent: e.target.value }))} rows={6} placeholder="Write article content or paste HTML/markdown..." />
              </div>
            )}

            {form.assetType === 'QUIZ' && (
              <div className="space-y-1.5">
                <Label>Link to Quiz</Label>
                <Select value={form.quizId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, quizId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select a quiz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {quizzes.map(q => <SelectItem key={q.id} value={q.id}>{q.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Only published quizzes are shown.</p>
              </div>
            )}

            {form.assetType === 'QUESTION_SET' && (
              <div className="space-y-1.5">
                <Label>Link to Question Set</Label>
                <Select value={form.questionSetId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, questionSetId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select a question set" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {questionSets.map(qs => <SelectItem key={qs.id} value={qs.id}>{qs.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Only published question sets are shown.</p>
              </div>
            )}

            {form.assetType === 'MOCK_TEST' && (
              <div className="space-y-1.5">
                <Label>Link to Mock Test</Label>
                <Select value={form.mockTestId || 'none'} onValueChange={(v) => setForm(f => ({ ...f, mockTestId: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select a mock test" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockTests.map(mt => <SelectItem key={mt.id} value={mt.id}>{mt.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Links this asset to a configured mock test.</p>
              </div>
            )}

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isFree} onCheckedChange={(v) => setForm(f => ({ ...f, isFree: !!v }))} />
                Free preview
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
                Published
              </label>
            </div>

            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editAsset ? 'Save Changes' : 'Create Asset'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteAsset}
        title="Delete Asset"
        description={`Delete "${deleteAsset?.title}"? Student progress for this asset will also be deleted.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteAsset(null)}
      />
    </div>
  );
}
