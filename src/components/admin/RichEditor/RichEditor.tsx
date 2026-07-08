'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getExtensions, type EditorMode } from './extensions';
import { Toolbar } from './toolbar/Toolbar';
import { LinkModal } from './modals/LinkModal';
import { ImageModal } from './modals/ImageModal';
import { VideoModal } from './modals/VideoModal';
import { MathModal } from './modals/MathModal';
import { sanitizeHtml } from './utils/sanitize';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  mode?: EditorMode;
  minHeight?: number;
  className?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder,
  mode = 'full',
  minHeight = 150,
  className = '',
}: RichEditorProps) {
  // Modal states
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [defaultMathDisplay, setDefaultMathDisplay] = useState(false);

  // Lazy-load KaTeX CSS on client side
  useEffect(() => {
    if (mode !== 'full') return;
    const linkId = 'katex-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, [mode]);

  const extensions = React.useMemo(() => getExtensions(mode, placeholder), [mode, placeholder]);

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Sanitizing before calling onChange to make sure only clean HTML is returned
      const clean = sanitizeHtml(html);
      // Only call onChange if it's actually different from the current editor HTML to avoid loop
      onChange(clean);
    },
  });

  // Keep editor content in sync with outer value if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={`rich-editor-container flex items-center justify-center ${className}`}
        style={{ minHeight }}
      >
        <span className="text-xs text-[var(--color-muted-foreground)]">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className={`rich-editor-container flex flex-col ${className}`}>
      <Toolbar
        editor={editor}
        mode={mode}
        onLinkClick={() => setLinkOpen(true)}
        onImageClick={() => setImageOpen(true)}
        onVideoClick={() => setVideoOpen(true)}
        onMathClick={(displayMode) => {
          setDefaultMathDisplay(displayMode);
          setMathOpen(true);
        }}
      />
      
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="rich-editor-content prose max-w-none focus:outline-none"
          style={{ minHeight }}
        />
      </div>

      {/* Character Count footer if characterCount extension is present */}
      {editor.storage.characterCount && (
        <div className="editor-char-count">
          {editor.storage.characterCount.words()} words | {editor.storage.characterCount.characters()} characters
        </div>
      )}

      {/* Modals */}
      <LinkModal
        editor={editor}
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
      />
      <ImageModal
        editor={editor}
        open={imageOpen}
        onClose={() => setImageOpen(false)}
      />
      <VideoModal
        editor={editor}
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
      />
      <MathModal
        editor={editor}
        open={mathOpen}
        onClose={() => setMathOpen(false)}
        defaultDisplayMode={defaultMathDisplay}
      />
    </div>
  );
}
