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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  author: { firstName: string; lastName: string };
  category: { name: string } | null;
}

const emptyForm = { title: '', slug: '', excerpt: '', content: '', isPublished: false, isFeatured: false };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async (p = page, s = search, pub = publishedFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      if (pub) params.set('published', pub);
      const res = await fetch(`/api/admin/blog?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [page, search, publishedFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openAdd = () => { setEditPost(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };

  const openEdit = (p: BlogPost) => {
    setEditPost(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', content: '', isPublished: p.isPublished, isFeatured: p.isFeatured });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title || !form.slug) { setFormError('Title and slug are required.'); return; }
    if (!editPost && !form.content) { setFormError('Content is required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editPost) {
        const payload: Record<string, unknown> = { title: form.title, excerpt: form.excerpt, isPublished: form.isPublished, isFeatured: form.isFeatured };
        if (form.content) payload.content = form.content;
        res = await fetch(`/api/admin/blog/${editPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editPost ? 'Post updated' : 'Post created');
      setModalOpen(false);
      fetchPosts();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePost) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${deletePost.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Post deleted');
      setDeletePost(null);
      fetchPosts();
    } catch {
      toast('error', 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      label: 'Post',
      render: (p) => (
        <div>
          <div className="font-medium text-sm">{p.title}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            {p.author.firstName} {p.author.lastName} · {p.category?.name ?? 'Uncategorized'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={p.isPublished ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fef3c7', color: '#d97706' }}>
          {p.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    { key: 'viewCount', label: 'Views', render: (p) => <span className="text-sm">{p.viewCount}</span> },
    { key: 'createdAt', label: 'Created', render: (p) => <span className="text-sm text-[var(--color-muted-foreground)]">{new Date(p.createdAt).toLocaleDateString()}</span> },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Blog Posts" description={`${total} posts`} onAdd={openAdd} addLabel="New Post" />

      <AdminTable
        columns={columns}
        data={posts}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchPosts(p); }}
        onEdit={openEdit}
        onDelete={setDeletePost}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchPosts(1, v, publishedFilter); }}
        searchPlaceholder="Search posts..."
        filterSlot={
          <Select value={publishedFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setPublishedFilter(val); setPage(1); fetchPosts(1, search, val); }}>
            <SelectTrigger className="h-9 w-32 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Drafts</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPost ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} disabled={!!editPost} />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>{editPost ? 'Content (leave blank to keep existing)' : 'Content *'}</Label>
              <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={6} placeholder="Write your post content here..." />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isPublished} onCheckedChange={(v) => setForm(f => ({ ...f, isPublished: !!v }))} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.isFeatured} onCheckedChange={(v) => setForm(f => ({ ...f, isFeatured: !!v }))} />
                Featured
              </label>
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editPost ? 'Save Changes' : 'Create Post'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletePost}
        title="Delete Post"
        description={`Delete "${deletePost?.title}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeletePost(null)}
      />
    </div>
  );
}
