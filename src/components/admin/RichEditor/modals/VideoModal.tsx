'use client';

import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toEmbedUrl } from '../extensions/videoEmbed';

interface VideoModalProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

export function VideoModal({ editor, open, onClose }: VideoModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const embedUrl = url ? toEmbedUrl(url) : '';
  const isValid = !!(embedUrl && (embedUrl.includes('youtube.com/embed') || embedUrl.includes('vimeo.com/video') || embedUrl !== url));

  const handleInsert = () => {
    if (!embedUrl) { setError('Enter a valid YouTube or Vimeo URL'); return; }
    editor.chain().focus().insertContent({
      type: 'videoEmbed',
      attrs: { src: embedUrl, title: '' },
    }).run();
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setUrl(''); setError(''); onClose(); } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Embed Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>YouTube or Vimeo URL</Label>
            <Input
              autoFocus
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://youtu.be/... or https://vimeo.com/..."
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            />
            {error && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}
          </div>

          {/* Embed preview */}
          {isValid && (
            <div className="relative rounded-lg overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => { setUrl(''); setError(''); onClose(); }}>Cancel</Button>
            <Button size="sm" onClick={handleInsert} disabled={!url}>Embed</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
