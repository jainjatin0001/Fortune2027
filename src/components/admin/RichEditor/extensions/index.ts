import StarterKit from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { CharacterCount } from '@tiptap/extension-character-count';
import { createLowlight, common } from 'lowlight';

import { ImageUpload } from './imageUpload';
import { VideoEmbed } from './videoEmbed';
import { MathInline } from './mathInline';
import { MathBlock } from './mathBlock';
import { PasteHandler } from './pasteHandler';

export type EditorMode = 'full' | 'simple' | 'minimal';

const lowlight = createLowlight(common);

/**
 * Returns the Tiptap extension array for the given editor mode.
 *
 * - `full`    : All features (math, code blocks, tables, video, image upload)
 * - `simple`  : Prose features only (no math, no code blocks)
 * - `minimal` : Bold, italic, underline, links, and lists only
 */
export function getExtensions(mode: EditorMode = 'full', placeholder?: string) {
  const base = [
    StarterKit.configure({
      // Disable code block from StarterKit — we replace it with lowlight version
      codeBlock: false,
      // We provide our own history via starter kit
      history: {},
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', class: 'editor-link' },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: placeholder ?? 'Write something…',
    }),
    Highlight.configure({ multicolor: false }),
    CharacterCount,
    PasteHandler,
  ];

  if (mode === 'minimal') {
    return base;
  }

  // simple + full
  const simple = [
    ...base,
    Subscript,
    Superscript,
    Color,
    ImageUpload,
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
  ];

  if (mode === 'simple') {
    return simple;
  }

  // full only — adds math, code blocks with syntax highlighting, video embeds
  return [
    ...simple,
    CodeBlockLowlight.configure({ lowlight }),
    VideoEmbed,
    MathInline,
    MathBlock,
  ];
}
