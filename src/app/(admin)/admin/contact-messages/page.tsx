'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt: string | null;
  createdAt: string;
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [unreadFilter, setUnreadFilter] = useState('');

  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  const [deleteMessage, setDeleteMessage] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async (p = page, unread = unreadFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (unread) params.set('unread', unread);
      const res = await fetch(`/api/admin/contact-messages?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMessages(data.messages);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [page, unreadFilter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleMarkRead = async (msg: ContactMessage) => {
    if (msg.isRead) return;
    setMarkingRead(true);
    try {
      const res = await fetch(`/api/admin/contact-messages/${msg.id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark as read');
      toast('success', 'Marked as read');
      setViewMessage(prev => prev ? { ...prev, isRead: true } : null);
      fetchMessages();
    } catch {
      toast('error', 'Failed to mark as read');
    } finally {
      setMarkingRead(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteMessage) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contact-messages/${deleteMessage.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast('success', 'Message deleted');
      setDeleteMessage(null);
      setViewMessage(null);
      fetchMessages();
    } catch {
      toast('error', 'Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const columns: Column<ContactMessage>[] = [
    {
      key: 'name',
      label: 'Sender',
      render: (m) => (
        <div className="flex items-center gap-2">
          {!m.isRead && (
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#3b82f6' }} title="Unread" />
          )}
          <div>
            <div className="font-medium text-sm">{m.name}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (m) => <span className="text-sm line-clamp-1">{m.subject}</span>,
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (m) => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={m.isRead ? { background: '#f3f4f6', color: '#6b7280' } : { background: '#dbeafe', color: '#1d4ed8' }}
        >
          {m.isRead ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (m) => <span className="text-sm">{formatDate(m.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader
        title="Contact Messages"
        description="Messages submitted via the contact form"
      />

      <AdminTable
        columns={columns}
        data={messages}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchMessages(p); }}
        onEdit={setViewMessage}
        onDelete={setDeleteMessage}
        searchPlaceholder="Search messages..."
        filterSlot={
          <Select
            value={unreadFilter || 'all'}
            onValueChange={(v) => {
              const val = v === 'all' ? '' : 'true';
              setUnreadFilter(val);
              setPage(1);
              fetchMessages(1, val);
            }}
          >
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="All messages" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All messages</SelectItem>
              <SelectItem value="unread">Unread only</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* View Message Modal */}
      <Dialog open={!!viewMessage} onOpenChange={(v) => !v && setViewMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium" style={{ color: 'var(--color-muted-foreground)' }}>From</span>
                  <p className="mt-0.5">{viewMessage.name}</p>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Email</span>
                  <p className="mt-0.5">
                    <a href={`mailto:${viewMessage.email}`} className="underline" style={{ color: 'var(--color-primary)' }}>
                      {viewMessage.email}
                    </a>
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Subject</span>
                  <p className="mt-0.5">{viewMessage.subject}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Received</span>
                  <p className="mt-0.5">{formatDate(viewMessage.createdAt)}</p>
                </div>
              </div>
              <div
                className="rounded-lg p-4 text-sm whitespace-pre-wrap"
                style={{ background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
              >
                {viewMessage.message}
              </div>
              <div className="flex justify-between gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setDeleteMessage(viewMessage)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setViewMessage(null)}>Close</Button>
                  {!viewMessage.isRead && (
                    <Button onClick={() => handleMarkRead(viewMessage)} disabled={markingRead}>
                      {markingRead ? 'Marking...' : 'Mark as Read'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteMessage}
        title="Delete Message"
        description={`Delete the message from "${deleteMessage?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteMessage(null)}
      />
    </div>
  );
}
