/**
 * Strips HTML tags from a rich content string for use in previews/list cells.
 * Works in both SSR (regex-based) and client contexts.
 */
export function htmlToText(html: string, maxLength = 120): string {
  if (!html || typeof html !== 'string') return '';
  // Remove tags and decode common HTML entities
  const stripped = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (maxLength && stripped.length > maxLength) {
    return stripped.slice(0, maxLength) + '…';
  }
  return stripped;
}
