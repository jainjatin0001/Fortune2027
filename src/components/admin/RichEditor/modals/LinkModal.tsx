'use client';

import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface LinkModalProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

export function LinkModal({ editor, open, onClose }: LinkModalProps) {
  const [href, setHref] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (open) {
      const attrs = editor.getAttributes('link');
      setHref(attrs.href ?? '');
      setOpenInNewTab(attrs.target === '_blank');
    }
  }, [open, editor]);

  const handleApply = () => {
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: href.trim(), target: openInNewTab ? '_blank' : null })
        .run();
    }
    onClose();
  };

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input
              autoFocus
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={openInNewTab}
              onCheckedChange={(v) => setOpenInNewTab(!!v)}
            />
            Open in new tab
          </label>
          <div className="flex justify-between gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={handleRemove}>
              Remove Link
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={handleApply}>Apply</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
