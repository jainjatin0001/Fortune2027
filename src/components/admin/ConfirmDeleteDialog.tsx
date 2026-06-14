'use client';

import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteDialog({
  open,
  title = 'Delete Record',
  description = 'This action cannot be undone. Are you sure you want to delete this record?',
  loading,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
            <span style={{ color: 'var(--color-foreground)' }}>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>
          {description}
        </p>

        <div
          className="flex justify-end gap-2 pt-4 mt-2 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant="destructive"
            className="gap-2"
          >
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Trash2 className="h-4 w-4" />}
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
