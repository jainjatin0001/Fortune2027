'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { ToolbarButton } from '../ToolbarButton';

export function MathGroup({
  editor,
  onMathClick,
}: {
  editor: Editor;
  onMathClick: (displayMode: boolean) => void;
}) {
  return (
    <>
      <ToolbarButton
        onClick={() => onMathClick(false)}
        isActive={editor.isActive('mathInline')}
        title="Insert Inline Math (LaTeX)"
      >
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'serif' }}>∫ₓ</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onMathClick(true)}
        isActive={editor.isActive('mathBlock')}
        title="Insert Display Math (LaTeX)"
      >
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'serif' }}>Σ</span>
      </ToolbarButton>
    </>
  );
}
