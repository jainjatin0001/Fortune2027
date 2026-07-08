'use client';

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/core';

const pasteHandlerKey = new PluginKey('pasteHandler');

/**
 * Strips Microsoft Word / Google Docs wrapper markup from pasted HTML while
 * preserving semantic formatting (headings, bold, italic, lists, tables).
 */
function cleanWordHtml(html: string): string {
  return html
    // Remove conditional comments
    .replace(/<!--\[if[\s\S]*?endif\]-->/gi, '')
    // Strip XML namespace declarations
    .replace(/<\/?[a-z]+:[a-z]+[^>]*>/gi, '')
    // Remove Office-specific style attributes but keep the element
    .replace(/\s?mso-[^;'"]+;?/gi, '')
    // Remove font-size and font-family from inline styles (let editor CSS handle it)
    .replace(/font-family:[^;'"]+;?/gi, '')
    .replace(/font-size:[^;'"]+;?/gi, '')
    // Remove empty style attributes
    .replace(/\sstyle="[^"]*"/gi, (match) => {
      const cleaned = match.replace(/style="([^"]*)"/i, (_, styles) => {
        const kept = styles
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s && !/^(mso|font-family|font-size|margin|padding|color|background)/i.test(s))
          .join('; ');
        return kept ? `style="${kept}"` : '';
      });
      return cleaned;
    })
    // Remove <o:p> and other Office tags
    .replace(/<\/?o:[^>]+>/gi, '')
    // Remove <w:> elements
    .replace(/<\/?w:[^>]+>/gi, '')
    // Normalize Google Docs wrapper spans with no meaningful attributes
    .replace(/<span[^>]*id="docs-internal-[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    // Remove empty spans
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    // Remove empty paragraphs inserted by Word
    .replace(/<p[^>]*>\s*(&nbsp;|\u00a0)?\s*<\/p>/gi, '')
    .trim();
}

/**
 * PasteHandler Extension — intercepts paste events and cleans up
 * Office/Google Docs HTML before Tiptap processes it.
 */
export const PasteHandler = Extension.create({
  name: 'pasteHandler',

  addProseMirrorPlugins() {
    const editor = this.editor as Editor;

    return [
      new Plugin({
        key: pasteHandlerKey,
        props: {
          handlePaste(_view, event) {
            const html = event.clipboardData?.getData('text/html') ?? '';
            if (!html) return false;

            // Only clean if it looks like an Office or GDocs paste
            const isWordPaste = /urn:schemas-microsoft-com|mso-|MicrosoftWord|word\/|xmlns:w=/.test(html);
            const isGDocsPaste = /docs-internal-guid|id="docs-internal/.test(html);

            if (!isWordPaste && !isGDocsPaste) return false;

            const cleaned = cleanWordHtml(html);
            // Let Tiptap's normal paste handler process the cleaned HTML
            editor.commands.insertContent(cleaned);
            return true;
          },
        },
      }),
    ];
  },
});
