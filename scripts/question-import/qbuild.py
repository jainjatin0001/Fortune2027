"""Helpers for writing a question-import batch JSON (contract: src/lib/question-import.ts).

A batch builder (imports/<batch>/build.py) transcribes each PDF question with q(...) and calls write().

Text markup used by H():
  \\( ... \\)   inline math   -> <span data-type="math-inline" data-math-src="LATEX"></span>
  \\[ ... \\]   display math  -> <div data-type="math-block" data-math-src="LATEX"></div> (own paragraph)
  blank line  new paragraph
  paragraphs starting with "<" are raw HTML (use table() / figure() for those)
  <strong>…</strong>, <u>…</u> and <em>…</em> are kept
"""
import html
import json
import re

__all__ = ['H', 'table', 'figure', 'Batch']


def _esc_attr(s):
    return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')


def _inline(text):
    out, pos = [], 0
    for m in re.finditer(r'\\\((.+?)\\\)', text, re.S):
        out.append(html.escape(text[pos:m.start()], quote=False))
        out.append(f'<span data-type="math-inline" data-math-src="{_esc_attr(m.group(1).strip())}"></span>')
        pos = m.end()
    out.append(html.escape(text[pos:], quote=False))
    out = ''.join(out)
    for tag in ('strong', 'u', 'em'):
        out = out.replace(f'&lt;{tag}&gt;', f'<{tag}>').replace(f'&lt;/{tag}&gt;', f'</{tag}>')
    return out


def H(src):
    """Markup -> stored question HTML."""
    parts = []
    for para in [p.strip() for p in src.strip().split('\n\n') if p.strip()]:
        if para.startswith('<'):
            parts.append(para)
        elif para.startswith('\\[') and para.endswith('\\]'):
            for blk in re.findall(r'\\\[(.+?)\\\]', para, re.S):
                parts.append(f'<div data-type="math-block" data-math-src="{_esc_attr(blk.strip())}"></div>')
        else:
            parts.append('<p>' + _inline(' '.join(l.strip() for l in para.split('\n'))) + '</p>')
    return ''.join(parts)


def table(header, rows):
    """HTML table; cells use the same inline markup. Pass header=[] for a table without a header row."""
    cell = lambda tag, c: f'<{tag}>{_inline(c)}</{tag}>'
    head = '<tr>' + ''.join(cell('th', c) for c in header) + '</tr>' if header else ''
    body = ''.join('<tr>' + ''.join(cell('td', c) for c in r) + '</tr>' for r in rows)
    return f'<table><tbody>{head}{body}</tbody></table>'


def figure(name, alt, w, h):
    """<img> for a cropped figure file in the batch folder. w/h = display size (crop pixels / 2)."""
    return f'<img src="{name}" alt="{_esc_attr(alt)}" width="{w}" height="{h}">'


class Batch:
    def __init__(self, source):
        self.source = source
        self.questions = []

    def q(self, ext, pages, diff, skill, statement, explanation,
          options=None, correct=None, answers=None, pdf=None, figures=()):
        """One question.

        ext        PDF "Question ID"
        pages      page number, or [first, second] when it spans two pages
        diff       EASY / MEDIUM / HARD
        options    list of option markup -> SINGLE_CORRECT; `correct` = letter ("C")
        answers    accepted answers -> NUMERIC (every form; grader compares by value, no rounding)
        pdf        raw "Correct Answer:" line; None when the PDF has none (gets flagged for review).
                   Multiple choice defaults to `correct`; pass pdf='' when the PDF has no line.
        figures    figure file names used in the HTML
        """
        pages = pages if isinstance(pages, list) else [pages]
        if options is not None:
            opts = [{'content': H(o), 'isCorrect': 'ABCDEFGH'[i] == correct} for i, o in enumerate(options)]
            qtype, accepted, pdf = 'SINGLE_CORRECT', [], (correct if pdf is None else pdf or None)
        else:
            opts, qtype, accepted = [], 'NUMERIC', [str(a) for a in answers]
        self.questions.append({
            'externalId': ext,
            'page': pages[0],
            'difficulty': diff,
            'questionType': qtype,
            'statement': H(statement),
            'options': opts,
            'acceptedAnswers': accepted,
            'explanation': H(explanation),
            'skill': skill,
            'pdfCorrectAnswer': pdf,
            'pageImage': [f'page-{p}.png' for p in pages] if len(pages) > 1 else f'page-{pages[0]}.png',
            'figures': list(figures),
        })

    def write(self, path):
        with open(path, 'w') as f:
            json.dump({'source': self.source, 'questions': self.questions}, f, indent=2, ensure_ascii=False)
        print(len(self.questions), 'questions written to', path)
