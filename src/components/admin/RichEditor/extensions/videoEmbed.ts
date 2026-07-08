'use client';

import React, { useRef } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeViewProps } from '@tiptap/react';

// ---------------------------------------------------------------------------
// VideoEmbedView — renders the iframe inside the editor
// ---------------------------------------------------------------------------
function VideoEmbedView({ node, selected }: NodeViewProps) {
  const src = node.attrs.src as string;
  const title = node.attrs.title as string;

  return React.createElement(
    NodeViewWrapper,
    { className: `video-embed-node${selected ? ' video-selected' : ''}` },
    React.createElement(
      'div',
      { className: 'video-embed-wrapper' },
      React.createElement('iframe', {
        src,
        title: title || 'Embedded video',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true,
        frameBorder: '0',
        className: 'video-embed-iframe',
      })
    )
  );
}

/**
 * Converts common YouTube / Vimeo share URLs to embed URLs.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return url;
  // YouTube: https://youtu.be/ID or https://www.youtube.com/watch?v=ID
  const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  const ytWatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);

  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  if (ytEmbed) return url; // already an embed URL

  // Vimeo: https://vimeo.com/ID
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  // Return as-is (direct iframe src)
  return url;
}

// ---------------------------------------------------------------------------
// VideoEmbed Tiptap Node extension
// ---------------------------------------------------------------------------
export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: el => el.querySelector('iframe')?.getAttribute('src') ?? el.getAttribute('data-src') ?? '',
        renderHTML: attrs => ({ 'data-src': attrs.src }),
      },
      title: {
        default: '',
        parseHTML: el => el.querySelector('iframe')?.getAttribute('title') ?? '',
        renderHTML: attrs => (attrs.title ? { 'data-title': attrs.title } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="video-embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes['data-src'] ?? '';
    const title = HTMLAttributes['data-title'] ?? '';
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'video-embed', class: 'video-embed-node' }),
      [
        'iframe',
        {
          src,
          title: title || 'Embedded video',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowfullscreen: 'true',
          frameborder: '0',
          class: 'video-embed-iframe',
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoEmbedView);
  },
});
