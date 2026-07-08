import DOMPurify from 'isomorphic-dompurify';

/**
 * Strict DOMPurify config — allows rich prose HTML but blocks scripts,
 * event handlers, and unsafe URL schemes.
 */
const ALLOWED_TAGS = [
  // Structural
  'div', 'p', 'span', 'br', 'hr',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Inline formatting
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark',
  'sup', 'sub', 'code', 'kbd', 'samp', 'var',
  // Lists
  'ul', 'ol', 'li',
  // Blockquote / pre
  'blockquote', 'pre',
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
  // Media
  'img', 'figure', 'figcaption',
  // Links
  'a',
  // Video embed (iframe — restricted to safe sources below)
  'iframe',
  // Math render output spans/divs (KaTeX)
  'math', 'annotation', 'semantics', 'mrow', 'mn', 'mi', 'mo', 'msup', 'msub',
  'msubsup', 'mfrac', 'msqrt', 'mroot', 'mtext', 'mspace', 'mover', 'munder',
  'munderover', 'mtable', 'mtr', 'mtd', 'mlabeledtr',
];

const ALLOWED_ATTR = [
  // Universal
  'class', 'id', 'style',
  // Images
  'src', 'alt', 'width', 'height', 'loading',
  // Links
  'href', 'target', 'rel',
  // Tables
  'colspan', 'rowspan', 'scope', 'align', 'valign',
  // Iframes (video embeds)
  'allow', 'allowfullscreen', 'frameborder', 'sandbox', 'title',
  // Data attributes (Tiptap uses these for math source)
  'data-math-src', 'data-type', 'data-language',
  // Math
  'xmlns', 'display', 'alttext', 'encoding',
];

const SAFE_IFRAME_ORIGINS = [
  'https://www.youtube.com',
  'https://youtube.com',
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
  'https://vimeo.com',
];

DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  // Restrict iframe src to known video origins
  if (node.tagName === 'IFRAME' && data.attrName === 'src') {
    const allowed = SAFE_IFRAME_ORIGINS.some(origin => data.attrValue.startsWith(origin));
    if (!allowed) {
      data.keepAttr = false;
    }
  }
  // Block javascript: URLs
  if (data.attrName === 'href' || data.attrName === 'src') {
    if (/^javascript:/i.test(data.attrValue)) {
      data.keepAttr = false;
    }
  }
});

/**
 * Sanitize an HTML string before saving to DB or rendering in the browser.
 * Returns an empty string for falsy inputs.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    FORCE_BODY: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  }) as string;
}
