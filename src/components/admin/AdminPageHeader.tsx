'use client';

import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  addLabel?: string;
  onAdd?: () => void;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, addLabel = 'Add New', onAdd, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-heading-2" style={{ color: 'var(--color-foreground)' }}>{title}</h1>
        {description && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
