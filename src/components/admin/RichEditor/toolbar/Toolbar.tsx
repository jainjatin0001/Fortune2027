'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HistoryGroup } from './groups/HistoryGroup';
import { TextStyleGroup } from './groups/TextStyleGroup';
import { HeadingGroup } from './groups/HeadingGroup';
import { ListGroup } from './groups/ListGroup';
import { AlignGroup } from './groups/AlignGroup';
import { InsertGroup } from './groups/InsertGroup';
import { MathGroup } from './groups/MathGroup';
import { CodeGroup } from './groups/CodeGroup';
import { ToolbarDivider } from './ToolbarDivider';
import type { EditorMode } from '../extensions';

interface ToolbarProps {
  editor: Editor;
  mode: EditorMode;
  onLinkClick: () => void;
  onImageClick: () => void;
  onVideoClick: () => void;
  onMathClick: (displayMode: boolean) => void;
}

export function Toolbar({ editor, mode, onLinkClick, onImageClick, onVideoClick, onMathClick }: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={400}>
      <div className="rich-editor-toolbar" role="toolbar" aria-label="Text formatting">
        <HistoryGroup editor={editor} />
        <ToolbarDivider />
        <TextStyleGroup editor={editor} />
        <ToolbarDivider />
        <HeadingGroup editor={editor} />
        <ToolbarDivider />
        <ListGroup editor={editor} />

        {mode !== 'minimal' && (
          <>
            <ToolbarDivider />
            <AlignGroup editor={editor} />
            <ToolbarDivider />
            <InsertGroup
              editor={editor}
              onLinkClick={onLinkClick}
              onImageClick={onImageClick}
              onVideoClick={onVideoClick}
            />
          </>
        )}

        {mode === 'full' && (
          <>
            <ToolbarDivider />
            <CodeGroup editor={editor} />
            <ToolbarDivider />
            <MathGroup editor={editor} onMathClick={onMathClick} />
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
