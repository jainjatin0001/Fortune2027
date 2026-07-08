'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { Undo2, Redo2 } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

export function HistoryGroup({ editor }: { editor: Editor }) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={15} />
      </ToolbarButton>
    </>
  );
}
