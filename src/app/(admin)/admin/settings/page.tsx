'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminToastContainer, toast } from '@/components/admin/AdminToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Globe, Shield, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast('success', 'Settings saved (coming soon)');
    }, 800);
  };

  const sections = [
    {
      icon: Globe,
      title: 'Platform Settings',
      color: '#7c3aed',
      fields: [
        { label: 'Platform Name', placeholder: 'Delta Tutors', name: 'platformName' },
        { label: 'Support Email', placeholder: 'info.deltatutors@gmail.com', name: 'supportEmail' },
        { label: 'Domain', placeholder: 'https://www.deltatutors.us', name: 'domain' },
      ],
    },
    {
      icon: Shield,
      title: 'Security Settings',
      color: '#dc2626',
      fields: [
        { label: 'Session Timeout (minutes)', placeholder: '60', name: 'sessionTimeout' },
        { label: 'Max Login Attempts', placeholder: '5', name: 'maxLoginAttempts' },
      ],
    },
    {
      icon: Bell,
      title: 'Notification Settings',
      color: '#d97706',
      fields: [
        { label: 'Admin Notification Email', placeholder: 'info.deltatutors@gmail.com', name: 'adminEmail' },
        { label: 'Webhook URL (optional)', placeholder: 'https://...', name: 'webhookUrl' },
      ],
    },
  ];

  return (
    <div>
      <AdminToastContainer />
      <AdminPageHeader title="Settings" description="Platform configuration" />

      <div className="space-y-6 max-w-2xl">
        {sections.map(({ icon: Icon, title, color, fields }) => (
          <div key={title} className="card-base p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
            </div>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label>{field.label}</Label>
                  <Input placeholder={field.placeholder} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="card-base p-6" style={{ borderColor: 'var(--color-danger)', border: '1px solid' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Database className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-sm" style={{ color: '#dc2626' }}>Danger Zone</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-muted)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Clear Demo Data</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Remove all seeded demo content</div>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50" disabled>Coming Soon</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-muted)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Export All Data</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Download a full database export</div>
              </div>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </div>
    </div>
  );
}
