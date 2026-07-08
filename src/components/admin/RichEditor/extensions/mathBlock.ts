'use client';

import React, { useRef } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';

// ---------------------------------------------------------------------------
// MathBlockView — React component rendered inside the editor for block math
// ---------------------------------------------------------------------------
function MathBlockView({ node, selected }: NodeViewProps) {
  const katexRef = useRef<HTMLDivElement>(null);
  const src = node.attrs.src as string;

  React.useEffect(() => {
    let cancelled = false;
    if (!katexRef.current || !src) return;

    import('katex').then(({ default: katex }) => {
      if (cancelled) return;
      import('katex/contrib/mhchem' as string).catch(() => undefined);
      try {
        katex.render(src, katexRef.current!, {
          throwOnError: false,
          displayMode: true,
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
    { className: `math-block-node${selected ? ' math-selected' : ''}` },
    React.createElement('div', { ref: katexRef, className: 'math-block-render' })
  );
}

// ---------------------------------------------------------------------------
// MathBlock Tiptap Node extension
// ---------------------------------------------------------------------------
export const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: el => el.getAttribute('data-math-src') ?? el.textContent ?? '',
        renderHTML: attrs => ({ 'data-math-src': attrs.src, 'data-type': 'math-block' }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="math-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'math-block-node' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathBlockView);
  },
});
