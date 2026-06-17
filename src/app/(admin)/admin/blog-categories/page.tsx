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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: { posts: number };
}

const emptyForm = { name: '', slug: '' };

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteCategory, setDeleteCategory] = useState<BlogCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20', search: s });
      const res = await fetch(`/api/admin/blog-categories?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data.categories);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => {
    setEditCategory(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: BlogCategory) => {
    setEditCategory(c);
    setForm({ name: c.name, slug: c.slug });
    setFormError('');
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: editCategory ? f.slug : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.name || !form.slug) { setFormError('Name and slug are required.'); return; }
    setSaving(true);
    try {
      let res: Response;
      if (editCategory) {
        res = await fetch(`/api/admin/blog-categories/${editCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name }),
        });
      } else {
        res = await fetch('/api/admin/blog-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editCategory ? 'Category updated' : 'Category created');
      setModalOpen(false);
      fetchCategories();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog-categories/${deleteCategory.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Category deleted');
      setDeleteCategory(null);
      fetchCategories();
    } catch {
      toast('error', 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<BlogCategory>[] = [
    {
      key: 'name',
      label: 'Category',
      render: (c) => (
        <div>
          <div className="font-medium text-sm">{c.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{c.slug}</div>
        </div>
      ),
    },
    {
      key: 'posts',
      label: 'Posts',
      render: (c) => <span className="text-sm">{c._count.posts}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (c) => <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Blog Categories" description={`${total} categories`} onAdd={openAdd} addLabel="New Category" />

      <AdminTable
        columns={columns}
        data={categories}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchCategories(p); }}
        onEdit={openEdit}
        onDelete={setDeleteCategory}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); fetchCategories(1, v); }}
        searchPlaceholder="Search categories..."
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editCategory ? 'Edit Category' : 'New Blog Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Test Preparation" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="test-preparation" disabled={!!editCategory} />
              {!editCategory && <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Auto-generated from name. Cannot be changed after creation.</p>}
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editCategory ? 'Save Changes' : 'Create Category'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteCategory}
        title="Delete Category"
        description={`Delete "${deleteCategory?.name}"? Posts in this category will become uncategorized.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteCategory(null)}
      />
    </div>
  );
}
