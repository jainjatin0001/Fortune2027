'use client';

import { Image } from '@tiptap/extension-image';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

const imageUploadKey = new PluginKey('imageUpload');

/**
 * Upload a File to /api/admin/upload and return the public URL.
 */
async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Image upload failed');
  }
  const data = await res.json();
  return data.url as string;
}

/**
 * Insert an uploaded image at the current cursor position.
 */
function insertImage(view: EditorView, url: string, alt = '') {
  const { schema, tr } = view.state;
  const node = schema.nodes.image?.create({ src: url, alt });
  if (!node) return;
  const transaction = tr.replaceSelectionWith(node);
  view.dispatch(transaction);
}

/**
 * ImageUpload — extends the built-in Image extension with:
 *   - Drag-and-drop image upload → R2
 *   - Clipboard paste image upload → R2
 */
export const ImageUpload = Image.extend({
  name: 'image',

  addProseMirrorPlugins() {
    const existingPlugins = this.parent?.() ?? [];

    return [
      ...existingPlugins,
      new Plugin({
        key: imageUploadKey,
        props: {
          // Handle drag-drop
          handleDrop(view, event) {
            const files = Array.from(event.dataTransfer?.files ?? []);
            const images = files.filter(f => f.type.startsWith('image/'));
            if (!images.length) return false;

            event.preventDefault();
            images.forEach(async (file) => {
              try {
                const url = await uploadImageFile(file);
                insertImage(view, url, file.name);
              } catch (e) {
                console.error('[RichEditor] Image upload failed:', e);
              }
            });
            return true;
          },

          // Handle paste
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items ?? []);
            const imageItems = items.filter(item => item.type.startsWith('image/'));
            if (!imageItems.length) return false;

            event.preventDefault();
            imageItems.forEach(async (item) => {
              const file = item.getAsFile();
              if (!file) return;
              try {
                const url = await uploadImageFile(file);
                insertImage(view, url, 'pasted-image');
              } catch (e) {
                console.error('[RichEditor] Image paste upload failed:', e);
              }
            });
            return true;
          },
        },
      }),
    ];
  },
});
