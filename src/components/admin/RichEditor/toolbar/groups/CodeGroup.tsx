'use client';

import React from 'react';
import type { Editor } from '@tiptap/core';
import { ToolbarButton } from '../ToolbarButton';

const LANGUAGES = ['', 'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'rust', 'go', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown'];

export function CodeGroup({ editor }: { editor: Editor }) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </ToolbarButton>

      {editor.isActive('codeBlock') && (
        <select
          className="toolbar-select"
          value={editor.getAttributes('codeBlock').language ?? ''}
          onChange={(e) =>
            editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value || null }).run()
          }
          title="Language"
        >
          <option value="">Auto</option>
          {LANGUAGES.slice(1).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
