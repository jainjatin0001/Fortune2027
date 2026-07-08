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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichEditor from '@/components/admin/RichEditor';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  targetRole: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

const USER_ROLES = ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN', 'SUPER_ADMIN'];

const emptyForm = {
  title: '',
  content: '',
  targetRole: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      const res = await fetch(`/api/admin/announcements?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAnnouncements(data.announcements);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const openAdd = () => {
    setEditAnnouncement(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditAnnouncement(a);
    setForm({
      title: a.title,
      content: a.content,
      targetRole: a.targetRole ?? '',
      startDate: a.startDate ? a.startDate.slice(0, 10) : '',
      endDate: a.endDate ? a.endDate.slice(0, 10) : '',
      isActive: a.isActive,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.title || !form.content) { setFormError('Title and content are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        targetRole: form.targetRole || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        isActive: form.isActive,
      };

      let res: Response;
      if (editAnnouncement) {
        res = await fetch(`/api/admin/announcements/${editAnnouncement.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      toast('success', editAnnouncement ? 'Announcement updated' : 'Announcement created');
      setModalOpen(false);
      fetchAnnouncements();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAnnouncement) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${deleteAnnouncement.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Announcement deleted');
      setDeleteAnnouncement(null);
      fetchAnnouncements();
    } catch {
      toast('error', 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const columns: Column<Announcement>[] = [
    {
      key: 'title',
      label: 'Announcement',
      render: (a) => (
        <div>
          <div className="font-medium text-sm">{a.title}</div>
          <div className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{a.content}</div>
        </div>
      ),
    },
    {
      key: 'targetRole',
      label: 'Audience',
      render: (a) => (
        <span className="text-sm" style={{ color: a.targetRole ? 'inherit' : 'var(--color-muted-foreground)' }}>
          {a.targetRole ?? 'Everyone'}
        </span>
      ),
    },
    { key: 'startDate', label: 'Start', render: (a) => <span className="text-sm">{formatDate(a.startDate)}</span> },
    { key: 'endDate', label: 'End', render: (a) => <span className="text-sm">{formatDate(a.endDate)}</span> },
    {
      key: 'isActive',
      label: 'Status',
      render: (a) => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={a.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#fee2e2', color: '#dc2626' }}
        >
          {a.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Announcements"
        description="Create and manage platform-wide announcements for users"
        onAdd={openAdd}
      />

      <AdminTable
        columns={columns}
        data={announcements}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchAnnouncements(p); }}
        onEdit={openEdit}
        onDelete={setDeleteAnnouncement}
        searchPlaceholder="Search announcements..."
      />

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="System maintenance on Sunday" />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <RichEditor value={form.content} onChange={(html) => setForm(f => ({ ...f, content: html }))} placeholder="Announcement details..." mode="simple" minHeight={140} />
            </div>
            <div className="space-y-1.5">
              <Label>Target Audience</Label>
              <Select value={form.targetRole || 'all'} onValueChange={(v) => setForm(f => ({ ...f, targetRole: v === 'all' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Everyone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  {USER_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active (visible to users)</Label>
            </div>
            {formError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editAnnouncement ? 'Save Changes' : 'Create Announcement'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteAnnouncement}
        title="Delete Announcement"
        description={`Delete "${deleteAnnouncement?.title}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteAnnouncement(null)}
      />
    </div>
  );
}
