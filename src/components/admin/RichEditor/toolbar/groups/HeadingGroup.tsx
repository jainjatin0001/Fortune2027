'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { ToolbarButton } from '../ToolbarButton';

export function HeadingGroup({ editor }: { editor: Editor }) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        title="Paragraph"
      >
        <span style={{ fontSize: '11px', fontWeight: 600 }}>P</span>
      </ToolbarButton>
      {([1, 2, 3] as const).map((level) => (
        <ToolbarButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          isActive={editor.isActive('heading', { level })}
          title={`Heading ${level}`}
        >
          <span style={{ fontSize: '11px', fontWeight: 700 }}>H{level}</span>
        </ToolbarButton>
      ))}
    </>
  );
}
