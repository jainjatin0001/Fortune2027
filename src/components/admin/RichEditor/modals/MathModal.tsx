'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MathModalProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
  defaultDisplayMode?: boolean;
}

export function MathModal({ editor, open, onClose, defaultDisplayMode = false }: MathModalProps) {
  const [latex, setLatex] = useState('');
  const [displayMode, setDisplayMode] = useState(defaultDisplayMode);
  const [renderEl, setRenderEl] = useState<HTMLDivElement | null>(null);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync display mode when modal opens
  useEffect(() => {
    if (open) {
      setDisplayMode(defaultDisplayMode);
      setLatex('');
      setError('');
    }
  }, [open, defaultDisplayMode]);

  // Live KaTeX preview
  useEffect(() => {
    let cancelled = false;

    if (!renderEl || !latex) {
      if (renderEl) renderEl.innerHTML = '';
      setError('');
      return;
    }

    import('katex').then(({ default: katex }) => {
      if (cancelled) return;
      import('katex/contrib/mhchem' as string).catch(() => undefined);
      try {
        katex.render(latex, renderEl, {
          throwOnError: true,
          displayMode,
          output: 'html',
        });
        if (!cancelled) setError('');
      } catch (e) {
        if (!cancelled) {
          renderEl.innerHTML = '';
          setError(e instanceof Error ? e.message : 'Invalid LaTeX');
        }
      }
    }).catch(() => {
      if (!cancelled) {
        renderEl.innerHTML = '';
        setError('Unable to load math renderer');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [latex, displayMode, renderEl]);

  const handleInsert = () => {
    if (!latex.trim()) return;
    if (error) return;

    if (displayMode) {
      editor.chain().focus().insertContent({
        type: 'mathBlock',
        attrs: { src: latex.trim() },
      }).run();
    } else {
      editor.chain().focus().insertContent({
        type: 'mathInline',
        attrs: { src: latex.trim() },
      }).run();
    }
    setLatex('');
    onClose();
  };

  const examples = displayMode
    ? ['\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', '\\ce{H2O -> H2 + 1/2 O2}']
    : ['x^2 + y^2 = z^2', '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', '\\ce{CO2 + H2O}'];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert {displayMode ? 'Display' : 'Inline'} Math</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={displayMode}
              onCheckedChange={(v) => setDisplayMode(!!v)}
            />
            Display mode (centered block equation)
          </label>

          <div className="space-y-1.5">
            <Label>LaTeX Expression</Label>
            <textarea
              ref={textareaRef}
              autoFocus
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder={displayMode ? '\\int_0^1 f(x)\\,dx' : 'x^2 + y^2 = z^2'}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono resize-none outline-none focus:ring-2"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-background-alt)',
                fontFamily: 'var(--font-mono)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleInsert();
              }}
            />
          </div>

          {/* Examples */}
          <div className="space-y-1">
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Quick examples:</p>
            <div className="flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setLatex(ex)}
                  className="text-xs px-2 py-1 rounded border font-mono hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-muted)', color: 'var(--color-foreground)' }}
                >
                  {ex.slice(0, 24)}{ex.length > 24 ? '…' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="space-y-1.5">
            <Label>Preview</Label>
            <div
              className="rounded-lg border p-3 min-h-12 overflow-x-auto"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
            >
              {latex ? (
                error ? (
                  <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
                ) : (
                  <div ref={setRenderEl} />
                )
              ) : (
                <p className="text-xs italic" style={{ color: 'var(--color-muted-foreground)' }}>
                  Preview will appear here…
                </p>
              )}
            </div>
          </div>

          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            Supports KaTeX LaTeX syntax. Use <code>\ce{"{"}...{"}"}</code> for chemistry (mhchem).
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleInsert} disabled={!latex.trim() || !!error}>
              Insert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
