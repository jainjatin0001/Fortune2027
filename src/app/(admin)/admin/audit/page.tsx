'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string } | null;
}

const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH', 'UNPUBLISH'];

const actionColor: Record<string, { background: string; color: string }> = {
  CREATE: { background: '#dcfce7', color: '#16a34a' },
  UPDATE: { background: '#dbeafe', color: '#2563eb' },
  DELETE: { background: '#fee2e2', color: '#dc2626' },
  PUBLISH: { background: '#fef3c7', color: '#d97706' },
  UNPUBLISH: { background: '#f3f4f6', color: '#6b7280' },
  LOGIN: { background: '#ede9fe', color: '#7c3aed' },
  LOGOUT: { background: '#f3f4f6', color: '#6b7280' },
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async (p = page, action = actionFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (action) params.set('action', action);
      const res = await fetch(`/api/admin/audit?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
    } catch {
      toast('error', 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const columns: Column<AuditLog>[] = [
    {
      key: 'user',
      label: 'User',
      render: (l) => l.user ? (
        <div>
          <div className="text-sm font-medium">{l.user.firstName} {l.user.lastName}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{l.user.email}</div>
        </div>
      ) : <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>System</span>,
    },
    {
      key: 'action',
      label: 'Action',
      render: (l) => {
        const s = actionColor[l.action] ?? { background: '#f3f4f6', color: '#6b7280' };
        return <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={s}>{l.action}</span>;
      },
    },
    {
      key: 'resource',
      label: 'Resource',
      render: (l) => (
        <div>
          <div className="text-sm font-medium">{l.resource}</div>
          {l.resourceId && <div className="text-xs font-mono" style={{ color: 'var(--color-muted-foreground)' }}>{l.resourceId.slice(0, 8)}...</div>}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP',
      render: (l) => <span className="text-xs font-mono">{l.ipAddress ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Timestamp',
      render: (l) => (
        <div>
          <div className="text-sm">{new Date(l.createdAt).toLocaleDateString()}</div>
          <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{new Date(l.createdAt).toLocaleTimeString()}</div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Audit Logs" description={`${total} log entries`} />

      <AdminTable
        columns={columns}
        data={logs}
        loading={loading}
        total={total}
        page={page}
        onPageChange={(p) => { setPage(p); fetchLogs(p); }}
        filterSlot={
          <Select value={actionFilter || 'all'} onValueChange={(v) => { const val = v === 'all' ? '' : v; setActionFilter(val); setPage(1); fetchLogs(1, val); }}>
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue placeholder="All actions" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {ACTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
