'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { List, ListOrdered, Quote } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

export function ListGroup({ editor }: { editor: Editor }) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolbarButton>
    </>
  );
}
