'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { sanitizeHtml } from '@/components/admin/RichEditor';
import { cn } from '@/lib/utils';

interface RichContentProps {
  html: string | null | undefined;
  /** Use 'span' when rendering inside inline/phrasing content (e.g. option buttons). */
  as?: 'div' | 'span';
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders admin-authored RichEditor HTML for students:
 *   - sanitizes it
 *   - renders math nodes (data-math-src) with KaTeX — the stored HTML only carries the LaTeX
 *   - fades images in once loaded (space is reserved when the <img> has width/height)
 */
export function RichContent({ html, as = 'div', className, style }: RichContentProps) {
  const ref = useRef<HTMLElement>(null);
  const clean = useMemo(() => sanitizeHtml(html ?? ''), [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>('[data-math-src]').forEach((el) => {
      const src = el.getAttribute('data-math-src') ?? '';
      try {
        katex.render(src, el, {
          throwOnError: false,
          displayMode: el.getAttribute('data-type') === 'math-block',
          output: 'html',
        });
      } catch {
        el.textContent = src;
      }
    });

    root.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      img.classList.add('rich-img-loading');
      const done = () => img.classList.remove('rich-img-loading');
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }, [clean]);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={cn('rich-html', className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

/** Extracts <img> URLs from HTML strings. */
function imageSources(htmlList: (string | null | undefined)[]): string[] {
  const urls = new Set<string>();
  for (const html of htmlList) {
    for (const m of (html ?? '').matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) urls.add(m[1]);
  }
  return [...urls];
}

/**
 * Starts downloading every image in the given HTML up front, so later
 * questions render instantly instead of popping in as the student reaches them.
 */
export function usePreloadImages(htmlList: (string | null | undefined)[]) {
  const key = imageSources(htmlList).join('\n');
  useEffect(() => {
    if (!key) return;
    const images = key.split('\n').map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      return img;
    });
    // Holding references keeps the downloads alive for the lifetime of the player
    return () => { images.length = 0; };
  }, [key]);
}
