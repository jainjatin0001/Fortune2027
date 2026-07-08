'use client';

import React, { useState, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditorUpload } from '../hooks/useEditorUpload';

interface ImageModalProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

export function ImageModal({ editor, open, onClose }: ImageModalProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadFile } = useEditorUpload();

  const reset = () => {
    setUrl(''); setAlt(''); setPreview(''); setTab('upload');
  };

  const handleInsert = () => {
    const src = url || preview;
    if (!src) return;
    editor.chain().focus().setImage({ src, alt }).run();
    reset();
    onClose();
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const uploaded = await uploadFile(file);
      setPreview(uploaded);
      setUrl(uploaded);
    } catch (e) {
      console.error('[ImageModal] Upload failed:', e);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        {/* Tab selector */}
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
          {(['upload', 'url'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{
                background: tab === t ? 'var(--color-primary)' : 'var(--color-card)',
                color: tab === t ? 'white' : 'var(--color-foreground)',
              }}
            >
              {t === 'upload' ? 'Upload File' : 'From URL'}
            </button>
          ))}
        </div>

        {tab === 'upload' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="mt-2 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-8 gap-2 transition-colors"
            style={{
              borderColor: dragOver ? 'var(--color-accent)' : 'var(--color-border)',
              background: dragOver ? 'var(--color-primary-light)' : 'var(--color-background-alt)',
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            {uploading ? (
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Uploading…</span>
            ) : preview ? (
              <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>PNG, JPG, WebP, GIF, SVG</p>
              </>
            )}
          </div>
        )}

        {tab === 'url' && (
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
            {url && (
              <img
                src={url}
                alt="Preview"
                className="max-h-32 rounded-lg object-contain mx-auto"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
        )}

        <div className="space-y-1.5 mt-1">
          <Label>Alt Text</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image…" />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button size="sm" onClick={handleInsert} disabled={(!url && !preview) || uploading}>
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
