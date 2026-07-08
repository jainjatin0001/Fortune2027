'use client';

import React, { useCallback, useRef } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';

// ---------------------------------------------------------------------------
// MathInlineView — React component rendered inside the editor for inline math
// ---------------------------------------------------------------------------
function MathInlineView({ node, selected, updateAttributes }: NodeViewProps) {
  const katexRef = useRef<HTMLSpanElement>(null);
  const src = node.attrs.src as string;

  React.useEffect(() => {
    let cancelled = false;
    if (!katexRef.current || !src) return;

    // Dynamically import KaTeX to avoid SSR issues
    import('katex').then(({ default: katex }) => {
      if (cancelled) return;
      // Load mhchem for chemistry support
      import('katex/contrib/mhchem' as string).catch(() => undefined);
      try {
        katex.render(src, katexRef.current!, {
          throwOnError: false,
          displayMode: false,
          output: 'html',
        });
      } catch {
        if (!cancelled && katexRef.current) katexRef.current.textContent = src;
      }
    }).catch(() => {
      if (!cancelled && katexRef.current) katexRef.current.textContent = src;
    });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return React.createElement(
    NodeViewWrapper,
    { as: 'span', className: `math-inline-node${selected ? ' math-selected' : ''}` },
    React.createElement('span', { ref: katexRef, className: 'math-inline-render' })
  );
}

// ---------------------------------------------------------------------------
// MathInline Tiptap Node extension
// ---------------------------------------------------------------------------
export const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: el => el.getAttribute('data-math-src') ?? el.textContent ?? '',
        renderHTML: attrs => ({ 'data-math-src': attrs.src, 'data-type': 'math-inline' }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="math-inline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'math-inline-node' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathInlineView);
  },
});
