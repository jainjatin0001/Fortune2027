'use client';

import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TARGET_ROLES = ['STUDENT', 'INSTRUCTOR', 'PARENT', 'ADMIN', 'SUPER_ADMIN'];

export default function AdminNotificationsPage() {
  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [annTotal, setAnnTotal] = useState(0);
  const [annPage, setAnnPage] = useState(1);
  const [annModal, setAnnModal] = useState(false);
  const [editAnn, setEditAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({ title: '', content: '', targetRole: '', startDate: '', endDate: '' });
  const [annSaving, setAnnSaving] = useState(false);
  const [annFormError, setAnnFormError] = useState('');
  const [deleteAnn, setDeleteAnn] = useState<Announcement | null>(null);
  const [annDeleting, setAnnDeleting] = useState(false);

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(true);
  const [msgTotal, setMsgTotal] = useState(0);
  const [msgPage, setMsgPage] = useState(1);
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);

  const fetchAnnouncements = useCallback(async (p = annPage) => {
    setAnnLoading(true);
    try {
      const res = await fetch(`/api/admin/announcements?page=${p}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAnnouncements(data.announcements);
      setAnnTotal(data.total);
    } catch {
      toast('error', 'Failed to load announcements');
    } finally {
      setAnnLoading(false);
    }
  }, [annPage]);

  const fetchMessages = useCallback(async (p = msgPage) => {
    setMsgLoading(true);
    try {
      const res = await fetch(`/api/admin/contact-messages?page=${p}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMessages(data.messages);
      setMsgTotal(data.total);
    } catch {
      toast('error', 'Failed to load messages');
    } finally {
      setMsgLoading(false);
    }
  }, [msgPage]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);
  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const openAddAnn = () => { setEditAnn(null); setAnnForm({ title: '', content: '', targetRole: '', startDate: '', endDate: '' }); setAnnFormError(''); setAnnModal(true); };
  const openEditAnn = (a: Announcement) => {
    setEditAnn(a);
    setAnnForm({ title: a.title, content: a.content, targetRole: a.targetRole ?? '', startDate: a.startDate?.slice(0, 10) ?? '', endDate: a.endDate?.slice(0, 10) ?? '' });
    setAnnFormError('');
    setAnnModal(true);
  };

  const handleSaveAnn = async () => {
    setAnnFormError('');
    if (!annForm.title || !annForm.content) { setAnnFormError('Title and content are required.'); return; }
    setAnnSaving(true);
    try {
      const payload = {
        title: annForm.title,
        content: annForm.content,
        targetRole: annForm.targetRole || null,
        startDate: annForm.startDate || null,
        endDate: annForm.endDate || null,
      };
      const res = await fetch(
        editAnn ? `/api/admin/announcements/${editAnn.id}` : '/api/admin/announcements',
        { method: editAnn ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.error ?? 'Failed to save'); }
      toast('success', editAnn ? 'Announcement updated' : 'Announcement created');
      setAnnModal(false);
      fetchAnnouncements();
    } catch (e) {
      setAnnFormError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setAnnSaving(false);
    }
  };

  const handleDeleteAnn = async () => {
    if (!deleteAnn) return;
    setAnnDeleting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${deleteAnn.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Announcement deleted');
      setDeleteAnn(null);
      fetchAnnouncements();
    } catch {
      toast('error', 'Failed to delete');
    } finally {
      setAnnDeleting(false);
    }
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    try {
      await fetch(`/api/admin/contact-messages/${msg.id}`, { method: 'PATCH' });
      fetchMessages();
    } catch {
      toast('error', 'Failed to mark as read');
    }
  };

  const handleDeleteMsg = async (msg: ContactMessage) => {
    try {
      const res = await fetch(`/api/admin/contact-messages/${msg.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast('success', 'Message deleted');
      fetchMessages();
    } catch {
      toast('error', 'Failed to delete message');
    }
  };

  const annColumns: Column<Announcement>[] = [
    { key: 'title', label: 'Title', render: (a) => <div className="font-medium text-sm">{a.title}</div> },
    {
      key: 'targetRole', label: 'Target',
      render: (a) => <span className="text-xs">{a.targetRole ?? 'All roles'}</span>,
    },
    {
      key: 'isActive', label: 'Status',
      render: (a) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={a.isActive ? { background: '#dcfce7', color: '#16a34a' } : { background: '#f3f4f6', color: '#6b7280' }}>
          {a.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'dates', label: 'Schedule',
      render: (a) => (
        <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          {a.startDate ? new Date(a.startDate).toLocaleDateString() : '—'} → {a.endDate ? new Date(a.endDate).toLocaleDateString() : '∞'}
        </div>
      ),
    },
  ];

  const msgColumns: Column<ContactMessage>[] = [
    {
      key: 'from', label: 'From',
      render: (m) => (
        <div>
          <div className="text-sm font-medium">{m.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{m.email}</div>
        </div>
      ),
    },
    {
      key: 'subject', label: 'Subject',
      render: (m) => (
        <button onClick={() => setViewMsg(m)} className="text-sm text-left hover:underline" style={{ color: 'var(--color-primary)' }}>
          {m.subject}
        </button>
      ),
    },
    {
      key: 'isRead', label: 'Status',
      render: (m) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={m.isRead ? { background: '#f3f4f6', color: '#6b7280' } : { background: '#dbeafe', color: '#2563eb' }}>
          {m.isRead ? 'Read' : 'New'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Date', render: (m) => <span className="text-sm text-[var(--color-muted-foreground)]">{new Date(m.createdAt).toLocaleDateString()}</span> },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Notifications" description="Manage announcements and contact messages" />

      <Tabs defaultValue="announcements">
        <TabsList className="mb-6">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages ({msgTotal})</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={openAddAnn}>+ New Announcement</Button>
          </div>
          <AdminTable columns={annColumns} data={announcements} loading={annLoading} total={annTotal} page={annPage} onPageChange={(p) => { setAnnPage(p); fetchAnnouncements(p); }} onEdit={openEditAnn} onDelete={setDeleteAnn} />
        </TabsContent>

        <TabsContent value="messages">
          <AdminTable columns={msgColumns} data={messages} loading={msgLoading} total={msgTotal} page={msgPage} onPageChange={(p) => { setMsgPage(p); fetchMessages(p); }} onEdit={(m) => { setViewMsg(m); handleMarkRead(m); }} onDelete={handleDeleteMsg} />
        </TabsContent>
      </Tabs>

      {/* Announcement Modal */}
      <Dialog open={annModal} onOpenChange={(v) => !v && setAnnModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editAnn ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={annForm.title} onChange={(e) => setAnnForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea value={annForm.content} onChange={(e) => setAnnForm(f => ({ ...f, content: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Target Role (optional)</Label>
              <Select value={annForm.targetRole || 'all'} onValueChange={(v) => setAnnForm(f => ({ ...f, targetRole: v === 'all' ? '' : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {TARGET_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={annForm.startDate} onChange={(e) => setAnnForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={annForm.endDate} onChange={(e) => setAnnForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            {annFormError && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{annFormError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAnnModal(false)} disabled={annSaving}>Cancel</Button>
              <Button onClick={handleSaveAnn} disabled={annSaving}>{annSaving ? 'Saving...' : editAnn ? 'Save Changes' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Message Modal */}
      <Dialog open={!!viewMsg} onOpenChange={(v) => !v && setViewMsg(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewMsg?.subject}</DialogTitle>
          </DialogHeader>
          {viewMsg && (
            <div className="space-y-3">
              <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                From: <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>{viewMsg.name}</span> &lt;{viewMsg.email}&gt;
              </div>
              <div className="text-sm p-3 rounded-xl" style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)', whiteSpace: 'pre-wrap' }}>
                {viewMsg.message}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Received: {new Date(viewMsg.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteAnn}
        title="Delete Announcement"
        description={`Delete "${deleteAnn?.title}"?`}
        loading={annDeleting}
        onConfirm={handleDeleteAnn}
        onClose={() => setDeleteAnn(null)}
      />
    </div>
  );
}
