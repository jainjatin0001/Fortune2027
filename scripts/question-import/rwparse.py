"""Reading & Writing (English) question-bank PDF -> import questions, straight from the text layer.

English exports have no math, so the text layer is the source of truth; page images are only for review.
What the layout needs that plain get_text() loses, recovered from the PDF itself:
  - italics: the fonts are per-page Type3 subsets with no names, so faces are identified by their
    glyph programs (same glyph bytes = same face) and labelled from known text (FACE_* below)
  - kerning gaps the text layer turns into spaces ("par t", "Asser tion"): spaces < 1pt wide are dropped
  - paragraphs: baseline gap > 18pt
  - bullets: drawn as 3pt dots, not text; a line level with a dot starts a list item (x ≈ 38 level 1, ≈ 48 level 2)
  - superscripts / subscripts: the smaller text size, above / below the line's baseline

Each page is one question. parse_page() returns the question plus `warnings` for anything that is not the
standard layout (other than 4 options, nested bullets, rationale not matching the key, …) — those pages
need a manual override in the batch build.py.

usage (survey): python rwparse.py <pdf> [first last]   -> prints warnings per page
"""
import hashlib
import html
import re
import sys
import unicodedata

import pymupdf

# Glyph-program hashes of the faces (one glyph per face is enough to identify it). Exports encode the same
# face differently, so each face can have several anchors (one per export where it didn't link up).
FACE_REGULAR = {'dadac859520e5978efa952bb46c835eb'}
FACE_BOLD = {'07bed14b7d65b5744d989779f717528d'}
FACE_ITALIC = {'023fe456978d85dc96e821da9fb95cc6',   # export 2026-11-1 (Expression of Ideas)
               'dac4b8f179b6a1a900e5ef15bec2b230'}   # export 2026-11-3 (Standard English Conventions)
FACE_BOLD_ITALIC = {'6d72c49e2694eac346f658eeb1bac636'}  # species / titles in table header columns

PARA_GAP = 20.5    # baseline gap that starts a new paragraph (lines 14–16 apart, 18.8 next to a superscript;
                   # paragraphs 21.2+)
SAME_LINE = 5      # baselines closer than this are one visual line (sup/sub, split spans)
FAKE_SPACE = 1.0   # spaces narrower than this are kerning artefacts (they measure 0.2pt; real ones 2.0+)
GAP_SPACE = 1.5    # a wider gap between two glyphs is a word space even without a space glyph
BODY_X = 18        # left edge of body text; passages are set in to 27 or 48 (excerpts, poems)
PAGE_MID = 306     # centre of the text column (18–594); short lines centred on it are titles
CENTER_MIN_X = 60
STANZA_GAP = 40   # inside a passage, lines are 14–27 apart; a stanza or speech break is ~53
RIGHT_X = 300     # a paragraph starting right of this is right-aligned (© credits under excerpts)
BREAK_X = 470      # a line ending left of this, followed by more of the paragraph, is a hard break (poems)
SPACES ='       '  # odd space characters -> plain space (nbsp is handled later)


class Faces:
    """font xref -> 'r' / 'b' / 'i' / None (punctuation, accents, nbsp: style comes from the neighbours)."""

    def __init__(self, doc):
        self.doc, self.parent, self.hash = doc, {}, {}
        seen = set()
        for page in doc:  # whole document first: a face's anchor glyph may only appear on a later page
            for f in page.get_fonts(full=True):
                if f[0] not in seen:
                    seen.add(f[0])
                    self._add(f[0])
        known = {self._find(('h', h)): style for anchors, style in
                 ((FACE_REGULAR, 'r'), (FACE_BOLD, 'b'), (FACE_ITALIC, 'i'), (FACE_BOLD_ITALIC, 'bi'))
                 for h in anchors}
        self.style = {x: known.get(self._find(('f', x))) for x in seen}

    def _find(self, x):
        p = self.parent
        while p.setdefault(x, x) != x:
            p[x] = p[p[x]]
            x = p[x]
        return x

    def _add(self, xref):
        m = re.search(r'/CharProcs<<(.*?)>>', self.doc.xref_object(xref, compressed=True))
        for g in re.findall(r'(\d+) 0 R', m.group(1)) if m else []:
            if g not in self.hash:
                s = self.doc.xref_stream(int(g)) or b''
                self.hash[g] = hashlib.md5(s).hexdigest() if len(s) > 60 else None
            if self.hash[g]:
                self.parent[self._find(('f', xref))] = self._find(('h', self.hash[g]))

    def of(self, page):
        return {f[0]: self.style[f[0]] for f in page.get_fonts(full=True)}


def _black_rules(page, top):
    """Thin black filled rectangles: underlines and the borders of data tables."""
    return [d['rect'] for d in page.get_drawings()
            if d['rect'].y0 > top and d['type'] == 'f' and d.get('fill') is not None and max(d['fill']) < 0.1
            and (d['rect'].height < 1.5 and d['rect'].width > 1 or d['rect'].width < 1.5 and d['rect'].height > 1)]


def _cluster(rects, pad):
    """Groups rectangles that touch (within `pad`) -> list of (bbox, members)."""
    groups = []
    for r in rects:
        hit = [g for g in groups if g[0].intersects(r + (-pad, -pad, pad, pad))]
        bbox, members = pymupdf.Rect(r), [r]
        for g in hit:
            bbox |= g[0]
            members += g[1]
            groups.remove(g)
        groups.append((bbox, members))
    merged = True
    while merged:  # unions can make earlier groups touch
        merged = False
        for i, a in enumerate(groups):
            for b in groups[i + 1:]:
                if a[0].intersects(b[0] + (-pad, -pad, pad, pad)):
                    groups.remove(b)
                    groups[i] = (a[0] | b[0], a[1] + b[1])
                    merged = True
                    break
            if merged:
                break
    return groups


def table_grids(page, top=110):
    """Data tables: clusters of black rules that include vertical ones -> [(bbox, rules)]."""
    return [g for g in _cluster(_black_rules(page, top), 1.5)
            if any(r.width < 1.5 and r.height > 3 for r in g[1]) and g[0].width > 20 and g[0].height > 10]


def figure_boxes(page, top=115):  # below the metadata table's bottom rule (y≈112)
    """Graphs: drawn with stroked paths and labelled in a real (non-Type3) font -> [bbox] padded to crop."""
    items = []
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                if s['bbox'][1] > top and not re.search(r'\(\d+ 0 R\)', s['font']) and s['text'].strip():
                    items.append(pymupdf.Rect(s['bbox']))
    if not items:
        return []
    for d in page.get_drawings():
        r = d['rect']
        if r.y0 > top and d['type'] != 'f' and (r.width > 3 or r.height > 3):
            items.append(pymupdf.Rect(r))
    boxes = sorted((g[0] for g in _cluster(items, 18)
                    if any(not re.search(r'\(\d+ 0 R\)', s['font']) for s in _spans_in(page, g[0]))),
                   key=lambda r: r.y0)
    # Pieces of one graph (plot, rotated axis title, legend) are separate clusters: merge pieces that no line
    # of the export's own text separates
    text_y = [l['bbox'][3] for b in page.get_text('dict')['blocks'] for l in b.get('lines', [])
              if l['bbox'][1] > top and any(re.search(r'\(\d+ 0 R\)', s['font']) and s['text'].strip()
                                            for s in l['spans'])]
    merged = []
    for b in boxes:
        if merged and not any(merged[-1].y1 < y < b.y0 + 2 for y in text_y):
            merged[-1] = merged[-1] | b
        else:
            merged.append(pymupdf.Rect(b))
    return [(b + (-8, -8, 8, 8)) & page.rect for b in merged]


def _spans_in(page, rect):
    return [dict(s, dir=l['dir']) for b in page.get_text('dict', clip=rect)['blocks'] for l in b.get('lines', [])
            for s in l['spans'] if s['text'].strip()]


def _underlines(page, top):
    """Underlines are thin black rules just below a baseline — the ones that aren't part of a table grid."""
    grids = [g[0] + (-1, -1, 1, 1) for g in table_grids(page, top)]
    return [r for r in _black_rules(page, top) if r.height < 1.5 and not any(g.contains(r) for g in grids)]


def _lines(page, styles, top=110):
    """Visual lines below `top` (the metadata table on a question's first page; 0 on a continuation page):
    [{'y', 'x0', 'x1', 'text', 'chars': [{c, x, x1, y, style, script?, u?}]}].
    Graph labels (set in a real font, not the export's Type3 text fonts) are left out — the graph is cropped."""
    raw = []
    rules = _underlines(page, top)
    for b in page.get_text('rawdict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                if s['bbox'][1] < top:
                    continue
                m = re.search(r'\((\d+) 0 R\)', s['font'])
                if not m:
                    continue
                xref = int(m.group(1))
                small = s['size'] < 0.85
                for c in s['chars']:
                    w = c['bbox'][2] - c['bbox'][0]
                    if c['c'] == ' ' and w < FAKE_SPACE or c['c'] in '\xad​':  # kerning / soft hyphen / ZWSP
                        continue
                    if c['c'] in SPACES:
                        c = dict(c, c=' ')
                    ch = {'c': c['c'], 'x': c['bbox'][0], 'x1': c['bbox'][2], 'y': c['origin'][1],
                          'top': c['bbox'][1], 'style': styles[xref], 'small': small}
                    mid = (ch['x'] + ch['x1']) / 2
                    if any(r.x0 - 0.5 <= mid <= r.x1 + 0.5 and 0 <= r.y0 - ch['y'] <= 4 for r in rules):
                        ch['u'] = True
                    raw.append(ch)
    full = sorted((ch for ch in raw if not ch['small']), key=lambda ch: ch['y'])
    lines = []
    for ch in full:
        if lines and abs(ch['y'] - lines[-1]['y']) < SAME_LINE:
            lines[-1]['chars'].append(ch)
        else:
            lines.append({'y': ch['y'], 'chars': [ch]})
    for ch in raw:
        if ch['small']:
            line = min(lines, key=lambda l: abs(l['y'] - ch['y']))
            ch['script'] = 'sup' if ch['y'] < line['y'] else 'sub'
            line['chars'].append(ch)
    for l in lines:
        l['chars'].sort(key=lambda ch: ch['x'])
        # Combining accents are separate glyphs: put each on the letter it sits over ("Iban" + "~" -> "Ibañ")
        # (zero-width marks follow their letter, Unicode order; drawn marks go on the letter they overlap)
        bases = [ch for ch in l['chars'] if not unicodedata.combining(ch['c']) and ch['c'] != ' ']
        for m in (ch for ch in l['chars'] if unicodedata.combining(ch['c'])):
            if m['x1'] - m['x'] < 0.5:
                base = [ch for ch in bases if ch['x'] < m['x'] - 0.05][-1]
            else:
                mid = (m['x'] + m['x1']) / 2
                base = min(bases, key=lambda ch: abs((ch['x'] + ch['x1']) / 2 - mid))
            base['c'] = unicodedata.normalize('NFC', base['c'] + m['c'])
        l['chars'] = [ch for ch in l['chars'] if not unicodedata.combining(ch['c'])]
        # Word gaps drawn by positioning alone (no space glyph), e.g. between spans of different fonts
        spaced = []
        for ch in l['chars']:
            if spaced and ' ' not in (ch['c'], spaced[-1]['c']) and ch['x'] - spaced[-1]['x1'] > GAP_SPACE:
                spaced.append({'c': ' ', 'x': spaced[-1]['x1'], 'x1': ch['x'], 'y': ch['y'], 'style': None,
                               'small': False})
            spaced.append(ch)
        l['chars'] = spaced
        # indent = first visible glyph (poems indent some lines with leading spaces)
        l['x0'] = next((ch['x'] for ch in l['chars'] if ch['c'] not in ' \xa0'), l['chars'][0]['x'])
        l['x1'] = l['chars'][-1]['x1']
        l['text'] = ''.join(ch['c'] for ch in l['chars'])
    return lines


def _resolve_styles(chars):
    """Neutral glyphs (punctuation, accents, spaces) are italic only when both neighbours are italic —
    except accented letters, which take the style of their own word ("Rabinal Achí", "Día")."""
    st = [ch['style'] for ch in chars]
    for i, s in enumerate(st):
        if s is None and chars[i]['c'].isalpha():
            word = [j for j in (*range(i - 1, -1, -1), *range(i + 1, len(chars)))
                    if chars[j]['style'] is not None and chars[j]['c'].isalpha()
                    and all(chars[k]['c'].isalpha() for k in range(min(i, j), max(i, j) + 1))]
            if word:
                st[i] = chars[word[0]]['style']
                continue
        if s is None:
            prev = next((st[j] for j in range(i - 1, -1, -1) if chars[j]['style'] is not None), 'r')
            nxt = next((chars[j]['style'] for j in range(i + 1, len(chars)) if chars[j]['style'] is not None), 'r')
            st[i] = prev if prev == nxt and prev in ('i', 'b', 'bi') else 'r'
    return st


TAG_ORDER = ('strong', 'u', 'em', 'sup', 'sub')   # nesting order, outermost first


def _html(chars):
    """Chars of one paragraph -> inline HTML (<strong>, <u>, <em>, <sup>, <sub>, <br>), whitespace normalised.
    A '\\n' char is a hard line break (poem lines)."""
    chars = [dict(ch, c=' ' if ch['c'] in '\xa0\t' else ch['c']) for ch in chars]
    st = _resolve_styles(chars)
    tags = []
    for ch, s in zip(chars, st):
        t = {'i': {'em'}, 'b': {'strong'}, 'bi': {'strong', 'em'}}.get(s, set())
        if ch.get('u'):
            t.add('u')
        if ch.get('script'):
            t.add(ch['script'])
        tags.append(t)
    # A space is inside a run only when both neighbours are ("a singular" stays one <u>, one <em>)
    for i, ch in enumerate(chars):
        if ch['c'] == ' ':
            prev = next((tags[j] for j in range(i - 1, -1, -1) if chars[j]['c'] not in ' \n'), set())
            nxt = next((tags[j] for j in range(i + 1, len(chars)) if chars[j]['c'] not in ' \n'), set())
            tags[i] = (prev & nxt) - {'sup', 'sub'}
        elif ch['c'] == '\n':
            tags[i] = set()
    out, opened = [], []
    for ch, t in zip(chars, tags):
        want = [x for x in TAG_ORDER if x in t]
        k = 0
        while k < min(len(opened), len(want)) and opened[k] == want[k]:
            k += 1
        out += [f'</{x}>' for x in reversed(opened[k:])] + [f'<{x}>' for x in want[k:]]
        opened = want
        out.append('<br>' + '\xa0' * ch.get('pad', 0) if ch['c'] == '\n' else html.escape(ch['c'], quote=False))
    out += [f'</{x}>' for x in reversed(opened)]
    s = re.sub(r' +', ' ', ''.join(out))
    prev = None
    while prev != s:  # move spaces out of tags, drop empty tags
        prev = s
        s = re.sub(r'<(strong|u|em)> ', r' <\1>', s)
        s = re.sub(r' </(strong|u|em)>', r'</\1> ', s)
        s = re.sub(r'<(\w+)></\1>', '', s)
        s = re.sub(r' +', ' ', s)
    s = re.sub(r' ?<br> ?', '<br>', s).strip()
    # Punctuation set in the italic face next to a roman word ("Daughter 2, Hagar’s…") is not emphasis
    s = re.sub(r'<em>([^\w<]*)</em>', r'\1', s)
    s = re.sub(r'<em>([,;:.] *)', r'\1<em>', s)
    s = re.sub(r'(?<=\w)′(?=\w)', '’', s)  # export typo: prime used as apostrophe ("study′s")
    # export typo: a quote closed with an opening mark (“old milk carts“ that / …somehow.“) — an opening
    # quote is always followed by the quoted word, so one after a word and before a space/end is a closing one
    s = re.sub(r'(?<=\S)“(?=$|[\s,.;:)!?<])', '”', s)
    # Export typo: a stray " ." after a sentence that already ended (“…therefore.” .  /  …a dash! .)
    return re.sub(r'([.!?][”"’]?) \.(?= |$)', r'\1', s)


def _pad(x0, base):
    """Extra indent of a poem line relative to its passage, as non-breaking spaces (they survive the editor)."""
    return round((x0 - base) / 2.2) if x0 - base > 4 else 0


def _join(lines, base=BODY_X, breaks=True):
    """Lines of a paragraph -> chars, with a space at each line break — except next to a hyphen or em dash
    (the export never hyphenates words, so "Anglo-|African" is a compound, and its em dashes are unspaced),
    after an ellipsis ("its predictions…|forecast") and after an unspaced en dash ("1809–|1849"): inside a
    line the export never puts a space after those either. breaks=False: no hard breaks (table cells)."""
    chars, prev = [], None
    for l in lines:
        while chars and chars[-1]['c'] == ' ':
            chars.pop()
        tail = ''.join(ch['c'] for ch in chars[-3:])
        glued = (tail[-1:] in ('-', '—', '…') or tail.endswith('...')
                 or tail[-1:] == '–' and tail[-2:-1] not in (' ', '\xa0'))
        if tail[-1:] == '-' and re.match(r'(and|or) ', l['text'].lstrip()):
            glued = False  # suspended hyphen: "late nineteenth-|and early twentieth-century"
        if tail[-1:] == '/' and tail[-2:-1] not in (' ', '\xa0', ''):
            glued = True  # "⁸⁷Sr/|⁸⁶Sr" (a spaced " / " separating quoted verse lines keeps its space)
        if chars and breaks and prev.get('x1', 600) < BREAK_X:
            # previous line stops well short: a hard break (poem line)
            chars.append({'c': '\n', 'style': None, 'pad': _pad(l['x0'], base)})
        elif chars and not glued and l['text'].lstrip()[:1] != '—':
            chars.append({'c': ' ', 'style': None})
        prev = l
        body = l['chars']
        while body and body[0]['c'] in ' \xa0':
            body = body[1:]
        chars.extend(body)
    return chars


def _paragraphs(lines):
    """Lines -> paragraphs: a new one after a paragraph gap, or where the text moves between the body margin
    and an indented passage (an intro line and the excerpt under it can be set without a gap)."""
    passage = lambda l: l['x0'] > BODY_X + 6
    paras = []
    for l in lines:
        if paras and l['y'] - paras[-1][-1]['y'] < PARA_GAP and passage(l) == passage(paras[-1][-1]):
            paras[-1].append(l)
        else:
            paras.append([l])
    return paras


def _block_html(lines, dots, warnings):
    """Lines of a section -> <p>…</p>, <ul> lists (bullets from drawn dots), and <blockquote> for passages set
    in from the margin (excerpts, poems); right-aligned lines (© credits) get text-align: right."""
    parts, quote, base = [], [], [BODY_X]

    def end_quote(keep_base=False):
        if quote:
            parts.append('<blockquote>' + ''.join(quote) + '</blockquote>')
            quote.clear()
        if not keep_base:
            base[0] = BODY_X

    def dot_of(l):
        return next((d for d in dots if abs(d[1] - (l['y'] - 3)) < 4 and d[0] < l['x0']), None)

    prev_y = None
    for para in _paragraphs(lines):
        x0 = para[0]['x0']
        gap, prev_y = (para[0]['y'] - prev_y if prev_y is not None else 0), para[-1]['y']
        if quote and gap > STANZA_GAP:
            end_quote(keep_base=True)  # stanza / speech break inside a passage: next passage block
        if re.fullmatch(r'Text \d', _html(_join(para))):
            end_quote()
            parts.append(f'<p><strong>{_html(_join(para))}</strong></p>')  # bold in most pages, plain in some
            continue
        if any(dot_of(l) for l in para):
            pass  # bullet list (its text is set in like a passage, so check this first)
        elif x0 > CENTER_MIN_X and all(abs((l['x0'] + l['x1']) / 2 - PAGE_MID) < 12 for l in para):
            end_quote()  # table / graph title (its line breaks are just wrapping)
            parts.append(f'<p style="text-align: center">{_html(_join(para, breaks=False))}</p>')
            continue
        elif x0 > RIGHT_X:
            p = f'<p style="text-align: right">{_html(_join(para))}</p>'
            (quote if quote else parts).append(p)
            continue
        elif x0 > BODY_X + 6:
            if not quote:
                base[0] = x0  # the passage's own margin; deeper poem lines are padded relative to it
            pad = '\xa0' * _pad(x0, base[0])
            quote.append(f'<p>{pad}{_html(_join(para, base[0]))}</p>')
            continue
        end_quote()
        items, plain = [], []
        for l in para:
            dot = dot_of(l)
            if dot:
                if dot[0] > 44:
                    warnings.append(f'nested bullet: {l["text"][:60]!r}')
                items.append([l])
            elif items:
                items[-1].append(l)
            else:
                plain.append(l)
        if plain and items:
            warnings.append('paragraph mixes text and bullets')
        if plain:
            # a poem printed at the body margin can still indent some lines slightly (4–5pt): keep that
            pad = '\xa0' * _pad(plain[0]['x0'], BODY_X)
            parts.append(f'<p>{pad}{_html(_join(plain))}</p>')
        if items:
            parts.append('<ul>' + ''.join(f'<li><p>{_html(_join(it))}</p></li>' for it in items) + '</ul>')
    end_quote()
    return parts


def _table_html(grid, lines, warnings):
    """A ruled data table -> <table>. Cell borders come from the drawn rules; a cell with no rule between it
    and its right neighbour spans both (colspan). The first row is the header (<th>)."""
    bbox, rules = grid
    merge = lambda vals: [v for i, v in enumerate(sorted(vals)) if i == 0 or v - sorted(vals)[i - 1] > 2]
    xs = merge([(r.x0 + r.x1) / 2 for r in rules if r.width < 1.5])
    ys = merge([(r.y0 + r.y1) / 2 for r in rules if r.height < 1.5])
    if len(xs) < 2 or len(ys) < 2:
        warnings.append(f'table at y={bbox.y0:.0f}: no cell grid')
        return '', []

    def vrule(x, y0, y1):  # is there a vertical rule at x covering the row y0..y1?
        return any(abs((r.x0 + r.x1) / 2 - x) < 2 and r.y0 <= y0 + 2 and r.y1 >= y1 - 2
                   for r in rules if r.width < 1.5)

    used = []
    rows = []
    for ri in range(len(ys) - 1):
        y0, y1 = ys[ri], ys[ri + 1]
        cells, ci = [], 0
        while ci < len(xs) - 1:
            span = 1
            while ci + span < len(xs) - 1 and not vrule(xs[ci + span], y0, y1):
                span += 1
            x0, x1 = xs[ci], xs[ci + span]
            cl = []
            for l in lines:
                chars = [ch for ch in l['chars'] if x0 < (ch['x'] + ch['x1']) / 2 < x1 and y0 < ch['y'] < y1]
                if chars:
                    cl.append(dict(l, chars=chars, x0=chars[0]['x'], x1=chars[-1]['x1'],
                                   text=''.join(c['c'] for c in chars)))
                    used.append(l)
            cells.append((span, _html(_join(cl, breaks=False)) if cl else ''))
            ci += span
        rows.append(cells)
    for ci in range(len(xs) - 1):  # a missing horizontal rule inside the grid would be a rowspan
        for ri in range(1, len(ys) - 1):
            if not any(abs((r.y0 + r.y1) / 2 - ys[ri]) < 2 and r.x0 <= xs[ci] + 2 and r.x1 >= xs[ci + 1] - 2
                       for r in rules if r.height < 1.5):
                warnings.append(f'table at y={bbox.y0:.0f}: merged rows (rowspan) not supported')
    out = []
    for ri, cells in enumerate(rows):
        tag = 'th' if ri == 0 else 'td'
        tds = []
        for span, h in cells:
            if tag == 'th':
                h = re.sub(r'</?strong>', '', h)  # header cells are bold anyway
            tds.append(f'<{tag}{f" colspan=\"{span}\"" if span > 1 else ""}>{h}</{tag}>')
        out.append('<tr>' + ''.join(tds) + '</tr>')
    return '<table><tbody>' + ''.join(out) + '</tbody></table>', used


def split_choices(p_html):
    """'… Choice C is incorrect …' run-on rationale paragraph -> one paragraph per choice."""
    body = p_html[3:-4]
    pieces = re.split(r'(?<=[.!?”"’)]) (?=Choice [A-D] is (?:incorrect|not the best answer))', body)
    return ''.join(f'<p>{x}</p>' for x in pieces)


def is_question_page(doc, pno):
    return 'Question ID:' in doc[pno - 1].get_text()


def continuation_pages(doc, pno):
    """Pages after a question's first page that carry on with it (no "Question ID" header)."""
    cont = []
    while pno + len(cont) < doc.page_count and not is_question_page(doc, pno + len(cont) + 1):
        cont.append(pno + len(cont) + 1)
    return cont


# Skill names as the bank spells them; the export is inconsistent in case ("Cross-text Connections")
SKILLS = ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context', 'Boundaries',
          'Form, Structure, and Sense', 'Transitions', 'Rhetorical Synthesis']


def parse_page(doc, faces, pno):
    """The question starting on page `pno`, including any continuation pages."""
    page = doc[pno - 1]
    text = page.get_text()
    # Metadata table: header row (Assessment / Test / Domain / Skill / Difficulty), then one value cell per
    # column; long values wrap onto more lines in the same column ("Form, Structure, and" / "Sense").
    heads, cells = {}, {}
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            t = ''.join(s['text'] for s in l['spans']).strip()
            if 50 < l['bbox'][1] < 70:
                heads[t] = l['bbox'][0]
            elif 70 <= l['bbox'][1] < 110 and t:
                cells.setdefault(round(l['bbox'][0]), []).append((l['bbox'][1], t))
    meta = {}
    for name, x in heads.items():
        col = min(cells, key=lambda cx: abs(cx - x)) if cells else None
        if col is not None and abs(col - x) < 10:
            meta[name] = ' '.join(t for _, t in sorted(cells[col]))
    q = {'page': pno, 'externalId': re.search(r'Question ID:\s*(\w+)', text).group(1),
         'domain': meta.get('Domain'), 'skill': meta.get('Skill'),
         'difficulty': (meta.get('Difficulty') or '').upper(), 'warnings': []}
    w = q['warnings']
    if not q['skill'] or q['difficulty'] not in ('EASY', 'MEDIUM', 'HARD'):
        w.append(f'metadata table not read: {meta}')
    q['skill'] = next((s for s in SKILLS if s.lower() == (q['skill'] or '').lower()), q['skill'])

    def page_dots(pg, top):
        return [((d['rect'].x0 + d['rect'].x1) / 2, (d['rect'].y0 + d['rect'].y1) / 2) for d in pg.get_drawings()
                if d['rect'].y0 > top and d['rect'].width < 5 and d['rect'].height < 5]

    dots = page_dots(page, 110)
    lines = _lines(page, faces.of(page))
    # Continuation pages: shift their lines below the first page's. The break continues the paragraph when
    # the last line runs to the right margin (mid-sentence), else a new paragraph starts.
    q['pages'] = [pno] + continuation_pages(doc, pno)
    for cp in q['pages'][1:]:
        cpage = doc[cp - 1]
        more = _lines(cpage, faces.of(cpage), top=0)
        if not more:
            continue
        last = lines[-1]
        ends_sentence = bool(re.search(r'[.!?:][”"’)]?$', last['text'].rstrip()))
        joins = last['x1'] >= 545 or 500 < last['x1'] and not ends_sentence
        if 500 < last['x1'] < 545 and ends_sentence:
            w.append(f'p{cp}: unclear whether the page break ends a paragraph ({last["text"][-40:]!r})')
        gap = 15 if joins else PARA_GAP + 5
        shift = last['y'] + gap - more[0]['y']
        for l in more:
            l['y'] += shift
            for ch in l['chars']:
                ch['y'] += shift
        dots += [(x, y + shift) for x, y in page_dots(cpage, 0)]
        lines += more
    # Faces are matched by glyph bytes of this export; a different export (other fonts) would silently
    # lose italics, so stop when letters on the page don't belong to a known face.
    letters = [ch['style'] for l in lines for ch in l['chars'] if ch['c'].isascii() and ch['c'].isalpha()]
    unknown = letters.count(None)
    if not letters or unknown > 0.01 * len(letters) or 'r' not in letters or 'b' not in letters:
        w.append(f'fonts not recognised ({unknown}/{len(letters)} letters in unknown faces) — update FACE_* hashes')

    def bold(l):
        return all(ch['style'] in ('b', None) for ch in l['chars'])

    idx = {}
    for i, l in enumerate(lines):
        t = l['text'].strip()
        if bold(l) and (t in ('Question', 'Answer', 'Rationale') or t.startswith('Correct Answer:')):
            idx.setdefault(t.split(':')[0], i)
            if t.startswith('Correct Answer:'):
                q['pdfCorrectAnswer'] = t.split(':', 1)[1].strip()
    if list(idx) != ['Question', 'Answer', 'Correct Answer', 'Rationale']:
        w.append(f'section headings {list(idx)}')
        return q

    # Statement: text, with data tables (rebuilt as HTML) and graphs (cropped images) where they stand.
    st_lines = lines[idx['Question'] + 1:idx['Answer']]
    regions = [('table', g[0], g) for g in table_grids(page)] + \
              [('figure', b, None) for b in figure_boxes(page)]
    regions = sorted((r for r in regions if lines[idx['Question']]['y'] < r[1].y1 and
                      (r[1].y0 < lines[idx['Answer']]['y'] or idx['Answer'] >= len(lines))), key=lambda r: r[1].y0)
    q['figures'] = []
    parts, rest = [], st_lines
    for i, (kind, box, grid) in enumerate(regions):
        inside = lambda l: box.y0 - 2 < l['y'] - 3 < box.y1 + 2
        before = [l for l in rest if l['y'] < box.y0 and not inside(l)]
        parts += _block_html(before, dots, w)
        within = [l for l in rest if inside(l)]
        rest = [l for l in rest if l['y'] >= box.y0 and not inside(l)]
        if kind == 'table':
            tbl, used = _table_html(grid, within, w)
            parts.append(tbl)
            left = [l for l in within if not any(l is u for u in used)]
            if left:
                w.append(f'table at y={box.y0:.0f}: text inside the table outside any cell: {left[0]["text"][:50]!r}')
        else:
            name = f'fig-p{pno}{"abcdefgh"[sum(r[0] == "figure" for r in regions[:i])] if sum(r[0] == "figure" for r in regions) > 1 else ""}.png'
            # alt text: the graph's title = the horizontal labels above the plot (the first drawn line or bar)
            plot_top = min((d['rect'].y0 for d in page.get_drawings() if d['rect'] in box and d['type'] != 'f'
                            and (d['rect'].width > 3 or d['rect'].height > 3)), default=box.y1)
            title = ' '.join(s['text'].strip() for s in sorted(_spans_in(page, box), key=lambda s: s['bbox'][1])
                             if not re.search(r'\(\d+ 0 R\)', s['font']) and s['bbox'][3] <= plot_top + 1
                             and abs(s['dir'][1]) < 0.01)
            w_px, h_px = round(box.width * 192 / 72), round(box.height * 192 / 72)
            parts.append(f'<img src="{name}" alt="{html.escape("Graph: " + title if title else "Graph", quote=True)}"'
                         f' width="{round(w_px / 2)}" height="{round(h_px / 2)}">')
            q['figures'].append((name, pno, box))
            if within:  # export text inside the graph area (e.g. a legend) — it is in the image; report it
                q.setdefault('figure_text', []).extend(l['text'] for l in within)
    parts += _block_html(rest, dots, w)
    q['statement'] = ''.join(parts)

    # Options: "A. " starts one; continuation lines (hanging indent) belong to it; anything else is flagged.
    opts = []
    for l in lines[idx['Answer'] + 1:idx['Correct Answer']]:
        m = re.match(r'([A-D])\. ', l['text'])
        if m and m.group(1) == 'ABCD'[len(opts)] and (not opts or l['y'] - opts[-1][-1]['y'] > PARA_GAP):
            l = dict(l, chars=l['chars'][3:])
            opts.append([l])
        elif opts and l['y'] - opts[-1][-1]['y'] < PARA_GAP and not any(
                abs(d[1] - (l['y'] - 3)) < 4 for d in dots):
            opts[-1].append(l)
        else:
            w.append(f'stray answer line: {l["text"][:70]!r}')
    q['options'] = [_html(_join(o)) for o in opts]
    if len(opts) != 4:
        w.append(f'{len(opts)} options')

    rat = _block_html(lines[idx['Rationale'] + 1:], dots, w)
    q['explanation'] = ''.join(split_choices(p) if p.startswith('<p>') else p for p in rat)
    m = re.match(r'<p>Choice ([A-D]) is (?:the best answer|correct)', q['explanation'])
    if not m or m.group(1) != q.get('pdfCorrectAnswer'):
        w.append(f'rationale best answer {m and m.group(1)} vs key {q.get("pdfCorrectAnswer")}')
    for letter in 'ABCD':
        if letter != q.get('pdfCorrectAnswer') and not re.search(rf'Choice {letter} is (incorrect|not)', q['explanation']):
            w.append(f'rationale has no "Choice {letter} is incorrect"')
    # Glyphs the PDF has no Unicode for come out as NUL / control / private-use characters
    for field, h in [('statement', q['statement']), ('explanation', q['explanation'])] + \
                    [(f'option {"ABCD"[i]}', o) for i, o in enumerate(q['options'])]:
        bad = sorted({hex(ord(c)) for c in h if unicodedata.category(c) in ('Cc', 'Co', 'Cn', 'Cf')})
        if bad:
            w.append(f'{field} has unmapped/control characters {bad}')
    return q


def build(pdf, first, last, out, overrides=None, source=None):
    """Writes the questions on pages first..last as an import batch JSON. The range must start on a question
    page and include the continuation pages of its last question.

    overrides  {first page of the question: {'statement' / 'options' (4 inline HTML strings) / 'explanation': html,
                       'replace': [(old, new), …]  small fixes in any field (each `old` must occur),
                       'note': why}} — required for every page that has parser warnings; the build
                stops otherwise. Overridden fields are used as given.
    """
    import json
    from pathlib import Path
    doc, overrides = pymupdf.open(pdf), overrides or {}
    faces = Faces(doc)
    questions, unhandled = [], []
    if not is_question_page(doc, first):
        sys.exit(f'p{first} is a continuation page — start the batch on a question page')
    for p in [p for p in range(first, last + 1) if is_question_page(doc, p)]:
        q = parse_page(doc, faces, p)
        if q['pages'][-1] > last:
            sys.exit(f'p{p}: question continues onto p{q["pages"][-1]}, past the end of the range ({last})')
        fix = overrides.get(p, {})
        if q['warnings'] and not fix:
            unhandled.append(f'p{p} {q["externalId"]}: ' + '; '.join(q['warnings']))
        q.update({k: v for k, v in fix.items() if k not in ('note', 'replace')})
        for old, new in fix.get('replace', []):
            fields = ['statement', 'explanation'] + [i for i in range(len(q['options']))]
            hit = [f for f in fields if old in (q['options'][f] if isinstance(f, int) else q[f])]
            if not hit:
                sys.exit(f'p{p}: replace text not found: {old!r}')
            for f in hit:
                if isinstance(f, int):
                    q['options'][f] = q['options'][f].replace(old, new)
                else:
                    q[f] = q[f].replace(old, new)
        key = q['pdfCorrectAnswer']
        questions.append({
            'externalId': q['externalId'],
            'page': p,
            'difficulty': q['difficulty'],
            'questionType': 'SINGLE_CORRECT',
            'statement': q['statement'],
            'options': [{'content': f'<p>{o}</p>', 'isCorrect': 'ABCD'[i] == key} for i, o in enumerate(q['options'])],
            'acceptedAnswers': [],
            'explanation': q['explanation'],
            'skill': q['skill'],
            'pdfCorrectAnswer': key,
            'pageImage': [f'page-{n}.png' for n in q['pages']] if len(q['pages']) > 1 else f'page-{p}.png',
            'figures': [name for name, _, _ in q['figures']],
        })
        for name, fp, box in q['figures']:  # graphs: cropped at 192 dpi (display size = half), like crop.py
            pix = doc[fp - 1].get_pixmap(dpi=192, clip=box)
            pix.save(Path(out).parent / name)
    if unhandled:
        sys.exit('pages with parser warnings need an override:\n  ' + '\n  '.join(unhandled))
    Path(out).write_text(json.dumps({'source': source or Path(pdf).name, 'questions': questions},
                                    indent=2, ensure_ascii=False))
    print(len(questions), 'questions written to', out)


if __name__ == '__main__':
    doc = pymupdf.open(sys.argv[1])
    first, last = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1, doc.page_count)
    faces = Faces(doc)
    n = 0
    for p in [p for p in range(first, last + 1) if is_question_page(doc, p)]:
        q = parse_page(doc, faces, p)
        if q['warnings']:
            n += 1
            print(f'p{p} {q["externalId"]}:', '; '.join(q['warnings']))
    print(n, 'pages with warnings')
